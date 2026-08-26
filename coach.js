/* =====================================================
   MY TRANSFORMATION
   COACH ENGINE — V1
===================================================== */

const COACH_KEY = "myTransformationCoach";


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
        return JSON.parse(data);
    } catch {
        return null;
    }
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
   MESSAGGI
===================================================== */

const COACH_MESSAGES = [

    "La motivazione cambia. La disciplina deve rimanere.",

    "Non devi essere perfetto. Devi essere costante.",

    "Il fisico che vuoi costruire dipende dalle decisioni che ripeti ogni giorno.",

    "Allenati anche quando non hai voglia. Ma recupera quando il corpo ne ha realmente bisogno.",

    "Una giornata storta non rovina un percorso. Abbandonare il percorso sì.",

    "Non inseguire il peso sulla bilancia. Guarda l'andamento nel tempo.",

    "Il tuo obiettivo non è dimagrire il più velocemente possibile. È diventare più definito mantenendo più muscolo possibile."

];


/* =====================================================
   MESSAGGIO CASUALE
===================================================== */

function getRandomCoachMessage() {

    return COACH_MESSAGES[
        Math.floor(
            Math.random() *
            COACH_MESSAGES.length
        )
    ];

}


/* =====================================================
   ANALISI DEL PESO
===================================================== */

function analyzeWeightTrend() {

    const progress =
        getCoachProgress();


    if (!progress) {

        return {

            status: "unknown",

            message:
                "Inizia a registrare il peso per poter analizzare il tuo andamento."

        };

    }


    if (
        progress.totalWeighIns < 3
    ) {

        return {

            status: "insufficient_data",

            message:
                "Abbiamo ancora pochi dati. Registra il peso con regolarità prima di modificare il piano."

        };

    }


    const change =
        progress.weightChange;


    if (
        change === null
    ) {

        return {

            status: "unknown",

            message:
                "Continua a registrare il peso per costruire uno storico affidabile."

        };

    }


    if (
        change < -2.5
    ) {

        return {

            status: "too_fast",

            message:
                "Il peso sta scendendo molto rapidamente. Non aumentare ulteriormente il deficit senza valutare andamento, recupero e performance."

        };

    }


    if (
        change < -0.2
    ) {

        return {

            status: "progress",

            message:
                "Il peso sta scendendo. Continua a seguire il piano e valuta anche le performance in palestra."

        };

    }


    if (
        Math.abs(change) <= 0.2
    ) {

        return {

            status: "stable",

            message:
                "Il peso è sostanzialmente stabile. Prima di modificare le calorie, osserviamo ancora l'andamento e l'aderenza."

        };

    }


    return {

        status: "increase",

        message:
            "Il peso è aumentato rispetto al punto di partenza. Controlliamo prima aderenza, porzioni e andamento medio."

    };

}


/* =====================================================
   ANALISI ALLENAMENTO
===================================================== */

function analyzeTraining() {

    const profile =
        getCoachProfile();


    const progress =
        getCoachProgress();


    if (
        !profile ||
        !progress
    ) {

        return {

            status: "unknown",

            message:
                "Completa il profilo e registra gli allenamenti per poter valutare la tua costanza."

        };

    }


    const adherence =
        progress.workoutAdherence;


    if (
        adherence >= 90
    ) {

        return {

            status: "excellent",

            message:
                "Ottima costanza negli allenamenti. Mantieni la qualità delle serie e cerca progressione graduale."

        };

    }


    if (
        adherence >= 75
    ) {

        return {

            status: "good",

            message:
                "La costanza è buona. Cerca di ridurre gli allenamenti saltati per rendere il percorso più prevedibile."

        };

    }


    if (
        adherence >= 50
    ) {

        return {

            status: "warning",

            message:
                "Stai saltando una parte importante degli allenamenti programmati. Prima di cambiare scheda, miglioriamo l'aderenza."

        };

    }


    return {

        status: "low",

        message:
            "La priorità in questo momento è costruire una routine di allenamento sostenibile."

    };

}


/* =====================================================
   ANALISI DIETA
===================================================== */

function analyzeNutrition() {

    const profile =
        getCoachProfile();


    const progress =
        getCoachProgress();


    if (
        !profile ||
        !progress
    ) {

        return {

            status: "unknown",

            message:
                "Registra i pasti per permettere al Coach di valutare l'aderenza alimentare."

        };

    }


    const adherence =
        progress.mealAdherence;


    if (
        adherence >= 90
    ) {

        return {

            status: "excellent",

            message:
                "Ottima aderenza alimentare. Non serve inseguire la perfezione: continua con questa costanza."

        };

    }


    if (
        adherence >= 75
    ) {

        return {

            status: "good",

            message:
                "L'aderenza è buona. Cerca di rendere più regolari i pasti mancanti."

        };

    }


    if (
        adherence >= 50
    ) {

        return {

            status: "warning",

            message:
                "La dieta viene seguita solo parzialmente. Prima di cambiare il piano, lavoriamo sulla costanza."

        };

    }


    return {

        status: "low",

        message:
            "Il piano alimentare non viene seguito abbastanza regolarmente per poter valutare correttamente i risultati."

    };

}


/* =====================================================
   GENERA ANALISI COMPLETA
===================================================== */

function generateCoachAnalysis() {

    const weight =
        analyzeWeightTrend();

    const training =
        analyzeTraining();

    const nutrition =
        analyzeNutrition();


    return {

        generatedAt:
            new Date()
                .toISOString(),

        weight:
            weight,

        training:
            training,

        nutrition:
            nutrition

    };

}


/* =====================================================
   MESSAGGIO INTELLIGENTE
===================================================== */

function generateCoachMessage() {

    const analysis =
        generateCoachAnalysis();


    /*
       Priorità:
       1. problemi importanti
       2. aderenza
       3. progresso
       4. motivazione
    */


    if (
        analysis.weight.status ===
        "too_fast"
    ) {

        return analysis.weight.message;

    }


    if (
        analysis.nutrition.status ===
        "low"
    ) {

        return analysis.nutrition.message;

    }


    if (
        analysis.training.status ===
        "low"
    ) {

        return analysis.training.message;

    }


    if (
        analysis.weight.status ===
        "progress"
    ) {

        return analysis.weight.message;

    }


    return getRandomCoachMessage();

}


/* =====================================================
   SALVA COACH
===================================================== */

function saveCoachAnalysis(
    analysis
) {

    if (
        typeof storageSet ===
        "function"
    ) {

        return storageSet(
            COACH_KEY,
            analysis
        );

    }


    localStorage.setItem(
        COACH_KEY,
        JSON.stringify(
            analysis
        )
    );


    return true;

}


/* =====================================================
   RECUPERA COACH
===================================================== */

function getSavedCoachAnalysis() {

    if (
        typeof storageGet ===
        "function"
    ) {

        return storageGet(
            COACH_KEY
        );

    }


    const data =
        localStorage.getItem(
            COACH_KEY
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
   AGGIORNA COACH
===================================================== */

function refreshCoach() {

    const analysis =
        generateCoachAnalysis();


    saveCoachAnalysis(
        analysis
    );


    return analysis;

}


/* =====================================================
   AVVIO
===================================================== */

function initializeCoach() {

    if (
        getCoachProfile()
    ) {

        refreshCoach();

    }

}


document.addEventListener(
    "DOMContentLoaded",
    initializeCoach
);