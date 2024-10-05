export const periodLabel = (period: string | null) => {
    switch (period) {
        case null: return 'Mensual';
        case 'month': return 'Mensual';
        case 'annual': return 'Anual';
        default: return 'Mensual';
    }
}