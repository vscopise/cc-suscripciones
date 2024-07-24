'use server';

import { auth } from '@/auth.config';
import prisma from '@/lib/prisma';

export const getClientCards = async (clientId: string) => {
    
    const session = await auth();
    if (!session) return null;

    try {
        const cards = await prisma.creditCard.findMany({ where: { clientId } });

        if (!cards) return null;

        return { ...cards };

    } catch (error) {
        console.log(error)
        throw new Error('Error al obtener las Tarjeta del Cliente');

    }
}