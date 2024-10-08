'use client';

import { useState } from 'react';
import { Client, CreditCard, Plan, Subscription } from '@/interfaces';
import { Controller, useForm, useWatch } from 'react-hook-form';
import Select from 'react-select';
import { createUpdateSubscription } from '@/actions';
import { getCreditCardType } from '@/utils';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

interface Props {
  plans: Plan[];
  clients: Client[];
  cards: CreditCard[];
  subscription: Partial<Subscription>;
}

interface FormInputs {
  active: boolean;
  amount: number;
  clientId: { label: string; value: string; };
  comment: string | null;
  creditCardId: string | null;
  dateStart: string;
  dateLastPay: string;
  delivery: string | null;
  paymentMethod: 'MercadoPago' | 'FirstData' | 'Visa' | 'Stripe' | 'Multipago' | 'CobroYa' | 'TransferenciaBancaria' | 'AbitabNet' | 'Efectivo';
  period: 'Mensual' | 'Trimestral' | 'Semestral' | 'Anual';
  planId: string;
}

const periods = ['Mensual', 'Trimestral', 'Semestral', 'Anual'];

const paymentMethods = [
  { label: 'Mercado Pago', value: 'MercadoPago' },
  { label: 'First Data', value: 'FirstData' },
  { label: 'Visa', value: 'Visa' },
  { label: 'Stripe', value: 'Stripe' },
  { label: 'Multipago', value: 'Multipago' },
  { label: 'Cobro Ya', value: 'CobroYa' },
  { label: 'Transferencia Bancaria', value: 'TransferenciaBancaria' },
  { label: 'Abitab Net', value: 'AbitabNet' },
];

export const SubscriptionForm = ({ plans, clients, subscription, cards }: Props) => {

  var defaultClient;

  const searchParams = useSearchParams();
  //const clientId = searchParams.get('clientId');

  if (searchParams.get('clientId') !== null) {
    defaultClient = clients.filter(
      c => c.id === searchParams.get('clientId')
    )[0];
  } else {
    if (Object.keys(subscription).length === 0) {
      defaultClient = clients[0];
    } else {
      defaultClient = clients.filter(c => c.id === subscription.clientId)[0];
    }
  }

  //const [clientId, setClientId] = useState(defaultClient.id);

  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');


  const { control, register, handleSubmit, reset } = useForm<FormInputs>({
    defaultValues: {
      ...subscription,
      dateStart: subscription.dateStart?.toISOString().split('T')[0],
      dateLastPay: subscription.dateLastPay?.toISOString().split('T')[0],
      clientId: {
        value: defaultClient.id,
        label: `${defaultClient.email} - (${defaultClient.name} ${defaultClient.lastName})`,
      },
    }
  });

  const onSubmit = async (data: FormInputs) => {

    setErrorMessage('');
    setSuccessMessage('');

    const subscriptionData = {
      ...data,
      id: subscription.id ?? '',
      dateDeactivation: null,
      dateStart: new Date(data.dateStart),
      dateLastPay: new Date(data.dateLastPay),
      clientId: data.clientId.value,
      creditCardId: data.creditCardId ?? null,
    }

    const { ok, message } = await createUpdateSubscription(subscriptionData);

    if (!ok) {
      setErrorMessage(message);
      return;
    }

    setSuccessMessage(message);

    //setClientId(data.clientId.value);

    /* if (subscription) {

      reset({
        clientId: undefined,
        dateStart: '',
        amount: 0,
      })
    } */
  }

  const client = useWatch({ control, name: "clientId" });
  //console.log({ client })

  const clientCards = client ? cards.filter(card => card.clientId === client.value) : [];

  const submitLabel = subscription.id ? 'Actualizar' : 'Guardar';

  return (
    <form className="flex flex-col" onSubmit={handleSubmit(onSubmit)}>
      <div className="-mx-3 flex flex-wrap">
        <div className="w-full px-3 sm:w-1/2">
          <div className="mb-5">
            <label className="form-label">Cliente</label>
            <Controller
              name="clientId"
              control={control}
              render={({ field }) => <Select

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
              />}
            />
          </div>
        </div>
        <div className="w-full px-3 sm:w-1/4">
          <div className="mb-5">
            <label className="form-label">Inicio de la suscripción</label>
            <input className="form-control" type="date" {...register('dateStart')} />
          </div>
        </div>
        <div className="w-full px-3 sm:w-1/4">
          <div className="mb-5">
            <label className="form-label">Fecha último pago</label>
            <input className="form-control" type="date" {...register('dateLastPay')} />
          </div>
        </div>
      </div>

      <div className="-mx-3 flex flex-wrap">
        <div className="w-full px-3 sm:w-1/5">
          <div className="mb-5">
            <label className="form-label">Plan</label>
            <select className="form-control form-select" {...register('planId')}>
              {plans.map(plan => (
                <option key={plan.id} value={plan.id}>
                  {plan.name}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="w-full px-3 sm:w-1/5">
          <div className="mb-5">
            <label className="form-label">Monto</label>
            <input className="form-control" type="number" {...register('amount', { required: true, min: 0 })} />
          </div>
        </div>
        <div className="w-full px-3 sm:w-1/5">
          <div className="mb-5">
            <label className="form-label">Método de Pago</label>
            <select className="form-control" {...register('paymentMethod')}>
              {paymentMethods.map(paymentMethod => (
                <option key={paymentMethod.value} value={paymentMethod.value}>{paymentMethod.label}</option>
              ))}
            </select>
          </div>
        </div>
        <div className="w-full px-3 sm:w-1/5">
          <div className="mb-5">
            <label className="form-label">Período de cobro</label>
            <select className="form-control form-select" {...register('period')}>
              {periods.map(period => (
                <option key={period} value={period}>{period}</option>
              ))}
            </select>
          </div>

        </div>
        <div className="w-full px-3 sm:w-1/5">
          <div className="mb-5">
            <label className="form-label">Repartidor</label>
            <input className="form-control" type="text" {...register('delivery')} />
          </div>
        </div>
      </div>

      <div className="-mx-3 flex flex-wrap">
        <div className="w-full px-3 sm:w-1/2">
          <label className="form-label">Tarjetas</label>
          <div className="flex justify-start space-x-6">
            {clientCards.length > 0 && (
              <select className="form-control" {...register('creditCardId')}>
                <option>Seleccione una tarjeta</option>
                {clientCards.map(card => (
                  <option key={card.id} value={card.id}>
                    {`${getCreditCardType(card.number)} ...${card.number.toString().substring(card.number.toString().length - 4)}`}
                  </option>
                ))}
              </select>
            )}
            {client &&
              <Link
                className='btn-secondary'
                href={`/card/new/?clientId=${client.value}`}
              >
                Agregar
              </Link>
            }
          </div>
        </div>
        <div className="w-full px-3 sm:w-1/2">
          <label className="form-label">Comentarios</label>
          <input className="form-control" type="text" {...register('comment')} />
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