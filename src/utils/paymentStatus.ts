interface Props {
    dateLastPay: Date | null;
    period: 'Mensual' | 'Trimestral' | 'Semestral' | 'Anual';
}

export const paymentStatus = ({ dateLastPay, period }: Props) => {
    const monthPerPeriod = {
        Mensual: 30,
        Trimestral: 90,
        Semestral: 180,
        Anual: 365,
    };

    if (dateLastPay === null) return 0;


    // Diferencia en milisegundos
    const diff_mill = new Date().getTime() - dateLastPay.getTime();

    //Diferencia en días
    const diff_day = (diff_mill) / (1000 * 60 * 60 * 24);

    //const status = Math.floor(diff_day) - monthPerPeriod[period] - 1;

    return Math.floor(diff_day) - monthPerPeriod[period] - 1;
}