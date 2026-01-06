import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { writeFile, mkdir } from "fs/promises";
import { join } from "path";
import sharp from "sharp";
import { v4 as uuidv4 } from "uuid";

export const dynamic = 'force-dynamic';

const UPLOAD_DIR = process.env.UPLOAD_DIR || "/var/www/myinsurancebuddies.com/uploads";
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];

const SIZES = {
    xl: { width: 1920, height: 1080 },
    lg: { width: 1280, height: 720 },
    md: { width: 800, height: 600 },
    sm: { width: 400, height: 300 },
    thumb: { width: 150, height: 150 },
};

export async function POST(request: NextRequest) {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const formData = await request.formData();
        const file = formData.get("file") as File;
        const altText = formData.get("altText") as string;

        if (!file) {
            return NextResponse.json({ error: "No file provided" }, { status: 400 });
        }

        if (!ALLOWED_TYPES.includes(file.type)) {
            return NextResponse.json({ error: "Invalid file type" }, { status: 400 });
        }

        if (file.size > MAX_FILE_SIZE) {
            return NextResponse.json({ error: "File too large" }, { status: 400 });
        }

        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        // Sanitize filename
        const ext = file.name.split(".").pop() || "jpg";
        const filename = `${uuidv4()}.${ext}`;
        const date = new Date();
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, "0");

        const uploadPath = join(UPLOAD_DIR, String(year), month);
        await mkdir(uploadPath, { recursive: true });

        const originalPath = join(uploadPath, filename);
        await writeFile(originalPath, buffer);

        // Get image metadata
        const metadata = await sharp(buffer).metadata();

        // Generate sizes and webp variants
        const variants: any = {};
        for (const [sizeName, dimensions] of Object.entries(SIZES)) {
            const variantFilename = `${filename.replace(/\.[^.]+$/, "")}-${sizeName}.webp`;
            const variantPath = join(uploadPath, variantFilename);

            await sharp(buffer)
                .resize(dimensions.width, dimensions.height, {
                    fit: "inside",
                    withoutEnlargement: true,
                })
                .webp({ quality: 85 })
                .toFile(variantPath);

            variants[sizeName] = `/${year}/${month}/${variantFilename}`;
        }

        // Save to database
        const url = `/uploads/${year}/${month}/${filename}`;
        const media = await prisma.media.create({
            data: {
                filename,
                originalName: file.name,
                path: `/${year}/${month}/${filename}`,
                url,
                width: metadata.width || null,
                height: metadata.height || null,
                sizeBytes: file.size,
                altText: altText || null,
                uploadedBy: session.user.id,
            },
        });

        return NextResponse.json({
            ...media,
            variants,
            url: `/uploads/${year}/${month}/${filename}`,
        }, { status: 201 });
    } catch (error) {
        console.error("Upload error:", error);
        return NextResponse.json({ error: "Upload failed" }, { status: 500 });
    }
}

// GET /api/media - List media
export async function GET(request: NextRequest) {
    const session = await getServerSession(authOptions);

    if (!session) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");
    const skip = (page - 1) * limit;

    const [media, total] = await Promise.all([
        prisma.media.findMany({
            orderBy: { createdAt: "desc" },
            skip,
            take: limit,
        }),
        prisma.media.count(),
    ]);

    return NextResponse.json({
        media: media.map(m => ({
            ...m,
            url: `/uploads${m.path}`,
        })),
        pagination: {
            page,
            limit,
            total,
            totalPages: Math.ceil(total / limit),
        },
    });
}
