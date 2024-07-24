'use server';

import { auth } from '@/auth.config';
import prisma from '@/lib/prisma';

export const getSingleClient = async (id: string) => {

    const session = await auth();
    if (!session) return null;

    try {
        const client = await prisma.client.findFirst({
            where: { id }
        });

        if (!client) return null;

        return { ...client }

    } catch (error) {
        console.log(error)
        throw new Error('Error al obtener el Cliente por id');
    }
}