'use server';

import { Plan } from '@/interfaces';
import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';

const planSchema = z.object({
    id: z.string().optional(),
    name: z.string(),
    description: z.string(),
});

export const createUpdatePlan = async (planData: Plan) => { 

    const planParsed = planSchema.safeParse(planData);

    if (!planParsed.success) {
        return {
            ok: false,
            message: 'Error en la validación'
        }
    }

    const plan = planParsed.data;

    const { id, ...rest } = plan;

    try {
        let message = '';
        if (id) {
            await prisma.plan.update({
                where: {id},
                data: {
                    name: rest.name,
                    description: rest.description,
                }
            })
            message = 'Plan actualizado correctamente';
            revalidatePath(`/plan/${id}`);
        } else {
            await prisma.plan.create({
                data: {
                    name: rest.name,
                    description: rest.description
                }
            })
            message = 'Plan creado correctamente';
            revalidatePath('/plans/');
        }
        return { ok: true, message}
    } catch (error) {
        return {
            ok: false,
            message: 'No se pudo crear el plan'
        }
    }
}