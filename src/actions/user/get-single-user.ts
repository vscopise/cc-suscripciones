'use server';

import { auth } from '@/auth.config';
import prisma from '@/lib/prisma';

export const getSingleUser = async (id: string) => {

    const session = await auth();
    if (!session) return null;

    try {
        const user = await prisma.user.findFirst({
            where: { id: id }
        });

        if (!user) return null;

        return {
            ...user
        }
    } catch (error) {
        console.log(error)
        throw new Error('Error al obtener el Usuario por id');
    }
}