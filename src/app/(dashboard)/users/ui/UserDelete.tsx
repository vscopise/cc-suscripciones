import { useState } from 'react';
import { deleteUser } from '@/actions';
import { Button, ConfirmDialog } from '@/components';
import { IoTrashOutline } from 'react-icons/io5';

interface Props {
    userId: string;
}

export const UserDelete = ({ userId }: Props) => {

    const [confirmOpen, setConfirmOpen] = useState(false);

    const handleDeleteUser = (userId: string) => {
        deleteUser(userId);
    }
    
    return (
        <>
        <Button onClick={() => setConfirmOpen(true)} className='mx-2'>
            <IoTrashOutline />
        </Button>
        <ConfirmDialog
            title="Eliminar usuario"
            open={confirmOpen}
            onClose={() => setConfirmOpen(false)}
            onConfirm={() => handleDeleteUser(userId)}
        >
            ¿Está seguro que quiere eliminar este usuario?
        </ConfirmDialog>
    </>
    )
}
