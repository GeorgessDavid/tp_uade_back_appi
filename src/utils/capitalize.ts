/**
 * 
 * @param text = Texto a ser capitalizado
 * @returns {string} - Texto capitalizado
 * 
 * Example:
 * _capitalize('ciudad autónoma de buenos aires') → 'Ciudad Autónoma de Buenos Aires'_
 */

export const capitalize = (text: string) => {
    const prepositions: string[] = ['a', 'ante', 'bajo', 'cabe', 'con', 'contra', 'de', 'desde', 'durante', 'en', 'entre', 'hacia', 'hasta', 'mediante', 'para', 'por', 'según', 'sin', 'so', 'sobre', 'tras', 'versus', 'vía', 'los', 'las', 'les', 'del'];

    const words = text.split(' ');

    const capitalized = words.map(word => {
        if (prepositions.includes(word)) {
            return word;
        } else {
            return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
        }
    })

    return capitalized.join(' ');
}