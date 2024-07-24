import { auth } from '@/auth.config';
import { Sidebar, TopMenu } from '@/components';
import { redirect } from 'next/navigation';

export default async function MainLayout({ children }: { children: React.ReactNode; }) {

    const session = await auth();
    if (!session) redirect('/auth/login');

    return (
        <main className="min-h-screen">
            <TopMenu />
            <Sidebar />
            <div className="px-0 sm:px-10">
                {children}
            </div>
        </main>
    );
}