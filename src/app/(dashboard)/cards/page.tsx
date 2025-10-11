import { getFilteredCards } from '@/actions';
import { auth } from '@/auth.config';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { Pagination, Title } from '@/components';
import { CreditCardsTable } from './ui/CreditCardsTable';
import { CardsFilter } from './ui/CardsFilter';

interface Props {
    searchParams: {
        email?: string;
        name?: string;
        page?: string;
        take?: string;
    }
}

export default async function CardsPage({ searchParams }: Props) {

    const email = searchParams?.email || '';
    const name = searchParams?.name || '';
    const page = searchParams.page ? parseInt(searchParams.page) : 1;
    const take = searchParams.take ? parseInt(searchParams.take) : 20;

    const session = await auth();
    if (session?.user.role !== 'admin') {
        redirect('/');
    }

    const { ok, totalPages = 1, creditCards = [] } = await getFilteredCards({ 
        page, 
        take,
        name,
        email
    });

    if (!ok) {
        redirect('/auth/login')
    }

    return (
        <>
            <div className="flex justify-between items-center">
                <Title title='Tarjetas de Crédito' />
                <Link href="/card/new" className="btn-primary mt-3">
                    Nueva tarjeta
                </Link>
            </div>
            <div className="mb-10">
                <CardsFilter
                    email={email}
                    name={name}
                />
                <CreditCardsTable
                    creditCards={creditCards}
                />
                <Pagination totalPages={totalPages} />
            </div>
        </>
    );
}