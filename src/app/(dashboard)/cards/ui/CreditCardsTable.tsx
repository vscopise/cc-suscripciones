'use client';

import { CreditCard } from '@/interfaces';
import { CreditCardsTableItem } from './CreditCardsTableItem';

interface Props {
  creditCards: any[];
}

export const CreditCardsTable = ({ creditCards }: Props) => {
  return (
    <table className="min-w-full">
      <thead className="bg-gray-200 border-b">
        <tr>
          <th
            scope="col"
            className="text-sm font-medium text-gray-900 px-6 py-4 text-left"
          >
            Número
          </th>
          <th
            scope="col"
            className="text-sm font-medium text-gray-900 px-6 py-4 text-left"
          >
            Cliente
          </th>
          <th />
        </tr>
      </thead>
      <tbody>
        {creditCards.map((card) => (
          <tr key={card.id} className="bg-white border-b transition duration-300 ease-in-out hover:bg-gray-100 text-gray-900">
            <td className="text-sm  font-light px-6 py-4 whitespace-nowrap">
              {card.number.toString()}
            </td>
            <td className="text-sm  font-light px-6 py-4 whitespace-nowrap">
              {`${card.client.name} ${card.client.lastName}`}
            </td>
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
