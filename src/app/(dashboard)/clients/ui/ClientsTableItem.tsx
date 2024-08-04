import { useState } from 'react'
import { deleteClient } from '@/actions';
import { Button, ConfirmDialog } from '@/components';
import { IoTrashOutline } from 'react-icons/io5';

interface Props {
    clientId: string;
}

export const ClientsTableItem = ({ clientId }: Props) => {

    const [confirmOpen, setConfirmOpen] = useState(false);

    const handleDelete = (id: string) => {
        deleteClient(id);
    }
    
    return (
        <>
            <Button onClick={() => setConfirmOpen(true)} className='mx-2'>
                <IoTrashOutline />
            </Button>
            <ConfirmDialog
                title="Eliminar cliente"
                open={confirmOpen}
                onClose={() => setConfirmOpen(false)}
                onConfirm={() => handleDelete(clientId)}
            >
                ¿Está seguro que quiere eliminar este cliente?
            </ConfirmDialog>
        </>
    )
}
