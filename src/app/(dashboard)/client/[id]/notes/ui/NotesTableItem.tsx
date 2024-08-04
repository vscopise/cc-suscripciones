'use client';

import { useState } from 'react';
import { Button, ConfirmDialog } from '@/components';
import { IoTrashOutline } from 'react-icons/io5';
import { deleteNote } from '@/actions';

interface Props {
    noteId: string;
    clientId: string;
}

export const NotesTableItem = ({ noteId, clientId }: Props) => {

    const [confirmOpen, setConfirmOpen] = useState(false);
    const handleDelete = (id: string) => {
        deleteNote(id, clientId);
    }

    return (
        <>
            <Button onClick={() => setConfirmOpen(true)} className='mx-2'>
                <IoTrashOutline />
            </Button>
            <ConfirmDialog
                title="Eliminar nota"
                open={confirmOpen}
                onClose={() => setConfirmOpen(false)}
                onConfirm={() => handleDelete(noteId)}
            >
                ¿Está seguro que quiere eliminar esta nota?
            </ConfirmDialog>
        </>
    )
}
