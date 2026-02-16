const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
    await prisma.user.updateMany({
        where: {
            email: {
                in: ['bhushan@gmail.com', 'bhushan22@gmail.com']
            }
        },
        data: {
            role: 'ADMIN'
        }
    })
    console.log('Users promoted to ADMIN')
}

main()
    .catch((e) => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
