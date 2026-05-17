import { Resend } from 'resend';
import { NextResponse } from 'next/server';

export const runtime = 'edge';

export async function POST(req: Request) {
  const resend = new Resend(process.env.RESEND_API_KEY);
  try {
    const { form, message } = await req.json();

    const { data, error } = await resend.emails.send({
      from: 'Booking System <onboarding@resend.dev>', // Se hai validato il dominio usa: info@tuodominio.it
      to: [process.env.PERSONAL_EMAIL as string],
      subject: `Nuova Prenotazione: ${form.name} ${form.surname}`,
      html: `
        <div style="font-family: sans-serif; line-height: 1.6; color: #333;">
          <h2 style="color: #0A1628; border-bottom: 1px solid #eee; padding-bottom: 10px;">Nuova Richiesta di Prenotazione</h2>
          <p>Hai ricevuto una nuova richiesta dal sito web:</p>
          
          <table style="width: 100%; border-collapse: collapse;">
            <tr><td style="padding: 8px 0;"><strong>Pacchetto:</strong></td><td>${form.packageName}</td></tr>
            <tr><td style="padding: 8px 0;"><strong>Modalità:</strong></td><td>${form.mode === 'private' ? 'Privata' : 'Condivisa'}</td></tr>
            <tr><td style="padding: 8px 0;"><strong>Data e Ora:</strong></td><td>${form.date} ore ${form.time}</td></tr>
            <tr><td style="padding: 8px 0;"><strong>Ospiti:</strong></td><td>${form.guests}</td></tr>
          </table>

          <h3 style="margin-top: 20px; color: #C9A96E;">Dati Cliente</h3>
          <p>
            <strong>Nome:</strong> ${form.name} ${form.surname}<br>
            <strong>Email:</strong> ${form.email}<br>
            <strong>Telefono:</strong> ${form.phone}
          </p>
          
          <p style="background: #f9f9f9; padding: 15px; border-left: 4px solid #C9A96E;">
            <strong>Note:</strong><br>${form.notes || 'Nessuna nota aggiuntiva'}
          </p>
        </div>
      `,
    });

    if (error) {
      return NextResponse.json({ error }, { status: 400 });
    }

    return NextResponse.json({ success: true, data });
  } catch (err) {
    return NextResponse.json({ error: 'Errore interno' }, { status: 500 });
  }
}