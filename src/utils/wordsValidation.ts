function normalizeText(text: string): string {
    return text
        .toLowerCase()
        .trim()
        .replace(/[^a-z]/g, '')       // Eliminar números y caracteres especiales
        .replace(/(.)\1+/g, '$1');    // Reducir secuencias de letras repetidas (aa → a)
}

function replaceNumbersWithLetters(text: string): string {
    const numberMap: { [key: string]: string } = {
        '0': 'o', '1': 'i', '3': 'e', '4': 'a', '5': 's', '7': 't'
    };

    return text.replace(/[013457]/g, match => numberMap[match] || match);
}


export const wordValidation = (email: string): boolean => {
    // Palabras bloqueadas
    const blockedWords = new Set([
        "notiene", "nousa", "noemail", "sinemail", "noexiste", "nodisponible",
        "unknown", "empty", "none", "null", "fakemail", "false", "test", "prueba",
        "correo", "nosabe", "nolotiene", "nolousa", "nohay", "sincorreo", "noenviar",
        "nondisponible", "noposeo", "desconocido", "default", "xyz", "asdf", "qwerty",
        "1234", "testmail", "no@tiene", "no-mail", "sin.mail", "notine", "notengocoreo", "notienemail",
        "nohaycorreo", "nohayemail", "nohaymail", "nohaycorreoelectronico", "notienecorreo", "notieneemail",
        "notienemail", "nousamail", "nousacorreo", "nousaemail", "nousacorreoelectronico", "nousacorreoe",
        "tieneperonolousa", "tieneperonotienetiempo", "tieneperonotienecorreo", "tieneperonotienemail",
        "adwdawdawd", "abcdefgh", "qwertyuiop", "asdfghjkl", "zxcvbnm", "qwerty123", "password", "contraseña",
        "123456", "123456789", "12345678", "1234567", "1234567890", "0987654321", "87654321", "987654321", "notienehotmailcom",
        "notienegmailcom", "notieneoutlookcom", "notieneyahoocom", "notienelivecom", "notieneicloudcom", "notienelivecomar",
        "notienespeedycomar", "notienearnetcomar", "notienehotmailcomar", "notieneyahoocomar", "notieneoutlookes", "notieneicloudcomar",
        "nousahotmailcom", "nousagmailcom", "nousaoutlookcom", "nousayahoocom", "nousalivecom", "nousaicloudcom", "nousalivecomar",
        "nousaspeedycomar", "nousaarnetcomar", "nousahotmailcomar", "nousayahoocomar", "nousaoutlookes", "nousaicloudcomar", "nousa123",
        "notienenotienecom", "notienenotienecomo", "notienenotienecorreo", "notienenotienemail", "notienenotienecorreoelectronico",
        "nousanotienecom", "nousanotienecomo", "nousanotienecorreo", "nousanotienemail", "nousanotienecorreoelectronico",
        "notienenotiene", "notienenotienenotiene", "nousanousa", "nousanousanousa", "nousanousanousanousa", "nousanousanousanousanousa",
        "norecuerda", "norecuerdanorecuerda", "norecuerdanorecuerdanorecuerda", "norecuerdanorecuerdanorecuerdanorecuerda",
        "noseacuerda", "noseacuerdanoseacuerda", "noseacuerdanoseacuerdanoseacuerda","nolorecuerda", "nolorecuerdanolorecuerda",
        "nolorecuerdanolorecuerdanolorecuerda", "nolorecuerdanolorecuerdanolorecuerdanolorecuerda", "nolosabe", "nolosabenolosabe",
        "nolosabenolosabenolosabe", "nolosabenolosabenolosabenolosabe", "noloentiende", "noloentiendenoloentiende"
    ]);

    // Validación del dominio
    const validDomains = new Set([
        "gmail.com", "hotmail.com", "outlook.com", "yahoo.com",
        "live.com", "icloud.com", "live.com.ar", "speedy.com.ar",
        "arnet.com.ar", "hotmail.com.ar", "yahoo.com.ar", "outlook.es", "icloud.com.ar"
    ]);


    let domain = email.split('@')[1];
    if (!validDomains.has(domain)) return false;

    // Extraer el nombre de usuario antes de la @
    let purifiedMail = email.split('@')[0];

    // Normalizar el texto
    let normalizedMail = normalizeText(purifiedMail);

    // Si el email normalizado está en la lista de bloqueados, rechazarlo
    if (blockedWords.has(normalizedMail)) return false;

    // Si el email solo tiene un carácter, rechazarlo
    if (normalizedMail.length <= 1) return false;

    // Si el email es solo números, rechazarlo
    if (/^\d+$/.test(purifiedMail)) return false;

    // Si al eliminar los números queda una palabra bloqueada, rechazarlo
    let withoutNumbers = replaceNumbersWithLetters(purifiedMail);
    if (blockedWords.has(withoutNumbers)) return false;

    return true;
};
