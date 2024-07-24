import { Title } from '@/components';
import { LoginForm } from './ui/LoginForm';

export default function LoginPage() {
  return (
    <main className="flex flex-col min-h-screen pt-32">
      <Title title="Ingresar" />
      <LoginForm />
    </main>
  );
}