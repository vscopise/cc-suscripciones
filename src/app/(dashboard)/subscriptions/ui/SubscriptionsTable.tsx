'use client';

import { PaymentStatus } from './PaymentStatus';
import Link from 'next/link';
import { SubscriptionDelete } from './SubscriptionDelete';
import { SubscriptionStatus } from './SubscriptionStatus';

interface Props {
  active: string;
  //status: string;
  client: string;
  page: number;
  take: number;
  isAdmin: boolean;
  subscriptions: any[];
}

export const SubscriptionsTable = ({ active, /*status,*/ subscriptions, client, page, take, isAdmin }: Props) => {

  return (
    <table className="min-w-full">
      <thead className="bg-gray-200 border-b">
        <tr>
          <th
            scope="col"
            className="text-sm font-medium text-gray-900 px-6 py-4 text-left"
          >
            Suscriptor
          </th>
          <th
            scope="col"
            className="text-sm font-medium text-gray-900 px-6 py-4 text-left"
          >
            Contacto
          </th>
          <th
            scope="col"
            className="text-sm font-medium text-gray-900 px-6 py-4 text-left"
          >
            Monto
          </th>
          <th
            scope="col"
            className="text-sm font-medium text-gray-900 px-6 py-4 text-left"
          >
            Fecha de inicio
          </th>
          <th
            scope="col"
            className="text-sm font-medium text-gray-900 px-6 py-4 text-left"
          >
            Activo
          </th>
          <th
            scope="col"
            className="text-sm font-medium text-gray-900 px-6 py-4 text-center"
          >
            Estado del pago
          </th>
          <th />
        </tr>
      </thead>
      <tbody>
        {subscriptions.map(subscription => {
          return (
            <tr key={subscription.id} className="bg-white border-b transition duration-300 ease-in-out hover:bg-gray-100 text-gray-900">
              <td className="text-sm  font-light whitespace-nowrap">
                <Link href={`/subscription/${subscription.id}`} className='hover:underline px-6 py-4 block'>
                  {subscription.client.email}
                </Link>
              </td>
              <td className="text-sm  font-light whitespace-nowrap">
                <Link href={`/subscription/${subscription.id}`} className='hover:underline px-6 py-4 block'>
                  {subscription.client.phone}
                </Link>
              </td>
              <td className="text-sm font-light whitespace-nowrap">
                <Link href={`/subscription/${subscription.id}`} className='hover:underline px-6 py-4 block'>
                  {subscription.amount}
                </Link>
              </td>
              <td className="text-sm font-light whitespace-nowrap">
                <Link href={`/subscription/${subscription.id}`} className='hover:underline px-6 py-4 block'>
                  {subscription.dateStart.toLocaleString('es-ES', {
                    timeZone: 'UTC',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </Link>
              </td>
              <SubscriptionStatus subscription={subscription} />
              <td className="text-sm text-gray-900 font-light px-6 py-4">
                <PaymentStatus dateLastPay={subscription.dateLastPay} period={subscription.period} />
              </td>
              <td className="text-sm text-gray-900 font-light px-6 py-4 flex justify-center">
                {isAdmin && <SubscriptionDelete id={subscription.id} />}
              </td>
            </tr>
          )
        })}
      </tbody>
    </table>
  )
}
