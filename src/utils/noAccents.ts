/**
 * Verifica que el string no tenga acentos ni caracteres especiales.
 */
export const noAccents = (str: string): boolean => {
    const regex = /^[a-zA-Z0-9\s]*$/;
    if (!regex.test(str)) {
        return false;
    }

    return true;
}