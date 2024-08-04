import { changeSubscriptionStatus } from '@/actions';
import { ConfirmDialog } from '@/components';
import { Subscription } from '@/interfaces';
import clsx from 'clsx';
import { useState } from 'react';
import { IoAlertCircle, IoCheckmarkCircleOutline } from 'react-icons/io5';

interface Props {
    subscription: Subscription;
}
export const SubscriptionStatus = ({ subscription }: Props) => {

    const [confirmDeactivate, setConfirmDeactivate] = useState(false);

    const handleChangeStatus = (id: string, value: boolean) => {
        changeSubscriptionStatus(id, value);
    }

    return (
        <td className={clsx(
            "text-sm text-gray-900 font-light px-6 grid place-items-center cursor-pointer",
            { "py-4": subscription.active },
        )}>
            {!subscription.active &&
                <>
                    <IoAlertCircle
                        size={30} className="text-red-500"
                        onClick={() => handleChangeStatus(subscription.id, subscription.active)}
                    />
                    <span
                        className="text-xs py-1"
                        onClick={() => handleChangeStatus(subscription.id, subscription.active)}
                    >
                        {subscription.dateDeactivation?.toLocaleDateString('es-ES', {
                            day: 'numeric',
                            month: 'long',
                            year: 'numeric'
                        })}
                    </span>
                </>
            }
            {subscription.active &&
                <>
                    <IoCheckmarkCircleOutline
                        size={30} className="text-green-500"
                        onClick={() => setConfirmDeactivate(true)}
                    />
                    <ConfirmDialog
                        title="Desactivar suscripción"
                        open={confirmDeactivate}
                        onClose={() => setConfirmDeactivate(false)}
                        onConfirm={() => handleChangeStatus(subscription.id, subscription.active)}
                    >
                        ¿Está seguro que quiere desactivar esta Suscripción?
                    </ConfirmDialog>
                </>
            }
        </td>
    )
}
