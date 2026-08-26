/* =====================================================
   MY TRANSFORMATION
   AI COACH ENGINE — V3
===================================================== */

const COACH_STORAGE_KEY = "myTransformationCoach";
const COACH_PROMPT_VERSION = "3.0";


/* =====================================================
   UTILITÀ
===================================================== */

function coachNumber(value, fallback = 0) {

    const number = Number(value);

    return Number.isFinite(number)
        ? number
        : fallback;
}


function coachNormalize(value) {

    return String(value ?? "").trim();

}


/* =====================================================
   PROFILO
===================================================== */

function getCoachProfile() {

    if (typeof storageGetProfile === "function") {

        return storageGetProfile();

    }

    const data = localStorage.getItem(
        "myTransformationProfile"
    );

    if (!data) {

        return null;

    }

    try {

        return JSON.parse(data);

    } catch {

        return null;

    }

}


/* =====================================================
   NUTRIZIONE
===================================================== */

function getCoachNutrition() {

    if (typeof getNutritionSummary === "function") {

        return getNutritionSummary();

    }

    if (typeof getNutritionTarget === "function") {

        return getNutritionTarget();

    }

    return null;

}


/* =====================================================
   PIANO ALIMENTARE
===================================================== */

function getCoachMeals() {

    if (typeof getSavedMealsPlan === "function") {

        return getSavedMealsPlan();

    }

    return null;

}


/* =====================================================
   ALLENAMENTO
===================================================== */

function getCoachWorkout() {

    if (typeof getStoredWorkout === "function") {

        return getStoredWorkout();

    }

    return null;

}


/* =====================================================
   PROGRESSI
===================================================== */

function getCoachProgress() {

    if (typeof getProgressSummary === "function") {

        return getProgressSummary();

    }

    return null;

}


/* =====================================================
   PREFERENZE
===================================================== */

function getCoachPreferences(profile) {

    if (!profile) {

        return {
            likes: "",
            dislikes: "",
            allergies: ""
        };

    }

    return {

        likes: coachNormalize(profile.likes),

        dislikes: coachNormalize(profile.dislikes),

        allergies: coachNormalize(profile.allergies)

    };

}


/* =====================================================
   OBIETTIVO
===================================================== */

function getCoachGoalName(goal) {

    const goals = {

        fatloss: "Perdita di grasso",

        definition: "Definizione",

        recomp: "Ricomposizione corporea",

        muscle: "Aumento della massa muscolare"

    };

    return (
        goals[goal] ||
        goal ||
        "Non specificato"
    );

}


/* =====================================================
   CONTESTO PROFILO
===================================================== */

function buildCoachProfileContext(profile) {

    if (!profile) {

        return `
PROFILO UTENTE

Dati non disponibili.
`;

    }

    const preferences =
        getCoachPreferences(profile);

    return `
PROFILO UTENTE

Età:
${coachNormalize(profile.age)} anni

Sesso:
${coachNormalize(profile.sex)}

Altezza:
${coachNormalize(profile.height)} cm

Peso attuale:
${coachNormalize(profile.weight)} kg

Obiettivo:
${getCoachGoalName(profile.goal)}

Allenamenti:
${coachNormalize(profile.trainingDays)} giorni a settimana

Durata allenamento:
${coachNormalize(profile.trainingDuration)} minuti

Luogo allenamento:
${coachNormalize(profile.trainingPlace)}

Pasti giornalieri:
${coachNormalize(profile.meals)}

Alimenti preferiti:
${preferences.likes || "Non specificati"}

Alimenti non graditi:
${preferences.dislikes || "Nessuno indicato"}

Allergie / alimenti da evitare:
${preferences.allergies || "Nessuna indicata"}
`;

}


/* =====================================================
   CONTESTO NUTRIZIONE
===================================================== */

function buildCoachNutritionContext(nutrition) {

    if (!nutrition) {

        return `
TARGET NUTRIZIONALE

Dati nutrizionali non ancora disponibili.
`;

    }

    return `
TARGET NUTRIZIONALE

Calorie:
${coachNumber(nutrition.calories)} kcal

Proteine:
${coachNumber(nutrition.protein)} g

Carboidrati:
${coachNumber(nutrition.carbs)} g

Grassi:
${coachNumber(nutrition.fat)} g

BMR:
${coachNumber(nutrition.bmr)} kcal

TDEE:
${coachNumber(nutrition.tdee)} kcal
`;

}


