'use server';

import { Client } from '@/interfaces';
import prisma from '@/lib/prisma';
import { IdentificationType } from '@prisma/client';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';

const clientSchema = z.object({
    id: z.string().optional(),
    name: z.string(),
    lastName: z.string(),
    identification: z.coerce.number().min(0).transform(val => Number(val)),
    identificationType: z.nativeEnum(IdentificationType),
    phone: z.string(),
    email: z.string(),
    address: z.string().optional(),
    city: z.string().optional(),
    state: z.string().optional(),
    countryId: z.string(),
    userId: z.string(),
});

export const createUpdateClient = async (clientData: Client) => {

    const clientParsed = clientSchema.safeParse(clientData);

    if (!clientParsed.success) {
        return {
            ok: false,
            message: 'Error en la validación'
        }
    }

    const data = clientParsed.data;

    const { id, ...rest } = data;

    try {
       // let message = '';
        if (id) {

            const updatedClient = await prisma.client.update({
                where: { id },
                data: {
                    ...rest,
                    address: rest.address ?? '',
                    city: rest.city ?? '',
                    state: rest.state ?? '',
                },
            });

            //message = 'Cliente actualizado';

            revalidatePath(`/client/${id}`);

            return {
                ok: true,
                clientId: updatedClient.id,
                message: 'Cliente actualizado',
            }

        } else {

            const newClient = await prisma.client.create({
                data: {
                    ...rest
                }
            });

            //message = 'Cliente creado';

            revalidatePath('/clients/');

            return {
                ok: true,
                clientId: newClient.id,
                message: 'Cliente creado',
            }

        }
        //return { ok: true, message}
    } catch (error) {
        return {
            ok: false,
            message: 'No se pudo crear el cliente'
        }
    }
}