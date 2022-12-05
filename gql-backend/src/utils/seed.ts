import { FakeRoutines } from "./fakeData";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient()

async function main() {
    await prisma.scenario.deleteMany({});
    await prisma.routine.deleteMany({});

    console.log(`Start seeding ...`)
    for (const u of FakeRoutines) {
        const routine = await prisma.routine.create({
            data: {
                name: u.name,
                description: u.description,
                author: u.author,
            },
        });

        for (const s of u.scenarios) {
            const scenario = await prisma.scenario.create({
                data: {
                    name: s.name,
                    playCount: s.playCount,
                    routineId: routine.id
                }
            })

            console.log("Created scenario", scenario.name);
        }

        // for (const s of FAKE_SCENARIOS) {
        //     const scenario = await prisma.scenario.create({
        //         data: {
        //             name: s.name,
        //             playCount: s.playCount,
        //             routineId: routine.id
        //         }
        //     })
        //     console.log("Create scenario with id: ", scenario.id);
        // }
        console.log(`Created routine with id: ${routine.id}`)
    }
    console.log(`Seeding finished.`)
}

main()
    .then(async () => {
        await prisma.$disconnect()
    })
    .catch(async (e) => {
        console.error(e)
        await prisma.$disconnect()
        process.exit(1)
    })