/* =====================================================
   CONTESTO PROGRESSI
===================================================== */

function buildCoachProgressContext(progress) {

    if (!progress) {

        return `
PROGRESSI

Non sono ancora disponibili dati sufficienti.
`;

    }

    return `
PROGRESSI

Ultimo peso registrato:
${
    progress.latestWeight !== null &&
    progress.latestWeight !== undefined
        ? progress.latestWeight + " kg"
        : "Non registrato"
}

Media peso ultimi 7 giorni:
${
    progress.averageWeight7 !== null &&
    progress.averageWeight7 !== undefined
        ? progress.averageWeight7 + " kg"
        : "Non disponibile"
}

Variazione peso:
${
    progress.weightChange !== null &&
    progress.weightChange !== undefined
        ? progress.weightChange + " kg"
        : "Non disponibile"
}

Allenamenti completati:
${coachNumber(progress.completedWorkouts)}

Aderenza allenamento:
${coachNumber(progress.workoutAdherence)}%

Pasti completati:
${coachNumber(progress.completedMeals)}

Aderenza alimentare:
${coachNumber(progress.mealAdherence)}%
`;

}


/* =====================================================
   CONTESTO DIETA
===================================================== */

function buildCoachMealsContext(plan) {

    if (!plan || !plan.meals) {

        return `
PIANO ALIMENTARE ATTUALE

Nessun piano disponibile.
`;

    }

    let output = `
PIANO ALIMENTARE ATTUALE
`;

    plan.meals.forEach((meal, index) => {

        output += `

${index + 1}. ${
    meal.name || "Pasto"
}

`;

        if (meal.foods && meal.foods.length) {

            meal.foods.forEach(food => {

                output +=
                    `- ${food.name}: ${food.grams} g\n`;

            });

        }

        output +=
            `Calorie: ${meal.totals?.kcal || 0} kcal\n`;

        output +=
            `Proteine: ${meal.totals?.protein || 0} g\n`;

        output +=
            `Carboidrati: ${meal.totals?.carbs || 0} g\n`;

        output +=
            `Grassi: ${meal.totals?.fat || 0} g\n`;

    });

    return output;

}


/* =====================================================
   CONTESTO ALLENAMENTO
===================================================== */

function buildCoachWorkoutContext(workout) {

    if (!workout || !workout.workouts) {

        return `
ALLENAMENTO ATTUALE

Nessun allenamento disponibile.
`;

    }

    let output = `
ALLENAMENTO ATTUALE
`;

    workout.workouts.forEach((session, index) => {

        output += `

SESSIONE ${index + 1}:
${session.name || "Allenamento"}

`;

        if (session.exercises) {

            session.exercises.forEach(exercise => {

                output +=
                    `- ${exercise.name}`;

                output +=
                    ` | ${exercise.sets} serie`;

                output +=
                    ` | ${exercise.reps} ripetizioni`;

                output +=
                    ` | RIR ${exercise.rir}`;

                output += "\n";

            });

        }

    });

    return output;

}


/* =====================================================
   REGOLE DEL COACH
===================================================== */

function getCoachRules() {

    return `
REGOLE DEL COACH

Sei il Coach IA ufficiale di MY TRANSFORMATION.

Devi analizzare i dati dell'utente prima di
proporre qualsiasi modifica.

La dieta deve essere PERSONALIZZATA e VARIATA.

Non devi utilizzare una dieta fissa o preimpostata.

Non devi ripetere automaticamente gli stessi pasti
per tutta la settimana.

Devi rispettare sempre:

- obiettivo dell'utente
- peso
- altezza
- età
- sesso
- allenamenti
- durata degli allenamenti
- numero di pasti
- preferenze alimentari
- alimenti non graditi
- allergie e alimenti da evitare
- andamento del peso
- aderenza alla dieta
- aderenza agli allenamenti
- calorie
- macronutrienti

Non modificare calorie o macro senza una motivazione
basata sui dati.

Considera il trend del peso e non una singola pesata.

Se il percorso sta procedendo bene, non modificare
inutilmente il target.

Puoi comunque modificare gli alimenti per aumentare
varietà e sostenibilità.

Se il percorso non procede come previsto, analizza
prima la causa e poi proponi una modifica.

Non creare deficit estremi.

Non promettere risultati garantiti.

Non prescrivere farmaci, sostanze dopanti o pratiche
pericolose.

Se mancano dati importanti, dichiaralo chiaramente.

Rispondi sempre in italiano.

Il tuo stile deve essere diretto, concreto e motivante.

Non devi semplicemente dire all'utente quello che
vuole sentirsi dire.

Devi ragionare sui dati.
`;

}


