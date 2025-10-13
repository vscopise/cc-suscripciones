import { auth } from "@/auth.config";
import prisma from "@/lib/prisma";
import { convertDdMmYyyyToDate } from "@/utils";
import { PaymentMethod } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { NextResponse, NextRequest } from "next/server";
import { number, z } from "zod";

export async function POST(req: Request) {
  interface SchemaInterfce {
    [key: string]: string[];
  }

  const session = await auth();

  var userId = session!.user.id;
  var planId = "";

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
        inicio: z.string().optional(),
        "último pago": z.string().optional(),
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
    const numberOfChunks = Math.ceil(result.data.length / 100);

    const plans = await prisma.plan.findMany();

    const clients = await prisma.client.findMany();

    const tempArray = Array.from({ length: numberOfChunks }, (_, index) => {
      const start = index * 100;
      const end = start + 100;
      return result.data.slice(start, end);
    });

    var i = 0;

    while (i < tempArray.length) {
      var data: any = [];
      var j = 0;
      var clientId = "";
      while (j < tempArray[i].length) {
        if ("" !== tempArray[i][j]["email cliente"]) {
          var clienteAsignado = clients.filter(
            (c) => c.email === tempArray[i][j]["email cliente"]
          );

          if (clienteAsignado.length != 0) {
            clientId = clienteAsignado[0].id;
          } else {
            return NextResponse.json(
              `${tempArray[i][j]["email cliente"]} no registrado`,
              { status: 201 }
            );
          }
        }

        if ("" !== tempArray[i][j]["plan"]) {
          var userPlans = plans.filter(
            (p) => p.name === tempArray[i][j]["plan"]
          );

          if (userPlans.length != 0) {
            planId = userPlans[0].id;
          }
        }

        var dateStart = convertDdMmYyyyToDate(tempArray[i][j]["inicio"]);
        var dateLastPay = convertDdMmYyyyToDate(tempArray[i][j]["último pago"]);

        data.push({
          amount: +tempArray[i][j]["monto"],
          clientId,
          comment: tempArray[i][j]["comentarios"],
          delivery: tempArray[i][j]["repartidor"],
          dateStart,
          dateLastPay,
          paymentMethod: tempArray[i][j]["método de pago"] as PaymentMethod,
          period: tempArray[i][j]["período de pago"],
          planId,
        });

        j++;
      }
      try {
        await prisma.subscription.createMany({
          data,
          skipDuplicates: true,
        });
      } catch (error) {
        console.log(error);
      }
      i++;
    }

    /* while (i < result.data.length) {
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
    } */

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
        var expiration = tempArray[i][j]["Vencimiento"];
        var client = await prisma.client.findFirst({
          where: {
            email: tempArray[i][j]["Correo Electrónico"],
          },
        });
        var number = tempArray[i][j]["Número"];
        if (!client)
          return NextResponse.json(
            `${tempArray[i][j]["Correo Electrónico"]} no registrado`,
            { status: 201 }
          );

        var cvv = tempArray[i][j]["CVV"];

        data.push({
          clientId: client.id,
          number,
          expiration,
          cvv,
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
