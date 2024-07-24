import { deleteCard } from '@/actions';
import { Button, ConfirmDialog } from '@/components';
import Link from 'next/link';
import { useState } from 'react';
import { IoPencil, IoTrashOutline } from 'react-icons/io5';

interface Props {
    creditCardId: string;
}
export const CreditCardsTableItem = ({ creditCardId }: Props) => {

    const [confirmOpen, setConfirmOpen] = useState(false);

    const handleDelete = (id: string) => {
        deleteCard(id);
    }

    return (
        <>
            <Link href={`/card/${creditCardId}`} className='btn-primary mx-2'>
                <IoPencil />
            </Link>
            <Button onClick={() => setConfirmOpen(true)} className='mx-2'>
                <IoTrashOutline />
            </Button>
            <ConfirmDialog
                title="Eliminar tarjeta de crédito"
                open={confirmOpen}
                onClose={() => setConfirmOpen(false)}
                onConfirm={() => handleDelete(creditCardId)}
            >
                ¿Está seguro que quiere eliminar esta Tarjeta?
            </ConfirmDialog>
        </>
    )
}
