'use server';

import { CreditCard } from '@/interfaces';
import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';


const cardSchema = z.object({
    cvv: z.coerce.number().min(0).transform(val => Number(val)).optional(),
    clientId: z.string(),
    expiration: z.date(),
    id: z.string().optional(),
    number: z.coerce.number().min(0).transform(val => Number(val)),
});

export const createUpdateCard = async (cardData: CreditCard) => {
    const cardParsed = cardSchema.safeParse(cardData);

    if (!cardParsed.success) {
        return {
            ok: false,
            message: 'Error en la validación'
        }
    }

    const card = cardParsed.data;

    const { id, ...rest } = card;

    try {
        let message;

        if (id) {
            await prisma.creditCard.update({
                where: { id },
                data: { ...rest },
            });

            message = 'Tarjeta actualizada';

            revalidatePath(`/card/${id}`);
        } else {

            await prisma.creditCard.create({
                data: {...rest}
            });

            message = 'Tarjeta creada';

            revalidatePath('/cards/');
        }
        return { ok: true, message};
    } catch (error) {
        console.log(error);
        return {
            ok: false,
            message: 'Error en la actualización de la tarjeta'
        }
    }
}