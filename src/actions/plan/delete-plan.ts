'use server';

import { auth } from '@/auth.config';
import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export const deletePlan = async (id: string) => {
    const session = await auth();
    if (session?.user.role !== 'admin') {
        return {
            ok: false,
            message: 'Debe ser un usuario administrador',
        }
    }

    try {
        await prisma.plan.delete({ where: { id } });
        revalidatePath('/plans');
        return {
            ok: true
        }
    } catch (error) {
        console.log(error)
        return {
            ok: false,
            message: 'No se pudo eliminar el usuario'
        }
    }
}