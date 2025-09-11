import { getAllUsers, getFilteredClients } from '@/actions';
import { auth } from '@/auth.config';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { Pagination, Title } from '@/components';
import { ClientsTable } from './ui/ClientsTable';
import { ClientsFilter } from './ui/ClientsFilter';

interface Props {
    searchParams: {
        name?: string;
        email?: string;
        subscriptions?: string;
        page?: string;
        take?: string;
        orderby?: string;
        order?: string;
    }
}

export default async function ClientsPage({ searchParams }: Props) {
    const name = searchParams?.name || '';
    const email = searchParams?.email || '';
    const subscriptions = searchParams?.subscriptions || 'all';
    const page = searchParams.page ? parseInt(searchParams.page) : 1;
    const take = searchParams.take ? parseInt(searchParams.take) : 10;

    const orderby = searchParams?.orderby || 'name';
    const order = searchParams.order=== 'asc' ? 'asc' : 'desc';

    const session = await auth();
    const isAdmin = session?.user.role === 'admin';
    const userId = session!.user.id;
    
    const [{ ok, totalPages = 1, clients = [] }, users = []] = await Promise.all([
        getFilteredClients({ 
            name,
            email, 
            subscriptions, 
            page, 
            take, 
            orderby,
            order,
            isAdmin, 
            userId }), 
        getAllUsers(),
    ]);
    
    if (!ok) {
        redirect('/auth/login')
    }
    
    return (
        <>
            <div className="flex justify-between items-center">
                <Title title='Clientes' />
                <Link href="/client/new" className="btn-primary mt-3">
                    Nuevo Cliente
                </Link>
            </div>
            <div className="mb-10">
                <ClientsFilter />
                <ClientsTable clients={clients} users={users} isAdmin={isAdmin} />
                <Pagination totalPages={totalPages} />
            </div>
        </>
    );
}