import nodemailer from 'nodemailer';
import * as dotenv from 'dotenv';

dotenv.config();

let user: string = process.env.NODEMAILER_USER!;
let pass: string = process.env.NODEMAILER_PASS!;

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user,
        pass
    }
})

export default transporter;