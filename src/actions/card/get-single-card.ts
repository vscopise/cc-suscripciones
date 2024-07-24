'use server';

import { auth } from '@/auth.config';
import prisma from '@/lib/prisma';

export const getSingleCard = async (id: string) => {

    const session = await auth();
    if (!session) return null;

    try {
        const card = await prisma.creditCard.findFirst({ where: { id } });

        if (!card) return null;

        return { ...card };

    } catch (error) {
        console.log(error)
        throw new Error('Error al obtener la Tarjeta por id');
    }
}