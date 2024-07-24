import { getPaginatedUsers } from '@/actions';
import { auth } from '@/auth.config';
import { Pagination, Title } from '@/components';
import { redirect } from 'next/navigation';
import { UsersTable } from './ui/UsersTable';
import Link from 'next/link';

interface Props {
    searchParams: {
        page?: string;
        take?: string;
    }
}

export default async function UsersPage({ searchParams }: Props) {

    const page = searchParams.page ? parseInt(searchParams.page) : 1;
    const take = searchParams.take ? parseInt(searchParams.take) : 10;

    const session = await auth();
    if (session?.user.role !== 'admin') {
        redirect('/');
    }

    const { ok, totalPages = 1, users = [] } = await getPaginatedUsers({ page, take });

    if (!ok) {
        redirect('/auth/login')
    }

    return (
        <>
            <div className="flex justify-between items-center">
                <Title title='Usuarios' />
                <Link href="/user/new" className="btn-primary mt-3">
                    Nuevo Usuario
                </Link>
            </div>
            <div className="mb-10">
                <UsersTable users={users} currentUser={session.user.id} />
                <Pagination totalPages={totalPages} />
            </div>
        </>
    );
}