'use client';

import { useState } from 'react';
import { Client, User } from '@/interfaces';
import { deleteClient } from '@/actions';
import Link from 'next/link';
import { IoTrashOutline } from 'react-icons/io5';
import { Button, ConfirmDialog } from '@/components';

interface Props {
  clients: any[],
  users: User[],
  isAdmin: boolean,
}

export const ClientsTable = ({ clients, users, isAdmin }: Props) => {

  const [confirmOpen, setConfirmOpen] = useState(false);

  const handleDelete = (id: string) => {
    deleteClient(id);
  }

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
            Contacto
          </th>
          <th
            scope="col"
            className="text-sm font-medium text-gray-900 px-6 py-4 text-left"
          >
            Observaciones
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
                  {client.phone}
                </Link>
              </td>
              <td className="text-sm  font-light whitespace-nowrap">
                <Link href={`/client/${client.id}`} className='hover:underline px-6 py-4 block'>
                  {client.observations.length > 25 ? `${client.observations.substring(0, 25)}...` : client.observations}
                </Link>
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
                {isAdmin &&
                  <>
                    <Button onClick={() => setConfirmOpen(true)} className='mx-2'>
                      <IoTrashOutline />
                    </Button>
                    <ConfirmDialog
                      title="Eliminar cliente"
                      open={confirmOpen}
                      onClose={() => setConfirmOpen(false)}
                      onConfirm={() => handleDelete(client.id)}
                    >
                      ¿Está seguro que quiere eliminar este cliente?
                    </ConfirmDialog>
                  </>
                }
              </td>
            </tr>
          )
        })}
      </tbody>
    </table>
  )
}
