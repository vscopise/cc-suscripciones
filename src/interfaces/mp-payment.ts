export interface MP_Payment {
    id: number;
    date_created: string;
    date_approved: string;
    date_last_updated: string;
    money_release_date: string;
    payment_method_id: string;
    payment_type_id: string;
    status: string;
    status_detail: string;
    currency_id: string;
    description: string;
    collector_id: number;
    payer: {
        id: number;
        email: string;
        identification: {
            type: string;
            number: number
        };
        type: string
    };
    metadata: {};
    additional_info: {};
    external_reference: string;
    transaction_amount: number;
    transaction_amount_refunded: number;
    coupon_amount: number;
    transaction_details: {
        net_received_amount: number;
        total_paid_amount: number;
        overpaid_amount: number;
        installment_amount: number;
    };
    installments: number;
    card: {};
}