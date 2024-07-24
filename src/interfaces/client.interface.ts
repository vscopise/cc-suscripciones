import { Subscription } from './subscription.interface';

export interface Client {
    id: string;
    name: string;
    lastName: string;
    identification: number;
    identificationType: 'Cedula' | 'Pasaporte';
    phone: string;
    email: string;
    address: string;
    city: string;
    state: string;
    countryId: string;
    userId: string;
    observations: string;
}

export interface ClientCard {
    id: string;
    number: bigint;
    expiration: Date;
    cvv: number;
    clientId: string;
}
