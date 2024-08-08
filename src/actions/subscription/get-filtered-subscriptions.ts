'use server';

import prisma from '@/lib/prisma';

interface Props {
    active: string;
    client: string;
    status: string;
    page: number;
    take: number;
    //isAdmin: boolean,
    //userId: string,
}

export const getFilteredSubscriptions = async ({ active, client, status, page = 1, take = 10 }: Props) => {
    if (isNaN(Number(page))) page = 1;
    if (page < 1) page = 1;

    const today = new Date();
    const checkDate = new Date(new Date().setMonth(today.getMonth() - 3));

    const minus30days = new Date(new Date().setDate(today.getDate() - 30));
    const minus59days = new Date(new Date().setDate(today.getDate() - 59));
    const minus62days = new Date(new Date().setDate(today.getDate() - 62));

    const minus90days = new Date(new Date().setDate(today.getDate() - 90));
    const minus119days = new Date(new Date().setDate(today.getDate() - 119));
    const minus122days = new Date(new Date().setDate(today.getDate() - 122));

    const minus180days = new Date(new Date().setDate(today.getDate() - 180));
    const minus209days = new Date(new Date().setDate(today.getDate() - 209));
    const minus212days = new Date(new Date().setDate(today.getDate() - 212));

    const minus365days = new Date(new Date().setDate(today.getDate() - 365));
    const minus394days = new Date(new Date().setDate(today.getDate() - 394));
    const minus397days = new Date(new Date().setDate(today.getDate() - 397));

    try {
        const allSubscriptions = await prisma.subscription.findMany({
            include: { client: true },
            where: {
                ...(active !== 'all' ? { active: active === 'yes' } : {}),
                ...(active === '1' ? { dateDeactivation: { gt: checkDate } } : {}),
                ...(active === '2' ? { dateDeactivation: { lte: checkDate } } : {}),
                ...(client !== '' ? { client: { email: { contains: client } } } : {}),

                // Filtros por estado: los límites son: 28 y 31 días

                // Verde
                ...(status === '1' ? {
                    OR: [
                        { dateLastPay: { lt: minus30days, gte: minus59days }, period: 'Mensual' },
                        { dateLastPay: { lt: minus90days, gte: minus119days }, period: 'Trimestral' },
                        { dateLastPay: { lt: minus180days, gte: minus209days }, period: 'Semestral' },
                        { dateLastPay: { lt: minus365days, gte: minus394days }, period: 'Anual' },
                    ]
                } : {}),

                // Amarillo
                ...(status === '2' ? {
                    OR: [
                        { dateLastPay: { lt: minus59days, gte: minus62days }, period: 'Mensual' },
                        { dateLastPay: { lt: minus119days, gte: minus122days }, period: 'Trimestral' },
                        { dateLastPay: { lt: minus209days, gte: minus212days }, period: 'Semestral' },
                        { dateLastPay: { lt: minus394days, gte: minus397days }, period: 'Anual' },
                    ]
                } : {}),

                // Rojo
                ...(status === '3' ? {
                    OR: [
                        { dateLastPay: { lt: minus62days }, period: 'Mensual' },
                        { dateLastPay: { lt: minus122days }, period: 'Trimestral' },
                        { dateLastPay: { lt: minus212days }, period: 'Semestral' },
                        { dateLastPay: { lt: minus397days }, period: 'Anual' },
                    ]
                } : {}),

            }
        });
        const count = allSubscriptions.length;

        const subscriptions = await prisma.subscription.findMany({
            take: take, skip: take * (page - 1), include: { client: true },
            where: {
                ...(active !== 'all' ? { active: active === 'yes' } : {}),
                ...(active === '1' ? { dateDeactivation: { gt: checkDate } } : {}),
                ...(active === '2' ? { dateDeactivation: { lte: checkDate } } : {}),
                ...(client !== '' ? { client: { email: { contains: client } } } : {}),

                // Verde
                ...(status === '1' ? {
                    OR: [
                        { dateLastPay: { lt: minus30days, gte: minus59days }, period: 'Mensual' },
                        { dateLastPay: { lt: minus90days, gte: minus119days }, period: 'Trimestral' },
                        { dateLastPay: { lt: minus180days, gte: minus209days }, period: 'Semestral' },
                        { dateLastPay: { lt: minus365days, gte: minus394days }, period: 'Anual' },
                    ]
                } : {}),

                // Amarillo
                ...(status === '2' ? {
                    OR: [
                        { dateLastPay: { lt: minus59days, gte: minus62days }, period: 'Mensual' },
                        { dateLastPay: { lt: minus119days, gte: minus122days }, period: 'Trimestral' },
                        { dateLastPay: { lt: minus209days, gte: minus212days }, period: 'Semestral' },
                        { dateLastPay: { lt: minus394days, gte: minus397days }, period: 'Anual' },
                    ]
                } : {}),

                // Rojo
                ...(status === '3' ? {
                    OR: [
                        { dateLastPay: { lt: minus62days }, period: 'Mensual' },
                        { dateLastPay: { lt: minus122days }, period: 'Trimestral' },
                        { dateLastPay: { lt: minus212days }, period: 'Semestral' },
                        { dateLastPay: { lt: minus397days }, period: 'Anual' },
                    ]
                } : {}),

            }
        });
        //const count = await prisma.subscription.count();
        //const count = subscriptions.length;
        //console.log({ subscriptions });
        const totalPages = Math.ceil(count / take);

        return {
            ok: true,
            totalPages: totalPages,
            subscriptions: subscriptions,
            allSubscriptions: allSubscriptions,
        }
    } catch (error) {
        console.log(error);
        return {
            ok: false,
            message: 'Error de base de datos'
        }
    }
}