import Handlebars from "handlebars";
import { PrismaClient } from "@myinsurancebuddy/db";

const prisma = new PrismaClient();

// Register Handlebars helpers
Handlebars.registerHelper("formatNumber", function (num: number) {
    return new Intl.NumberFormat("en-US").format(num);
});

Handlebars.registerHelper("formatCurrency", function (num: number) {
    return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
    }).format(num);
});

Handlebars.registerHelper("lowercase", function (str: string) {
    return str?.toLowerCase() || "";
});

Handlebars.registerHelper("uppercase", function (str: string) {
    return str?.toUpperCase() || "";
});

Handlebars.registerHelper("capitalize", function (str: string) {
    if (!str) return "";
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
});

export interface TemplateContext {
    region_name?: string;
    region_slug?: string;
    region_type?: string;
    state_code?: string;
    population?: number;
    median_income?: number;
    timezone?: string;
    seo_summary?: string;
    legal_notes?: string;
    [key: string]: any;
}

export async function renderTemplate(
    templateHtml: string,
    context: TemplateContext
): Promise<string> {
    try {
        const template = Handlebars.compile(templateHtml);
        return template(context);
    } catch (error) {
        console.error("Template rendering error:", error);
        throw new Error("Failed to render template");
    }
}

export async function generateProgrammaticPage(
    templateId: string,
    regionId: string,
    userId: string
): Promise<any> {
    const [template, region] = await Promise.all([
        prisma.programmaticTemplate.findUnique({
            where: { id: templateId },
        }),
        prisma.region.findUnique({
            where: { id: regionId },
        }),
    ]);

    if (!template) throw new Error("Template not found");
    if (!region) throw new Error("Region not found");

    // Build context
    const context: TemplateContext = {
        region_name: region.name,
        region_slug: region.slug,
        region_type: region.type,
        state_code: region.stateCode || undefined,
        population: region.population || undefined,
        median_income: region.medianIncome || undefined,
        timezone: region.timezone || undefined,
        seo_summary: region.seoSummary || undefined,
        legal_notes: region.legalNotes || undefined,
        ...(region.metadata as object || {}),
    };

    const generatedHtml = await renderTemplate(template.templateHtml, context);

    // Generate meta fields
    const metaTitle = region.type === "STATE"
        ? `Best Insurance in ${region.name} - Tips & Deals | MyInsuranceBuddies`
        : `${region.name} Insurance Guide - Find Cheap Coverage | MyInsuranceBuddies`;

    const metaDescription = region.seoSummary ||
        `Find the best and cheapest ${region.type === "STATE" ? "state" : "local"} insurance in ${region.name}. Compare auto, health, home, and life insurance rates. Expert tips & deals.`;

    // Create or update programmatic page
    const slug = region.type === "STATE"
        ? `/state/${region.slug}/insurance-guide`
        : `/city/${region.slug}/insurance-guide`;

    const existingPage = await prisma.programmaticPage.findFirst({
        where: {
            templateId,
            regionId,
        },
    });

    if (existingPage) {
        const updated = await prisma.programmaticPage.update({
            where: { id: existingPage.id },
            data: {
                generatedHtml,
                title: metaTitle,
                metaTitle,
                metaDescription,
                lastGeneratedAt: new Date(),
                isPublished: true,
            },
        });

        // Audit log
        await prisma.auditLog.create({
            data: {
                userId,
                action: "REGENERATE_PAGE",
                objectType: "ProgrammaticPage",
                objectId: updated.id,
                beforeState: existingPage,
                afterState: updated,
            },
        });

        return updated;
    } else {
        const created = await prisma.programmaticPage.create({
            data: {
                templateId,
                regionId,
                slug,
                title: metaTitle,
                generatedHtml,
                metaTitle,
                metaDescription,
                isPublished: true,
                lastGeneratedAt: new Date(),
            },
        });

        // Audit log
        await prisma.auditLog.create({
            data: {
                userId,
                action: "CREATE_PAGE",
                objectType: "ProgrammaticPage",
                objectId: created.id,
                afterState: created,
            },
        });

        return created;
    }
}

export async function bulkGeneratePages(
    templateId: string,
    regionType: "STATE" | "CITY" | null,
    userId: string
): Promise<{ success: number; failed: number; errors: any[] }> {
    const where: any = {};
    if (regionType) where.type = regionType;

    const regions = await prisma.region.findMany({ where });

    let success = 0;
    let failed = 0;
    const errors: any[] = [];

    for (const region of regions) {
        try {
            await generateProgrammaticPage(templateId, region.id, userId);
            success++;
        } catch (error: any) {
            failed++;
            errors.push({
                regionId: region.id,
                regionName: region.name,
                error: error.message,
            });
        }
    }

    return { success, failed, errors };
}
