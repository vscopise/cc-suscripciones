import { getPlans } from '@/actions';
import { auth } from '@/auth.config';
import { Title } from '@/components';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { PlansTable } from './ui/PlansTable';

export default async function PlansPage() {

    const session = await auth();
    const isAdmin = session?.user.role === 'admin';

    const { ok, plans = [] } = await getPlans();

    if (!ok) {
        redirect('/auth/login')
    }

    return (
        <>
            <div className="flex justify-between items-center">
                <Title title='Planes' />
                {isAdmin && (
                    <Link href="/plan/new" className="btn-primary mt-3">
                        Nuevo Plan
                    </Link>
                )}
            </div>
            <div className="mb-10">
                <PlansTable plans={plans} isAdmin={isAdmin} />
            </div>
        </>
    );
}