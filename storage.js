/* =====================================================
   MY TRANSFORMATION
   STORAGE ENGINE — V1
   Memoria centrale dell'app
===================================================== */

const STORAGE = {

    PROFILE: "myTransformationProfile",

    NUTRITION: "myTransformationNutrition",

    MEALS: "myTransformationMeals",

    WORKOUT: "myTransformationWorkout",

    PROGRESS: "myTransformationProgress",

    SETTINGS: "myTransformationSettings",

    MONTHLY_PLAN: "myTransformationMonthlyPlan"

};


/* =====================================================
   FUNZIONI BASE
===================================================== */

/*
   Salva qualsiasi dato in formato JSON.
*/

function storageSet(key, value) {

    try {

        localStorage.setItem(
            key,
            JSON.stringify(value)
        );

        return true;

    } catch (error) {

        console.error(
            "Errore salvataggio:",
            error
        );

        return false;

    }

}


/*
   Recupera un dato JSON.
*/

function storageGet(key) {

    try {

        const data =
            localStorage.getItem(key);

        if (!data) {
            return null;
        }

        return JSON.parse(data);

    } catch (error) {

        console.error(
            "Errore lettura:",
            error
        );

        return null;

    }

}


/*
   Cancella un dato.
*/

function storageRemove(key) {

    try {

        localStorage.removeItem(key);

        return true;

    } catch (error) {

        console.error(
            "Errore cancellazione:",
            error
        );

        return false;

    }

}


/* =====================================================
   PROFILO
===================================================== */

function storageSaveProfile(profile) {

    return storageSet(
        STORAGE.PROFILE,
        profile
    );

}


function storageGetProfile() {

    return storageGet(
        STORAGE.PROFILE
    );

}


function storageDeleteProfile() {

    return storageRemove(
        STORAGE.PROFILE
    );

}


/* =====================================================
   NUTRIZIONE
===================================================== */

function storageSaveNutrition(
    nutrition
) {

    return storageSet(
        STORAGE.NUTRITION,
        nutrition
    );

}


function storageGetNutrition() {

    return storageGet(
        STORAGE.NUTRITION
    );

}


function storageDeleteNutrition() {

    return storageRemove(
        STORAGE.NUTRITION
    );

}


/* =====================================================
   PIANO PASTI
===================================================== */

function storageSaveMeals(
    meals
) {

    return storageSet(
        STORAGE.MEALS,
        meals
    );

}


function storageGetMeals() {

    return storageGet(
        STORAGE.MEALS
    );

}


function storageDeleteMeals() {

    return storageRemove(
        STORAGE.MEALS
    );

}


/* =====================================================
   ALLENAMENTO
===================================================== */

function storageSaveWorkout(
    workout
) {

    return storageSet(
        STORAGE.WORKOUT,
        workout
    );

}


function storageGetWorkout() {

    return storageGet(
        STORAGE.WORKOUT
    );

}


function storageDeleteWorkout() {

    return storageRemove(
        STORAGE.WORKOUT
    );

}


/* =====================================================
   PROGRESSI
===================================================== */

function storageSaveProgress(
    progress
) {

    return storageSet(
        STORAGE.PROGRESS,
        progress
    );

}


function storageGetProgress() {

    return storageGet(
        STORAGE.PROGRESS
    );

}


function storageDeleteProgress() {

    return storageRemove(
        STORAGE.PROGRESS
    );

}


/* =====================================================
   IMPOSTAZIONI
===================================================== */

function storageSaveSettings(
    settings
) {

    return storageSet(
        STORAGE.SETTINGS,
        settings
    );

}


function storageGetSettings() {

    return storageGet(
        STORAGE.SETTINGS
    );

}


/* =====================================================
   PIANO MENSILE
===================================================== */

function storageSaveMonthlyPlan(
    plan
) {

    return storageSet(
        STORAGE.MONTHLY_PLAN,
        plan
    );

}


function storageGetMonthlyPlan() {

    return storageGet(
        STORAGE.MONTHLY_PLAN
    );

}


function storageDeleteMonthlyPlan() {

    return storageRemove(
        STORAGE.MONTHLY_PLAN
    );

}


/* =====================================================
   RESET COMPLETO
===================================================== */

function storageResetAll() {

    Object.values(
        STORAGE
    ).forEach(
        key => {

            localStorage.removeItem(
                key
            );

        }
    );

}


/* =====================================================
   ESPORTAZIONE DATI
===================================================== */

/*
   In futuro potremo usare questa funzione
   per permetterti di esportare tutto il percorso.
*/

function storageExportAll() {

    return {

        profile:
            storageGetProfile(),

        nutrition:
            storageGetNutrition(),

        meals:
            storageGetMeals(),

        workout:
            storageGetWorkout(),

        progress:
            storageGetProgress(),

        settings:
            storageGetSettings(),

        monthlyPlan:
            storageGetMonthlyPlan(),

        exportedAt:
            new Date().toISOString()

    };

}


/* =====================================================
   IMPORTAZIONE DATI
===================================================== */

/*
   Serve per poter eventualmente trasferire
   il tuo percorso su un altro dispositivo.
*/

function storageImportAll(
    data
) {

    if (!data) {
        return false;
    }


    if (data.profile) {

        storageSaveProfile(
            data.profile
        );

    }


    if (data.nutrition) {

        storageSaveNutrition(
            data.nutrition
        );

    }


    if (data.meals) {

        storageSaveMeals(
            data.meals
        );

    }


    if (data.workout) {

        storageSaveWorkout(
            data.workout
        );

    }


    if (data.progress) {

        storageSaveProgress(
            data.progress
        );

    }


    if (data.settings) {

        storageSaveSettings(
            data.settings
        );

    }


    if (data.monthlyPlan) {

        storageSaveMonthlyPlan(
            data.monthlyPlan
        );

    }


    return true;

}


/* =====================================================
   STATO APP
===================================================== */

function getAppState() {

    return {

        profile:
            storageGetProfile(),

        nutrition:
            storageGetNutrition(),

        meals:
            storageGetMeals(),

        workout:
            storageGetWorkout(),

        progress:
            storageGetProgress(),

        settings:
            storageGetSettings(),

        monthlyPlan:
            storageGetMonthlyPlan()

    };

}