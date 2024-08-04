import { useState } from 'react';
import { Button, ConfirmDialog } from '@/components';
import { IoTrashOutline } from 'react-icons/io5';
import { deleteSubscription } from '@/actions';

interface Props {
    id: string;
}

export const SubscriptionDelete = ({ id }: Props) => {

    const [confirmOpen, setConfirmOpen] = useState(false);

    const handleDelete = (id: string) => {
        deleteSubscription(id);
    }

    return (
        <>
            <Button onClick={() => setConfirmOpen(true)}>
                <IoTrashOutline onClick={() => setConfirmOpen(true)} />
            </Button>
            <ConfirmDialog
                title="Eliminar suscripción"
                open={confirmOpen}
                onClose={() => setConfirmOpen(false)}
                onConfirm={() => handleDelete(id)}
            >
                ¿Está seguro que quiere eliminar esta Suscripción?
            </ConfirmDialog>
        </>
    )
}
