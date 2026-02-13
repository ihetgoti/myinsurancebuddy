const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkFailedJobs() {
    try {
        const jobs = await prisma.aIGenerationJob.findMany({
            orderBy: { createdAt: 'desc' },
            take: 5
        });

        if (jobs.length > 0) {
            console.log('Recent Jobs:');
            jobs.forEach(job => {
                console.log(`- ID: ${job.id}`);
                console.log(`  Name: ${job.name}`);
                console.log(`  Status: ${job.status}`);
                console.log(`  Created: ${job.createdAt}`);
                if (job.errorLog) console.log(`  Error Log: ${JSON.stringify(job.errorLog)}`);
                console.log('---');
            });
        } else {
            console.log('No jobs found.');
        }

        const providers = await prisma.aIProvider.findMany();
        console.log('AI Providers:', providers.length);
        providers.forEach(p => console.log(`- ${p.name} (Active: ${p.isActive})`));

    } catch (error) {
        console.error(error);
    } finally {
        await prisma.$disconnect();
    }
}

checkFailedJobs();
