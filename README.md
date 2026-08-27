# MY TRANSFORMATION — V5

Mobile-first web app per percorso fitness personale.

## Caratteristiche
- Profilo persistente in localStorage.
- Target calorico/macro calcolato localmente.
- Dieta settimanale **solo da Coach IA**, con importazione robusta da clipboard.
- Pulsante pasto funzionante con stato `✅ PASTO COMPLETATO` persistente.
- Calendario reale Lunedì→Domenica: il giorno mostrato segue la data del dispositivo.
- Allenamento generato automaticamente e rinnovato ogni mese tramite ciclo Base → Progressione → Intensificazione → Deload.
- Progressi peso, media e aderenza.
- UI mobile-first e background evocativo senza dipendenze esterne.

## Importazione dieta
Il pulsante “GENERA LA MIA SETTIMANA” copia un prompt compatto. In ChatGPT incolla/invia, poi copia **la risposta JSON completa** e premi “IMPORTA SETTIMANA DEL COACH”.

Il parser accetta i marker ufficiali ed estrarrà l’oggetto JSON anche se ChatGPT lo racchiude in un blocco di codice.
