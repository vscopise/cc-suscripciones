'use server';

import { User } from '@/interfaces';
import { z } from 'zod';
import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import bcryptjs from 'bcryptjs';

const userSchema = z.object({
    id: z.string().optional(),
    name: z.string(),
    email: z.string().email(),
    password: z.string(),
    //role: z.enum(['admin', 'user']),
});

export const createUpdateUser = async (userData: User) => {

    const userParsed = userSchema.safeParse(userData);


    if (!userParsed.success) {
        return {
            ok: false,
            message: 'Error en la validación'
        }
    }

    const user = userParsed.data;

    const { id, ...rest } = user;

    try {
        let message = '';
        if (id) {
            await prisma.user.update({
                where: { id },
                data: {  
                    name: rest.name,
                    email: rest.email.toLowerCase(),
                    password: bcryptjs.hashSync(rest.password),
                }
            })
            message = 'Usuario actualizado correctamente';
            revalidatePath(`/user/${id}`);
        } else {
            await prisma.user.create({
                data: { 
                    name: rest.name,
                    email: rest.email.toLowerCase(),
                    password: bcryptjs.hashSync(rest.password),
                }
            })
            message = 'Usuario creado correctamente';
            revalidatePath('/users/');
        }
        return { ok: true, message}
    } catch (error) {
        console.log(error);
        return {
            ok: false,
            message: 'No se pudo crear el usuario'
        }
    }
}