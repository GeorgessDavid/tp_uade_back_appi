export const censoredNumbers = (numbers: string, limit: number): string => {
    let maskedNumber: string = '';

    for ( let i = 0; i < numbers.length; i++) {
        if (i < limit) {
            maskedNumber += '*';
        } else {
            maskedNumber += numbers[i];
        }
    }

    return maskedNumber;
}