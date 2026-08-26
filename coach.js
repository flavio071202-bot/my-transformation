/* =====================================================
   MY TRANSFORMATION
   AI COACH ENGINE — V4
===================================================== */

const COACH_STORAGE_KEY = "myTransformationCoach";
const COACH_PROMPT_VERSION = "4.0";


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

    if (typeof refreshNutrition === "function") {

        return refreshNutrition();

    }

    return null;

}


/* =====================================================
   PIANO ATTUALE
===================================================== */

function getCoachMeals() {

    if (typeof getSavedMealsPlan === "function") {

        return getSavedMealsPlan();

    }

    const data = localStorage.getItem(
        "myTransformationMeals"
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

        likes:
            coachNormalize(profile.likes),

        dislikes:
            coachNormalize(profile.dislikes),

        allergies:
            coachNormalize(profile.allergies)

    };

}


/* =====================================================
   OBIETTIVO
===================================================== */

function getCoachGoalName(goal) {

    const goals = {

        fatloss:
            "Perdita di grasso",

        definition:
            "Definizione",

        recomp:
            "Ricomposizione corporea",

        muscle:
            "Aumento della massa muscolare"

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

Peso:
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

Dati non disponibili.
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
   CONTESTO DIETA ATTUALE
===================================================== */

function buildCoachMealsContext(plan) {

    if (!plan) {

        return `
PIANO ALIMENTARE ATTUALE

Nessun piano disponibile.
`;

    }

    /*
       Supportiamo sia il vecchio formato
       sia il futuro formato settimanale.
    */

    if (plan.days && Array.isArray(plan.days)) {

        let output =
            "PIANO ALIMENTARE ATTUALE\n";

        plan.days.forEach((day, index) => {

            output += `\nGIORNO ${index + 1}\n`;

            if (day.meals) {

                day.meals.forEach(meal => {

                    output +=
                        `\n${meal.name || "Pasto"}\n`;

                    if (meal.foods) {

                        meal.foods.forEach(food => {

                            output +=
                                `- ${food.name}: ${food.grams} g\n`;

                        });

                    }

                    if (meal.totals) {

                        output +=
                            `Kcal: ${meal.totals.kcal || 0}\n`;

                        output +=
                            `Proteine: ${meal.totals.protein || 0} g\n`;

                        output +=
                            `Carboidrati: ${meal.totals.carbs || 0} g\n`;

                        output +=
                            `Grassi: ${meal.totals.fat || 0} g\n`;

                    }

                });

            }

        });

        return output;

    }

    if (plan.meals) {

        let output =
            "PIANO ALIMENTARE ATTUALE\n";

        plan.meals.forEach(meal => {

            output +=
                `\n${meal.name || "Pasto"}\n`;

            if (meal.foods) {

                meal.foods.forEach(food => {

                    output +=
                        `- ${food.name}: ${food.grams} g\n`;

                });

            }

        });

        return output;

    }

    return `
PIANO ALIMENTARE ATTUALE

Formato non disponibile.
`;

}


/* =====================================================
   CONTESTO ALLENAMENTO
===================================================== */

function buildCoachWorkoutContext(workout) {

    if (!workout) {

        return `
ALLENAMENTO ATTUALE

Nessun allenamento disponibile.
`;

    }

    if (!workout.workouts) {

        return `
ALLENAMENTO ATTUALE

Dati non disponibili.
`;

    }

    let output =
        "ALLENAMENTO ATTUALE\n";

    workout.workouts.forEach(
        (session, index) => {

            output += `

SESSIONE ${index + 1}
${session.name || "Allenamento"}

`;

            if (session.exercises) {

                session.exercises.forEach(
                    exercise => {

                        output +=
                            `- ${exercise.name}`;

                        if (exercise.sets !== undefined) {

                            output +=
                                ` | ${exercise.sets} serie`;

                        }

                        if (exercise.reps !== undefined) {

                            output +=
                                ` | ${exercise.reps} ripetizioni`;

                        }

                        if (exercise.rir !== undefined) {

                            output +=
                                ` | RIR ${exercise.rir}`;

                        }

                        output += "\n";

                    }
                );

            }

        }
    );

    return output;

}


/* =====================================================
   REGOLE COACH
===================================================== */

function getCoachRules() {

    return `
REGOLE DEL COACH

Sei il Coach IA ufficiale di MY TRANSFORMATION.

Il tuo compito è analizzare il percorso dell'utente
e costruire una strategia personalizzata.

La dieta NON deve essere una dieta fissa contenuta
nell'app.

La dieta deve essere GENERATA DAL COACH.

Deve essere settimanale e composta da 7 giorni.

La settimana deve essere varia.

Non copiare la stessa giornata per tutta la settimana.

Considera sempre:

- profilo dell'utente
- obiettivo
- peso
- altezza
- età
- sesso
- numero di pasti
- allenamenti
- durata allenamenti
- preferenze alimentari
- alimenti non graditi
- allergie
- calorie
- macronutrienti
- andamento del peso
- aderenza alimentare
- aderenza agli allenamenti
- piano precedente

Non modificare calorie o macronutrienti senza una
motivazione basata sui dati.

Considera il trend del peso e non una singola pesata.

Se il percorso sta procedendo bene, non modificare
inutilmente il target.

Puoi modificare gli alimenti per aumentare varietà,
sostenibilità e aderenza.

Non creare deficit calorici estremi.

Non promettere risultati garantiti.

Non prescrivere farmaci o sostanze dopanti.

Rispetta sempre allergie e alimenti esclusi.

Se mancano dati importanti, dichiaralo.

Rispondi in italiano.

Devi ragionare sui dati e non semplicemente
assecondare l'utente.
`;

}


/* =====================================================
   FORMATO IMPORTAZIONE
===================================================== */

function getImportFormatRules() {

    return `
FORMATO DI IMPORTAZIONE MY TRANSFORMATION

IMPORTANTE:

Alla fine della risposta devi creare un blocco
di dati valido JSON.

Il blocco deve essere racchiuso ESATTAMENTE tra:

=== MY_TRANSFORMATION_DIET_START ===

e:

=== MY_TRANSFORMATION_DIET_END ===

Tra queste due righe deve esserci SOLO JSON valido.

NON inserire testo, commenti o markdown dentro
il blocco JSON.

La struttura DEVE essere:

{
  "version": "1.0",
  "type": "weekly",
  "week": [
    {
      "day": "Lunedì",
      "meals": [
        {
          "name": "Colazione",
          "foods": [
            {
              "name": "Alimento",
              "grams": 100
            }
          ],
          "totals": {
            "kcal": 500,
            "protein": 30,
            "carbs": 60,
            "fat": 15
          }
        }
      ],
      "totals": {
        "kcal": 2000,
        "protein": 150,
        "carbs": 220,
        "fat": 60
      }
    }
  ]
}

REGOLE JSON:

- week deve contenere ESATTAMENTE 7 giorni.
- I giorni devono essere da Lunedì a Domenica.
- Ogni giorno deve avere tutti i pasti previsti.
- Ogni alimento deve avere nome e grammatura.
- grams deve essere un numero.
- kcal deve essere un numero.
- protein deve essere un numero.
- carbs deve essere un numero.
- fat deve essere un numero.
- Non utilizzare valori come "circa".
- Non utilizzare stringhe al posto dei numeri.
- Non inserire testo fuori dal formato previsto.
- Il JSON deve essere valido e leggibile da JavaScript.

La parte visibile della risposta può contenere
spiegazioni e la dieta completa.

Il blocco JSON finale invece deve contenere
SOLO i dati necessari all'app.
`;

}


/* =====================================================
   RICHIESTA DIETA SETTIMANALE
===================================================== */

function getWeeklyDietRequest() {

    return `
CREA LA NUOVA SETTIMANA ALIMENTARE.

Devi creare una dieta completa di 7 giorni:

Lunedì
Martedì
Mercoledì
Giovedì
Venerdì
Sabato
Domenica

Ogni giorno deve avere tutti i pasti necessari.

La dieta deve essere varia.

Varia le fonti proteiche, i carboidrati,
le verdure, la frutta e le altre componenti
quando è compatibile con il profilo.

Non utilizzare una dieta generica.

Non ripetere la stessa identica giornata.

Per ogni alimento indica la grammatura.

Per ogni pasto indica:

- kcal
- proteine
- carboidrati
- grassi

Per ogni giornata indica:

- kcal totali
- proteine totali
- carboidrati totali
- grassi totali

Alla fine della risposta crea anche il blocco
JSON secondo le regole di importazione.
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
7. sostenibilità del piano

Stabilisci se il piano attuale deve essere:

- mantenuto
- modificato leggermente
- modificato in modo significativo

Spiega sempre il motivo.

Non cambiare il piano senza una motivazione
basata sui dati.
`;

}


/* =====================================================
   COSTRUISCI PROMPT
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

    const importRules =
        requestType === "analysis"
            ? ""
            : getImportFormatRules();

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
REGOLE DI IMPORTAZIONE
====================================================

${importRules}

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
        buildCoachPrompt(
            requestType
        );

    try {

        await navigator.clipboard.writeText(
            prompt
        );

        return true;

    } catch {

        const textarea =
            document.createElement(
                "textarea"
            );

        textarea.value =
            prompt;

        textarea.style.position =
            "fixed";

        textarea.style.opacity =
            "0";

        document.body.appendChild(
            textarea
        );

        textarea.select();

        const success =
            document.execCommand(
                "copy"
            );

        textarea.remove();

        return success;

    }

}


/* =====================================================
   GENERA RICHIESTA COACH
===================================================== */

function openChatGPTWithCoachPrompt(
    requestType = "weekly_diet"
) {

    copyCoachPrompt(
        requestType
    );

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
        document.createElement(
            "div"
        );

    modal.id =
        "coachPromptModal";

    modal.innerHTML = `

        <div
            style="
                position:fixed;
                inset:0;
                z-index:9999;
                background:rgba(0,0,0,.82);
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
                    box-shadow:0 20px 60px rgba(0,0,0,.5);
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
                        line-height:1.08;
                        letter-spacing:-.04em;
                        margin:0 0 14px;
                    "
                >
                    La richiesta è pronta.
                </h2>

                <p
                    style="
                        color:#a4a4ad;
                        font-size:16px;
                        line-height:1.55;
                        margin:0 0 22px;
                    "
                >
                    Il prompt completo del Coach è stato
                    copiato automaticamente negli appunti.
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
                        📋 Ora fai così
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
                    💡
                    <strong style="color:#f5f5f7;">
                        Non devi scrivere nulla.
                    </strong>
                    Il testo è già pronto.
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

    document.body.appendChild(
        modal
    );

}


/* =====================================================
   APRI CHATGPT
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
   PROMPT DIETA
===================================================== */

function generateWeeklyDietPrompt() {

    return buildCoachPrompt(
        "weekly_diet"
    );

}


/* =====================================================
   PROMPT ANALISI
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
        JSON.stringify(
            analysis
        )
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