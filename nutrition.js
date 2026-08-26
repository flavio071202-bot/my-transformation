/* =====================================================
   MY TRANSFORMATION
   NUTRITION ENGINE — DEFINITIVE V1

   Responsabilità:
   - BMR
   - TDEE
   - calorie target
   - macronutrienti
   - distribuzione dei pasti
   - andamento del peso
   - adattamento prudente nel tempo

   Non sostituisce un professionista sanitario.
===================================================== */


/* =====================================================
   COSTANTI
===================================================== */

const NUTRITION_STORAGE_KEY =
    "myTransformationNutrition";


/*
   Limiti di sicurezza del motore.

   Non permettiamo al sistema di creare automaticamente
   deficit estremi.
*/

const NUTRITION_LIMITS = {

    minimumCaloriesMale: 1600,

    minimumCaloriesFemale: 1400,

    maximumDeficitPercent: 20,

    minimumProteinPerKg: 1.6,

    maximumProteinPerKg: 2.4,

    fatMinimumPerKg: 0.6

};


/* =====================================================
   LETTURA PROFILO
===================================================== */

function getNutritionProfile() {

    /*
       Prima prova ad usare storage.js.
    */

    if (
        typeof storageGetProfile ===
        "function"
    ) {

        return storageGetProfile();

    }


    /*
       Fallback per mantenere il modulo
       funzionante anche prima del collegamento
       definitivo.
    */

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
   NUMERO SICURO
===================================================== */

function nutritionNumber(
    value,
    fallback = 0
) {

    const number =
        Number(value);


    if (
        Number.isFinite(number)
    ) {

        return number;

    }


    return fallback;

}


/* =====================================================
   ARROTONDAMENTO
===================================================== */

function roundNutrition(
    value,
    decimals = 0
) {

    const multiplier =
        Math.pow(
            10,
            decimals
        );


    return Math.round(
        value * multiplier
    ) / multiplier;

}


/* =====================================================
   BMR — MIFFLIN ST JEOR
===================================================== */

function calculateBMR(
    profile
) {

    if (!profile) {

        return null;

    }


    const age =
        nutritionNumber(
            profile.age
        );

    const height =
        nutritionNumber(
            profile.height
        );

    const weight =
        nutritionNumber(
            profile.weight
        );


    if (
        age <= 0 ||
        height <= 0 ||
        weight <= 0
    ) {

        return null;

    }


    /*
       Uomo:
       BMR = 10W + 6.25H - 5A + 5

       Donna:
       BMR = 10W + 6.25H - 5A - 161
    */

    const sex =
        String(
            profile.sex || ""
        )
        .toLowerCase();


    let sexConstant = 5;


    if (
        sex === "female" ||
        sex === "femmina" ||
        sex === "donna" ||
        sex === "f"
    ) {

        sexConstant = -161;

    }


    const bmr =
        (
            10 * weight
        ) +
        (
            6.25 * height
        ) -
        (
            5 * age
        ) +
        sexConstant;


    return roundNutrition(
        bmr
    );

}


/* =====================================================
   FATTORE ATTIVITÀ
===================================================== */

function getActivityFactor(
    trainingDays
) {

    const days =
        nutritionNumber(
            trainingDays
        );


    /*
       Valori volutamente moderati.
       L'allenamento non significa automaticamente
       attività fisica elevata per tutta la giornata.
    */

    if (days <= 0) {

        return 1.30;

    }


    if (days === 1) {

        return 1.375;

    }


    if (days === 2) {

        return 1.45;

    }


    if (days === 3) {

        return 1.50;

    }


    if (days === 4) {

        return 1.55;

    }


    if (days === 5) {

        return 1.60;

    }


    return 1.65;

}


/* =====================================================
   TDEE
===================================================== */

function calculateTDEE(
    profile
) {

    const bmr =
        calculateBMR(
            profile
        );


    if (
        bmr === null
    ) {

        return null;

    }


    const activity =
        getActivityFactor(
            profile.trainingDays
        );


    return roundNutrition(
        bmr * activity
    );

}


/* =====================================================
   OBIETTIVO
===================================================== */

function getGoalSettings(
    goal
) {

    const normalized =
        String(
            goal || ""
        )
        .toLowerCase()
        .trim();


    /*
       Obiettivo principale:
       perdere grasso mantenendo/costruendo
       più massa possibile.
    */


    if (
        normalized === "fatloss" ||
        normalized === "perdere_grasso" ||
        normalized === "loss"
    ) {

        return {

            deficit: 0.18,

            proteinPerKg: 2.2

        };

    }


    if (
        normalized === "definition" ||
        normalized === "definizione"
    ) {

        return {

            deficit: 0.15,

            proteinPerKg: 2.2

        };

    }


    if (
        normalized === "recomp" ||
        normalized === "ricomposizione"
    ) {

        return {

            deficit: 0.08,

            proteinPerKg: 2.1

        };

    }


    if (
        normalized === "muscle" ||
        normalized === "massa"
    ) {

        return {

            surplus: 0.08,

            proteinPerKg: 1.8

        };

    }


    /*
       Fallback.
    */

    return {

        deficit: 0.10,

        proteinPerKg: 2.0

    };

}


/* =====================================================
   CALORIE TARGET
===================================================== */

function calculateTargetCalories(
    profile,
    tdee
) {

    if (
        !profile ||
        !tdee
    ) {

        return null;

    }


    const settings =
        getGoalSettings(
            profile.goal
        );


    let calories;


    /*
       Definizione / perdita grasso.
    */

    if (
        settings.deficit
    ) {

        calories =
            tdee *
            (
                1 -
                settings.deficit
            );

    }


    /*
       Massa.
    */

    else if (
        settings.surplus
    ) {

        calories =
            tdee *
            (
                1 +
                settings.surplus
            );

    }


    else {

        calories =
            tdee;

    }


    /*
       Limite minimo.
    */

    const sex =
        String(
            profile.sex || ""
        )
        .toLowerCase();


    const minimum =
        (
            sex === "female" ||
            sex === "femmina" ||
            sex === "donna" ||
            sex === "f"
        )
            ? NUTRITION_LIMITS
                .minimumCaloriesFemale
            : NUTRITION_LIMITS
                .minimumCaloriesMale;


    calories =
        Math.max(
            calories,
            minimum
        );


    return roundNutrition(
        calories
    );

}


/* =====================================================
   PROTEINE
===================================================== */

function calculateProtein(
    profile
) {

    const weight =
        nutritionNumber(
            profile.weight
        );


    const settings =
        getGoalSettings(
            profile.goal
        );


    let grams =
        weight *
        settings.proteinPerKg;


    grams =
        Math.max(
            grams,
            weight *
            NUTRITION_LIMITS
                .minimumProteinPerKg
        );


    grams =
        Math.min(
            grams,
            weight *
            NUTRITION_LIMITS
                .maximumProteinPerKg
        );


    return roundNutrition(
        grams
    );

}


/* =====================================================
   GRASSI
===================================================== */

function calculateFat(
    profile
) {

    const weight =
        nutritionNumber(
            profile.weight
        );


    /*
       Base iniziale:
       circa 0.8 g/kg.
    */

    const grams =
        Math.max(
            weight * 0.8,
            weight *
            NUTRITION_LIMITS
                .fatMinimumPerKg
        );


    return roundNutrition(
        grams
    );

}


/* =====================================================
   CARBOIDRATI
===================================================== */

function calculateCarbs(
    calories,
    protein,
    fat
) {

    /*
       1 g proteine = 4 kcal
       1 g carboidrati = 4 kcal
       1 g grassi = 9 kcal
    */

    const proteinCalories =
        protein * 4;


    const fatCalories =
        fat * 9;


    const remainingCalories =
        calories -
        proteinCalories -
        fatCalories;


    const carbs =
        remainingCalories / 4;


    return Math.max(
        0,
        roundNutrition(
            carbs
        )
    );

}


/* =====================================================
   CREA TARGET COMPLETO
===================================================== */

function calculateNutritionTarget(
    profile
) {

    if (!profile) {

        return null;

    }


    const bmr =
        calculateBMR(
            profile
        );


    const tdee =
        calculateTDEE(
            profile
        );


    if (
        bmr === null ||
        tdee === null
    ) {

        return null;

    }


    const calories =
        calculateTargetCalories(
            profile,
            tdee
        );


    const protein =
        calculateProtein(
            profile
        );


    const fat =
        calculateFat(
            profile
        );


    const carbs =
        calculateCarbs(
            calories,
            protein,
            fat
        );


    /*
       Controllo finale delle calorie
       derivanti dai macro.
    */

    const calculatedCalories =
        (
            protein * 4
        ) +
        (
            carbs * 4
        ) +
        (
            fat * 9
        );


    return {

        calories:
            calories,

        protein:
            protein,

        carbs:
            carbs,

        fat:
            fat,

        bmr:
            bmr,

        tdee:
            tdee,

        calculatedCalories:
            roundNutrition(
                calculatedCalories
            ),

        activityFactor:
            getActivityFactor(
                profile.trainingDays
            ),

        goal:
            profile.goal,

        generatedAt:
            new Date()
                .toISOString()

    };

}


/* =====================================================
   RECUPERA TARGET SALVATO
===================================================== */

function getNutritionTarget() {

    /*
       Prima cerca nello storage centrale.
    */

    if (
        typeof storageGetNutrition ===
        "function"
    ) {

        const stored =
            storageGetNutrition();


        if (stored) {

            return stored;

        }

    }


    /*
       Fallback.
    */

    const data =
        localStorage.getItem(
            NUTRITION_STORAGE_KEY
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
   SALVA TARGET
===================================================== */

function saveNutritionTarget(
    target
) {

    if (!target) {

        return false;

    }


    if (
        typeof storageSaveNutrition ===
        "function"
    ) {

        return storageSaveNutrition(
            target
        );

    }


    localStorage.setItem(
        NUTRITION_STORAGE_KEY,
        JSON.stringify(
            target
        )
    );


    return true;

}


/* =====================================================
   GENERA / AGGIORNA TARGET
===================================================== */

function refreshNutrition() {

    const profile =
        getNutritionProfile();


    if (!profile) {

        return null;

    }


    const target =
        calculateNutritionTarget(
            profile
        );


    if (!target) {

        return null;

    }


    saveNutritionTarget(
        target
    );


    return target;

}


/* =====================================================
   DISTRIBUZIONE DEI PASTI
===================================================== */

function getMealDistribution(
    target
) {

    if (!target) {

        return [];

    }


    const profile =
        getNutritionProfile();


    const meals =
        profile
            ? nutritionNumber(
                profile.meals,
                3
            )
            : 3;


    /*
       Per 3 pasti:

       Colazione 25%
       Pranzo    40%
       Cena      35%

       Le proteine vengono distribuite
       abbastanza uniformemente.
    */

    let percentages;


    if (meals === 3) {

        percentages = [
            0.25,
            0.40,
            0.35
        ];

    }


    /*
       Per 4 pasti.
    */

    else if (meals === 4) {

        percentages = [
            0.22,
            0.33,
            0.15,
            0.30
        ];

    }


    /*
       Per 5 pasti.
    */

    else if (meals === 5) {

        percentages = [
            0.20,
            0.30,
            0.15,
            0.10,
            0.25
        ];

    }


    /*
       Fallback.
    */

    else {

        percentages = [
            0.25,
            0.40,
            0.35
        ];

    }


    return percentages.map(
        percentage => ({

            calories:
                Math.round(
                    target.calories *
                    percentage
                ),

            protein:
                Math.round(
                    target.protein *
                    percentage
                ),

            carbs:
                Math.round(
                    target.carbs *
                    percentage
                ),

            fat:
                Math.round(
                    target.fat *
                    percentage
                )

        })
    );

}


/* =====================================================
   ANALISI PESO
===================================================== */

function getNutritionProgress() {

    if (
        typeof getProgressSummary !==
        "function"
    ) {

        return null;

    }


    return getProgressSummary();

}


/* =====================================================
   ADATTAMENTO CALORIE
===================================================== */

function calculateAdaptiveCalories() {

    const profile =
        getNutritionProfile();


    if (!profile) {

        return null;

    }


    const currentTarget =
        getNutritionTarget();


    if (!currentTarget) {

        return refreshNutrition();

    }


    /*
       Senza dati sufficienti NON tocchiamo
       le calorie.
    */

    const progress =
        getNutritionProgress();


    if (
        !progress ||
        progress.totalWeighIns < 3
    ) {

        return currentTarget;

    }


    const latest =
        progress.latestWeight;


    const average =
        progress.averageWeight7;


    if (
        latest === null ||
        average === null
    ) {

        return currentTarget;

    }


    /*
       Per evitare modifiche impulsive,
       l'adattamento automatico viene limitato.

       Questa funzione prepara il sistema
       per l'analisi settimanale/mensile.
    */

    return currentTarget;

}


/* =====================================================
   STATO NUTRIZIONALE COMPLETO
===================================================== */

function getNutritionSummary() {

    const profile =
        getNutritionProfile();


    const target =
        getNutritionTarget();


    if (
        !profile ||
        !target
    ) {

        return null;

    }


    const mealDistribution =
        getMealDistribution(
            target
        );


    return {

        calories:
            target.calories,

        protein:
            target.protein,

        carbs:
            target.carbs,

        fat:
            target.fat,

        bmr:
            target.bmr,

        tdee:
            target.tdee,

        calculatedCalories:
            target.calculatedCalories,

        meals:
            mealDistribution

    };

}


/* =====================================================
   RESET
===================================================== */

function resetNutrition() {

    if (
        typeof storageDeleteNutrition ===
        "function"
    ) {

        return storageDeleteNutrition();

    }


    localStorage.removeItem(
        NUTRITION_STORAGE_KEY
    );


    return true;

}


/* =====================================================
   INIZIALIZZAZIONE
===================================================== */

function initializeNutrition() {

    const profile =
        getNutritionProfile();


    if (!profile) {

        return;

    }


    /*
       Se non esiste ancora un target,
       crealo.
    */

    if (
        !getNutritionTarget()
    ) {

        refreshNutrition();

    }

}


/* =====================================================
   AVVIO
===================================================== */

document.addEventListener(
    "DOMContentLoaded",
    initializeNutrition
);