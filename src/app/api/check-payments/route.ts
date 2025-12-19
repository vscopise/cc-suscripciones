import prisma from "@/lib/prisma";
import { NextResponse, NextRequest } from "next/server";
import { Subscription } from "../../../interfaces/subscription.interface";

const mpUrl = process.env.MP_URL;
const mpToken = process.env.MP_TOKEN;

/* console.log({mpUrl});
console.log({mpToken}); */

export async function POST() {
  try {
    const response = await fetch(
      `${mpUrl}/payments/search?begin_date=NOW-1DAY&end_date=NOW`,
      {
        headers: {
          Authorization: `Bearer ${process.env.MP_TOKEN}`,
        },
      }
    ).then((res) => res.json());

    console.log({ response });

    const total = response.paging.total;

    console.log({ total });

    if (30 < total) {
      let page = 1;
      while (30 * page < total) {
        process_paginated_payments(page);
        page++;
      }
    } else {
      process_paginated_payments();
    }

    return NextResponse.json({ sucess: true });
  } catch (error) {
    console.log(error);
    return NextResponse.json(error, { status: 400 });
  }
}

async function process_paginated_payments(page = 1) {
  const offset = 30 * (page - 1);
  const response = await fetch(
    `${mpUrl}payments/search?begin_date=NOW-1DAY&end_date=NOW&offset=${offset}`,
    {
      headers: {
        Authorization: `Bearer ${mpToken}`,
      },
    }
  ).then((res) => res.json());

  const payments = response.results;

  payments.forEach((payment: any) => {
    if ("approved" === payment.status) {
      let email = payment.payer.email;
      let amount = payment.transaction_details.total_paid_amount;
      if (null !== email && null !== amount) {
        process_single_payment(payment);
      }
    }
  });
}

async function process_single_payment(payment: any) {
  const client = await prisma.client.findFirst({
    where: {
      email: payment.payer.email,
    },
  });

  if (null !== client) {
    const subscription = await prisma.subscription.findFirst({
      where: { clientId: client.id },
    });

    if (null !== subscription) {
      //console.log({ subscription });
      const subscriptionId = subscription.id;
      const dateLastPay = payment.date_last_updated;

      await prisma.subscription.update({
        where: { id: subscriptionId },
        data: { dateLastPay: dateLastPay },
      });
    }
  }
}
