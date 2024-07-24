'use client';

import { useState } from 'react';
import { Client, ClientCard, Country, ClientCard as ClientWithCards, User, CreditCard } from '@/interfaces';
import clsx from 'clsx';
import { useForm } from 'react-hook-form';
import { useSession } from 'next-auth/react';
import { createUpdateClient } from '@/actions';
import Link from 'next/link';
import { getCreditCardType } from '@/utils';

interface Props {
    cards: CreditCard[];
    client: Partial<Client> & { ClientCard?: ClientCard[] };
    countries: Country[];
    users: User[];
    currentUser: any;
}


interface FormInputs {
    name: string;
    lastName: string;
    identification: number;
    identificationType: 'Cedula' | 'Pasaporte';
    phone: string;
    email: string;
    address: string;
    city: string;
    state: string;
    countryId: string;
    userId: string;
    observations: string;
}

export const ClientForm = ({ cards, client, countries, users, currentUser }: Props) => {

    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    const [clientId, setClientId] = useState(client ? client.id : '');

    const { ClientCard = [], ...rest } = client


    const { handleSubmit, register, reset, setFocus, formState: { errors } } = useForm<FormInputs>({
        defaultValues: { ...client, countryId: 'UY' }
    })

    const onSubmit = async (data: FormInputs) => {
        setErrorMessage('');
        setSuccessMessage('');
        const clientData = {
            id: client.id ?? '',
            ...data
        }

        const { ok, clientId, message } = await createUpdateClient(clientData);

        if (!ok) {
            setErrorMessage(message);
            return;
        }

        setSuccessMessage(message);

        setClientId(clientId);

        /* if (client) {
            reset({
                name: '',
                lastName: '',
                identification: 0,
                phone: '',
                email: '',
                address: '',
                city: '',
                countryId: 'UY',
                state: '',
                observations: '',
            });
            setFocus('name');
        } */
    }

    const resetMessage = () => {
        setSuccessMessage('');
        setErrorMessage('');
    }

    const submitLabel = client.id ? 'Actualizar' : 'Guardar';

    const { data: session } = useSession();
    const isAdmin = session?.user.role === 'admin';

    return (
        <form className="flex flex-col" onSubmit={handleSubmit(onSubmit)} onChange={resetMessage}>
            <div className="-mx-3 flex flex-wrap">
                <div className="w-full px-3 sm:w-1/3">
                    <div className="mb-5">
                        <label className="form-label">Nombre</label>
                        <input
                            className={clsx(
                                "form-control", { "border-red-500": errors.name }
                            )}
                            type="text"
                            {...register('name', { required: true })}
                        />
                        {errors.name?.type === 'required' && (
                            <p className='mb5 text-red-500 text-sm'>Este campo es requerido</p>
                        )}
                    </div>
                </div>
                <div className="w-full px-3 sm:w-1/3">
                    <div className="mb-5">
                        <label className="form-label">Apellido</label>
                        <input
                            className={clsx(
                                "form-control", { "border-red-500": errors.lastName }
                            )}
                            type="text"
                            {...register('lastName', { required: true })}
                        />
                        {errors.lastName?.type === 'required' && (
                            <p className='mb5 text-red-500 text-sm'>Este campo es requerido</p>
                        )}
                    </div>
                </div>
                <div className="w-full px-3 sm:w-1/3">
                    <div className="mb-5">
                        <label className="form-label">Documento de Identidad</label>
                        <div className="-mx-1 flex flex-wrap">
                            <div className="w-1/3 px-1">
                                <select
                                    className="form-control form-select"
                                    {...register('identificationType')}
                                >
                                    <option value="Cedula">Cédula</option>
                                    <option value="Pasaporte">Pasaporte</option>
                                </select>
                            </div>
                            <div className="w-2/3 px-1">
                                <input
                                    className="form-control"
                                    type="number"
                                    {...register('identification', { required: true, min: 0 })}
                                />
                                {errors.identification?.type === 'required' && (
                                    <p className='mb5 text-red-500 text-sm'>Este campo es requerido</p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="-mx-3 flex flex-wrap">
                <div className="w-full px-3 sm:w-1/3">
                    <div className="mb-5">
                        <label className="form-label">Número de contacto</label>
                        <input
                            className="form-control"
                            type="text"
                            {...register('phone', { required: true })}
                        />
                        {errors.phone?.type === 'required' && (
                            <p className='mb5 text-red-500 text-sm'>Este campo es requerido</p>
                        )}
                    </div>
                </div>
                <div className="w-full px-3 sm:w-1/3">
                    <div className="mb-5">
                        <label className="form-label">Correo Electrónico</label>
                        <input
                            className="form-control"
                            type="email"
                            {...register('email', { required: true, pattern: /^\S+@\S+$/i })}
                        />
                        {errors.email?.type === 'required' && (
                            <p className='mb5 text-red-500 text-sm'>Este campo es requerido</p>
                        )}
                    </div>
                </div>
                <div className="w-full px-3 sm:w-1/3">
                    <div className="mb-5">
                        <label className="form-label">Dirección</label>
                        <input
                            className="form-control"
                            type="text"
                            {...register('address')}
                        />
                    </div>
                </div>
            </div>

            <div className="-mx-3 flex flex-wrap">
                <div className="w-full px-3 sm:w-1/4">
                    <div className="mb-5">
                        <label className="form-label">Ciudad</label>
                        <input
                            className="form-control"
                            type="text"
                            {...register('city')}
                        />
                    </div>
                </div>
                <div className="w-full px-3 sm:w-1/4">
                    <div className="mb-5">
                        <label className="form-label">Estado (Dpto.)</label>
                        <input
                            className="form-control"
                            type="text"
                            {...register('state')}
                        />
                    </div>
                </div>
                <div className="w-full px-3 sm:w-1/4">
                    <label className="form-label">País</label>
                    <select
                        className="form-control form-select"
                        {...register('countryId')}
                    >
                        {countries.map(country => (
                            <option key={country.id} value={country.id}>
                                {country.name}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="w-full px-3 sm:w-1/4">
                    <div className="mb-5">
                        <label className="form-label">Usuario asignado</label>
                        {isAdmin && (
                            <select
                                className="form-control form-select"
                                {...register('userId')}
                            >
                                {users.map(user => (
                                    <option key={user.id} value={user.id}>
                                        {user.name}
                                    </option>
                                ))}
                            </select>
                        )}
                        {!isAdmin && (
                            <select
                                className="form-control form-select"
                                {...register('userId')}
                            >
                                <option value={currentUser.id}>
                                    {currentUser.name}
                                </option>
                            </select>
                        )}
                    </div>
                </div>
            </div>

            <div className="-mx-3 flex flex-wrap">
                <div className="w-full px-3 sm:w-1/2">
                    {clientId && <>
                        <label className="form-label">Tarjetas</label>
                        <div className="flex justify-start space-x-6">
                            <select className="form-control">
                                {cards.filter(card => card.clientId === client.id).map(card => (
                                    <option key={card.id}>
                                        {`${getCreditCardType(card.number)} ...${card.number.toString().substring(card.number.toString().length - 4)}`}
                                    </option>
                                ))}
                            </select>

                            <Link
                                className='btn-secondary'
                                href={`/card/new/?clientId=${clientId}`}
                            >
                                Agregar
                            </Link>
                        </div>
                    </>}
                </div>
                <div className="w-full px-3 sm:w-1/2">
                    <label className="form-label">Observaciones</label>
                    <textarea className="form-control" {...register('observations')} rows={1} />
                </div>
            </div>

            {errorMessage && <p className="text-red-500">{errorMessage}</p>}
            {successMessage && <p className="text-green-500">{successMessage}</p>}

            <div className="flex justify-between">
                <div>
                    <button className="btn-primary">{submitLabel}</button>
                </div>
                {clientId &&
                    <Link href={`/subscription/new?clientId=${clientId}`} className="btn-primary">
                        Agregar suscripción
                    </Link>
                }

            </div>
        </form>
    )
}
