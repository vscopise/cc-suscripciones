'use server';

import prisma from '@/lib/prisma';

export const getAllCards = async () => {
    try {
        const cards = await prisma.creditCard.findMany()
        return cards;
    } catch (error) {
        console.log(error);
    }
}