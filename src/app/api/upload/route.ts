import { NextResponse, NextRequest } from 'next/server'

export async function POST(req: Request) {

    const body = await req.json();

    const csv = body.csv.data;
    //console.log(csvDdata);

    for (let i = 0; i < csv.length; i += 1) {
        console.log(csv[i]);
    }

    //const csvData = data?.json

    //console.log('req')

    //return NextResponse.json({ title: { title } }, { status: 201 });
    return NextResponse.json(csv, { status: 200 });

}