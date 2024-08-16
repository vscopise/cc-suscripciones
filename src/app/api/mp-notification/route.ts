import { Client, MP_Payment, User } from '@/interfaces';
import prisma from '@/lib/prisma';
import { sendMail } from '@/utils';
import { NextResponse, NextRequest } from 'next/server';
import { z } from 'zod';

const notificationSchema = z.object({
    action: z.string(),
    api_version: z.string(),
    data: z.object({
        id: z.string(),
    }),
    date_created: z.string(),
    id: z.number(),
    live_mode: z.boolean(),
    type: z.string(),
    user_id: z.number(),
});



const mpUrl = process.env.MP_URL;

const administrativeEmail = process.env.ADMINISTRATIVE_MAIL ?? '';

export async function POST(req: Request) {

    try {
        const { data, type } = notificationSchema.parse(await req.json());

        //Si la notificación no tiene un tipo válido volver
        if (!['payment', 'subscription_authorized_payment']
            .includes(type)) return NextResponse.json({ sucess: true });

        const { id } = data;

        // Consulto por el pago
        const payment: MP_Payment = await fetch(`${mpUrl}/payments/${id}`, {
            headers: {
                'Authorization': `Bearer ${process.env.MP_TOKEN}`
            }
        }).then(res => res.json());

        // obtener detalles del cliente
        const customer = await await fetch(`${mpUrl}/customers/${payment.payer.id}`, {
            headers: {
                'Authorization': `Bearer ${process.env.MP_TOKEN}`
            }
        }).then(res => res.json());

        //Ver el estado del pago
        switch (payment.status) {
            case 'approved':
                // Actualizar base de datos

                const defaultUser = await prisma.user.findFirst();
        
                // Busco el cliente en la base de datos, si no existe crearlo
                const client = await prisma.client.findFirst({
                    where: { email: payment.payer.email },
                });
        
                let clientId, planId, subscriptionId;
        
                if (client === null) {
                    const identification = payment.payer.identification.number !== null
                        ? Number(payment.payer.identification.number)
                        : 0;
                    const identificationType = payment.payer.identification.type === 'CI' ? 'Cedula' : 'Pasaporte';
                    const newClient = await prisma.client.create({
                        data: {
                            email: payment.payer.email,
                            countryId: 'UY',
                            userId: defaultUser!.id,
                            identification: identification,
                            identificationType: identificationType,
                        }
                    });
                    clientId = newClient.id;
                } else {
                    clientId = client!.id;
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
                    planId = plan!.id;
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
                    subscriptionId = subscription!.id;
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
        



                break;
            case 'authorized':
                break;
            case 'cancelled':
                break;
            case 'charged_back':
                break;
            case 'in_process':
                break;
            case 'in_mediation':
                break;
            case 'pending':
                break;
            case 'refunded':
                // Mandar correo con el aviso de rechazo
                sendMail({
                    from: 'Suscripciones Caras y Caretas',
                    to: administrativeEmail,
                    subject: 'Error en el cobro',
                    text: 'Pago devuelto',
                    html: `
                            <h3>Pago devuelto</h3>
                            <p>El cobro correspondiente a:</p>
                            <p>${customer.email ?? ''}</p>
                            <p>${payment.payer.email ?? ''}</p>
                            <p>fue devuelto</p>
                          `
                });
                break;
                break;
            case 'rejected':
                // Mandar correo con el aviso de rechazo
                sendMail({
                    from: 'Suscripciones Caras y Caretas',
                    to: administrativeEmail,
                    subject: 'Error en el cobro',
                    text: 'Pago rechazado',
                    html: `
                            <h3>Pago rechazado</h3>
                            <p>El cobro correspondiente a:</p>
                            <p>${customer.email}</p>
                            <p>no pudo ser realizado</p>
                          `
                });
                break;
        }
        return NextResponse.json({ sucess: true });


        


        //console.log({ email });


        return NextResponse.json({ sucess: true });

    } catch (error) {
        console.log(error);
        return NextResponse.json(error, { status: 400 });
    }
}