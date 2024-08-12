import { Client, MP_Payment, User } from '@/interfaces';
import prisma from '@/lib/prisma';
import { NextResponse, NextRequest } from 'next/server';
import { z } from 'zod';

const notificationSchema = z.object({
    action: z.string(),
    api_version: z.string(),
    data: z.object({
        id: z.string(),
    }),
    date_created: z.string(),
    id: z.string(),
    live_mode: z.boolean(),
    type: z.string(),
    user_id: z.number(),
});



const mpUrl = process.env.MP_URL;

export async function POST(req: Request) {

    try {
        const { data, type } = notificationSchema.parse(await req.json());

        if (!['payment', 'subscription_authorized_payment']
            .includes(type)) return NextResponse.json({ sucess: true });

        const { id } = data;

        // Consulto por el pago
        const payment: MP_Payment = await fetch(`${mpUrl}/payments/${id}`, {
            headers: {
                'Authorization': `Bearer ${process.env.MP_TOKEN}`
            }
        }).then(res => res.json());

        // Si el pago no existe finalizar
        if (!payment.payer) return NextResponse.json('Error', { status: 404 });


        const status = payment.status;
        const identification = payment.payer.identification;

        const defaultUser = await prisma.user.findFirst();

        // Busco el cliente en la base de datos, si no existe crearlo
        const client = await prisma.client.findFirst({
            where: { email: payment.payer.email },
        });

        let clientId, planId, subscriptionId;

        if (client === null) {
            const identifaction = payment.payer.identification.number !== null 
                ? payment.payer.identification.number 
                : 0;
            const identificationType = payment.payer.identification.type === 'CI' ? 'Cedula' : 'Pasaporte';
            const newClient = await prisma.client.create({
                data: {
                    email: payment.payer.email,
                    countryId: 'UY',
                    userId: defaultUser!.id,
                    identification: identifaction,
                    identificationType: identificationType,
                }
            });
            clientId = newClient.id;
        } else {
            clientId = client.id;
        }

        // Busco el plan en la base de datos, si no existe crearlo

        const plan = await prisma.plan.findFirst({
            where: { name: payment.description }
        });

        if (!plan) {
            const newPlan = await prisma.plan.create({
                data: {
                    name: payment.description,
                    description: 'Plan Mercadopago',
                }
            });
            planId = newPlan.id;
        } else {
            planId = plan.id;
        }

        // Busco la suscripción en la base de datos, si no existe crearla

        const subscription = await prisma.subscription.findFirst({
            where: {
                clientId: clientId,
                planId: planId,
            }
        });

        if (subscription === null) {
            const newSubscription = await prisma.subscription.create({
                data: {
                    clientId: clientId,
                    planId: planId,
                    amount: payment.transaction_amount,
                    dateStart: new Date(payment.date_created),
                    dateLastPay: new Date(payment.date_approved),
                    comment: 'Pago por MercadoPago',
                }
            });
            subscriptionId = newSubscription.id;

        } else {
            subscriptionId = subscription.id;
            await prisma.subscription.update({
                where: { id: subscriptionId },
                data: {
                    amount: payment.transaction_amount,
                    dateStart: new Date(payment.date_created),
                    dateLastPay: new Date(payment.date_approved),
                    comment: 'Pago por MercadoPago',
                }
            });
        }



        //console.log({ email });


        return NextResponse.json({ sucess: true });

    } catch (error) {
        console.log(error);
        return NextResponse.json(error, { status: 400 });
    }
}