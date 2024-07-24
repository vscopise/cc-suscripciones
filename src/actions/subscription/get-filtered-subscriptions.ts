'use server';

import prisma from '@/lib/prisma';

interface Props {
    active: string;
    client: string;
    page: number;
    take: number;
    //isAdmin: boolean,
    //userId: string,
}

export const getFilteredSubscriptions = async ({ active, client, page = 1, take = 10 }: Props) => {
    if (isNaN(Number(page))) page = 1;
    if (page < 1) page = 1;

    const today = new Date()
    const checkDate = new Date(today.setMonth(today.getMonth() - 3));

    try {
        const allSubscriptions = await prisma.subscription.findMany({
            include: {
                client: true
            },
            where: {
                ...(active !== 'all' ? { active: active === 'yes' } : {}),
                ...(active === '1' ? { dateDeactivation: { gt: checkDate } } : {}),
                ...(active === '2' ? { dateDeactivation: { lte: checkDate } } : {}),
                ...(client !== '' ? { client: { email: { contains: client } } } : {}),
            }
        });
        const count = allSubscriptions.length;

        const subscriptions = await prisma.subscription.findMany({
            take: take,
            skip: take * (page - 1),
            include: {
                client: true
            },
            where: {
                ...(active !== 'all' ? { active: active === 'yes' } : {}),
                ...(active === '1' ? { dateDeactivation: { gt: checkDate } } : {}),
                ...(active === '2' ? { dateDeactivation: { lte: checkDate } } : {}),
                ...(client !== '' ? { client: { email: { contains: client } } } : {}),

            }
        });
        //const count = await prisma.subscription.count();
        //const count = subscriptions.length;
        //console.log({ subscriptions });
        const totalPages = Math.ceil(count / take);

        return {
            ok: true,
            totalPages: totalPages,
            subscriptions: subscriptions,
            allSubscriptions: allSubscriptions,
        }
    } catch (error) {
        console.log(error);
        return {
            ok: false,
            message: 'Error de base de datos'
        }
    }
}