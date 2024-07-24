export interface CreditCard {
    id: string;
    number: bigint;
    expiration: Date;
    cvv: number;
    clientId: string;
}