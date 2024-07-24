'use server';

import { auth } from '@/auth.config';
import prisma from '@/lib/prisma';

export const getPaginatedUsers = async ({ page = 1, take = 10 }) => {

    if (isNaN(Number(page))) page = 1;
    if (page < 1) page = 1;

    const session = await auth();
    if (session?.user.role !== 'admin') {
        return {
            ok: false,
            message: 'Debe ser un usuario administrador'
        }
    }

    try {
        const users = await prisma.user.findMany({
            take: take,
            skip: take * (page - 1),
            orderBy: {
                email: 'asc',
            }
        });

        const count = await prisma.user.count();
        const totalPages = Math.ceil(count / take);

        return {
            ok: true,
            totalPages: totalPages,
            users: users,
        }

    } catch (error) {
        console.log(error);
        return {
            ok: false,
            message: 'Error de base de datos'
        }
    }
}