/* =====================================================
   RICHIESTA DIETA SETTIMANALE
===================================================== */

function getWeeklyDietRequest() {

    return `
OBIETTIVO

Crea una DIETA COMPLETA DI 7 GIORNI.

La settimana deve essere realmente varia.

Ogni giorno deve avere pasti diversi o comunque
variazioni significative.

Non utilizzare una singola giornata e copiarla
per tutta la settimana.

Rispetta il numero di pasti configurato dall'utente.

Per ogni giorno crea tutti i pasti necessari.

Per ogni alimento indica:

- nome
- quantità in grammi

Per ogni pasto indica:

- calorie
- proteine
- carboidrati
- grassi

Per ogni giornata indica:

- calorie totali
- proteine totali
- carboidrati totali
- grassi totali

Alla fine spiega brevemente la logica utilizzata
per costruire la settimana.

La dieta deve essere costruita sui dati dell'utente.

Non inventare allergie, preferenze o dati personali.

Non usare alimenti esclusi dall'utente.
`;

}


/* =====================================================
   RICHIESTA ANALISI
===================================================== */

function getAnalysisRequest() {

    return `
ANALIZZA IL PERCORSO DELL'UTENTE.

Valuta:

1. andamento del peso
2. aderenza alimentare
3. aderenza agli allenamenti
4. calorie
5. macronutrienti
6. progressione dell'allenamento

Stabilisci se è necessario modificare qualcosa.

Se non è necessario modificare nulla,
spiega chiaramente perché.

Indica la priorità della prossima settimana.
`;

}


/* =====================================================
   COSTRUZIONE PROMPT
===================================================== */

function buildCoachPrompt(
    requestType = "weekly_diet"
) {

    const profile =
        getCoachProfile();

    const nutrition =
        getCoachNutrition();

    const progress =
        getCoachProgress();

    const meals =
        getCoachMeals();

    const workout =
        getCoachWorkout();

    const request =
        requestType === "analysis"
            ? getAnalysisRequest()
            : getWeeklyDietRequest();

    const prompt = `

====================================================
MY TRANSFORMATION — COACH IA
====================================================

Versione:
${COACH_PROMPT_VERSION}

Data:
${new Date().toLocaleDateString("it-IT")}

${getCoachRules()}

====================================================
PROFILO UTENTE
====================================================

${buildCoachProfileContext(profile)}

====================================================
TARGET NUTRIZIONALE
====================================================

${buildCoachNutritionContext(nutrition)}

====================================================
PROGRESSI
====================================================

${buildCoachProgressContext(progress)}

====================================================
PIANO ALIMENTARE ATTUALE
====================================================

${buildCoachMealsContext(meals)}

====================================================
ALLENAMENTO ATTUALE
====================================================

${buildCoachWorkoutContext(workout)}

====================================================
RICHIESTA
====================================================

${request}

====================================================
FORMATO DELLA RISPOSTA
====================================================

Rispondi in italiano.

Usa titoli chiari.

Se stai creando la dieta settimanale,
organizzala chiaramente da LUNEDÌ a DOMENICA.

Non saltare nessun giorno.

Non saltare nessun pasto previsto.

Indica sempre le grammature.

Indica calorie e macronutrienti.

Alla fine fornisci un riepilogo della settimana.

====================================================
FINE CONTESTO
====================================================
`;

    return prompt.trim();

}


/* =====================================================
   COPIA PROMPT
===================================================== */

