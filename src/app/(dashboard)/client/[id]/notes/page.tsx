import { auth } from '@/auth.config';
import { redirect } from 'next/navigation';
import { Pagination, Title } from '@/components';
import { getFilteredNotes } from '@/actions';
import { NotesTable } from './ui/NotesTable';
import { NoteInput } from './ui/NoteInput';

interface Props {
    searchParams: {
        page?: string;
        take?: string;
    },
    params: {
        id?: string;
    }
}

export default async function ClientNotesPage({ searchParams, params }: Props) {

    const clientId = params.id ? params.id : '';
    const page = searchParams.page ? parseInt(searchParams.page) : 1;
    const take = searchParams.take ? parseInt(searchParams.take) : 10;

    const session = await auth();
    if (session?.user.role !== 'admin') {
        redirect('/');
    }

    const { ok, totalPages = 1, notes = [] } = await getFilteredNotes({ clientId, page, take });

    if (!ok) return null;

    return (
        <>
            <div className="flex justify-between items-center">
                <Title title='Notas' />
            </div>
            <div className="mb-10">
                <NoteInput clientId={clientId} />
                <NotesTable
                    notes={notes} 
                    clientId={clientId}
                />
                <Pagination totalPages={totalPages} />
            </div>
        </>
    );
}