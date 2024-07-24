import type { Metadata } from 'next';
import './globals.css';
import { documentFont } from '@/config/fonts';
import { Provider, Sidebar, TopMenu } from '@/components';


export const metadata: Metadata = {
  title: 'Suscripciones Caras y Caretas',
  description: 'Administración de Suscriptores',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className={documentFont.className}>
        <Provider>
          {children}
        </Provider>
      </body>
    </html>
  );
}