async function copyCoachPrompt(
    requestType = "weekly_diet"
) {

    const prompt =
        buildCoachPrompt(requestType);

    try {

        await navigator.clipboard.writeText(
            prompt
        );

        return true;

    } catch {

        const textarea =
            document.createElement("textarea");

        textarea.value = prompt;

        textarea.style.position = "fixed";
        textarea.style.opacity = "0";

        document.body.appendChild(textarea);

        textarea.select();

        const success =
            document.execCommand("copy");

        textarea.remove();

        return success;

    }

}


/* =====================================================
   PULSANTE GENERA COACH
===================================================== */

function openChatGPTWithCoachPrompt(
    requestType = "weekly_diet"
) {

    copyCoachPrompt(requestType);

    showCoachPromptInstructions(
        requestType
    );

}


/* =====================================================
   SCHERMATA ISTRUZIONI
===================================================== */

function showCoachPromptInstructions(
    requestType = "weekly_diet"
) {

    const existing =
        document.getElementById(
            "coachPromptModal"
        );

    if (existing) {

        existing.remove();

    }

    const modal =
        document.createElement("div");

    modal.id =
        "coachPromptModal";

    modal.innerHTML = `

        <div
            style="
                position:fixed;
                inset:0;
                z-index:9999;
                background:rgba(0,0,0,0.80);
                display:flex;
                align-items:center;
                justify-content:center;
                padding:20px;
                backdrop-filter:blur(14px);
                -webkit-backdrop-filter:blur(14px);
            "
        >

            <div
                style="
                    width:100%;
                    max-width:460px;
                    max-height:90vh;
                    overflow-y:auto;
                    background:#151517;
                    border:1px solid #303037;
                    border-radius:28px;
                    padding:28px;
                    color:#f5f5f7;
                    box-shadow:0 20px 60px rgba(0,0,0,0.5);
                "
            >

                <div
                    style="
                        font-size:42px;
                        margin-bottom:16px;
                    "
                >
                    🤖
                </div>

                <div
                    style="
                        color:#8f8f98;
                        font-size:12px;
                        font-weight:700;
                        letter-spacing:.14em;
                        text-transform:uppercase;
                        margin-bottom:10px;
                    "
                >
                    COACH IA
                </div>

                <h2
                    style="
                        font-size:30px;
                        line-height:1.05;
                        letter-spacing:-.04em;
                        margin-bottom:14px;
                    "
                >
                    Il Coach ha preparato la richiesta.
                </h2>

                <p
                    style="
                        color:#a4a4ad;
                        font-size:16px;
                        line-height:1.55;
                        margin-bottom:22px;
                    "
                >
                    Il prompt è stato copiato
                    automaticamente negli appunti.
                </p>

                <div
                    style="
                        background:#1f1f23;
                        border:1px solid #303037;
                        border-radius:20px;
                        padding:20px;
                        margin-bottom:20px;
                    "
                >

                    <div
                        style="
                            font-weight:750;
                            font-size:17px;
                            margin-bottom:14px;
                        "
                    >
                        📋 Cosa devi fare
                    </div>

                    <div
                        style="
                            color:#d7d7dc;
                            line-height:1.75;
                            font-size:15px;
                        "
                    >

                        <div>
                            <strong>1.</strong>
                            Apri ChatGPT
                        </div>

                        <div>
                            <strong>2.</strong>
                            Tocca
                            <strong>
                                “Fai una domanda”
                            </strong>
                        </div>

                        <div>
                            <strong>3.</strong>
                            Tocca
                            <strong>
                                “Incolla”
                            </strong>
                        </div>

                        <div>
                            <strong>4.</strong>
                            Premi
                            <strong>
                                Invia ↑
                            </strong>
                        </div>

                    </div>

                </div>

                <div
                    style="
                        background:#202024;
                        border-radius:16px;
                        padding:14px 16px;
                        color:#a4a4ad;
                        font-size:13px;
                        line-height:1.5;
                        margin-bottom:22px;
                    "
                >
                    💡 <strong style="color:#f5f5f7;">
                    Non devi scrivere nulla.
                    </strong>
                    Il testo è già pronto e copiato.
                    Devi solo incollarlo in ChatGPT.
                </div>

                <button
                    type="button"
                    onclick="launchChatGPTFromCoach()"
                    style="
                        width:100%;
                        min-height:58px;
                        border:none;
                        border-radius:18px;
                        background:#f5f5f7;
                        color:#080808;
                        font-size:15px;
                        font-weight:750;
                        cursor:pointer;
                    "
                >
                    🤖 APRI CHATGPT
                </button>

                <button
                    type="button"
                    onclick="closeCoachPromptInstructions()"
                    style="
                        width:100%;
                        min-height:50px;
                        margin-top:10px;
                        border:none;
                        border-radius:18px;
                        background:transparent;
                        color:#8f8f98;
                        font-size:14px;
                        font-weight:600;
                        cursor:pointer;
                    "
                >
                    Annulla
                </button>

            </div>

        </div>

    `;

    document.body.appendChild(modal);

}


