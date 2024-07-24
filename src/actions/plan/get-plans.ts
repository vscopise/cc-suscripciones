'use server';

import prisma from '@/lib/prisma';

export const getPlans = async () => {

    try {
        const plans = await prisma.plan.findMany({
            orderBy: { name: 'asc' }
        });

        return {
            ok: true,
            plans: plans,
        }
    } catch (error) {
        console.log(error);
        return {
            ok: false,
            message: 'Error de base de datos'
        }
    }
}