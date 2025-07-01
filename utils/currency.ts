export const formatCurrency = (value: number, locale: string = "en-US") => {
    return value.toLocaleString('en-US') + ' VND';
}