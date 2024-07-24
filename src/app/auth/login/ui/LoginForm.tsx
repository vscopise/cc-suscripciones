'use client';

import { useEffect } from 'react';
import { useFormState, useFormStatus } from 'react-dom';

import { login } from '@/actions';
import { IoInformationOutline } from 'react-icons/io5';

export const LoginForm = () => {

  const [state, dispatch] = useFormState(login, undefined);

  useEffect(() => {
    if (state === 'Success') {
      window.location.replace('/')
    }
  }, [state]);

  return (
    <form action={dispatch} className="flex flex-col">
      <label htmlFor="email">Correo electrónico</label>
      <input type="email" name="email" className="px-5 py-2 border bg-gray-300 rounded mb-5" />

      <label htmlFor="password">Contraseña</label>
      <input type="password" name="password" className="px-5 py-2 border bg-gray-300 rounded mb-5" />

      <div className="flex h-8 items-end space-x-1" aria-live="polite" aria-atomic="true">
        {
          state === 'CredentialsSignIn' && (
            <div className="flex flex-row mb-2">
              <IoInformationOutline className="h-5 w-5 text-red-500" />
              <p className="text-sm text-red-500">Credenciales Inválidas</p>
            </div>
          )
        }
      </div>
      <LoginButton />
    </form>
  )
}

function LoginButton() {
  const { pending } = useFormStatus();

  const classButton = pending ? 'btn-secondary' : 'btn-primary';

  return (
    <button type="submit" className={classButton} disabled={pending}>
      Ingresar
    </button>
  )
}