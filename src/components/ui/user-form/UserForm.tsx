'use client';

import { useState } from 'react';
import { User } from '@/interfaces';
import clsx from 'clsx';
import { useForm } from 'react-hook-form';
import { createUpdateUser } from '@/actions';

interface Props {
    user: Partial<User>;
}

interface FormInputs {
    name: string;
    email: string;
    password: string;
}

export const UserForm = ({ user }: Props) => {

    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    const { handleSubmit, register, setFocus, formState: { errors } } = useForm<FormInputs>({
        defaultValues: { ...user }
    });

    const onSubmit = async (data: FormInputs) => {
        setErrorMessage('');
        setSuccessMessage('');
        const userData = { 
            id: user.id ?? '', 
            role: user.role ?? 'user', 
            ...data 
        }
        const { ok, message } = await createUpdateUser(userData);

        if (!ok) {
            setErrorMessage(message);
            return;
        }

        setSuccessMessage(message);

        if (user) {
            setFocus('name');
        }
    }

    const resetMessages = () => {
        setSuccessMessage('');
        setErrorMessage('');
    }

    const submitLabel = user.id ? 'Actualizar' : 'Guardar';

    return (
        <form className="flex flex-col" onSubmit={handleSubmit(onSubmit)} onChange={resetMessages}>
            <div className="pb-5">
                <label className="form-label">Nombre Completo</label>
                <input
                    className={clsx(
                        "form-control", { "border-red-500": errors.name }
                    )}
                    type="text"
                    {...register('name', { required: true })}
                />
            </div>
            <div className="pb-5">
                <label className="form-label">Correo electrónico</label>
                <input
                    className={clsx(
                        "form-control", { "border-red-500": errors.email }
                    )}
                    type="email"
                    {...register('email', { required: true, pattern: /^\S+@\S+$/i })}
                />
            </div>
            <div className="pb-5">
                <label className="form-label">Contraseña</label>
                <input
                    className={clsx(
                        "form-control", { "border-red-500": errors.password }
                    )}
                    type="password"
                    {...register('password', { required: true, minLength: 6 })}
                />
            </div>
            {errorMessage && <span className="text-red-500">{errorMessage}</span>}
            {successMessage && <span className="text-green-500">{successMessage}</span>}
            <button className="btn-primary">{submitLabel}</button>
        </form>
    )
}
