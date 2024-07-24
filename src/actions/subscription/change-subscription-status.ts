'use server';

import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export const changeSubscriptionStatus = async (subscriptionId: string, value: boolean) => {
    const dateDeactivation = value === false ? undefined : new Date()
    try {
        await prisma.subscription.update({
            where: {
                id: subscriptionId,
            },
            data: {
                active: !value,
                dateDeactivation,
            }
        });

        revalidatePath('/subscriptions')
        return {
            ok: true
        }

    } catch (error) {
        console.log(error);
        return {
            ok: false,
            message: 'No se pudo cambiar el estado de la suscripción'
        }
    }
}