/* =====================================================
   APERTURA CHATGPT
===================================================== */

function launchChatGPTFromCoach() {

    const modal =
        document.getElementById(
            "coachPromptModal"
        );

    if (modal) {

        modal.remove();

    }

    window.open(
        "https://chatgpt.com/",
        "_blank"
    );

}


/* =====================================================
   CHIUDI MODALE
===================================================== */

function closeCoachPromptInstructions() {

    const modal =
        document.getElementById(
            "coachPromptModal"
        );

    if (modal) {

        modal.remove();

    }

}


/* =====================================================
   GENERA PROMPT DIETA
===================================================== */

function generateWeeklyDietPrompt() {

    return buildCoachPrompt(
        "weekly_diet"
    );

}


/* =====================================================
   GENERA PROMPT ANALISI
===================================================== */

function generateCoachAnalysisPrompt() {

    return buildCoachPrompt(
        "analysis"
    );

}


/* =====================================================
   ANALISI LOCALE
===================================================== */

function analyzeCoachStatus() {

    const progress =
        getCoachProgress();

    if (!progress) {

        return {

            status:
                "insufficient_data",

            message:
                "Servono più dati per valutare il percorso."

        };

    }

    if (
        progress.workoutAdherence >= 85 &&
        progress.mealAdherence >= 85
    ) {

        return {

            status:
                "excellent",

            message:
                "L'aderenza al percorso è molto buona."

        };

    }

    if (
        progress.workoutAdherence >= 70 &&
        progress.mealAdherence >= 70
    ) {

        return {

            status:
                "good",

            message:
                "Il percorso è abbastanza regolare."

        };

    }

    return {

        status:
            "needs_attention",

        message:
            "L'aderenza può essere migliorata."

    };

}


/* =====================================================
   MESSAGGIO COACH
===================================================== */

function generateCoachMessage() {

    const status =
        analyzeCoachStatus();

    return status.message;

}


/* =====================================================
   ANALISI COMPLETA
===================================================== */

function generateCoachAnalysis() {

    const progress =
        getCoachProgress();

    const status =
        analyzeCoachStatus();

    return {

        generatedAt:
            new Date().toISOString(),

        status:
            status.status,

        message:
            status.message,

        weight: {

            status:
                progress
                    ? "available"
                    : "unknown",

            message:
                progress
                    ? (
                        progress.weightChange !== null
                            ? `Variazione registrata: ${progress.weightChange} kg.`
                            : "Non ci sono ancora dati sufficienti sul peso."
                    )
                    : "Nessun dato disponibile."

        },

        training: {

            status:
                progress
                    ? "available"
                    : "unknown",

            message:
                progress
                    ? `Aderenza allenamento: ${progress.workoutAdherence}%.`
                    : "Nessun dato disponibile."

        },

        nutrition: {

            status:
                progress
                    ? "available"
                    : "unknown",

            message:
                progress
                    ? `Aderenza alimentare: ${progress.mealAdherence}%.`
                    : "Nessun dato disponibile."

        }

    };

}


/* =====================================================
   AGGIORNA COACH
===================================================== */

function refreshCoach() {

    const analysis =
        generateCoachAnalysis();

    localStorage.setItem(
        COACH_STORAGE_KEY,
        JSON.stringify(analysis)
    );

    return analysis;

}


/* =====================================================
   RESET COACH
===================================================== */

function resetCoach() {

    localStorage.removeItem(
        COACH_STORAGE_KEY
    );

    return true;

}


/* =====================================================
   INIZIALIZZAZIONE
===================================================== */

function initializeCoach() {

    refreshCoach();

}


document.addEventListener(
    "DOMContentLoaded",
    initializeCoach
);