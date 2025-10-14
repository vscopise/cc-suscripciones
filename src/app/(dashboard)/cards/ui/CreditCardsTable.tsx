'use client';

import { CreditCard } from '@/interfaces';
import { CreditCardsTableItem } from './CreditCardsTableItem';
import Link from 'next/link';
import { truncateString } from '@/utils';

interface Props {
  creditCards: any[];
}

export const CreditCardsTable = ({ creditCards }: Props) => {
  return (
    <table className="min-w-full">
      <thead className="bg-gray-200 text-gray-900 border-b text-xs">
        <tr>
          <th
            scope="col"
            className="w-1/4 px-6 py-4 text-left"
          >
            Número
          </th>
          <th
            scope="col"
            className="w-1/4 px-6 py-4 text-left"
          >
            Cliente
          </th>
          <th
            scope="col"
            className="w-1/4 px-6 py-4 text-left"
          >
            Venc
          </th>
          <th />
        </tr>
      </thead>
      <tbody>
        {creditCards.map((card) => (
          <tr key={card.id} className="bg-white border-b transition duration-300 ease-in-out hover:bg-gray-100 text-gray-900">
            <td className="text-sm  font-light px-6 py-4 whitespace-nowrap text-left">
              <Link href={`/card/${card.id}`} className='hover:underline block'>
                {card.number.toString()}
              </Link>
            </td>
            <td className="text-sm  font-light px-6 py-4 whitespace-nowrap">
              <Link href={`/card/${card.id}`} className='hover:underline block'>
                {truncateString(`${card.client.name} ${card.client.lastName}`, 30)}
              </Link>
            </td>
            <td className='text-sm  font-light px-6 py-4 whitespace-nowrap'>{card.expiration}</td>
            <td className="px-6 py-0 text-center">
              <div className="flex justify-center">
                <CreditCardsTableItem creditCardId={card.id} />
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}
