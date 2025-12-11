import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

const sampleTemplates = [
    {
        name: "Auto Insurance State Guide",
        slug: "auto-insurance-state-guide",
        templateHtml: `
<div class="insurance-guide">
  <h1>Best Auto Insurance in {{region_name}}</h1>
  
  <div class="intro">
    <p>Looking for affordable auto insurance in {{region_name}}? You've come to the right place. This comprehensive guide will help you find the best car insurance deals in {{region_name}}.</p>
  </div>

  <section class="requirements">
    <h2>{{region_name}} Auto Insurance Requirements</h2>
    <p>{{#if state_code}}Every driver in {{state_code}} must carry minimum liability coverage.{{else}}Check your local requirements for minimum coverage.{{/if}}</p>
    <ul>
      <li>Bodily Injury Liability</li>
      <li>Property Damage Liability</li>
      <li>Uninsured/Underinsured Motorist Coverage</li>
    </ul>
  </section>

  <section class="tips">
    <h2>Tips to Save on Auto Insurance in {{region_name}}</h2>
    <ol>
      <li><strong>Compare Multiple Quotes</strong> - Get at least 3-5 quotes from different insurers</li>
      <li><strong>Bundle Policies</strong> - Combine auto with home insurance for discounts</li>
      <li><strong>Maintain Good Credit</strong> - Better credit scores often mean lower rates</li>
      <li><strong>Increase Deductibles</strong> - Higher deductibles can lower premiums</li>
      <li><strong>Ask About Discounts</strong> - Safe driver, good student, low mileage discounts</li>
    </ol>
  </section>

  {{#if median_income}}
  <section class="local-context">
    <h2>Insurance Costs in {{region_name}}</h2>
    <p>With a median household income of {{formatCurrency median_income}}, residents of {{region_name}} should budget approximately 1-2% of their income for auto insurance.</p>
  </section>
  {{/if}}

  <section class="faq">
    <h2>Frequently Asked Questions</h2>
    <div class="faq-item">
      <h3>What factors affect auto insurance rates in {{region_name}}?</h3>
      <p>Your age, driving record, credit score, vehicle type, coverage limits, and location within {{region_name}} all impact your insurance rates.</p>
    </div>
    <div class="faq-item">
      <h3>How often should I shop for new auto insurance?</h3>
      <p>Experts recommend comparing rates at least once a year, or whenever you experience a major life change.</p>
    </div>
  </section>

  {{#if legal_notes}}
  <section class="legal">
    <h3>Important Legal Information</h3>
    <div class="legal-notice">{{{legal_notes}}}</div>
  </section>
  {{/if}}
</div>
    `,
        placeholders: ["region_name", "state_code", "median_income", "legal_notes"],
    },
    {
        name: "Health Insurance Guide",
        slug: "health-insurance-guide",
        templateHtml: `
<div class="insurance-guide">
  <h1>Affordable Health Insurance in {{region_name}}</h1>
  
  <div class="intro">
    <p>Finding quality, affordable health insurance in {{region_name}} doesn't have to be complicated. This guide breaks down your options and shows you how to save.</p>
  </div>

  <section class="options">
    <h2>Health Insurance Options in {{region_name}}</h2>
    <ul>
      <li><strong>Employer-Sponsored Plans</strong> - Often the most affordable option</li>
      <li><strong>Healthcare Marketplace</strong> - ACA plans with potential subsidies</li>
      <li><strong>Medicaid</strong> - For qualifying low-income individuals and families</li>
      <li><strong>Medicare</strong> - For those 65+ or with certain disabilities</li>
      <li><strong>Private Insurance</strong> - Direct purchase from insurers</li>
    </ul>
  </section>

  <section class="savings-tips">
    <h2>How to Save on Health Insurance</h2>
    <ol>
      <li><strong>Check for Subsidies</strong> - You may qualify for premium tax credits</li>
      <li><strong>Consider HSA Plans</strong> - High-deductible plans with tax advantages</li>
      <li><strong>Compare Networks</strong> - Make sure your doctors are in-network</li>
      <li><strong>Evaluate Your Needs</strong> - Don't over-insure or under-insure</li>
      <li><strong>Timing Matters</strong> - Enroll during open enrollment or qualifying events</li>
    </ol>
  </section>

  {{#if population}}
  <section class="local-data">
    <h2>Healthcare in {{region_name}}</h2>
    <p>With a population of {{formatNumber population}}, {{region_name}} offers various healthcare providers and insurance options to choose from.</p>
  </section>
  {{/if}}

  <section class="faq">
    <h2>Common Questions</h2>
    <div class="faq-item">
      <h3>When is open enrollment for {{region_name}}?</h3>
      <p>Open enrollment typically runs from November 1 to January 15 each year. Special enrollment periods may be available for qualifying life events.</p>
    </div>
    <div class="faq-item">
      <h3>What if I can't afford health insurance?</h3>
      <p>Check if you qualify for Medicaid, CHIP, or marketplace subsidies. Many {{region_name}} residents qualify for financial assistance.</p>
    </div>
  </section>
</div>
    `,
        placeholders: ["region_name", "population", "state_code"],
    },
    {
        name: "Home Insurance Guide",
        slug: "home-insurance-guide",
        templateHtml: `
<div class="insurance-guide">
  <h1>Best Home Insurance Rates in {{region_name}}</h1>
  
  <div class="intro">
    <p>Protect your most valuable asset with the right home insurance policy. Learn how homeowners in {{region_name}} can find comprehensive coverage at competitive rates.</p>
  </div>

  <section class="coverage-types">
    <h2>Types of Home Insurance Coverage</h2>
    <ul>
      <li><strong>Dwelling Coverage</strong> - Repairs or rebuilds your home</li>
      <li><strong>Personal Property</strong> - Protects your belongings</li>
      <li><strong>Liability Protection</strong> - Covers injuries on your property</li>
      <li><strong>Additional Living Expenses</strong> - Temporary housing costs</li>
      <li><strong>Other Structures</strong> - Garage, shed, fence coverage</li>
    </ul>
  </section>

  <section class="savings">
    <h2>Ways to Reduce Home Insurance Costs in {{region_name}}</h2>
    <ol>
      <li><strong>Bundle Policies</strong> - Combine home and auto for 15-25% savings</li>
      <li><strong>Improve Home Security</strong> - Alarm systems, deadbolts, smoke detectors</li>
      <li><strong>Raise Deductibles</strong> - Consider $1,000+ deductible for lower premiums</li>
      <li><strong>Maintain Good Credit</strong> - Better credit = better rates</li>
      <li><strong>Update Your Home</strong> - Roof, electrical, plumbing upgrades can reduce rates</li>
      <li><strong>Ask About Discounts</strong> - Long-term customer, claim-free, senior discounts</li>
    </ol>
  </section>

  <section class="faq">
    <h2>Home Insurance FAQs</h2>
    <div class="faq-item">
      <h3>How much home insurance do I need in {{region_name}}?</h3>
      <p>Your coverage should equal the cost to rebuild your home (not market value). Factor in local construction costs in {{region_name}}.</p>
    </div>
    <div class="faq-item">
      <h3>Is flood insurance included?</h3>
      <p>Standard home insurance doesn't cover flooding. {{region_name}} residents should evaluate their flood risk and consider separate flood insurance.</p>
    </div>
  </section>
</div>
    `,
        placeholders: ["region_name", "state_code"],
    },
];

async function seedTemplates() {
    console.log("Seeding sample templates...");

    // Get or create super admin user
    const adminEmail = "admin@myinsurancebuddies.com";
    let admin = await prisma.user.findUnique({
        where: { email: adminEmail },
    });

    if (!admin) {
        const passwordHash = await bcrypt.hash("changeme123", 10);
        admin = await prisma.user.create({
            data: {
                email: adminEmail,
                name: "Super Admin",
                passwordHash,
                role: "SUPER_ADMIN",
                isActive: true,
            },
        });
        console.log(`✓ Created admin user: ${adminEmail}`);
    }

    for (const template of sampleTemplates) {
        const existing = await prisma.programmaticTemplate.findUnique({
            where: { slug: template.slug },
        });

        if (!existing) {
            await prisma.programmaticTemplate.create({
                data: {
                    ...template,
                    createdById: admin.id,
                },
            });
            console.log(`✓ Created template: ${template.name}`);
        } else {
            console.log(`- Template already exists: ${template.name}`);
        }
    }

    console.log("✓ Template seeding complete!");
}

seedTemplates()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
