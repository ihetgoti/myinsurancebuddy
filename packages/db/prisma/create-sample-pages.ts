import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
    console.log('Creating sample pages...');

    // Get insurance types
    const carInsurance = await prisma.insuranceType.findFirst({ where: { slug: 'car-insurance' } });
    const homeInsurance = await prisma.insuranceType.findFirst({ where: { slug: 'home-insurance' } });

    if (!carInsurance || !homeInsurance) {
        console.error('Insurance types not found. Run seed first.');
        return;
    }

    // Get US country
    const us = await prisma.country.findFirst({ where: { code: 'us' } });
    if (!us) {
        console.error('US country not found. Run seed first.');
        return;
    }

    // Get states
    const states = await prisma.state.findMany();
    console.log('Found', states.length, 'states');

    // Get cities
    const cities = await prisma.city.findMany();
    console.log('Found', cities.length, 'cities');

    let created = 0;

    // Create state-level pages for car insurance
    for (const state of states) {
        const slug = `car-insurance/${state.slug}`;
        const existing = await prisma.page.findFirst({ where: { slug } });
        if (!existing) {
            await prisma.page.create({
                data: {
                    slug,
                    title: `Car Insurance in ${state.name}`,
                    insuranceTypeId: carInsurance.id,
                    countryId: us.id,
                    stateId: state.id,
                    geoLevel: 'STATE',
                    status: 'DRAFT',
                    content: [],
                }
            });
            created++;
            console.log('Created:', slug);
        }
    }

    // Create state-level pages for home insurance
    for (const state of states) {
        const slug = `home-insurance/${state.slug}`;
        const existing = await prisma.page.findFirst({ where: { slug } });
        if (!existing) {
            await prisma.page.create({
                data: {
                    slug,
                    title: `Home Insurance in ${state.name}`,
                    insuranceTypeId: homeInsurance.id,
                    countryId: us.id,
                    stateId: state.id,
                    geoLevel: 'STATE',
                    status: 'DRAFT',
                    content: [],
                }
            });
            created++;
            console.log('Created:', slug);
        }
    }

    // Create city-level pages for car insurance
    for (const city of cities) {
        const state = await prisma.state.findUnique({ where: { id: city.stateId } });
        if (state) {
            const slug = `car-insurance/${state.slug}/${city.slug}`;
            const existing = await prisma.page.findFirst({ where: { slug } });
            if (!existing) {
                await prisma.page.create({
                    data: {
                        slug,
                        title: `Car Insurance in ${city.name}, ${state.name}`,
                        insuranceTypeId: carInsurance.id,
                        countryId: us.id,
                        stateId: state.id,
                        cityId: city.id,
                        geoLevel: 'CITY',
                        status: 'DRAFT',
                        content: [],
                    }
                });
                created++;
                console.log('Created:', slug);
            }
        }
    }

    // Create city-level pages for home insurance
    for (const city of cities) {
        const state = await prisma.state.findUnique({ where: { id: city.stateId } });
        if (state) {
            const slug = `home-insurance/${state.slug}/${city.slug}`;
            const existing = await prisma.page.findFirst({ where: { slug } });
            if (!existing) {
                await prisma.page.create({
                    data: {
                        slug,
                        title: `Home Insurance in ${city.name}, ${state.name}`,
                        insuranceTypeId: homeInsurance.id,
                        countryId: us.id,
                        stateId: state.id,
                        cityId: city.id,
                        geoLevel: 'CITY',
                        status: 'DRAFT',
                        content: [],
                    }
                });
                created++;
                console.log('Created:', slug);
            }
        }
    }

    console.log('\n✅ Created', created, 'sample pages');
}

main().catch(console.error).finally(() => prisma.$disconnect());
