/**
 * Formats a number into a specified currency format.
 * 
 * @param amount - The number to format.
 * @param currency - The currency code, e.g., "MXN" for Mexican Peso.
 * @param locale - The locale, e.g., "es-MX" for Spanish (Mexico). Default is "en-US".
 * @returns The formatted currency string.
 */
export function formatCurrency(amount: number, currency: string = "MXN", locale: string = "es-MX"): string {
    return new Intl.NumberFormat(locale, {
        style: "currency",
        currency,
    }).format(amount);
}

