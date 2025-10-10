export interface CreditCard {
    id: string;
    number: string;
    expiration: string;
    cvv: string | null;
    clientId: string;
}