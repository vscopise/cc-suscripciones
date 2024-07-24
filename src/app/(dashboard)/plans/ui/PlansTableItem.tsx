import { useState } from 'react';
import { deletePlan } from '@/actions';
import { Button, ConfirmDialog } from '@/components';
import Link from 'next/link';
import { IoPencil, IoTrashOutline } from 'react-icons/io5';

interface Props {
    planId: string;
}

export const PlansTableItem = ({ planId }: Props) => {

    const [confirmOpen, setConfirmOpen] = useState(false);

    const handleDelete = (id: string) => {
        deletePlan(id);
    }

    return (
        <>
            <Link href={`/plan/${planId}`} className='btn-primary mx-2'>
                <IoPencil />
            </Link>
            <Button onClick={() => setConfirmOpen(true)} className='mx-2'>
                <IoTrashOutline />
            </Button>
            <ConfirmDialog
                title="Eliminar plan"
                open={confirmOpen}
                onClose={() => setConfirmOpen(false)}
                onConfirm={() => handleDelete(planId)}
            >
                ¿Está seguro que quiere eliminar este plan?
            </ConfirmDialog>
        </>
    )
}
