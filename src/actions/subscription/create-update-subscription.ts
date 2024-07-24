'use server';

import { Subscription } from '@/interfaces';
import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { PaymentMethod, Period } from '@prisma/client';
import { z } from 'zod';

const subscriptionSchema = z.object({
    active: z.boolean(),
    amount: z.coerce.number().min(0).transform(val => Number(val)),
    clientId: z.string().uuid(),
    comment: z.string().optional(),
    dateStart: z.date(),
    dateLastPay: z.date().nullable(),
    delivery: z.string().optional(),
    id: z.string().optional(),
    paymentMethod: z.nativeEnum(PaymentMethod),
    period: z.nativeEnum(Period),
    planId: z.string().uuid(),
    creditCardId: z.string().uuid().nullable(),
});

export const createUpdateSubscription = async (subscriptionData: Subscription) => {

    const subscriptionParsed = subscriptionSchema.safeParse(subscriptionData);

    if (!subscriptionParsed.success) {
        return {
            ok: false,
            message: 'Error en la validación'
        }
    }

    const subscription = subscriptionParsed.data;

    const { id, ...rest } = subscription;

    try {
        let message;
        if (id) {

            await prisma.subscription.update({
                where: { id },
                data: { ...rest },
            });

            message = 'Suscripción actualizada';

            revalidatePath(`/subscription/${id}`);

        } else {

            await prisma.subscription.create({
                data: {
                    ...rest,
                    delivery: rest.delivery ?? '',
                }
            });

            message = 'Suscripción creada';

            revalidatePath('/subscriptions');

        }

        return { ok: true, message }
    } catch (error) {
        console.log(error);
        return {
            ok: false,
            message: 'Error en la actualización de la suscripción'
        }
    }

}