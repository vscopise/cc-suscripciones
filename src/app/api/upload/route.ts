import { auth } from '@/auth.config';
import prisma from '@/lib/prisma';
import { NextResponse, NextRequest } from 'next/server'
import { z } from 'zod';

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

    //Validación de datos  const clientSchema = z.array(z.object({
    const schema: any = {
        Client: z.array(z.object({
            'Nombre': z.string().optional(),
            'Apellido': z.string().optional(),
            'Tipo Documento': z.enum(['Cedula', 'Pasaporte']),
            'Número Documento': z.string().optional(),
            'Número de Contacto': z.string().optional(),
            'Correo Electrónico': z.string().email(),
            'Dirección': z.string().optional(),
            'Ciudad': z.string().optional(),
            'Estado': z.string().optional(),
            'País': z.string().optional(),
        })),
        Subscription: {}
    }

    //const result = clientSchema.safeParse(out);
    const key: string = body.item;

    const result = schema[key].safeParse(out);

    if (result.success === false) {
        return NextResponse.json('Formato de datos incorrecto', { status: 201 });
    }

    var data = [], i = 0;
    while (i < result.data.length) {
        data.push({
            name: result.data[i]['Nombre'],
            lastName: result.data[i]['Apellido'],
            identification:  parseInt(result.data[i]['Número Documento']),
            identificationType: result.data[i]['Tipo Documento'],
            phone: result.data[i]['Número de Contacto'],
            email: result.data[i]['Correo Electrónico'],
            address: result.data[i]['Dirección'],
            city: result.data[i]['Ciudad'],
            countryId:'UY',
            userId: userId
        })
        i++;
    }

    await prisma.client.createMany({
        data, 
        skipDuplicates: true
    })
    

    return NextResponse.json('Archivo subido correctamente', { status: 200 });
    //return NextResponse.json({ title: { title } }, { status: 201 });
}

