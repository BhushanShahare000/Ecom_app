const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
    const product = await prisma.product.findFirst({
        where: {
            name: {
                contains: 'pink',
                mode: 'insensitive'
            }
        }
    })
    if (product) {
        console.log(`Name: ${product.name}`)
        console.log(`Image Prefix (50 chars): ${product.image.substring(0, 50)}`)
        console.log(`Image Length: ${product.image.length}`)
    } else {
        console.log('Product not found')
    }
}

main()
    .catch((e) => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
