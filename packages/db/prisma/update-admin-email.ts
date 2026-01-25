import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log('Updating super admin email...');

    // Find the old admin user
    const oldAdmin = await prisma.user.findUnique({
        where: { email: 'admin@myinsurancebuddies.com' },
    });

    if (oldAdmin) {
        // Update to new email
        await prisma.user.update({
            where: { id: oldAdmin.id },
            data: {
                email: 'ihetgoti@gmail.com',
                name: 'Het Goti',
            },
        });
        console.log('✅ Updated admin email from admin@myinsurancebuddies.com to ihetgoti@gmail.com');
    } else {
        // Check if new email already exists
        const newAdmin = await prisma.user.findUnique({
            where: { email: 'ihetgoti@gmail.com' },
        });

        if (newAdmin) {
            console.log('✅ Admin with email ihetgoti@gmail.com already exists');
        } else {
            console.log('⚠️  No admin user found. Run seed script to create one.');
        }
    }
}

main()
    .catch((e) => {
        console.error('Error:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
