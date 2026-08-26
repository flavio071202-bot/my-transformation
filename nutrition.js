/* =====================================================
   MY TRANSFORMATION
   NUTRITION ENGINE
===================================================== */

const NUTRITION_KEY = "myTransformationNutrition";


/* =====================================================
   PROFILO
===================================================== */

function getNutritionProfile() {

    const data = localStorage.getItem(
        "myTransformationProfile"
    );

    if (!data) {
        return null;
    }

    try {
        return JSON.parse(data);
    } catch (error) {
        console.error(
            "Errore profilo nutrizionale:",
            error
        );
        return null;
    }
}


/* =====================================================
   BMR — MIFFLIN ST JEOR
===================================================== */

function calculateBMR(profile) {

    if (!profile) {
        return null;
    }

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

    if (profile.sex === "male") {

        return Math.round(
            (10 * weight) +
            (6.25 * height) -
            (5 * age) +
            5
        );

    }

    return Math.round(
        (10 * weight) +
        (6.25 * height) -
        (5 * age) -
        161
    );
}


/* =====================================================
   ATTIVITÀ
===================================================== */

function getActivityMultiplier(profile) {

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
   TDEE
===================================================== */

function calculateTDEE(profile) {

    const bmr =
        calculateBMR(profile);

    if (!bmr) {
        return null;
    }

    return Math.round(
        bmr *
        getActivityMultiplier(profile)
    );
}


/* =====================================================
   CALORIE TARGET
===================================================== */

function calculateCalories(profile) {

    const tdee =
        calculateTDEE(profile);

    if (!tdee) {
        return null;
    }

    let factor = 1;


    switch (profile.goal) {

        case "fatloss":
            factor = 0.85;
            break;

        case "definition":
            factor = 0.85;
            break;

        case "recomp":
            factor = 0.92;
            break;

        case "muscle":
            factor = 1.05;
            break;

        default:
            factor = 1;

    }


    /*
       Limite prudenziale.
       Il sistema verrà raffinato successivamente
       con peso, andamento e feedback.
    */

    return Math.round(
        Math.max(
            1400,
            tdee * factor
        )
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

    return Math.round(
        weight * 2
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

    const remaining =
        calories -
        proteinCalories -
        fatCalories;


    return Math.max(
        0,
        Math.round(
            remaining / 4
        )
    );
}


/* =====================================================
   CREA TARGET
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
        calculateCalories(profile);

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

        bmr: bmr,

        tdee: tdee,

        calories: calories,

        protein: protein,

        carbs: carbs,

        fat: fat,

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

    if (!target) {
        return;
    }

    localStorage.setItem(
        NUTRITION_KEY,
        JSON.stringify(target)
    );
}


/* =====================================================
   LEGGE TARGET
===================================================== */

function getNutritionTarget() {

    const data =
        localStorage.getItem(
            NUTRITION_KEY
        );


    if (!data) {
        return null;
    }


    try {

        return JSON.parse(data);

    } catch (error) {

        console.error(
            "Errore target nutrizionale:",
            error
        );

        return null;
    }
}


/* =====================================================
   AGGIORNA TARGET
===================================================== */

function refreshNutrition() {

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
   DISTRIBUZIONE DEI PASTI
===================================================== */

function getMealDistribution(
    target
) {

    if (!target) {
        return [];
    }


    const meals =
        Number(target.meals);


    let percentages;


    switch (meals) {

        case 2:

            percentages = [
                0.45,
                0.55
            ];

            break;


        case 3:

            percentages = [
                0.30,
                0.35,
                0.35
            ];

            break;


        case 4:

            percentages = [
                0.25,
                0.30,
                0.20,
                0.25
            ];

            break;


        case 5:

            percentages = [
                0.20,
                0.25,
                0.15,
                0.20,
                0.20
            ];

            break;


        default:

            percentages = [
                0.30,
                0.35,
                0.35
            ];

    }


    return percentages.map(
        percentage => {

            return {

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

            };

        }
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


    refreshNutrition();

}


/* =====================================================
   AVVIO
===================================================== */

document.addEventListener(
    "DOMContentLoaded",
    initializeNutrition
);