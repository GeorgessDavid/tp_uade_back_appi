export const onlyWords = (text: string) => {
    const regex = /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s\'\-]+$/

    if(!regex.test(text)) {
        return false;
    }

    return true;
}