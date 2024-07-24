import prisma from '../lib/prisma';
import { initialData } from './seed';
import { countries } from './seed-countries';

async function main() {
    await prisma.subscription.deleteMany();
    await prisma.user.deleteMany();
    await prisma.client.deleteMany();
    await prisma.country.deleteMany();

    const { users } = initialData;

    await prisma.user.createMany({
        data: users,
    });

    await prisma.country.createMany({
        data: countries
    });

    console.log('Seed ejecutado correctamente');
}

(() => {
    if (process.env.NODE_ENV === 'production') return;

    main();
})();