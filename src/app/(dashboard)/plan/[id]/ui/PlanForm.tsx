'use client';

import { Plan } from '@/interfaces';
import clsx from 'clsx';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { createUpdatePlan } from '@/actions';

interface Props {
  plan: Partial<Plan>;
}

interface FormInputs {
  name: string;
  description: string;
}

export const PlanForm = ({ plan }: Props) => {

  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const { handleSubmit, register, setFocus, formState: { errors } } = useForm<FormInputs>({
    defaultValues: { ...plan }
  });

  const onSubmit = async (data: FormInputs) => {
    setErrorMessage('');
    setSuccessMessage('');
    const planData = {
      id: plan.id ?? '',
      ...data
    }

    const { ok, message } = await createUpdatePlan(planData);

    if (!ok) {
      setErrorMessage(message);
      return;
    }

    setSuccessMessage(message);

    if (plan) {
      setFocus('name');
    }
  }

  const resetMessage = () => {
    setSuccessMessage('');
    setErrorMessage('');
  }

  const submitLabel = plan.id ? 'Actualizar' : 'Guardar';

  return (
    <form className="flex flex-col" onSubmit={handleSubmit(onSubmit)} onChange={resetMessage}>
      <div className="pb-5">
        <label className="form-label">Nombre</label>
        <input
          className={clsx(
            "form-control", { "border-red-500": errors.name }
          )}
          type="text"
          {...register('name', { required: true })}
        />
      </div>
      <div className="pb-5">
        <label className="form-label">Descripción</label>
        <input
          className={clsx(
            "form-control", { "border-red-500": errors.description }
          )}
          type="text"
          {...register('description', { required: true })}
        />
      </div>
      {errorMessage && <p className="text-red-500">{errorMessage}</p>}
      {successMessage && <p className="text-green-500">{successMessage}</p>}
      <button className="btn-primary">{submitLabel}</button>
    </form>
  )
}
