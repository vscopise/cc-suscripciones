'use server';

import { auth } from '@/auth.config';
import prisma from '@/lib/prisma';

export const getAllUsers = async () => {
    const session = await auth();
    if (session?.user.role !== 'admin') {
        return [];
    }

    try {
        const users = await prisma.user.findMany({
            orderBy: { email: 'asc' }
        });
        return users;
        
    } catch (error) {
        console.log(error);
        
    }
}