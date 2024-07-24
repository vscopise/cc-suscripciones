import { getAllClients, getSingleCard } from '@/actions';
import { Title } from '@/components';
import { CreditCardForm } from './ui/CreditCardForm';

interface Props {
    params: {
        id: string;
    }
}

export default async function SingleCardPage({ params }: Props) {

    
    const { id } = params;

    const [card, clients] = await Promise.all([
        getSingleCard(id),
        getAllClients(),
    ]);

    const title = (id === 'new') ? 'Nueva Tarjeta' : 'Editar Tarjeta';

    return (
        <div className="flex flex-col pt-8">
            <div className="flex justify-center">
                <div className="w-full sm:w-[550px] px-10">
                    <Title title={title} />
                    <CreditCardForm 
                        card={card ?? {}}
                        clients={clients ?? []}
                    />
                </div>
            </div>
        </div>
    );
}