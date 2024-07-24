'use client';

import { useState } from 'react';
import { Plan } from '@/interfaces';
import { deletePlan } from '@/actions';
import Link from 'next/link';
import { IoPencil, IoTrashOutline } from 'react-icons/io5';
import { Button, ConfirmDialog } from '@/components';
import { PlansTableItem } from './PlansTableItem';

interface Props {
    plans: Plan[],
    isAdmin: boolean,
}

export const PlansTable = ({ plans, isAdmin }: Props) => {

    const [confirmOpen, setConfirmOpen] = useState(false);

    const handleDelete = (id: string) => {
        deletePlan(id);
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
                        Descripción
                    </th>
                    <th />
                </tr>
            </thead>
            <tbody>
                {plans.map(plan => (
                    <tr
                        key={plan.id}
                        className="bg-white border-b transition duration-300 ease-in-out hover:bg-gray-100"
                    >
                        <td className="text-sm text-gray-900 font-light whitespace-nowrap">
                            <Link href={`/plan/${plan.id}`} className='hover:underline px-6 py-4 block'>
                                {plan.name}
                            </Link>
                        </td>
                        <td className="text-sm text-gray-900 font-light whitespace-nowrap">
                            <Link href={`/plan/${plan.id}`} className='hover:underline px-6 py-4 block'>
                                {plan.description}
                            </Link>
                        </td>
                        <td className="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap">
                            {isAdmin &&
                                <>
                                    <Button onClick={() => setConfirmOpen(true)} className='mx-2'>
                                        <IoTrashOutline />
                                    </Button>
                                    <ConfirmDialog
                                        title="Eliminar plan"
                                        open={confirmOpen}
                                        onClose={() => setConfirmOpen(false)}
                                        onConfirm={() => handleDelete(plan.id)}
                                    >
                                        ¿Está seguro que quiere eliminar este plan?
                                    </ConfirmDialog>
                                </>
                            }
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    )
}
