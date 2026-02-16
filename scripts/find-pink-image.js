const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
    const products = await prisma.product.findMany({
        where: {
            name: {
                contains: 'pink',
                mode: 'insensitive'
            }
        },
        select: {
            id: true,
            name: true,
            image: true
        }
    })
    products.forEach(p => {
        console.log(`ID: ${p.id} | Name: ${p.name} | Image: ${p.image}`)
    })
}

main()
    .catch((e) => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
