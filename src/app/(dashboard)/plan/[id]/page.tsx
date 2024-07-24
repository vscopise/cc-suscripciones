import { getSinglePlan } from '@/actions';
import { auth } from '@/auth.config';
import { Title } from '@/components';
import { redirect } from 'next/navigation';
import { PlanForm } from './ui/PlanForm';

interface Props {
    params: {
        id: string;
    }
}

export default async function SinglePlanPage({ params }: Props) {
    const session = await auth();
    if (session?.user.role !== 'admin') {
        redirect('/');
    }

    const { id } = params;

    const plan = await getSinglePlan(id);

    if (!plan && id !== 'new') {
        redirect('/plans');
    }

    const title = (id === 'new') ? 'Nuevo Plan' : 'Editar Plan';

    return (
        <div className="flex flex-col pt-8">
            <div className="flex justify-center">
                <div className="w-full sm:w-[350px] px-10">
                    <Title title={title} />
                    <PlanForm plan={plan ?? {}} />
                </div>
            </div>
        </div>
    );
}