'use client';

import { useState } from 'react';
import { Client, CreditCard } from '@/interfaces';
import clsx from 'clsx';
import { Controller, useForm, useWatch } from 'react-hook-form';
import { IoEyeOffOutline, IoEyeOutline } from 'react-icons/io5';
import Select from 'react-select';
import { createUpdateCard } from '@/actions';
import { getCreditCardType } from '@/utils';
import { useSearchParams } from 'next/navigation';

interface Props {
    card: Partial<CreditCard>;
    clients: Client[];
}

interface FormInputs {
    number: bigint;
    expiration: string;
    clientId: { label: string; value: string; };
    cvv: number;
}

export const CreditCardForm = ({ card, clients }: Props) => {

    var defaultClient;

    const searchParams = useSearchParams();
    const clientId = searchParams.get('clientId');

    if (clientId !== null) {
        defaultClient = clients.filter(c => c.id === clientId)[0];
      } else {
        if (Object.keys(card).length === 0) {
          defaultClient = clients[0];
        } else {
          defaultClient = clients.filter(c => c.id === card.clientId)[0];
        }
      }

    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    const [showCvv, setShowCvv] = useState(false);

    //const defaultClient = clients.filter(c => c.id === clientId)[0];
    //const defaultClient = clients.filter(c => c.id === card.clientId)[0];


    const { control, register, handleSubmit, formState: { errors } } = useForm<FormInputs>({
        defaultValues: /* clientId === null ? {} : */ {
        //defaultValues: Object.keys(card).length === 0 ? {} : {
            ...card,
            expiration: card.expiration?.toISOString().split('T')[0],
            clientId: {
                value: defaultClient.id,
                label: `${defaultClient.email} - (${defaultClient.name} ${defaultClient.lastName})`,
            }
        }
    });

    const onSubmit = async (data: FormInputs) => {

        setErrorMessage('');
        setSuccessMessage('');

        const cardData = {
            ...data,
            id: card.id ?? '',
            expiration: new Date(data.expiration),
            clientId: data.clientId.value,
        }

        const { ok, message } = await createUpdateCard(cardData);

        if (!ok) {
            setErrorMessage(message);
            return;
        }

        setSuccessMessage(message);
    }

    const cardNumber = useWatch({ control, name: "number" });

    const submitLabel = card.id ? 'Actualizar' : 'Guardar';

    return (
        <form className="flex flex-col" onSubmit={handleSubmit(onSubmit)}>
            <div className="mb-5">
                <label className="form-label">Cliente</label>
                <Controller
                    name="clientId"
                    control={control}
                    render={({ field }) => (<Select
                        styles={{
                            control: (baseStyles) => ({
                                ...baseStyles,
                                borderColor: 'rgb(224 224 224)',
                                paddingTop: '0.4rem',
                                paddingBottom: '0.4rem',
                                borderRadius: '0.375rem',
                            }),
                        }}
                        {...field}
                        options={clients.map(c => ({
                            value: c.id,
                            label: `${c.email} - (${c.name} ${c.lastName})`,
                        }))}
                    />)}
                />
            </div>
            <div className="pb-5 relative">
                <label className="form-label">Número</label>
                <input
                    className={clsx(
                        "form-control text-right", { "border-red-500": errors.number }
                    )}
                    type="text"
                    {...register('number', { required: true, minLength: 16, maxLength: 16 })}
                />
                <span className="absolute left-1 p-3">{getCreditCardType(cardNumber)}</span>
            </div>
            <div className="-mx-3 flex flex-wrap">
                <div className="w-full px-3 sm:w-1/2">
                    <div className="pb-5">
                        <label className="form-label">Vencimiento</label>
                        <input className="form-control" type="date" {...register('expiration')} />

                    </div>
                </div>
                <div className="w-full px-3 sm:w-1/2">
                    <div className="pb-5">
                        <label className="form-label">CVV</label>
                        <div className="relative">
                            <input
                                className={clsx(
                                    "form-control", { "border-red-500": errors.cvv }
                                )}
                                type={showCvv ? "text" : "password"}
                                {...register('cvv', { required: true, minLength: 3, maxLength: 4 })}
                            />
                            <span className="absolute right-1 p-3 cursor-pointer" onClick={() => setShowCvv(!showCvv)}>
                                {!showCvv && <IoEyeOffOutline size={20} />}
                                {showCvv && <IoEyeOutline size={20} />}
                            </span>
                        </div>

                    </div>
                </div>
            </div>


            {errorMessage && (<p className="text-red-500">{errorMessage}</p>)}
            {successMessage && (<p className="text-green-500">{successMessage}</p>)}
            <div className="flex flex-wrap">
                <button className="btn-primary">{submitLabel}</button>
            </div>
        </form>
    )
}
