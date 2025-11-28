import transporter from '../config/config';



const sendNewAppointmentNotification = async (name: string, to: string, appointmentDate: string, appointmentTime: string) => {
    const message = `
        <p>Hola, ${name}!</p>
        <p>Se ha programado una nueva cita para usted.</p>
        <ul>
            <li>Fecha: ${appointmentDate}</li>
            <li>Hora: ${appointmentTime}</li>
        </ul>
        <p>Su cita se encuentra en estado: <b style="color:blue;">Solicitado</b>.</p>
        <p>En los próximos días, recibirá una confirmación de su cita.</p>
        <p>Gracias por confiar en nosotros.</p>
    `

    transporter.sendMail({
        from: '"Dr. Martin Alejandro Suarez " <noreply@maralesuarez.com>',
        to,
        subject: 'Nueva cita programada',
        html: message
    },
    (err, info) => {
        if (err) {
            console.error('Error al enviar el correo electrónico:', err);
        } else {
            console.log('Correo electrónico enviado:', info.response);
        }
    });
}

export default sendNewAppointmentNotification;