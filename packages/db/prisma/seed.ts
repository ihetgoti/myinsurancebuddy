import { PrismaClient, RegionType, UserRole } from '@prisma/client';

const prisma = new PrismaClient();

const states = [
    { name: 'Alabama', slug: 'alabama', stateCode: 'AL' },
    { name: 'Alaska', slug: 'alaska', stateCode: 'AK' },
    { name: 'Arizona', slug: 'arizona', stateCode: 'AZ' },
    { name: 'Arkansas', slug: 'arkansas', stateCode: 'AR' },
    { name: 'California', slug: 'california', stateCode: 'CA' },
    { name: 'Colorado', slug: 'colorado', stateCode: 'CO' },
    { name: 'Connecticut', slug: 'connecticut', stateCode: 'CT' },
    { name: 'Delaware', slug: 'delaware', stateCode: 'DE' },
    { name: 'Florida', slug: 'florida', stateCode: 'FL' },
    { name: 'Georgia', slug: 'georgia', stateCode: 'GA' },
    { name: 'Hawaii', slug: 'hawaii', stateCode: 'HI' },
    { name: 'Idaho', slug: 'idaho', stateCode: 'ID' },
    { name: 'Illinois', slug: 'illinois', stateCode: 'IL' },
    { name: 'Indiana', slug: 'indiana', stateCode: 'IN' },
    { name: 'Iowa', slug: 'iowa', stateCode: 'IA' },
    { name: 'Kansas', slug: 'kansas', stateCode: 'KS' },
    { name: 'Kentucky', slug: 'kentucky', stateCode: 'KY' },
    { name: 'Louisiana', slug: 'louisiana', stateCode: 'LA' },
    { name: 'Maine', slug: 'maine', stateCode: 'ME' },
    { name: 'Maryland', slug: 'maryland', stateCode: 'MD' },
    { name: 'Massachusetts', slug: 'massachusetts', stateCode: 'MA' },
    { name: 'Michigan', slug: 'michigan', stateCode: 'MI' },
    { name: 'Minnesota', slug: 'minnesota', stateCode: 'MN' },
    { name: 'Mississippi', slug: 'mississippi', stateCode: 'MS' },
    { name: 'Missouri', slug: 'missouri', stateCode: 'MO' },
    { name: 'Montana', slug: 'montana', stateCode: 'MT' },
    { name: 'Nebraska', slug: 'nebraska', stateCode: 'NE' },
    { name: 'Nevada', slug: 'nevada', stateCode: 'NV' },
    { name: 'New Hampshire', slug: 'new-hampshire', stateCode: 'NH' },
    { name: 'New Jersey', slug: 'new-jersey', stateCode: 'NJ' },
    { name: 'New Mexico', slug: 'new-mexico', stateCode: 'NM' },
    { name: 'New York', slug: 'new-york', stateCode: 'NY' },
    { name: 'North Carolina', slug: 'north-carolina', stateCode: 'NC' },
    { name: 'North Dakota', slug: 'north-dakota', stateCode: 'ND' },
    { name: 'Ohio', slug: 'ohio', stateCode: 'OH' },
    { name: 'Oklahoma', slug: 'oklahoma', stateCode: 'OK' },
    { name: 'Oregon', slug: 'oregon', stateCode: 'OR' },
    { name: 'Pennsylvania', slug: 'pennsylvania', stateCode: 'PA' },
    { name: 'Rhode Island', slug: 'rhode-island', stateCode: 'RI' },
    { name: 'South Carolina', slug: 'south-carolina', stateCode: 'SC' },
    { name: 'South Dakota', slug: 'south-dakota', stateCode: 'SD' },
    { name: 'Tennessee', slug: 'tennessee', stateCode: 'TN' },
    { name: 'Texas', slug: 'texas', stateCode: 'TX' },
    { name: 'Utah', slug: 'utah', stateCode: 'UT' },
    { name: 'Vermont', slug: 'vermont', stateCode: 'VT' },
    { name: 'Virginia', slug: 'virginia', stateCode: 'VA' },
    { name: 'Washington', slug: 'washington', stateCode: 'WA' },
    { name: 'West Virginia', slug: 'west-virginia', stateCode: 'WV' },
    { name: 'Wisconsin', slug: 'wisconsin', stateCode: 'WI' },
    { name: 'Wyoming', slug: 'wyoming', stateCode: 'WY' }
];

const cities = [
    { name: 'New York City', slug: 'new-york-city', stateCode: 'NY' },
    { name: 'Los Angeles', slug: 'los-angeles', stateCode: 'CA' },
    { name: 'Chicago', slug: 'chicago', stateCode: 'IL' },
    { name: 'Houston', slug: 'houston', stateCode: 'TX' },
    { name: 'Phoenix', slug: 'phoenix', stateCode: 'AZ' },
    { name: 'Philadelphia', slug: 'philadelphia', stateCode: 'PA' },
    { name: 'San Antonio', slug: 'san-antonio', stateCode: 'TX' },
    { name: 'San Diego', slug: 'san-diego', stateCode: 'CA' },
    { name: 'Dallas', slug: 'dallas', stateCode: 'TX' },
    { name: 'San Jose', slug: 'san-jose', stateCode: 'CA' },
    { name: 'Austin', slug: 'austin', stateCode: 'TX' },
    { name: 'Jacksonville', slug: 'jacksonville', stateCode: 'FL' },
    { name: 'Fort Worth', slug: 'fort-worth', stateCode: 'TX' },
    { name: 'Columbus', slug: 'columbus', stateCode: 'OH' },
    { name: 'Charlotte', slug: 'charlotte', stateCode: 'NC' },
    { name: 'San Francisco', slug: 'san-francisco', stateCode: 'CA' },
    { name: 'Indianapolis', slug: 'indianapolis', stateCode: 'IN' },
    { name: 'Seattle', slug: 'seattle', stateCode: 'WA' },
    { name: 'Denver', slug: 'denver', stateCode: 'CO' },
    { name: 'Washington D.C.', slug: 'washington-dc', stateCode: 'DC' }
];

async function main() {
    // Create Super Admin
    const email = 'admin@myinsurancebuddies.com';
    const existingUser = await prisma.user.findUnique({ where: { email } });

    if (!existingUser) {
        // Note: In production, use a real hashed password. This is a placeholder.
        // You can generate one using a script or online tool for Argon2/Bcrypt.
        await prisma.user.create({
            data: {
                email,
                name: 'Super Admin',
                passwordHash: '$argon2id$v=19$m=65536,t=3,p=4$placeholderhash',
                role: UserRole.SUPER_ADMIN,
            },
        });
        console.log('Super Admin created');
    }

    // Seed States
    for (const state of states) {
        await prisma.region.upsert({
            where: { slug: state.slug },
            update: {},
            create: {
                name: state.name,
                slug: state.slug,
                type: RegionType.STATE,
                stateCode: state.stateCode,
                seoSummary: `Find the best insurance in ${state.name}.`,
                legalNotes: `Insurance regulations in ${state.name} are governed by the state department of insurance.`,
            },
        });
    }
    console.log('States seeded');

    // Seed Cities
    for (const city of cities) {
        await prisma.region.upsert({
            where: { slug: city.slug },
            update: {},
            create: {
                name: city.name,
                slug: city.slug,
                type: RegionType.CITY,
                stateCode: city.stateCode,
                seoSummary: `Compare insurance rates in ${city.name}.`,
            },
        });
    }
    console.log('Cities seeded');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
