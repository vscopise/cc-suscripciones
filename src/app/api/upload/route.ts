import { auth } from '@/auth.config';
import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { NextResponse, NextRequest } from 'next/server'
import { number, z } from 'zod';

export async function POST(req: Request) {

    interface SchemaInterfce {
        [key: string]: string[]
    }

    const session = await auth();

    const userId = session!.user.id;

    const body = await req.json();

    const csv = body.csv.data;

    //Error si no vienen datos
    if (csv.length <= 1) {
        return NextResponse.json('No hay datos suficientes', { status: 201 });
    }

    const out: any = [];
    const propsRow = csv[0];
    csv.forEach((row: string[], i: number) => {
        if (i === 0) { return; }
        const addMe: any = {};
        row.forEach((datum, j) => addMe[propsRow[j]] = datum);
        out.push(addMe);
    });

    //Validación de datos
    const schema: any = {
        Client: z.array(z.object({
            'Nombre': z.string().optional(),
            'Apellido': z.string().optional(),
            'Tipo Documento': z.string().optional(),
            'Número Documento': z.string().optional(),
            'Número de Contacto': z.string().optional(),
            'Correo Electrónico': z.string().optional(),
            'Dirección': z.string().optional(),
            'Ciudad': z.string().optional(),
            'Estado': z.string().optional(),
            'País': z.string().optional(),
        })),
        Card: z.array(z.object({
            'Correo Electrónico': z.string().email(),
            'Número': z.string(),
            'Vencimiento': z.string().regex(new RegExp(/^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[0,1,2])\/(19|20)\d{2}$/)),
            'CVV': z.string().regex(new RegExp(/^\d{3,4}$/)),
        })),
        Subscription: z.array(z.object({
            'email cliente': z.string().email(),
            'inicio': z.string().date().nullish().or(z.string().max(0)),
            'último pago': z.string().date().nullish().or(z.string().max(0)),
            'plan': z.string().optional(),
            'monto': z.string().optional(),
            'método de pago': z.string().optional(),
            'período de pago': z.string().optional(),
            'repartidor': z.string().optional(),
            'comentarios': z.string().optional(),
        })),
    }

    const key: string = body.item;

    const result = schema[key].safeParse(out);

    if (result.success === false) return NextResponse.json('Formato de datos incorrecto', { status: 201 });

    var i = 0;

    if (key === 'Client') {
        while (i < result.data.length) {
            var row = result.data[i];
            var email = row['Correo Electrónico'];
            if ('' == email) {
                try {
                    await prisma.client.upsert({
                        where: {
                            email: `${row['Nombre']}.${row['Apellido']}`.toLowerCase().replace(/\s/g, '') + '@carasycaretas.com.uy',
                        },
                        create: {
                            name: String(row['Nombre']),
                            lastName: String(row['Apellido']),
                            identification: '' === row['Número Documento'] ? 0 : parseInt(row['Número Documento']),
                            identificationType: '' === row['Tipo Documento'] ? 'Cedula' : 'Pasaporte',
                            phone: String(row['Número de Contacto']),
                            email: `${row['Nombre']}.${row['Apellido']}`.toLowerCase().replace(/\s/g, '') + '@carasycaretas.com.uy',
                            address: String(row['Dirección']),
                            city: String(row['Ciudad']),
                            countryId: 'UY',
                            userId: userId
                        },
                        update: {
                            name: String(row['Nombre']),
                            lastName: String(row['Apellido']),
                            identification: '' === row['Número Documento'] ? 0 : parseInt(row['Número Documento']),
                            identificationType: '' === row['Tipo Documento'] ? 'Cedula' : 'Pasaporte',
                            phone: String(row['Número de Contacto']),
                            address: String(row['Dirección']),
                            city: String(row['Ciudad']),
                            countryId: 'UY',
                            userId: userId
                        }
                    })

                } catch (error) {
                    console.log(error)
                    return NextResponse.json('Error al importar datos', { status: 201 });
                }
            } else {
                try {
                    await prisma.client.upsert({
                        where: { email },
                        create: {
                            name: row['Nombre'],
                            lastName: row['Apellido'],
                            identification: row['Número Documento'] ? parseInt(row['Número Documento']) : 0,
                            identificationType: row['Tipo Documento'] ? row['Tipo Documento'] : 'Cedula',
                            phone: row['Número de Contacto'],
                            email: row['Correo Electrónico']
                                ? String(row['Correo Electrónico'])
                                //: `${row['Nombre'].toLowerCase()}.${row['Apellido'].toLowerCase()}@carasycaretas.com.uy`,
                                : `${row['Nombre']}.${row['Apellido']}`.toLowerCase().replace(/\s/g, '') + '@carasycaretas.com.uy',
                            address: row['Dirección'],
                            city: row['Ciudad'],
                            countryId: 'UY',
                            userId: userId
                        },
                        update: {
                            name: row['Nombre'],
                            lastName: row['Apellido'],
                            identification: row['Número Documento'] ? parseInt(row['Número Documento']) : 0,
                            identificationType: row['Tipo Documento'] ? row['Tipo Documento'] : 'Cedula',
                            phone: row['Número de Contacto'],
                            address: row['Dirección'],
                            city: row['Ciudad'],
                            countryId: 'UY',
                            userId: userId
                        }
                    })
                } catch (error) {
                    console.log(error)
                    return NextResponse.json('Error al importar datos', { status: 201 });
                }
            }
            i++;
        }
        revalidatePath('/clients/');
    } else if (key === 'Subscription') {
        while (i < result.data.length) {
            var row = result.data[i];
            var data: any = []
            var client = await prisma.client.findUnique({
                where: {
                    email: row['email cliente']
                }
            });

            if (!client) return NextResponse.json('Cliente no registrado', { status: 201 });

            var plan = await prisma.plan.findFirst({
                where: {
                    name: row['plan']
                }
            })
            if (!plan) return NextResponse.json('Plan no registrado', { status: 201 });

            data.push({
                dateStart: new Date(row['inicio']),
                dateLastPay: row['último pago'] ? new Date(row['último pago']) : null,
                amount: parseInt(row['monto']),
                paymentMethod: row['método de pago'] !== ''
                    ? row['método de pago'].replace(/\s+/g, '')
                    : 'MercadoPago',
                delivery: row['repartidor'],
                planId: plan.id,
                clientId: client.id,
            });
            i++;
        }
        try {
            await prisma.subscription.createMany({
                data,
                skipDuplicates: true
            })
        } catch (error) {
            return NextResponse.json('Error al importar datos', { status: 201 });
        }

        revalidatePath('/subscriptions/');
    } else if (key === 'Card') {
        var data: any = [];
        while (i < result.data.length) {
            var row = result.data[i];
            var data: any = []
            
            try {
                var client = await prisma.client.findUnique({
                    where: {
                        email: row['Correo Electrónico']
                    }
                });
    
                if (!client) return NextResponse.json('Cliente no registrado', { status: 201 });

                var expiration = row['Vencimiento'].replace(/(\d+[/])(\d+[/])/, '$2$1');

                await prisma.creditCard.upsert({
                    where: {
                        number: parseInt(row['Número']),
                    },
                    create: {
                        number:  parseInt(row['Número']),
                        expiration: new Date(expiration),
                        cvv: parseInt(row['CVV']),
                        clientId: client.id
                    },
                    update: {
                        expiration: new Date(expiration),
                        cvv: parseInt(row['CVV']),
                        clientId: client.id
                    },
                })


            } catch (error) {
                console.log(error)
                return NextResponse.json('Error al importar datos', { status: 201 });
            }
            i++;
        }
    }

    return NextResponse.json('Archivo subido correctamente', { status: 200 });
}

