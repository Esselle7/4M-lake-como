Ricevuto. Modifichiamo la logica: il sito diventa un generatore di richieste flessibile in base al dispositivo dell'utente. Se l'utente naviga da **computer/desktop**, il form invia una **mail automatica** a `info@4mlake.com`; se naviga da **smartphone**, si attiva la **CTA di WhatsApp** con il messaggio pre-compilato.

Ecco il documento di business aggiornato in formato Markdown:

---

# 4M Luxury Boats — Documento di Contesto Business (v3)

## 1. Cos'è 4M Luxury Boats

4M Luxury Boats è un servizio premium di esperienze in barca sul Lago di Como. Offre tour ed escursioni a bordo di imbarcazioni private (con o senza capitano), rivolti a turisti, coppie, gruppi e aziende.

Il sito ha un duplice scopo:

1. **Presentare il servizio** in modo elegante, emozionale e professionale.
2. **Canalizzare le richieste di prenotazione in modo intelligente**: raccoglie i dati del cliente e li smista via **Email** o via **WhatsApp** a seconda del dispositivo utilizzato dall'utente, senza richiedere pagamenti online.

Il sito è disponibile in tre lingue: **italiano, inglese e tedesco**.

---

## 2. La Flotta

L'azienda opera attualmente con tre imbarcazioni.

* **Capacità:** Ogni barca ha una capienza massima di persone.
* **Flessibilità:** Tutte le barche della flotta possono effettuare qualsiasi pacchetto presente in catalogo.
* **Gestione Disponibilità:** In caso di indisponibilità di una barca (manutenzione o meteo), l'azienda gestisce il cambio o la riprogrammazione direttamente durante la conversazione di conferma con il cliente.

---

## 3. I Pacchetti (Catalogo)

Il catalogo è diviso in **Pacchetti Standard** ed **Esperienze Premium**. I prezzi sono da intendersi come base di partenza per il servizio privato.

### Pacchetti Standard

| Nome | Durata | Prezzo (Privato) | Cosa include |
| --- | --- | --- | --- |
| **Golden Hour** | 1 ora | € 250 | Prosecco omaggio, giro del primo bacino |
| **Breakfast on Board** | 1 ora | € 300 | Colazione completa servita a bordo (8:30–10:30) |
| **Aperitivo Tour** | 1,5 ore | € 350 | Aperitivo italiano con stuzzichini e drink al tramonto |
| **Sushi Experience** | 1,5 ore | € 380 | Sushi box premium con drink, percorso panoramico |

### Esperienze Premium

| Nome | Durata | Prezzo (Privato) | Cosa include |
| --- | --- | --- | --- |
| **Como Luxury** | 2 ore | € 450 | Villa Pliniana, Villa Oleandra (Clooney), Nesso |
| **La Dolce Vita** | 4 ore | € 800 | Percorso fino all'Isola Comacina e Varenna |

---

## 4. Modalità di Richiesta: Privato vs In Compagnia

Il cliente può manifestare interesse per due tipologie di esperienza:

1. **Modalità Privata:** La barca è riservata esclusivamente al gruppo del cliente. Il prezzo è riferito all'intera imbarcazione.
2. **Modalità In Compagnia (Shared):** Il cliente richiede uno o più posti su una barca condivisa. Il prezzo è calcolato per persona. La conferma della partenza viene gestita dall'azienda al raggiungimento del numero minimo.

---

## 5. Il Flusso di Prenotazione Ibrido (Desktop vs Mobile)

Il cliente compila sempre gli stessi dati, ma il comportamento della Call to Action (CTA) finale cambia in base al dispositivo rilevato.

### Fasi di Compilazione (Identiche per tutti i dispositivi)

* **Passo 1:** Scelta del pacchetto e della modalità (Privato / In Compagnia).
* **Passo 2:** Selezione della data sul calendario e indicazione dell'orario preferito.
* **Passo 3:** Inserimento dei dati (Nome, Cognome, Email, Telefono, Numero di persone ed eventuali note).

### Passo 4 — Azione di Invio Dinamica

#### Caso A: Utente da Desktop (Computer)

Il pulsante finale mostra la dicitura **"Invia Richiesta di Prenotazione"**.
Al clic, il sistema invia in automatico un'email formattata all'indirizzo **`info@4mlake.com`**. Il cliente visualizza a schermo un messaggio di successo (es. *"Richiesta inviata! Ti risponderemo via mail entro poche ore"*).

#### Caso B: Utente da Mobile (Smartphone)

Il pulsante finale mostra la dicitura **"Invia Richiesta su WhatsApp"**.
Al clic, si apre direttamente l'applicazione WhatsApp sul telefono del cliente con il messaggio pre-compilato indirizzato al numero del business.

> **Contenuto del Messaggio (Valido sia per Email che per WhatsApp):**
> * **Oggetto (solo per Email):** Nuova richiesta di prenotazione - [Nome Cliente]
> * **Testo:** >   "Vorrei richiedere una prenotazione per il pacchetto [Nome Pacchetto] in modalità [Privata/Condivisa]. Data: [Data] alle ore [Orario]. Gruppo composto da [N] persone. Contatto: [Telefono] - [Email]. Note: [Eventuali Note]."
> 
> 

---

## 6. Politiche di Pagamento e Gestione

* **Zero Transazioni sul Sito:** Non è presente alcun gateway di pagamento (no Stripe, no acconti automatici).
* **Gestione Umana:** La prenotazione non è confermata istantaneamente. L'azienda verifica la disponibilità reale e risponde al cliente (via mail o via WhatsApp) inviando le istruzioni per il pagamento (che avverrà in loco o tramite metodi concordati privatamente).
* **Flessibilità di Cancellazione:** Gestita direttamente ed esclusivamente tramite contatto diretto tra azienda e cliente.

---

## 7. Struttura delle Pagine Pubbliche

Il sito è composto da 4 sezioni principali:

1. **Home Page:** Vetrina emozionale con foto/video del Lago di Como e panoramica dei servizi.
2. **La Flotta:** Presentazione delle barche disponibili.
3. **Prenotazione:** Il form intelligente (con logica di reindirizzamento Email/WhatsApp).
4. **Contatti:** Informazioni stradali per l'imbarco, email e link diretto a WhatsApp per domande generiche.