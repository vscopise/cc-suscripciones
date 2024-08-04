'use server';

import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export const createNote = async (clientId: string, newNote: string) => {
    console.log({ newNote });
    try {
        await prisma.clientNote.create({
            data: {
                note: newNote,
                clientId: clientId,
                date: new Date()

            }
        });
        revalidatePath(`/client/${clientId}/notes/`);
        return {
            ok: true, 
            message: 'Nota creada correctamente'
        }
    } catch (error) {
        console.log(error);
        return {
            ok: false,
            message: 'Error en la creación de la nota'
        }
    }
}