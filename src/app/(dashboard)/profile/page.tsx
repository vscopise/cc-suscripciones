import { auth } from '@/auth.config';
import { Title, UserForm } from '@/components';
import { redirect } from 'next/navigation';
import { getSingleUser } from '@/actions';

export default async function ProfilePage() {

  const session = await auth();

  if (!session?.user) {
    redirect('/')
  }

  const {...user} = await getSingleUser(session.user.id);

  return (
    <div className="flex flex-col pt-8">
      <div className="flex justify-center">
        <div className="w-full sm:w-[350px] px-10">
          <Title title='Editar perfil' />
          <UserForm user={user}/>
        </div>
      </div>
    </div>
  );
}