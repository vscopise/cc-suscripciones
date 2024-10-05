import { NextResponse, NextRequest } from 'next/server'
import { plaUser, Subscription } from '@/interfaces';
import { any, date, z } from 'zod';
import prisma from '@/lib/prisma';
import { processMpData } from './process-mp-data';
import { processPlData } from './process-pl-data';

const requestSchema = z.object({
    token: z.literal(process.env.API_TOKEN),
    issuer: z.literal(process.env.API_ISSUER),
    //users: z.string().optional(),
    pl_start: z.string().optional(),
    pl_count: z.string().optional(),
})

export async function POST(req: Request) {
    try {
        // Validar el request
        let { pl_start, pl_count } = requestSchema.parse(await req.json());

        // Procesar datos de Publica.la
        //await getPlaUsers(pl_start, pl_count);
        processPlData(pl_start, pl_count);

        // Procesar datos de MercadoPago
        processMpData();

        return NextResponse.json({ sucess: true })

    } catch (error) {
        return NextResponse.json(error, { status: 400 });
    }
}


// Obtiene usuarios de Publica.la
// parámetros: página, usuario a asignar, todas las páginas

const getPlaUsers = async (pl_start = "", pl_count = "") => {

    const headers = {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'X-User-Token': `${process.env.PLA_TOKEN}`
    }
    const plaUrl = process.env.PLA_URL;

    const defaultUser = await prisma.user.findFirst();

    let plaUsers: plaUser[] = [];
    let allUsers: plaUser[] = [];

    try {
        if (pl_start && pl_count) {

            // procesar un segmento de usuarios

            const start = parseInt(pl_start);
            const count = parseInt(pl_count);
            let page = 0;

            while (page < count) {
                const url = `${plaUrl}/dashboard/users/?page=${page + start}`
                allUsers = [];

                await fetch(url, { headers })
                    .then((response) => response.text())
                    .then((result) => JSON.parse(result))
                    .then((users) => allUsers.push(...users.data.paginator.data));

                //await sleep();

                plaUsers.push(...allUsers);

                page++;
            }
        } else {
            //Procesar solamente los usuarios registrados hoy
            let page = 1;
            const today = new Date().toISOString().slice(0, 10);

            while (true) {
                const url = `${plaUrl}/dashboard/users/?page=${page}`
                allUsers = [];

                await fetch(url, { headers })
                    .then((response) => response.text())
                    .then((result) => JSON.parse(result))
                    .then((users) => allUsers.push(...users.data.paginator.data));

                //await sleep();

                if (allUsers.length === 0) break;

                const todayUsers = allUsers.filter((user: plaUser) => (
                    user.created_at_date_string === today
                ));

                if (todayUsers.length === 0) break;

                plaUsers.push(...todayUsers);

                page++;
            }

        }

        // Descarto usuarios desactivados y anonimizados
        const activeUsers = plaUsers.filter((user: plaUser) => user.anonymized === false && user.deleted_at === null);

        // descarto usuarios duplicados
        const validUsers = activeUsers.reduce((accumulator: plaUser[], current: plaUser) => {
            if (!accumulator.find((user: plaUser) => user.email === current.email)) {
                accumulator.push(current);
            }
            return accumulator;
        }, []);

        const usersToUpdate = await prisma.client.findMany({
            where: {
                email: {
                    in: validUsers.map((user: plaUser) => user.email),
                },
            },
        });
        // Los usuarios a crear en la base de datos 
        // son aquellos usuarios validos cuyos emails no existen en la base
        const usersToCreate = validUsers.filter(
            user => !usersToUpdate.map(user => user.email)
                .includes(user.email)
        ).map(user => ({
            email: user.email,
            countryId: 'UY',
            userId: defaultUser!.id,
        }));

        if (usersToCreate.length > 0) {
            await prisma.client.createMany({
                data: usersToCreate,
            });

            // Crear planes
            const usersWithPlans = validUsers.filter(u => u.user_plans_count > 0);

            if (usersWithPlans.length === 0) return;

            //Obtengo los planes de los usuarios
            const plaPlans = usersWithPlans.map(u => u.user_plans[0].plan);

            // descarto planes duplicados 
            const validPlans = Array.from(new Set(plaPlans.map(plan => plan.name)))
                .map(name => {
                    return plaPlans.find(plan => plan.name === name)
                });

            const plansToUpdate = await prisma.plan.findMany({
                where: {
                    name: {
                        in: validPlans.map((plan) => plan.name),
                    },
                },
            });
            // Los planes a crear en la base de datos 
            // son aquellos planes validos cuyos nombres no existen en la base
            const plansToCreate = validPlans.filter(
                plan => !plansToUpdate.map(plan => plan.name)
                    .includes(plan.name)
            ).map(plan => ({
                name: plan.name,
                description: plan.details.replace(/<[^>]*>?/gm, ''),
            }));

            if (plansToCreate.length > 0) {
                await prisma.plan.createMany({
                    data: plansToCreate,
                });

                // Crear suscripciones
                usersWithPlans.forEach(async user => {
                    const dataClient = await prisma.client.findUnique({ where: { email: user.email } });

                    const dataPlan = await prisma.plan.findUnique(
                        { where: { name: user.user_plans[0].plan.name } }
                    );

                    const dataSubscription: any = {
                        amount: parseInt(user.user_plans[0].plan.prices['UYU']),
                        clientId: dataClient!.id,
                        dateStart: new Date(user.user_plans[0].plan.created_at),
                        //active: true,
                        //comment: '',
                        //dateLastPay: null,
                        //dateDeactivation: null,
                        paymentMethod: 'Stripe',
                        //period: 'Mensual',
                        period: periodLabel(user.user_plans[0].interval),
                        planId: dataPlan!.id,
                        //delivery: '',
                        //creditCardId: '',
                    }
                    await prisma.subscription.create({ data: dataSubscription })
                    const c = 1
                })




            }



        }



        return;

        /* const responseUsers = await fetch(`${process.env.PLA_URL}/dashboard/users/`, { headers });
        const { data } = JSON.parse(await responseUsers.text());

        const urls = data.paginator.links.map((link: any) => link.url);

        for (let url of urls) {
            await fetch(url, { headers })
                .then((response) => response.text())
                .then((result) => JSON.parse(result))
                //then((users) => console.log(users.data.paginator.data));
                .then((users) => allUsers.push(...users.data.paginator.data));
        }

        // Descarto usuarios desactivados y anonimizados
        const activeUsers = allUsers.filter((user: plaUser) => user.anonymized === false && user.deleted_at === null);

        const validUsers = Array.from(new Set(activeUsers.map((user: plaUser) => user.email)))
            .map(email => {
                return activeUsers.find((user: plaUser) => user.email === email)
            });

        console.log({ validUsers });

        const plaUsers = validUsers; */


        /* const masterPromiseResolved = await Promise.all(
            links.map((u: any, {
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'X-User-Token': `${process.env.PLA_TOKEN}`
                },
            }) => fetch(u).then(response => response.json())))
        console.log(masterPromiseResolved)

        const fetchPromises = links.map((link: string) =>
            fetch(link, {
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'X-User-Token': `${ process.env.PLA_TOKEN } `
                }
            })
        ); */

        // const responses = await Promise.all(fetchPromises);

        //const datas = await Promise.all(responses.map(response => response.text()));

        //const { data } = JSON.parse(await response.text());

        //return plaUsers;

    } catch (error) {
        console.log(error);
        return [];
    }

}


/* const periodLabel = (period: string | null) => {
    switch (period) {
        case null: return 'Mensual';
        case 'month': return 'Mensual';
        case 'annual': return 'Anual';
        default: return 'Mensual';
    }
} */
