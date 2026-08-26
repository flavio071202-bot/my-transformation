/* =====================================================
   MY TRANSFORMATION
   AI COACH ENGINE — V2

   Il Coach:
   - raccoglie i dati dell'utente
   - analizza il percorso
   - prepara il contesto
   - costruisce il prompt per ChatGPT
   - permette di aprire ChatGPT
   - mantiene una struttura pronta per il futuro
     collegamento diretto API

   IMPORTANTE:
   Questa versione NON contiene API key.
   ===================================================== */


/* =====================================================
   CONFIGURAZIONE
===================================================== */

const COACH_STORAGE_KEY =
    "myTransformationCoach";

const COACH_PROMPT_VERSION =
    "2.0";


/* =====================================================
   UTILITÀ
===================================================== */

function coachNumber(
    value,
    fallback = 0
) {

    const number =
        Number(value);


    return Number.isFinite(number)
        ? number
        : fallback;

}


function coachNormalize(
    value
) {

    return String(
        value ?? ""
    )
        .trim();

}


/* =====================================================
   PROFILO
===================================================== */

function getCoachProfile() {

    if (
        typeof storageGetProfile ===
        "function"
    ) {

        return storageGetProfile();

    }


    const data =
        localStorage.getItem(
            "myTransformationProfile"
        );


    if (!data) {

        return null;

    }


    try {

        return JSON.parse(
            data
        );

    } catch {

        return null;

    }

}


/* =====================================================
   NUTRIZIONE
===================================================== */

function getCoachNutrition() {

    if (
        typeof getNutritionSummary ===
        "function"
    ) {

        return getNutritionSummary();

    }


    if (
        typeof getNutritionTarget ===
        "function"
    ) {

        return getNutritionTarget();

    }


    return null;

}


/* =====================================================
   PIANO ALIMENTARE
===================================================== */

function getCoachMeals() {

    if (
        typeof getSavedMealsPlan ===
        "function"
    ) {

        return getSavedMealsPlan();

    }


    return null;

}


/* =====================================================
   ALLENAMENTO
===================================================== */

function getCoachWorkout() {

    if (
        typeof getStoredWorkout ===
        "function"
    ) {

        return getStoredWorkout();

    }


    return null;

}


/* =====================================================
   PROGRESSI
===================================================== */

function getCoachProgress() {

    if (
        typeof getProgressSummary ===
        "function"
    ) {

        return getProgressSummary();

    }


    return null;

}


/* =====================================================
   PREFERENZE
===================================================== */

function getCoachPreferences(
    profile
) {

    if (!profile) {

        return {

            likes: "",

            dislikes: "",

            allergies: ""

        };

    }


    return {

        likes:
            coachNormalize(
                profile.likes
            ),

        dislikes:
            coachNormalize(
                profile.dislikes
            ),

        allergies:
            coachNormalize(
                profile.allergies
            )

    };

}


/* =====================================================
   OBIETTIVO LEGGIBILE
===================================================== */

