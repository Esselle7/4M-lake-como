// ─────────────────────────────────────────────────────────────────────────────
// /api/send-bellagio — email quote request for the Bellagio fireworks package.
// BELLAGIO EVENT (remove after 2026-06-27) — also remove this file.
// ─────────────────────────────────────────────────────────────────────────────

import { Resend } from 'resend';
import { NextResponse } from 'next/server';

export const runtime = 'edge';

// Booking deadline: 27 June 2026, 10:00 local. Reject requests past this point.
const BELLAGIO_DEADLINE = Date.UTC(2026, 5, 27, 8, 0, 0); // 10:00 CEST = 08:00 UTC

export async function POST(req: Request) {
  // Hard deadline guard — no quotes after the cutoff.
  if (Date.now() > BELLAGIO_DEADLINE + 60 * 60 * 1000) {
    return NextResponse.json(
      { error: 'Le prenotazioni per l\'evento Bellagio sono chiuse.' },
      { status: 410 }
    );
  }

  const resend = new Resend(process.env.RESEND_API_KEY);
  try {
    const form = await req.json() as {
      name: string; surname: string; email: string;
      phone: string; guests: string; notes: string;
    };

    const escapeHtml = (str: string) =>
      String(str ?? '')
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;');

    const { data, error } = await resend.emails.send({
      from: 'Booking System <onboarding@resend.dev>',
      to: ['info@4mlake.com'],
      subject: `🔥 Bellagio — Richiesta preventivo: ${form.name} ${form.surname}`,
      html: `
        <div style="font-family: sans-serif; line-height: 1.6; color: #333;">
          <h2 style="color: #0A1628; border-bottom: 1px solid #eee; padding-bottom: 10px;">
            🔥 Richiesta Preventivo — Notte di Fuochi a Bellagio
          </h2>
          <p style="background: #FFF7E6; padding: 12px 15px; border-left: 4px solid #C9A96E; border-radius: 4px;">
            <strong>Evento:</strong> Sabato 27 Giugno 2026, ore 22:30<br>
            <strong>Pacchetto:</strong> €1.200 — skipper, carburante, 2× Moët &amp; Chandon
          </p>

          <table style="width: 100%; border-collapse: collapse; margin-top: 16px;">
            <tr><td style="padding: 8px 0;"><strong>Nome:</strong></td><td>${escapeHtml(form.name)} ${escapeHtml(form.surname)}</td></tr>
            <tr><td style="padding: 8px 0;"><strong>Email:</strong></td><td>${escapeHtml(form.email)}</td></tr>
            <tr><td style="padding: 8px 0;"><strong>Telefono:</strong></td><td>${escapeHtml(form.phone)}</td></tr>
            <tr><td style="padding: 8px 0;"><strong>Ospiti:</strong></td><td>${escapeHtml(String(form.guests))}</td></tr>
          </table>

          <h3 style="margin-top: 20px; color: #C9A96E;">Note</h3>
          <p style="background: #f9f9f9; padding: 15px; border-left: 4px solid #C9A96E; border-radius: 4px;">
            ${escapeHtml(form.notes) || 'Nessuna nota aggiuntiva'}
          </p>

          <p style="margin-top: 24px; font-size: 12px; color: #999;">
            Richiesta inviata dal modulo /book-bellagio. Contattare il cliente entro poche ore con il preventivo dettagliato.
          </p>
        </div>
      `,
    });

    if (error) {
      console.error('Resend error (bellagio):', error);
      const status = typeof (error as { statusCode?: number }).statusCode === 'number'
        ? (error as { statusCode: number }).statusCode
        : 400;
      return NextResponse.json({ error }, { status });
    }

    return NextResponse.json({ success: true, data });
  } catch (err) {
    console.error('Errore interno send-bellagio:', err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Errore interno' },
      { status: 500 }
    );
  }
}
