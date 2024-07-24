'use server';

import prisma from '@/lib/prisma';

export const getAllClients = async () => {
    try {
        const clients = await prisma.client.findMany({
            orderBy: { email: 'asc' }
        });
        return clients;
    } catch (error) {
        console.log(error);
    }
}