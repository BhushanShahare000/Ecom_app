const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    // Update all users to be ADMIN for development purposes, or find by email if we knew it clearly.
    // Since there seems to be only one user or few, upgrading them is fine for dev.
    const users = await prisma.user.updateMany({
        data: {
            role: 'ADMIN'
        }
    });
    console.log('Updated users count:', users.count);

    const allUsers = await prisma.user.findMany();
    console.log('All Users:', allUsers);
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
