import { useState } from 'react';
import { deleteCard } from '@/actions';
import { Button, ConfirmDialog } from '@/components';
import { IoTrashOutline } from 'react-icons/io5';

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
