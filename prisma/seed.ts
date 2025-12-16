import { prisma } from "../app/lib/prisma";

async function main() {
    const category = await prisma.category.create({
        data: { name: "Electronics" },
    });

    await prisma.product.createMany({
        data: [
            {
                name: "iPhone 15",
                description: "Latest Apple iPhone",
                price: 999,
                image: "https://example.com/iphone.jpg",
                categoryId: category.id,
            },
            {
                name: "Samsung Galaxy S24",
                description: "Flagship Android phone",
                price: 899,
                image: "https://example.com/samsung.jpg",
                categoryId: category.id,
            },
        ],
    });
}

main()
    .then(() => console.log("Seeded successfully"))
    .catch((e) => console.error(e))
    .finally(() => prisma.$disconnect());
