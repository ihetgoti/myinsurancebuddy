import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
    console.log('🌱 Seeding database...');

    // Create admin user
    const adminPassword = await bcrypt.hash('admin123', 10);
    const admin = await prisma.user.upsert({
        where: { email: 'admin@myinsurancebuddies.com' },
        update: {},
        create: {
            email: 'admin@myinsurancebuddies.com',
            name: 'Admin User',
            passwordHash: adminPassword,
            role: 'SUPER_ADMIN',
            isActive: true,
        },
    });
    console.log('✅ Created admin user:', admin.email);

    // Create insurance types
    const insuranceTypes = [
        { name: 'Car Insurance', slug: 'car-insurance', icon: '🚗', description: 'Protect your vehicle and drive with confidence', sortOrder: 1 },
        { name: 'Home Insurance', slug: 'home-insurance', icon: '🏠', description: 'Secure your home and belongings', sortOrder: 2 },
        { name: 'Health Insurance', slug: 'health-insurance', icon: '🏥', description: 'Coverage for medical expenses and wellness', sortOrder: 3 },
        { name: 'Life Insurance', slug: 'life-insurance', icon: '💚', description: 'Financial security for your loved ones', sortOrder: 4 },
        { name: 'Business Insurance', slug: 'business-insurance', icon: '💼', description: 'Protect your business from unexpected risks', sortOrder: 5 },
        { name: 'Travel Insurance', slug: 'travel-insurance', icon: '✈️', description: 'Peace of mind on your adventures', sortOrder: 6 },
    ];

    for (const type of insuranceTypes) {
        await prisma.insuranceType.upsert({
            where: { slug: type.slug },
            update: type,
            create: type,
        });
    }
    console.log('✅ Created', insuranceTypes.length, 'insurance types');

    // Create US country
    const us = await prisma.country.upsert({
        where: { code: 'us' },
        update: {},
        create: {
            code: 'us',
            name: 'United States',
            isActive: true,
        },
    });
    console.log('✅ Created country: United States');

    // Create sample US states
    const states = [
        { name: 'California', slug: 'california', code: 'CA' },
        { name: 'Texas', slug: 'texas', code: 'TX' },
        { name: 'Florida', slug: 'florida', code: 'FL' },
        { name: 'New York', slug: 'new-york', code: 'NY' },
        { name: 'Illinois', slug: 'illinois', code: 'IL' },
        { name: 'Pennsylvania', slug: 'pennsylvania', code: 'PA' },
        { name: 'Ohio', slug: 'ohio', code: 'OH' },
        { name: 'Georgia', slug: 'georgia', code: 'GA' },
        { name: 'North Carolina', slug: 'north-carolina', code: 'NC' },
        { name: 'Michigan', slug: 'michigan', code: 'MI' },
    ];

    const stateRecords: Record<string, any> = {};
    for (const state of states) {
        const record = await prisma.state.upsert({
            where: { countryId_slug: { countryId: us.id, slug: state.slug } },
            update: state,
            create: {
                ...state,
                countryId: us.id,
                isActive: true,
            },
        });
        stateRecords[state.slug] = record;
    }
    console.log('✅ Created', states.length, 'US states');

    // Create sample cities for California
    const californiaCities = [
        { name: 'Los Angeles', slug: 'los-angeles', population: 3900000 },
        { name: 'San Francisco', slug: 'san-francisco', population: 870000 },
        { name: 'San Diego', slug: 'san-diego', population: 1400000 },
        { name: 'San Jose', slug: 'san-jose', population: 1000000 },
        { name: 'Sacramento', slug: 'sacramento', population: 500000 },
        { name: 'Fresno', slug: 'fresno', population: 530000 },
        { name: 'Long Beach', slug: 'long-beach', population: 470000 },
        { name: 'Oakland', slug: 'oakland', population: 430000 },
        { name: 'Bakersfield', slug: 'bakersfield', population: 380000 },
        { name: 'Anaheim', slug: 'anaheim', population: 350000 },
    ];

    const california = stateRecords['california'];
    for (const city of californiaCities) {
        await prisma.city.upsert({
            where: { stateId_slug: { stateId: california.id, slug: city.slug } },
            update: city,
            create: {
                ...city,
                stateId: california.id,
                isActive: true,
            },
        });
    }
    console.log('✅ Created', californiaCities.length, 'California cities');

    // Create sample cities for Texas
    const texasCities = [
        { name: 'Houston', slug: 'houston', population: 2300000 },
        { name: 'San Antonio', slug: 'san-antonio', population: 1500000 },
        { name: 'Dallas', slug: 'dallas', population: 1300000 },
        { name: 'Austin', slug: 'austin', population: 1000000 },
        { name: 'Fort Worth', slug: 'fort-worth', population: 920000 },
    ];

    const texas = stateRecords['texas'];
    for (const city of texasCities) {
        await prisma.city.upsert({
            where: { stateId_slug: { stateId: texas.id, slug: city.slug } },
            update: city,
            create: {
                ...city,
                stateId: texas.id,
                isActive: true,
            },
        });
    }
    console.log('✅ Created', texasCities.length, 'Texas cities');

    console.log('\n🎉 Database seeding completed!');
    console.log('\nAdmin login:');
    console.log('  Email: admin@myinsurancebuddies.com');
    console.log('  Password: admin123');
}

main()
    .catch((e) => {
        console.error('❌ Seeding failed:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
