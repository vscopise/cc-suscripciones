import { getAllCards, getAllClients, getPlans, getSingleSubscription } from '@/actions';
import { Title } from '@/components';
import { redirect } from 'next/navigation';
import { SubscriptionForm } from './ui/SubscriptionForm';

interface Props {
    params: {
        id: string;
    }
}

export default async function SingleSubscriptionPage({ params }: Props) {

    const { id } = params;

    const [clients, subscription, { plans }, cards] = await Promise.all([
        getAllClients(),
        getSingleSubscription(id),
        getPlans(),
        getAllCards(),
    ]);

    if (!subscription && id !== 'new') {
        redirect('/subscriptions');
    }

    const title = (id === 'new') ? 'Nueva Suscripción' : 'Editar Suscripción';

    return (
        <div className="flex flex-col pt-8">
            <div className="flex justify-center">
                <div className="w-full sm:w-[950px] px-10">
                    <Title title={title} />
                    <SubscriptionForm
                        clients={clients ?? []}
                        subscription={subscription ?? {}}
                        plans={plans ?? []}
                        cards={cards ?? []}
                    />
                </div>
            </div>
        </div>
    );
}