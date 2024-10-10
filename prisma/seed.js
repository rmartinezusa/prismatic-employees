const prisma = require("../prisma");

async function seed() {
    const names = [
        { name: "Alice" },
        { name: "Bob" },
        { name: "Charlie" },
        { name: "Diana" },
        { name: "Ethan" },
        { name: "Fiona" },
        { name: "George" },
        { name: "Hannah" },
        { name: "Ivan" },
        { name: "Julia" }
    ];

    try {
        await prisma.employee.createMany({ data: names });
        console.log('Seeding successful!');
    } catch (error) {
        console.error('Error seeding data:', error);
    }
}

seed();


