// Se agrega el @ts-ignore para evitar errores de tipado por no encontrar el módulo. 
// Nodemailer no es compatible con plataformas serverless como Vercel, por lo que se recomienda migrar a Resend o usarlo en otro servidor.
// @ts-ignore
import transporter  from '../config/nodemailer.config';

export const sendWelcomeEmail = (email: string, name: string) => {
    const message = `
        <p style="font-family: 'Nunito', sans-serif">Hola <strong><em>${name}!</em></strong>
        <br>
        <br>
        Te damos la bienvenida a los <span style="color: #005725; font-weight: bold;">Consultorios Médicos David.</span>
        <br>
        <br>
        Para ingresar al sistema deberás utilizar la dirección del correo electrónico al cual recibiste este mensaje.
        <br>
        <br>
        <strong> Sólo por primera vez </strong> deberás ingresar con la dirección de tu correo electrónico como contraseña.
        <br>
        <br>
        <em>Por ejemplo: </em>
        <br>
        <br>
        Correo Electrónico: <em>${email}</em>
        <br>
        Contraseña: <em>${email}</em>
        <br>
        <br>
        <strong>Recuerda cambiar tu contraseña por una más segura una vez que hayas ingresado al sistema.</strong>
        <br>
        <br>
        Si necesitas más información sobre cómo utilizar el sistema, puedes hacer click <a href="https://guide.consultoriosmedicosdavid.com.ar/">aquí</a>. Deberás iniciar sesión con tu correo electrónico y tu contraseña.
        <br>
        Te deseamos muchos éxitos trabajando con nosotros.
        <br>
        Atte: Administración de Consultorios Médicos David.

    `

    transporter.sendMail({
        from: 'Consultorios Médicos David',
        to: email,
        subject: 'NO-RESPONDER: Bienvenido/a a Consultorios Médicos David',
        html: message
    }, (err, info): void =>  {
        if (err) {
            console.log(err);
        }else{
            console.log(info);
        }
    })
}

export const sendPasswordChangedEmail = (email: string, name: string) => {
    const message = `
        <p style="font-family: 'Nunito', sans-serif">Hola <strong><em>${name}!</em></strong>
        <br>
        <br>
        Te informamos que tu contraseña ha sido cambiada exitosamente.
        <br>
        <br>
        Si no has sido tú, por favor contacta al administrador del sistema.
        <br>
        <br>
        Atte: Administración de Consultorios Médicos David.
    `

    transporter.sendMail({
        from: 'Consultorios Médicos David',
        to: email,
        subject: 'NO-RESPONDER: Contraseña cambiada exitosamente',
        html: message
    }, (err, info): void =>  {
        if (err) {
            console.log(err);
        }else{
            console.log(info);
        }
    })
}

export const sendPasswordResetEmail = (email: string, name: string, token: string, host:string) => {
    const message = `
        <p style="font-family: 'Nunito', sans-serif">Hola <strong><em>${name}!</em></strong>
        <br>
        <br>
        Hemos recibido una solicitud para cambiar tu contraseña.
        <br>
        <br>
        Si no has sido tú, por favor ignora este mensaje.
        <br>
        <br>
        Para cambiar tu contraseña, haz click en el siguiente enlace:
        <br>
        <br>
        <a href="${host}/resetPassword/${token}">Cambiar contraseña</a>
        <br>
        <br>
        Atte: Administración de Consultorios Médicos David.
    `

    transporter.sendMail({
        from: 'Consultorios Médicos David',
        to: email,
        subject: 'NO-RESPONDER: Cambio de contraseña',
        html: message
    }, (err, info): void =>  {
        if (err) {
            console.log(err);
        }else{
            console.log(info);
        }
    })
}