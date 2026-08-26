/* =====================================================
   MY TRANSFORMATION — NUTRITION.JS
   Motore nutrizionale — V1
===================================================== */

const NUTRITION_STORAGE_KEY = "myTransformationNutrition";


/* =====================================================
   LETTURA PROFILO
===================================================== */

function getNutritionProfile() {

    const data = localStorage.getItem(
        "myTransformationProfile"
    );

    if (!data) return null;

    try {
        return JSON.parse(data);
    } catch {
        return null;
    }
}


/* =====================================================
   CALCOLO BMR
   Mifflin-St Jeor
===================================================== */

function calculateBMR(profile) {

    const weight = Number(profile.weight);
    const height = Number(profile.height);
    const age = Number(profile.age);

    if (
        !Number.isFinite(weight) ||
        !Number.isFinite(height) ||
        !Number.isFinite(age)
    ) {
        return null;
    }

    let bmr;

    if (profile.sex === "male") {

        bmr =
            (10 * weight) +
            (6.25 * height) -
            (5 * age) +
            5;

    } else {

        bmr =
            (10 * weight) +
            (6.25 * height) -
            (5 * age) -
            161;

    }

    return Math.round(bmr);
}


/* =====================================================
   FATTORE ATTIVITÀ
===================================================== */

function getActivityMultiplier(profile) {

    /*
       Per ora utilizziamo il volume di allenamento
       come stima iniziale.

       In una fase successiva aggiungeremo anche
       l'attività quotidiana reale.
    */

    const days =
        Number(profile.trainingDays);


    if (days <= 2) {
        return 1.40;
    }

    if (days === 3) {
        return 1.50;
    }

    if (days === 4) {
        return 1.55;
    }

    if (days === 5) {
        return 1.65;
    }

    return 1.70;
}


/* =====================================================
   CALCOLO TDEE
===================================================== */

function calculateTDEE(profile) {

    const bmr =
        calculateBMR(profile);

    if (!bmr) return null;

    const multiplier =
        getActivityMultiplier(profile);

    return Math.round(
        bmr * multiplier
    );
}


/* =====================================================
   CALORIE TARGET
===================================================== */

function calculateCalorieTarget(profile) {

    const tdee =
        calculateTDEE(profile);

    if (!tdee) return null;

    let deficit = 0;

    /*
       L'obiettivo non è creare un deficit estremo.
       Partiamo in modo conservativo e poi
       adattiamo in base ai progressi reali.
    */

    switch (profile.goal) {

        case "fatloss":
            deficit = 0.15;
            break;

        case "definition":
            deficit = 0.15;
            break;

        case "recomp":
            deficit = 0.08;
            break;

        case "muscle":
            deficit = -0.05;
            break;

        default:
            deficit = 0;
    }


    const calories =
        Math.round(
            tdee * (1 - deficit)
        );


    return Math.max(
        calories,
        1400
    );
}


/* =====================================================
   PROTEINE
===================================================== */

function calculateProtein(profile) {

    const weight =
        Number(profile.weight);

    if (!Number.isFinite(weight)) {
        return null;
    }


    /*
       Target iniziale elevato ma ragionevole
       per preservare la massa muscolare
       durante la perdita di grasso.
    */

    return Math.round(
        weight * 2.0
    );
}


/* =====================================================
   GRASSI
===================================================== */

function calculateFat(profile) {

    const weight =
        Number(profile.weight);

    if (!Number.isFinite(weight)) {
        return null;
    }


    return Math.round(
        weight * 0.8
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

    if (
        !calories ||
        !protein ||
        !fat
    ) {
        return null;
    }


    const proteinCalories =
        protein * 4;

    const fatCalories =
        fat * 9;

    const remainingCalories =
        calories -
        proteinCalories -
        fatCalories;


    return Math.max(
        0,
        Math.round(
            remainingCalories / 4
        )
    );
}


/* =====================================================
   CREA TARGET NUTRIZIONALE
===================================================== */

function generateNutritionTarget(profile) {

    if (!profile) {
        return null;
    }


    const bmr =
        calculateBMR(profile);

    const tdee =
        calculateTDEE(profile);

    const calories =
        calculateCalorieTarget(profile);

    const protein =
        calculateProtein(profile);

    const fat =
        calculateFat(profile);

    const carbs =
        calculateCarbs(
            calories,
            protein,
            fat
        );


    return {

        bmr,

        tdee,

        calories,

        protein,

        carbs,

        fat,

        meals:
            Number(profile.meals),

        generatedAt:
            new Date().toISOString()

    };
}


/* =====================================================
   SALVA TARGET
===================================================== */

function saveNutritionTarget(target) {

    if (!target) return;

    localStorage.setItem(
        NUTRITION_STORAGE_KEY,
        JSON.stringify(target)
    );
}


/* =====================================================
   RECUPERA TARGET
===================================================== */

function getNutritionTarget() {

    const data =
        localStorage.getItem(
            NUTRITION_STORAGE_KEY
        );


    if (!data) return null;


    try {

        return JSON.parse(data);

    } catch {

        return null;

    }
}


/* =====================================================
   AGGIORNA TARGET
===================================================== */

function updateNutritionTarget() {

    const profile =
        getNutritionProfile();


    if (!profile) {
        return null;
    }


    const target =
        generateNutritionTarget(
            profile
        );


    saveNutritionTarget(
        target
    );


    return target;
}


/* =====================================================
   DISTRIBUZIONE PASTI
===================================================== */

function calculateMealDistribution(
    target
) {

    if (!target) {
        return [];
    }


    const meals =
        Number(target.meals);


    /*
       Distribuzione iniziale.
       In seguito la renderemo intelligente
       in base a orari e preferenze.
    */

    let percentages;


    if (meals === 2) {

        percentages = [
            0.45,
            0.55
        ];

    } else if (meals === 3) {

        percentages = [
            0.30,
            0.35,
            0.35
        ];

    } else if (meals === 4) {

        percentages = [
            0.25,
            0.30,
            0.20,
            0.25
        ];

    } else {

        percentages = [
            0.20,
            0.25,
            0.15,
            0.20,
            0.20
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
   INIZIALIZZAZIONE
===================================================== */

function initializeNutrition() {

    const profile =
        getNutritionProfile();


    if (!profile) {
        return;
    }


    const target =
        generateNutritionTarget(
            profile
        );


    if (target) {

        saveNutritionTarget(
            target
        );

    }

}


/* =====================================================
   AVVIO
===================================================== */

document.addEventListener(
    "DOMContentLoaded",
    initializeNutrition
);