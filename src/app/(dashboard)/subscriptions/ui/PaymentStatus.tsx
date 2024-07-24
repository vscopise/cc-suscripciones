import { paymentStatus } from '@/utils';
import clsx from 'clsx';

interface Props {
  dateLastPay: Date | null;
  period: 'Mensual' | 'Trimestral' | 'Semestral' | 'Anual';
}

export const PaymentStatus = ({ dateLastPay, period }: Props) => {

  const status = paymentStatus({ dateLastPay, period });

  return (
    <div className="flex justify-center gap-4">
      {status}
      {status != null &&
        <span
          className={clsx(
            "relative flex h-3 w-3",
            { "hidden": (status < -1) }
          )}
        >
          <span
            className={clsx(
              "animate-ping absolute inline-flex h-full w-full rounded-full opacity-75",
              { "bg-green-400": -1 <= status && status <= 15 },
              { "bg-yellow-400": 15 < status && status <= 25 },
              { "bg-red-600": 25 < status && status <= 30 },
            )}
          />
          <span
            className={clsx(
              "relative inline-flex rounded-full h-3 w-3",
              { "bg-green-400": -1 <= status && status <= 15 },
              { "bg-yellow-400": 15 <= status && status <= 25 },
              { "bg-red-600": 25 < status && status <= 30 },
            )}
          />
        </span>}
    </div>
  )
}
