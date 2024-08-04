'use server';

import prisma from '@/lib/prisma';

interface Props {
    clientId: string;
    page: number;
    take: number;
}

export const getFilteredNotes = async ({ clientId, page = 1, take = 10 }: Props) => {
    if (isNaN(Number(page))) page = 1;
    if (page < 1) page = 1;

    try {
        const allNotes = await prisma.clientNote.findMany({ where: { clientId } });
        const count = allNotes.length;

        if (count > 0) {
            const notes = await prisma.clientNote.findMany({
                take: take,
                skip: take * (page - 1),
                where: { clientId },
                orderBy: { date: 'desc' }
            });

            return {
                ok: true,
                totalPages: Math.ceil(count / take),
                notes: notes
            }
        } else {
            return {
                ok: true,
                totalPages: 1,
                notes: []
            }
        }

    } catch (error) {
        console.log(error);
        return {
            ok: false,
            message: 'Error de base de datos'
        }
    }
}