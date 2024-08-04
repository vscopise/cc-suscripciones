'use client';

import { createNote } from '@/actions';
import clsx from 'clsx';
import { useState } from 'react';

interface Props {
    clientId: string;
}

export const NoteInput = ({clientId}: Props) => {

    const [disable, setDisable] = useState(true);
    const [newNote, setNewNote] = useState('');

    const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setDisable('' === e.target.value);
        setNewNote(e.target.value);
    }

    const onSubmit = async (e: React.FormEvent<HTMLButtonElement>) => {
        e.preventDefault();
        await createNote(clientId, newNote);

        setNewNote('');
        setDisable(true);
    }

    return (
        <div className="flex justify-between items-center gap-3 mb-10">
            <input
                type="text"
                className="form-control"
                onChange={(e) => onChange(e)}
                value={newNote}
            />
            <button
                className={clsx(
                    { "btn-primary": !disable },
                    { "btn-disabled": disable },
                )}
                disabled={disable}
                onClick={(e) => onSubmit(e)}
            >
                Agregar
            </button>
        </div>
    )
}
