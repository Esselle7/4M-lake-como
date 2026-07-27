import { Resend } from 'resend';
import { NextResponse } from 'next/server';
import { verifyTurnstile } from '@/lib/verify-turnstile';

export const runtime = 'edge';

export async function POST(req: Request) {
  const resend = new Resend(process.env.RESEND_API_KEY);
  try {
    const { form, whatsappMessage, pricing, turnstileToken } = await req.json();

    // Trust boundary: il body arriva da internet, non dal form. Rifiuta subito ciò che non è un oggetto.
    if (!form || typeof form !== 'object') {
      return NextResponse.json({ error: 'Payload non valido' }, { status: 400 });
    }

    // Anti-bot PRIMA di toccare Resend: un token non valido non deve costare una email.
    const ok = await verifyTurnstile(turnstileToken, req.headers.get('CF-Connecting-IP'));
    if (!ok) {
      return NextResponse.json(
        { error: 'Verifica anti-bot fallita. Ricarica la pagina e riprova.' },
        { status: 403 }
      );
    }

    // Escape per inserire in sicurezza il testo nel markup HTML della mail.
    // Il cap a 2000 char evita mail da megabyte via POST diretto.
    // ponytail: basta escapare &<> perché ogni valore finisce in text content, mai in un attributo.
    const escapeHtml = (str: string) =>
      String(str ?? '')
        .slice(0, 2000)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;');

    type AddonLine = { label: string; qty: number; price: number; lineTotal: number; isCustomPrice?: boolean };
    const cur = escapeHtml(pricing?.currency ?? '€');
    const isSelfDrive = !!pricing?.isSelfDrive;

    // Riga durata (solo per il pacchetto personalizzabile "La Bella Vita" o per il self drive).
    const durationRow = (pricing?.isCustom || isSelfDrive) && pricing?.durationLabel
      ? `<tr><td style="padding: 8px 0;"><strong>Durata:</strong></td><td>${escapeHtml(pricing.durationLabel)}${isSelfDrive && pricing?.durationHours ? ` (${pricing.durationHours} ore)` : ''}</td></tr>`
      : '';

    // Barca self drive (7/6 posti) — solo flusso self drive.
    const selfBoatRow = isSelfDrive && pricing?.selfBoatName
      ? `<tr><td style="padding: 8px 0;"><strong>Barca (self drive):</strong></td><td>${escapeHtml(pricing.selfBoatName)}</td></tr>`
      : '';

    // Etichetta modalità: "Self Drive (senza patente)" per il flusso self, altrimenti privata/condivisa.
    const modeLabel = isSelfDrive
      ? 'Self Drive (senza patente)'
      : (form.mode === 'private' ? 'Privata' : 'Condivisa');

    // Elenco extra a bordo selezionati (l'allestimento ha prezzo da definire).
    const addonLines: AddonLine[] = Array.isArray(pricing?.addonLines) ? pricing.addonLines : [];
    const addonsRow = addonLines.length
      ? `<tr><td style="padding: 8px 0; vertical-align: top;"><strong>Extra a bordo:</strong></td><td>${addonLines
          .map((l) => l.isCustomPrice
            ? `${escapeHtml(l.label)} (prezzo da definire)`
            : `${l.qty}× ${escapeHtml(l.label)} (${cur}${l.lineTotal})`)
          .join('<br>')}</td></tr>`
      : '';

    // Descrizione dell'allestimento speciale richiesto dal cliente.
    const setupNote = pricing?.customSetupNote || form.customSetupNote;
    const setupRow = setupNote
      ? `<tr><td style="padding: 8px 0; vertical-align: top;"><strong>Allestimento speciale:</strong></td><td>${escapeHtml(setupNote)}</td></tr>`
      : '';

    // ponytail: `pricing` è calcolato dal client (BookingForm.computePricing) e stampato come arriva.
    //           Chi fa POST a mano può dichiarare un totale falso nella mail allo staff.
    //           Accettato: non esiste un flusso di pagamento, lo staff rilegge il preventivo prima di
    //           confermare. Ricalcolare server-side con lib/pricing.mjs il giorno in cui si incassa online.
    // Righe prezzo: eventuale prezzo pieno barrato + sconto, totale (già scontato) + acconto 30%.
    const discountRow = pricing?.discountRate > 0 && typeof pricing?.originalTotal === 'number'
      ? `<tr><td style="padding: 8px 0;"><strong>Prezzo pieno:</strong></td><td><span style="text-decoration: line-through; color: #999;">${cur}${pricing.originalTotal}</span> &nbsp;<span style="color: #C9A96E;">−${Math.round(pricing.discountRate * 100)}% sulle ore</span></td></tr>`
      : '';
    const priceRows = typeof pricing?.total === 'number'
      ? discountRow +
        `<tr><td style="padding: 8px 0;"><strong>Prezzo totale:</strong></td><td><strong>${cur}${pricing.total}</strong></td></tr>` +
        `<tr><td style="padding: 8px 0;"><strong>Acconto (30%):</strong></td><td>${cur}${pricing.deposit}</td></tr>`
      : '';

    const { data, error } = await resend.emails.send({
      // ── MODALITÀ TEST ───────────────────────────────────────────────────────
      // Con il mittente di test `onboarding@resend.dev` Resend consegna SOLO
      // all'email proprietaria dell'account (info@4mlake.com). Qualsiasi altro
      // destinatario viene rifiutato con 403.
      from: 'Booking System <onboarding@resend.dev>',
      to: ['info@4mlake.com'],

      // ── PRODUZIONE (attivare dopo aver verificato un dominio su Resend) ──────
      // 1. Verifica il dominio su resend.com/domains (record DNS SPF/DKIM).
      // 2. Cambia il `from` con un indirizzo di quel dominio, es:
      //      from: '4M Lake Como <booking@4mboatlakecomo.com>',
      // 3. Sblocca i destinatari reali — staff in "to", Simone in copia nascosta
      //    (bcc) così i due non si vedono a vicenda:
      //      to: [process.env.PERSONAL_EMAIL as string],
      //      bcc: ['simone.leone300900@gmail.com'],
      // Newline strippati: il subject è un header, non HTML — niente CRLF injection anche se Resend già filtra.
      subject: `Nuova Prenotazione: ${`${form.name} ${form.surname}`.replace(/[\r\n]+/g, ' ').slice(0, 200)}`,
      html: `
        <div style="font-family: sans-serif; line-height: 1.6; color: #333;">
          <h2 style="color: #0A1628; border-bottom: 1px solid #eee; padding-bottom: 10px;">Nuova Richiesta di Prenotazione</h2>
          <p>Hai ricevuto una nuova richiesta dal sito web:</p>
          
          <table style="width: 100%; border-collapse: collapse;">
            <tr><td style="padding: 8px 0;"><strong>Pacchetto:</strong></td><td>${escapeHtml(form.packageName) || (isSelfDrive ? 'Self Drive (senza patente)' : '—')}</td></tr>
            <tr><td style="padding: 8px 0;"><strong>Modalità:</strong></td><td>${modeLabel}</td></tr>
            ${selfBoatRow}
            ${durationRow}
            <tr><td style="padding: 8px 0;"><strong>Data e Ora:</strong></td><td>${escapeHtml(form.date)} ore ${escapeHtml(form.time)}</td></tr>
            <tr><td style="padding: 8px 0;"><strong>Ospiti:</strong></td><td>${escapeHtml(form.guests)}</td></tr>
            ${addonsRow}
            ${setupRow}
            ${priceRows}
          </table>

          <h3 style="margin-top: 20px; color: #C9A96E;">Dati Cliente</h3>
          <p>
            <strong>Nome:</strong> ${escapeHtml(form.name)} ${escapeHtml(form.surname)}<br>
            <strong>Email:</strong> ${escapeHtml(form.email)}<br>
            <strong>Telefono:</strong> ${escapeHtml(form.phone)}
          </p>

          <p style="background: #f9f9f9; padding: 15px; border-left: 4px solid #C9A96E;">
            <strong>Note:</strong><br>${escapeHtml(form.notes) || 'Nessuna nota aggiuntiva'}
          </p>

          <h3 style="margin-top: 30px; color: #C9A96E; border-top: 1px solid #eee; padding-top: 20px;">Messaggio WhatsApp per il cliente</h3>
          <p style="font-size: 13px; color: #888;">Copia e incolla il testo qui sotto e invialo al cliente su WhatsApp (${escapeHtml(form.phone)}):</p>
          <pre style="white-space: pre-wrap; word-break: break-word; font-family: -apple-system, sans-serif; background: #f5f7fa; padding: 16px; border-radius: 8px; border: 1px solid #e0e4e8; font-size: 14px; line-height: 1.55; color: #222; margin: 0;">${escapeHtml(whatsappMessage)}</pre>
        </div>
      `,
    });

    if (error) {
      // Propaga l'errore reale di Resend (messaggio + status) invece di un 400 generico,
      // così in console/network si vede subito la causa.
      console.error('Resend error:', error);
      const status = typeof (error as { statusCode?: number }).statusCode === 'number'
        ? (error as { statusCode: number }).statusCode
        : 400;
      return NextResponse.json({ error }, { status });
    }

    return NextResponse.json({ success: true, data });
  } catch (err) {
    console.error('Errore interno send-booking:', err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Errore interno' },
      { status: 500 }
    );
  }
}