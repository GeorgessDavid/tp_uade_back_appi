import transporter from '../config/config';

const notifyAppointmentConfirmed = async (name: string, to: string, appointmentDate: string, appointmentTime: string, professionalName: string) => {
    const mailOptions = {
        from: '"Dr. Martin Alejandro Suarez " <noreply@maralesuarez.com>',
        to,
        subject: 'Confirmación de cita médica',
        html: `
            <h1>Su cita médica ha sido confirmada</h1>
            <p>Estimado/a ${name},</p>
            <p>Nos complace informarle que su cita médica ha sido confirmada con el Dr. ${professionalName}.</p>
            <p><strong>Fecha:</strong> ${appointmentDate}</p>
            <p><strong>Hora:</strong> ${appointmentTime}</p>
            <p>Por favor, asegúrese de llegar 10 minutos antes de la hora programada.</p>
            <p>Si tiene alguna pregunta o necesita reprogramar, no dude en contactarnos.</p>
            <br>
            <p>Atentamente,</p>
            <p>Consultorio Médico Dr. Martin Alejandro Suarez</p>
        `
    };
  
    try {
        await transporter.sendMail(mailOptions);
        console.log(`Correo de confirmación enviado a ${to}`);
    } catch (error) {
        console.error(`Error al enviar el correo a ${to}:`, error);
    }
}; 

export default notifyAppointmentConfirmed;