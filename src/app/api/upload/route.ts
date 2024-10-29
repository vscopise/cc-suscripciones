import { NextResponse, NextRequest } from 'next/server'
import { any } from 'zod';

export async function POST(req: Request) {

    const body = await req.json();

    const csv:[string] = body.csv.data;

    const item:string = body.item;

    const headers = {
        Client: [
            'Nombre', 
            'Apellido', 
            'Tipo Documento', 
            'Número Documento', 
            'Número de Contacto', 
            'Correo Electrónico', 
            'Dirección', 
            'Ciudad',
            'Estado',
            'País'
        ]
        
    }

    
    //console.log(csvDdata);
    if (csv.length <= 1 ){
        return NextResponse.json('No hay datos suficientes', { status: 200 });
    }

    const header = csv[0];

    //console.log(headers[item])

    /* if (headers[item] != header) {
        return NextResponse.json('Formato incorrecto', { status: 200 });
    } */

    for (let i = 0; i < csv.length; i += 1) {
        console.log(csv[i]);
    }

    //const csvData = data?.json

    //console.log('req')

    //return NextResponse.json({ title: { title } }, { status: 201 });
    return NextResponse.json(csv, { status: 200 });

}