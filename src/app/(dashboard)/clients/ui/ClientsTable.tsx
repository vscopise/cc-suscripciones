'use client';

import { User } from '@/interfaces';
import Link from 'next/link';
import { ClientsTableItem } from './ClientsTableItem';

interface Props {
  clients: any[],
  users: User[],
  isAdmin: boolean,
}

export const ClientsTable = ({ clients, users, isAdmin }: Props) => {

  return (
    <table className="min-w-full">
      <thead className="bg-gray-200 border-b">
        <tr>
          <th
            scope="col"
            className="text-sm font-medium text-gray-900 px-6 py-4 text-left"
          >
            Nombre
          </th>
          <th
            scope="col"
            className="text-sm font-medium text-gray-900 px-6 py-4 text-left"
          >
            Email
          </th>
          <th
            scope="col"
            className="text-sm font-medium text-gray-900 px-6 py-4 text-left"
          >
            Num. Cliente
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
            Notas
          </th>
          <th
            scope="col"
            className="text-sm font-medium text-gray-900 px-6 py-4 text-left"
          >
            Con suscripciones
          </th>
          <th
            scope="col"
            className="text-sm font-medium text-gray-900 px-6 py-4 text-left"
          >
            {isAdmin && <span>Usuario Asignado</span>}
          </th>
          <th />
        </tr>
      </thead>
      <tbody>
        {clients.map(client => {
          return (
            <tr
              key={client.id}
              className="bg-white border-b transition duration-300 ease-in-out hover:bg-gray-100"
            >
              <td className="text-sm  font-light whitespace-nowrap">
                <Link href={`/client/${client.id}`} className='hover:underline px-6 py-4 block'>
                  {`${client.name} ${client.lastName}`}
                </Link>
              </td>
              <td className="text-sm  font-light whitespace-nowrap">
                <Link href={`/client/${client.id}`} className='hover:underline px-6 py-4 block'>
                  {client.email}
                </Link>
              </td>
              <td className="text-sm  font-light whitespace-nowrap">
                <Link href={`/client/${client.id}`} className='hover:underline px-6 py-4 block'>
                  {client.clientNumber}
                </Link>
              </td>
              <td className="text-sm  font-light whitespace-nowrap">
                <Link href={`/client/${client.id}`} className='hover:underline px-6 py-4 block'>
                  {client.phone}
                </Link>
              </td>
              <td className="text-sm  font-light whitespace-nowrap">
                {client.ClientNote.length > 0 && (
                  <Link href={`/client/${client.id}`} className='hover:underline px-6 py-4 block'>
                    {
                      client.ClientNote!.at(-1)!.note.length > 25
                        ? `${client.ClientNote!.at(-1)!.note.substring(0, 25)}...`
                        : client.ClientNote!.at(-1)!.note
                    }
                  </Link>
                )}
              </td>
              <td className="text-sm font-light px-6 py-4 flex justify-center">
                <Link href={`/client/${client.id}`} className='hover:underline px-6 py-4 block'>
                  {client.Subscription.length > 0 && <span>SI</span>}
                </Link>
              </td>
              <td className="text-sm  font-light whitespace-nowrap">
                {isAdmin && (
                  <Link href={`/client/${client.id}`} className='hover:underline px-6 py-4 block'>
                    {users.filter(u => u.id === client.userId)[0].name}
                  </Link>
                )}
              </td>
              <td className="text-sm font-light px-6 py-4 flex justify-center">
                {isAdmin && <ClientsTableItem clientId={client.id} />}
              </td>
            </tr>
          )
        })}
      </tbody>
    </table>
  )
}
