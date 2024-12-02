'use server';

import { auth } from '@/auth.config';
import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export const deleteClient = async (id: string) => {
    console.log(id)
    const session = await auth();
    if (session?.user.role !== 'admin') {
        return {
            ok: false,
            message: 'Debe ser un usuario administrador',
        }
    }

    try {
        // Borrar las notas del cliente
        await prisma.clientNote.deleteMany({
            where: { clientId: id }
        });

        // Borrar las suscripciones asociadas al cliente
        await prisma.subscription.deleteMany({
            where: { clientId: id}
        });

        await prisma.client.delete({ where: { id } });
        revalidatePath('/clients');
        return {
            ok: true
        }
    } catch (error) {
        console.log(error)
        return {
            ok: false,
            message: 'No se pudo eliminar el cliente'
        }
    }
}