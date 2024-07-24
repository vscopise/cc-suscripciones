import { getSingleUser } from '@/actions';
import { auth } from '@/auth.config';
import { Title, UserForm } from '@/components';
import { redirect } from 'next/navigation';
//import { UserForm } from './ui/UserForm';

interface Props {
    params: {
        id: string;
    }
}

export default async function SingleUserPage({ params }: Props) {
    const session = await auth();
    if (session?.user.role !== 'admin') {
        redirect('/');
    }

    const { id } = params;

    const user = await getSingleUser(id);

    if (!user && id !== 'new') {
        redirect('/users');
    }

    const title = (id === 'new') ? 'Nuevo Usuario' : 'Editar Usuario';

    return (
        <div className="flex flex-col pt-8">
            <div className="flex justify-center">
                <div className="w-full sm:w-[350px] px-10">
                    <Title title={title} />
                    <UserForm user={user ?? {}} />
                </div>
            </div>
        </div>
    );
}