'use server';

import { auth } from '@/auth.config';
import prisma from '@/lib/prisma';

export const getSingleSubscription = async (id: string) => {

    const session = await auth();
    if (!session) return null;

    try {
        const subscription = await prisma.subscription.findFirst({ where: { id } });

        if (!subscription) return null;

        return { ...subscription };

    } catch (error) {
        console.log(error)
        throw new Error('Error al obtener Suscripción por id');
    }
}