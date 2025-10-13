import { getFilteredSubscriptions } from '@/actions';
import { auth } from '@/auth.config';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { Pagination, Title } from '@/components';
import { SubscriptionsTable } from './ui/SubscriptionsTable';
import { SubscriptionsFilter } from './ui/SubscriptionsFilter';

interface Props {
    searchParams: {
        active?: string;
        client?: string;
        status?: string;
        page?: string;
        take?: string;
    }
}

export default async function SubscriptionsPage({ searchParams }: Props) {

    const active = searchParams?.active || 'all';
    const client = searchParams?.client || '';
    const status = searchParams?.status || 'all';
    const page = searchParams.page ? parseInt(searchParams.page) : 1;
    const take = searchParams.take ? parseInt(searchParams.take) : 20;

    const session = await auth();
    const isAdmin = session?.user.role === 'admin';


    const { ok, totalPages = 1, subscriptions = [] } = await getFilteredSubscriptions({ 
        active, 
        status,
        /*status, subscriber,*/ 
        client, 
        page, 
        take 
    });

    if (!ok) {
        redirect('/auth/login')
    }

    return (
        <>
            <div className="flex justify-between items-center">
                <Title title='Suscripciones' />
                <Link href="/subscription/new" className="btn-primary mt-3">
                    Nueva Suscripción
                </Link>
            </div>
            <div className="mb-10">
                <SubscriptionsFilter  
                    active={active}
                    page={page}
                    take={take}
                    status={status}
                    client={client}
                    subscriptions={subscriptions} 
                    isAdmin={isAdmin}
                />
                <SubscriptionsTable
                    active={active}
                    page={page}
                    take={take}
                    client={client}
                    subscriptions={subscriptions} 
                    isAdmin={isAdmin}
                />
                <Pagination totalPages={totalPages} />
            </div>
        </>
    );
}