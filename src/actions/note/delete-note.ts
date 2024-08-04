'use server';

import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export const deleteNote = async (id: string, clientId: string) => {
    console.log({id, clientId})
    try {
        await prisma.clientNote.delete({ where: { id } });
        revalidatePath(`/client/${clientId}/notes`);
        return {
            ok: true
        }
    } catch (error) {
        console.log(error)
        return {
            ok: false,
            message: 'No se pudo eliminar la nota'
        }
    }
}