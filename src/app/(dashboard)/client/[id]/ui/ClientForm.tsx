'use client';

import { useState } from 'react';
import { Client, ClientCard, Country, ClientCard as ClientWithCards, ClientNote, User, CreditCard } from '@/interfaces';
import clsx from 'clsx';
import { useForm } from 'react-hook-form';
import { useSession } from 'next-auth/react';
import { createUpdateClient } from '@/actions';
import Link from 'next/link';
import { getCreditCardType } from '@/utils';

interface Props {
    cards: CreditCard[];
    client: Partial<Client> & { ClientCard?: ClientCard[] } & { ClientNote?: ClientNote[] };
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
                <div className="w-full px-3 sm:w-1/3 mb-5">
                    <label className="form-label">Nombre</label>
                    <input
                        className={clsx(
                            "form-control", { "border-red-500": errors.name }
                        )}
                        type="text"
                        {...register('name')}
                    />
                </div>
                <div className="w-full px-3 sm:w-1/3 mb-5">
                    <label className="form-label">Apellido</label>
                    <input
                        className={clsx(
                            "form-control", { "border-red-500": errors.lastName }
                        )}
                        type="text"
                        {...register('lastName')}
                    />
                </div>
                <div className="w-full px-3 sm:w-1/3 mb-5">
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
                                {...register('identification', { min: 0 })}
                            />
                        </div>
                    </div>
                </div>
            </div>

            <div className="-mx-3 flex flex-wrap">
                <div className="w-full px-3 sm:w-1/3 mb-5">
                    <label className="form-label">Número de contacto</label>
                    <input
                        className="form-control"
                        type="text"
                        {...register('phone')}
                    />
                </div>
                <div className="w-full px-3 sm:w-1/3 mb-5">
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
                <div className="w-full px-3 sm:w-1/3 mb-5">
                    <label className="form-label">Dirección</label>
                    <input
                        className="form-control"
                        type="text"
                        {...register('address')}
                    />
                </div>
            </div>

            <div className="-mx-3 flex flex-wrap">
                <div className="w-full px-3 sm:w-1/4 mb-5">
                    <label className="form-label">Ciudad</label>
                    <input
                        className="form-control"
                        type="text"
                        {...register('city')}
                    />
                </div>
                <div className="w-full px-3 sm:w-1/4 mb-5">
                    <label className="form-label">Estado (Dpto.)</label>
                    <input
                        className="form-control"
                        type="text"
                        {...register('state')}
                    />
                </div>
                <div className="w-full px-3 sm:w-1/4 mb-5">
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
                <div className="w-full px-3 sm:w-1/4 mb-5">
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

            <div className="-mx-3 flex flex-wrap">
                <div className="w-full px-3 sm:w-1/2 mb-5">
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
                {clientId && (
                    <div className="w-full px-3 sm:w-1/2 mb-5">
                        <label className="form-label">Notas</label>
                        <div className="flex justify-start space-x-6">
                            {client.ClientNote && (
                                <span className="form-control">
                                    {
                                        client.ClientNote!.at(-1)!.note.length > 33
                                            ? `${client.ClientNote!.at(-1)!.note.substring(0, 33)}...`
                                            : client.ClientNote!.at(-1)!.note
                                    }
                                </span>
                            )}
                            <Link
                                className='btn-secondary'
                                href={`/client/${clientId}/notes`}
                            >
                                Editar
                            </Link>
                        </div>
                    </div>
                )}
            </div>

            {errorMessage && <p className="text-red-500">{errorMessage}</p>}
            {successMessage && <p className="text-green-500">{successMessage}</p>}

            <div className="flex justify-between">
                <div>
                    <button className="btn-primary">{submitLabel}</button>
                </div>
                {clientId && (
                    <Link href={`/subscription/new?clientId=${clientId}`} className="btn-primary">
                        Agregar suscripción
                    </Link>
                )}
            </div>
        </form>
    )
}