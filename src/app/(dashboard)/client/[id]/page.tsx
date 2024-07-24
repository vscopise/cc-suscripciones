import {getAllCards, getAllUsers, getCountries, getSingleClient } from '@/actions';
import { auth } from '@/auth.config';
import { Title } from '@/components';
import { redirect } from 'next/navigation';
import { ClientForm } from './ui/ClientForm';

interface Props {
    params: {
        id: string;
    }
}

export default async function SingleClientPage({ params }: Props) {
    const session = await auth();
    /* if (session?.user.role !== 'admin') {
        redirect('/');
    } */
   const currentUser = session!.user;

    const { id } = params;

    const [cards, client, countries, users=[]] = await Promise.all([
        getAllCards(), getSingleClient(id), getCountries(), getAllUsers()
    ]);

    if (!cards || !client && id !== 'new') {
        redirect('/clients');
    }

    const title = (id === 'new') ? 'Nuevo Cliente' : 'Editar Cliente';

    return (
        <div className="flex flex-col pt-8">
            <div className="flex justify-center">
                <div className="w-full sm:w-[950px] px-10">
                    <Title title={title} />
                    <ClientForm
                        cards={cards}
                        client={client ?? {}}
                        countries={countries}
                        users={users}
                        currentUser={currentUser}
                    />
                </div>
            </div>
        </div>
    );
}