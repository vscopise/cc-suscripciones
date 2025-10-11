export const getCreditCardType = (cardNumber:string) => {

    if (!cardNumber) return '';
    
    switch(true) {
        case /^4[0-9]{6,}$/.test(cardNumber.toString()):
            return 'VISA';
            break;
        case /^5[1-5][0-9]{5,}|222[1-9][0-9]{3,}|22[3-9][0-9]{4,}|2[3-6][0-9]{5,}|27[01][0-9]{4,}|2720[0-9]{3,}$/.test(cardNumber.toString()):
            return 'MASTERCARD';
            break;
        case /^3[47][0-9]{5,}$/.test(cardNumber.toString()):
            return 'AMERICAN EXPRESS';
            break;
        case /^3(?:0[0-5]|[68][0-9])[0-9]{4,}$/.test(cardNumber.toString()):
            return 'DINERS CLUB';
            break;
        case /^6(?:011|5[0-9]{2})[0-9]{3,}$/.test(cardNumber.toString()):
            return 'DISCOVER';
            break;
        case /^(?:2131|1800|35[0-9]{3})[0-9]{3,}$/.test(cardNumber.toString()):
            return 'JCB';
            break;
        default:
            return '';
            break;
    }
}