function getCoachGoalName(
    goal
) {

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
   PROFILO TESTUALE
===================================================== */

function buildCoachProfileContext(
    profile
) {

    if (!profile) {

        return `
PROFILO UTENTE
Dati non disponibili.
`;

    }


    const preferences =
        getCoachPreferences(
            profile
        );


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
   NUTRIZIONE TESTUALE
===================================================== */

function buildCoachNutritionContext(
    nutrition
) {

    if (!nutrition) {

        return `
TARGET NUTRIZIONALE

Dati nutrizionali non ancora disponibili.
`;

    }


    return `
TARGET NUTRIZIONALE

Calorie:
${coachNumber(
    nutrition.calories
)} kcal

Proteine:
${coachNumber(
    nutrition.protein
)} g

Carboidrati:
${coachNumber(
    nutrition.carbs
)} g

Grassi:
${coachNumber(
    nutrition.fat
)} g

BMR:
${coachNumber(
    nutrition.bmr
)} kcal

TDEE:
${coachNumber(
    nutrition.tdee
)} kcal
`;

}


/* =====================================================
   PROGRESSI TESTUALI
===================================================== */

function buildCoachProgressContext(
    progress
) {

    if (!progress) {

        return `
PROGRESSI

Non sono ancora disponibili
dati sufficienti.
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
${coachNumber(
    progress.completedWorkouts
)}

Aderenza allenamento:
${coachNumber(
    progress.workoutAdherence
)}%

Pasti completati:
${coachNumber(
    progress.completedMeals
)}

Aderenza alimentare:
${coachNumber(
    progress.mealAdherence
)}%
`;

}


/* =====================================================
   PIANO ALIMENTARE TESTUALE
===================================================== */

function buildCoachMealsContext(
    plan
) {

    if (
        !plan ||
        !plan.meals
    ) {

        return `
PIANO ALIMENTARE ATTUALE

Nessun piano disponibile.
`;

    }


    let output = `
PIANO ALIMENTARE ATTUALE
`;


    plan.meals.forEach(
        (
            meal,
            index
        ) => {

            output += `

${index + 1}. ${
    meal.name ||
    "Pasto"
}

`;


            if (
                meal.foods &&
                meal.foods.length
            ) {

                meal.foods.forEach(
                    food => {

                        output +=
                            `- ${food.name}: ${food.grams} g\n`;

                    }
                );

            }


            output +=
                `Calorie: ${meal.totals?.kcal || 0} kcal\n`;

            output +=
                `Proteine: ${meal.totals?.protein || 0} g\n`;

            output +=
                `Carboidrati: ${meal.totals?.carbs || 0} g\n`;

            output +=
                `Grassi: ${meal.totals?.fat || 0} g\n`;

        }
    );


    return output;

}


/* =====================================================
   ALLENAMENTO TESTUALE
===================================================== */

function buildCoachWorkoutContext(
    workout
) {

    if (
        !workout ||
        !workout.workouts
    ) {

        return `
ALLENAMENTO ATTUALE

Nessun allenamento disponibile.
`;

    }


    let output = `
ALLENAMENTO ATTUALE
`;


    workout.workouts.forEach(
        (
            session,
            index
        ) => {

            output += `

SESSIONE ${index + 1}:
${session.name || "Allenamento"}

`;


            if (
                session.exercises
            ) {

                session.exercises.forEach(
                    exercise => {

                        output +=
                            `- ${exercise.name}`;

                        output +=
                            ` | ${exercise.sets} serie`;

                        output +=
                            ` | ${exercise.reps} ripetizioni`;

                        output +=
                            ` | RIR ${exercise.rir}`;

                        output += "\n";

                    }
                );

            }

        }
    );


    return output;

}


/* =====================================================
   REGOLE DEL COACH
===================================================== */

function getCoachRules() {

    return `
REGOLE DEL COACH

Sei il Coach IA ufficiale di MY TRANSFORMATION.

Il tuo compito è aiutare l'utente a migliorare
composizione corporea, alimentazione, allenamento
e costanza in modo progressivo e sostenibile.

REGOLE FONDAMENTALI:

1. Analizza sempre tutti i dati disponibili prima
   di proporre modifiche.

2. Non modificare calorie o macronutrienti
   senza una motivazione basata sui dati.

3. Non creare deficit calorici estremi.

4. Non promettere risultati garantiti.

5. La dieta deve essere VARIATA durante la settimana.

6. Non utilizzare sempre gli stessi alimenti.

7. Rispetta SEMPRE allergie e alimenti indicati
   come da evitare.

8. Considera le preferenze alimentari dell'utente.

9. Le grammature devono essere espresse chiaramente.

10. Ogni pasto deve riportare calorie e macronutrienti.

11. Il totale giornaliero deve essere coerente
    con il target nutrizionale.

12. Se i dati sono insufficienti, dichiaralo
    invece di inventare dati.

13. Non cambiare un piano solo perché è iniziata
    una nuova settimana: valuta prima i risultati.

14. Considera il trend del peso e non una singola
    pesata isolata.

15. Considera anche l'aderenza alla dieta e
    all'allenamento.

16. Se il percorso procede bene, puoi mantenere
    il target e cambiare principalmente gli alimenti
    per aumentare varietà e sostenibilità.

17. Se il percorso non procede come previsto,
    spiega prima il motivo e poi proponi una modifica.

18. L'allenamento deve essere progressivo e
    compatibile con i giorni e la durata disponibili.

19. Non prescrivere farmaci, sostanze dopanti
    o pratiche pericolose.

20. Quando un problema richiede valutazione medica
    o nutrizionale professionale, suggerisci di
    rivolgersi a un professionista.

Il tuo stile deve essere diretto, concreto,
motivante ma non infantile.

Non devi semplicemente dire all'utente quello
che vuole sentirsi dire.

Devi ragionare sui dati.
`;

}


/* =====================================================
   RICHIESTA SETTIMANALE
===================================================== */

function getWeeklyDietRequest() {

    return `
OBIETTIVO DELLA RICHIESTA

Analizza il profilo e lo storico dell'utente.

Se i dati sono sufficienti, crea il piano alimentare
COMPLETO PER 7 GIORNI.

La settimana deve essere varia.

Non ripetere automaticamente lo stesso identico
pasto ogni giorno.

Mantieni coerenza con calorie e macronutrienti.

Per ogni giorno crea:

COLAZIONE
PRANZO
CENA

e gli eventuali spuntini necessari in base al numero
di pasti configurato dall'utente.

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

Alla fine aggiungi una breve spiegazione
delle scelte effettuate.

NON creare una dieta generica.

La dieta deve essere costruita esclusivamente
sui dati forniti dal contesto.
`;

}


/* =====================================================
   RICHIESTA ANALISI
===================================================== */

function getAnalysisRequest() {

    return `
OBIETTIVO DELLA RICHIESTA

Analizza il percorso dell'utente.

Rispondi alle seguenti domande:

1. Il peso sta evolvendo nella direzione prevista?

2. L'aderenza alimentare è sufficiente?

3. L'aderenza all'allenamento è sufficiente?

4. Le calorie attuali sembrano appropriate?

5. È necessario modificare qualcosa?

6. Se non è necessario modificare nulla,
   spiega perché.

7. Qual è la priorità della prossima settimana?

Non modificare automaticamente il piano se
i dati non giustificano una modifica.
`;

}


/* =====================================================
   PROMPT COMPLETO
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


    let request;


    if (
        requestType ===
        "analysis"
    ) {

        request =
            getAnalysisRequest();

    }

    else {

        request =
            getWeeklyDietRequest();

    }


    const prompt = `

====================================================
MY TRANSFORMATION — AI COACH
====================================================

Versione prompt:
${COACH_PROMPT_VERSION}

Data:
${new Date().toLocaleDateString(
    "it-IT"
)}

${getCoachRules()}

====================================================
DATI UTENTE
====================================================

${buildCoachProfileContext(
    profile
)}

====================================================
TARGET NUTRIZIONALE
====================================================

${buildCoachNutritionContext(
    nutrition
)}

====================================================
PROGRESSI
====================================================

${buildCoachProgressContext(
    progress
)}

====================================================
PIANO ALIMENTARE ATTUALE
====================================================

${buildCoachMealsContext(
    meals
)}

====================================================
ALLENAMENTO ATTUALE
====================================================

${buildCoachWorkoutContext(
    workout
)}

====================================================
RICHIESTA
====================================================

${request}

====================================================
FORMATO RISPOSTA
====================================================

Rispondi in italiano.

Usa una struttura chiara.

Non usare informazioni non presenti nel contesto
come se fossero dati reali dell'utente.

Se mancano informazioni importanti,
indicalo chiaramente.

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

        /*
           Fallback per browser che non permettono
           direttamente navigator.clipboard.
        */

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
   APERTURA CHATGPT
===================================================== */

function openChatGPTWithCoachPrompt(
    requestType = "weekly_diet"
) {

    const prompt =
        buildCoachPrompt(
            requestType
        );


    /*
       Copiamo prima il prompt.

       L'utente apre ChatGPT e lo incolla.
    */

    copyCoachPrompt(
        requestType
    );


    /*
       Apriamo ChatGPT.

       L'utente troverà il prompt già copiato
       negli appunti.
    */

    const chatGPTURL =
        "https://chatgpt.com/";


    window.open(
        chatGPTURL,
        "_blank"
    );


    return prompt;

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
   SALVATAGGIO ULTIMO PROMPT
===================================================== */

function saveCoachPrompt(
    prompt
) {

    if (!prompt) {

        return false;

    }


    const data = {

        prompt:
            prompt,

        createdAt:
            new Date()
                .toISOString(),

        version:
            COACH_PROMPT_VERSION

    };


    localStorage.setItem(
        COACH_STORAGE_KEY,
        JSON.stringify(
            data
        )
    );


    return true;

}


/* =====================================================
   RECUPERA ULTIMO PROMPT
===================================================== */

function getSavedCoachPrompt() {

    const data =
        localStorage.getItem(
            COACH_STORAGE_KEY
        );


    if (!data) {

        return null;

    }


    try {

        return JSON.parse(
            data
        );

    } catch {

        return null;

    }

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
            "L'aderenza può essere migliorata prima di modificare drasticamente il piano."

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
            new Date()
                .toISOString(),

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
   PULISCI DATI COACH
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


/* =====================================================
   AVVIO
===================================================== */

document.addEventListener(
    "DOMContentLoaded",
    initializeCoach
);