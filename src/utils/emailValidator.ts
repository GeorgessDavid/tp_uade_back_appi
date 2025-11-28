/**
 * Verifica que sea un email válido, sin tildes ni caracteres especiales.
 */
export const emailValidator = (email: string): boolean => {
    const regex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    if (!regex.test(email)) {
        return false;
    }

    return true;
}