interface Props {
    dateLastPay: Date | null;
    period: 'Mensual' | 'Trimestral' | 'Semestral' | 'Anual';
}

export const paymentStatus = ({ dateLastPay, period }: Props) => {
    const monthPerPeriod = {
        Mensual: 1,
        Trimestral: 3,
        Semestral: 6,
        Anual: 12,
    };

    if (dateLastPay === null) return null;

    //const diff = dateLastPay.getDate() - new Date().getDate() + 1;

    const diff = Math.round(new Date().getTime() - dateLastPay.getTime()) / (1000 * 60 * 60 * 24);

    const paymentMonth = diff % monthPerPeriod[period];

    //const status = ((paymentMonth !== 0) || diff > 31) ? 0 : diff
    const status = Math.ceil(diff);

    return status;
}