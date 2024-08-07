import prisma from '@/lib/prisma';
import { NextResponse, NextRequest } from 'next/server';
import { z } from 'zod';

const clientSchema = z.object({
    email: z.string().email()
})

export async function POST(request: Request) {

    try {
        const clientParsed = clientSchema.safeParse(await request.json());

        const user = await prisma.user.findFirst();
    
        const client = await prisma.client.create({
            data: {
                email: clientParsed.data!.email,
                countryId: 'UY',
                userId: user!.id
            }
        });
    
        return NextResponse.json(client)
        
    } catch (error) {
        return NextResponse.json(error, { status: 400 });
    }

}