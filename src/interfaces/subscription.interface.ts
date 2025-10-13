export interface Subscription {
    active: boolean;
    amount: number;
    clientId: string;
    comment: string | null;
    dateDeactivation: Date | null;
    dateLastPay: Date | null;
    dateStart: Date;
    delivery: string | null;
    id: string;
    // paymentMethod: 'MercadoPago' | 'FirstData' | 'Visa' | 'Stripe' | 'Multipago' | 'CobroYa' | 'TransferenciaBancaria' | 'AbitabNet' | 'Efectivo',
    paymentMethod:  'AbitabNet' |
    'Brou' |
    'BrouDebito' |
    'CobroYa' |
    'Efectivo' |
    'Factura' |
    'FirstData' |
    'Gentileza' |
    'MercadoPago' |
    'Multipagos' |
    'Passcard' |
    'PaypalWesternUnion' |
    'Stripe' |
    'StripeMercadoPago' |
    'TransferenciaBancaria' |
    'Visa';
    period: 'Mensual' | 'Trimestral' | 'Semestral' | 'Anual';
    planId: string;
    creditCardId: string | null;
}