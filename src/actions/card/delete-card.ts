'use server';

import { auth } from '@/auth.config';
import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export const deleteCard = async (id: string) => {
    const session = await auth();
    if (session?.user.role !== 'admin') {
        return {
            ok: false,
            message: 'Debe ser un usuario administrador',
        }
    }

    try {
        await prisma.creditCard.delete({where: {id}});
        revalidatePath('/cards');
        return {
            ok: true
        }
    } catch (error) {
        console.log(error)
        return {
            ok: false,
            message: 'No se pudo eliminar la tarjeta'
        }
    }
}