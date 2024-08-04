'use client';

import { ClientNote } from '@/interfaces';
import { NotesTableItem } from './NotesTableItem';

interface Props {
    notes: ClientNote[]
    clientId: string;
}

export const NotesTable = ({ notes, clientId }: Props) => {

    return (
        <table className="min-w-full">
            <thead className="bg-gray-200 border-b">
                <tr>
                    <th
                        scope="col"
                        className="text-sm font-medium text-gray-900 px-6 py-4 text-left"
                    >
                        Fecha
                    </th>
                    <th
                        scope="col"
                        className="text-sm font-medium text-gray-900 px-6 py-4 text-left"
                    >
                        Texto
                    </th>
                    <th />
                </tr>
            </thead>
            <tbody>
                {notes.map((note) => (
                    <tr key={note.id} className="bg-white border-b transition duration-300 ease-in-out hover:bg-gray-100 text-gray-900">
                        <td className="text-sm  font-light px-6 py-4 whitespace-nowrap">
                            {note.date.toLocaleDateString('es-ES', {
                                day: 'numeric',
                                month: 'long',
                                hour: 'numeric',
                                minute: 'numeric'
                            })}
                        </td>
                        <td className="text-sm  font-light px-6 py-4 whitespace-nowrap">
                            {note.note}
                        </td>
                        <td className="px-6 py-0 text-center">
                            <NotesTableItem noteId={note.id} clientId={clientId} />
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    )
}
