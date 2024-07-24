'use server';

import prisma from '@/lib/prisma';

interface Props {
    name: string,
    email: string,
    subscriptions: string,
    page: number,
    take: number,
    isAdmin: boolean,
    userId: string,
}

export const getFilteredClients = async ({ name, email, subscriptions, page = 1, take = 10, isAdmin = true, userId }: Props) => {
    if (isNaN(Number(page))) page = 1;
    if (page < 1) page = 1;

    try {
        let clients, count;
        if (isAdmin) {
            clients = await prisma.client.findMany({
                take: take,
                skip: take * (page - 1),
                orderBy: { name: 'asc' },
                include: {
                    Subscription: true,
                },
                where: {
                    ...(name !== '' ? { OR: [{ name: { contains: name } }, { lastName: { contains: name } },] } : {}),
                    ...(email !== '' ? { email: { contains: email } } : {}),
                    ...(subscriptions === 'yes' ? { Subscription: { some: {} } } : {}),
                    ...(subscriptions === 'no' ? { Subscription: { none: {} } } : {}),
                },
            });
            count = await prisma.client.count({
                where: {
                    ...(name !== '' ? { OR: [{ name: { contains: name } }, { lastName: { contains: name } },] } : {}),
                    ...(email !== '' ? { email: { contains: email } } : {}),
                    ...(subscriptions === 'yes' ? { Subscription: { some: {} } } : {}),
                    ...(subscriptions === 'no' ? { Subscription: { none: {} } } : {}),
                },
            });
        } else {
            clients = await prisma.client.findMany({
                take: take,
                skip: take * (page - 1),
                orderBy: { name: 'asc' },
                include: {
                    Subscription: true,
                },
                where: {
                    userId,
                    ...(name !== '' ? { OR: [{ name: { contains: name } }, { lastName: { contains: name } },] } : {}),
                    ...(email !== '' ? { email: { contains: email } } : {}),
                    ...(subscriptions === 'yes' ? { Subscription: { some: {} } } : {}),
                    ...(subscriptions === 'no' ? { Subscription: { none: {} } } : {}),
                },
            });
            count = await prisma.client.count({
                 where: { 
                    userId,
                    ...(name !== '' ? { OR: [{ name: { contains: name } }, { lastName: { contains: name } },] } : {}),
                    ...(email !== '' ? { email: { contains: email } } : {}),
                    ...(subscriptions === 'yes' ? { Subscription: { some: {} } } : {}),
                    ...(subscriptions === 'no' ? { Subscription: { none: {} } } : {}), 
                } 
            });
        }
        const totalPages = Math.ceil(count / take);

        return {
            ok: true,
            totalPages: totalPages,
            clients: clients,
        }
    } catch (error) {
        console.log(error);
        return {
            ok: false,
            message: 'Error de base de datos'
        }
    }
}