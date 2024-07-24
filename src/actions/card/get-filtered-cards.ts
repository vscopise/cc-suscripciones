'use server';

import prisma from '@/lib/prisma';

interface Props {
    email: string;
    name: string;
    page: number;
    take: number;
}

export const getFilteredCards = async ({ email, name, page = 1, take = 10 }: Props) => {
    if (isNaN(Number(page))) page = 1;
    if (page < 1) page = 1;

    try {
        const allCreditCards = await prisma.creditCard.findMany();
        const count = allCreditCards.length;

        const creditCards = await prisma.creditCard.findMany({
            take: take,
            skip: take * (page - 1),
            include: {
                client: true
            },
            where: {
                ...(email !== '' ? { client: { email: { contains: email } } } : {}),
                ...(name !== '' ? { OR: [{client: { name: { contains: name } } }, {client: { lastName: { contains: name } } }]} : {}),
            },
            orderBy: { number: 'asc' }
        });

        const totalPages = Math.ceil(count / take);

        return {
            ok: true,
            totalPages: totalPages,
            creditCards: creditCards,
        }
    } catch (error) {
        console.log(error);
        return {
            ok: false,
            message: 'Error de base de datos'
        }
    }
}