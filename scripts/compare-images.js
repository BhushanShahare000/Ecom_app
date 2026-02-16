const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
    const products = await prisma.product.findMany({
        take: 5
    })
    products.forEach(p => {
        console.log(`Name: ${p.name}`)
        console.log(`Image Prefix: ${p.image.substring(0, 30)}...`)
        console.log(`Image Length: ${p.image.length}`)
        console.log('---')
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
