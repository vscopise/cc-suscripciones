'use server';

import { auth } from '@/auth.config';
import prisma from '@/lib/prisma';

export const getSinglePlan = async (id: string) => {

    const session = await auth();
    if (!session) return null;

    try {
        const plan = await prisma.plan.findFirst({ where: { id: id } });

        if (!plan) return null;

        return { ...plan }
        
    } catch (error) {
        console.log(error)
        throw new Error('Error al obtener el Plan por id');
    }
}