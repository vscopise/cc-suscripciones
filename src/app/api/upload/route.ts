import { auth } from "@/auth.config";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { NextResponse, NextRequest } from "next/server";
import { number, z } from "zod";

export async function POST(req: Request) {
  interface SchemaInterfce {
    [key: string]: string[];
  }

  const session = await auth();

  var userId = session!.user.id;

  const body = await req.json();

  const csv = body.csv.data;

  //Error si no vienen datos
  if (csv.length <= 1) {
    return NextResponse.json("No hay datos suficientes", { status: 201 });
  }

  const out: any = [];
  const propsRow = csv[0];
  csv.forEach((row: string[], i: number) => {
    if (i === 0) {
      return;
    }
    const addMe: any = {};
    row.forEach((datum, j) => (addMe[propsRow[j]] = datum));
    out.push(addMe);
  });

  //Validación de datos
  const schema: any = {
    Client: z.array(
      z.object({
        id: z.string().uuid().optional().nullable(),
        Nombre: z.string().optional(),
        Apellido: z.string().optional(),
        "Tipo Documento": z.string().optional(),
        "Número Documento": z.string().optional(),
        "Número de Contacto": z.string().optional(),
        "Correo Electrónico": z.string().optional(),
        Dirección: z.string().optional(),
        Ciudad: z.string().optional(),
        Estado: z.string().optional(),
        País: z.string().optional(),
        "Usuario asignado": z.string().optional(),
      })
    ),
    Card: z.array(
      z.object({
        "Correo Electrónico": z.string().optional(),
        Número: z.string(),
        //'Vencimiento': z.string().regex(new RegExp(/^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[0,1,2])\/(19|20)\d{2}$/)).nullish(),
        Vencimiento: z.string().optional(),
        //'CVV': z.string().regex(new RegExp(/^\d{3,4}$/)).nullish(),
        CVV: z.string().optional(),
      })
    ),
    Subscription: z.array(
      z.object({
        "email cliente": z.string().email(),
        inicio: z.string().date().nullish().or(z.string().max(0)),
        "último pago": z.string().date().nullish().or(z.string().max(0)),
        plan: z.string().optional(),
        monto: z.string().optional(),
        "método de pago": z.string().optional(),
        "período de pago": z.string().optional(),
        repartidor: z.string().optional(),
        comentarios: z.string().optional(),
      })
    ),
  };

  const key: string = body.item;

  const result = schema[key].safeParse(out);

  if (result.success === false)
    return NextResponse.json("Formato de datos incorrecto", { status: 201 });

  var i = 0;

  if (key === "Client") {
    const numberOfChunks = Math.ceil(result.data.length / 100);

    const usuarios = await prisma.user.findMany();

    const tempArray = Array.from({ length: numberOfChunks }, (_, index) => {
      const start = index * 100;
      const end = start + 100;
      return result.data.slice(start, end);
    });
    var i = 0;
    while (i < tempArray.length) {
      var data: any = [];
      var j = 0;
      while (j < tempArray[i].length) {
        if ("" !== tempArray[i][j]["Usuario asignado"]) {
          var usuarioAsignados = usuarios.filter(
            (u) => u.email === tempArray[i][j]["Usuario asignado"]
          );

          if (usuarioAsignados.length != 0) {
            userId = usuarioAsignados[0].id;
          }
        }
        data.push({
          name: tempArray[i][j]["Nombre"],
          lastName: tempArray[i][j]["Apellido"],
          phone: tempArray[i][j]["Número de Contacto"],
          email: tempArray[i][j]["Correo Electrónico"],
          address: tempArray[i][j]["Dirección"],
          city: tempArray[i][j]["Ciudad"],
          state: tempArray[i][j]["Estado"],
          //identification: '',
          countryId: "UY",
          userId,
        });
        j++;
      }
      await prisma.client.createMany({
        data,
        skipDuplicates: true,
      });
      i++;
    }

    revalidatePath("/clients/");
  } else if (key === "Subscription") {
    while (i < result.data.length) {
      var row = result.data[i];
      var data: any = [];
      var client = await prisma.client.findUnique({
        where: {
          //email: row['email cliente']
          id: row["id"],
        },
      });

      if (!client)
        return NextResponse.json("Cliente no registrado", { status: 201 });

      var plan = await prisma.plan.findFirst({
        where: {
          name: row["plan"],
        },
      });
      if (!plan)
        return NextResponse.json("Plan no registrado", { status: 201 });

      data.push({
        dateStart: new Date(row["inicio"]),
        dateLastPay: row["último pago"] ? new Date(row["último pago"]) : null,
        amount: parseInt(row["monto"]),
        paymentMethod:
          row["método de pago"] !== ""
            ? row["método de pago"].replace(/\s+/g, "")
            : "MercadoPago",
        delivery: row["repartidor"],
        planId: plan.id,
        clientId: client.id,
      });
      i++;
    }
    try {
      await prisma.subscription.createMany({
        data,
        skipDuplicates: true,
      });
    } catch (error) {
      return NextResponse.json("Error al importar datos", { status: 201 });
    }

    revalidatePath("/subscriptions/");
  } else if (key === "Card") {
    const numberOfChunks = Math.ceil(result.data.length / 100);

    
    const tempArray = Array.from({ length: numberOfChunks }, (_, index) => {
      const start = index * 100;
      const end = start + 100;
      return result.data.slice(start, end);
    });

    var i = 0;

    while (i < tempArray.length) {
      var data: any = [];
      var j = 0;
      while (j < tempArray[i].length) {
        var expiration = tempArray[i][j]["Vencimiento"].replace(
          /(\d+[/])(\d+[/])/,
          "$2$1"
        );
        var client = await prisma.client.findFirst({
          where: {
            email: tempArray[i][j]["Correo Electrónico"],
          },
        });
        if (!client)
          return NextResponse.json(
            `${tempArray[i][j]["Correo Electrónico"]} no registrado`,
            { status: 201 }
          );

        data.push({
          number: +tempArray[i][j]["Número"],
          cvv: tempArray[i][j]["CVV"],
          clientId: client.id,
          expiration,
        });
        j++;
      }
      await prisma.creditCard.createMany({
        data,
        skipDuplicates: true,
      });
      i++;
    }

  }

  return NextResponse.json("Archivo subido correctamente", { status: 200 });
}
