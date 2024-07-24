import { changeSubscriptionStatus } from '@/actions';
import { ConfirmDialog } from '@/components';
import { Subscription } from '@/interfaces';
import { useState } from 'react';
import { IoAlertCircle, IoCheckmarkCircleOutline } from 'react-icons/io5';

interface Props {
    subscription: Subscription;
}
export const SubscriptionsTableItem = ({ subscription }: Props) => {

    const [confirmDeactivate, setConfirmDeactivate] = useState(false);

    const handleChangeStatus = (id: string, value: boolean) => {
        changeSubscriptionStatus(id, value);
    }

    return (
        <>
            {!subscription.active &&
                <>
                    <IoAlertCircle
                        size={30} className="text-red-500"
                        onClick={() => handleChangeStatus(subscription.id, subscription.active)}
                    />
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
        </>
    )
}
