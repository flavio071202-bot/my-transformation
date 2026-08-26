/* =====================================================
   MY TRANSFORMATION
   APP ENGINE — DEFINITIVE V1
===================================================== */


/* =====================================================
   COSTANTI
===================================================== */

const APP_NAME = "MY TRANSFORMATION";

const APP_VERSION = "1.0.0";


/* =====================================================
   PROFILO
===================================================== */

function appGetProfile() {

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
   MOSTRA / NASCONDI SETUP
===================================================== */

function showSetupScreen() {

    const setup =
        document.getElementById(
            "setupScreen"
        );

    const app =
        document.getElementById(
            "mainApp"
        );


    if (setup) {

        setup.classList.remove(
            "hidden"
        );

    }


    if (app) {

        app.classList.add(
            "hidden"
        );

    }

}


/* =====================================================
   MOSTRA APP
===================================================== */

function showMainApplication() {

    const setup =
        document.getElementById(
            "setupScreen"
        );

    const app =
        document.getElementById(
            "mainApp"
        );


    if (setup) {

        setup.classList.add(
            "hidden"
        );

    }


    if (app) {

        app.classList.remove(
            "hidden"
        );

    }

}


/* =====================================================
   SALVA PROFILO
===================================================== */

function saveUserProfile(
    profile
) {

    if (!profile) {

        return false;

    }


    if (
        typeof storageSaveProfile ===
        "function"
    ) {

        return storageSaveProfile(
            profile
        );

    }


    localStorage.setItem(
        "myTransformationProfile",
        JSON.stringify(
            profile
        )
    );


    return true;

}


/* =====================================================
   LETTURA CAMPO
===================================================== */

function getInputValue(
    id
) {

    const element =
        document.getElementById(
            id
        );


    if (!element) {

        return "";

    }


    return element.value.trim();

}


/* =====================================================
   CONFIGURAZIONE PROFILO
===================================================== */

function completeSetup() {

    const profile = {

        age:
            getInputValue(
                "setupAge"
            ),

        sex:
            getInputValue(
                "setupSex"
            ),

        height:
            getInputValue(
                "setupHeight"
            ),

        weight:
            getInputValue(
                "setupWeight"
            ),

        goal:
            getInputValue(
                "setupGoal"
            ),

        trainingDays:
            getInputValue(
                "setupTrainingDays"
            ),

        trainingDuration:
            getInputValue(
                "setupTrainingDuration"
            ),

        trainingPlace:
            getInputValue(
                "setupTrainingPlace"
            ),

        meals:
            getInputValue(
                "setupMeals"
            ),

        likes:
            getInputValue(
                "setupLikes"
            ),

        dislikes:
            getInputValue(
                "setupDislikes"
            ),

        allergies:
            getInputValue(
                "setupAllergies"
            ),

        createdAt:
            new Date().toISOString(),

        updatedAt:
            new Date().toISOString()

    };


    /* =================================================
       VALIDAZIONE
    ================================================= */

    const age =
        Number(profile.age);

    const height =
        Number(profile.height);

    const weight =
        Number(profile.weight);

    const trainingDays =
        Number(
            profile.trainingDays
        );

    const meals =
        Number(
            profile.meals
        );


    if (
        !profile.age ||
        !profile.sex ||
        !profile.height ||
        !profile.weight ||
        !profile.goal ||
        !profile.trainingDays ||
        !profile.trainingDuration ||
        !profile.trainingPlace ||
        !profile.meals
    ) {

        alert(
            "Completa tutti i campi obbligatori."
        );

        return false;

    }


    if (
        !Number.isFinite(age) ||
        age < 13 ||
        age > 100
    ) {

        alert(
            "Inserisci un'età valida."
        );

        return false;

    }


    if (
        !Number.isFinite(height) ||
        height < 100 ||
        height > 250
    ) {

        alert(
            "Inserisci un'altezza valida."
        );

        return false;

    }


    if (
        !Number.isFinite(weight) ||
        weight < 30 ||
        weight > 300
    ) {

        alert(
            "Inserisci un peso valido."
        );

        return false;

    }


    if (
        !Number.isFinite(
            trainingDays
        ) ||
        trainingDays < 1 ||
        trainingDays > 7
    ) {

        alert(
            "Inserisci un numero di allenamenti valido."
        );

        return false;

    }


    if (
        !Number.isFinite(
            meals
        ) ||
        meals < 3 ||
        meals > 5
    ) {

        alert(
            "Il numero di pasti deve essere tra 3 e 5."
        );

        return false;

    }


    /* =================================================
       SALVATAGGIO
    ================================================= */

    saveUserProfile(
        profile
    );


    /*
       Aggiorna il motore nutrizionale.
    */

    if (
        typeof refreshNutrition ===
        "function"
    ) {

        refreshNutrition();

    }


    /*
       Genera il piano alimentare.
    */

    if (
        typeof refreshDailyMeals ===
        "function"
    ) {

        refreshDailyMeals();

    }


    /*
       Genera la scheda.
    */

    if (
        typeof refreshWorkout ===
        "function"
    ) {

        refreshWorkout();

    }


    /*
       Aggiorna Coach.
    */

    if (
        typeof refreshCoach ===
        "function"
    ) {

        refreshCoach();

    }


    showMainApplication();

    updateAllScreens();

    showScreen(
        "home"
    );


    return true;

}


/* =====================================================
   MODIFICA PROFILO
===================================================== */

function editProfile() {

    const profile =
        appGetProfile();


    if (!profile) {

        showSetupScreen();

        return;

    }


    const fields = {

        setupAge:
            profile.age,

        setupSex:
            profile.sex,

        setupHeight:
            profile.height,

        setupWeight:
            profile.weight,

        setupGoal:
            profile.goal,

        setupTrainingDays:
            profile.trainingDays,

        setupTrainingDuration:
            profile.trainingDuration,

        setupTrainingPlace:
            profile.trainingPlace,

        setupMeals:
            profile.meals,

        setupLikes:
            profile.likes || "",

        setupDislikes:
            profile.dislikes || "",

        setupAllergies:
            profile.allergies || ""

    };


    Object.entries(
        fields
    ).forEach(
        ([id, value]) => {

            const element =
                document.getElementById(
                    id
                );


            if (element) {

                element.value =
                    value;

            }

        }
    );


    showSetupScreen();

}


/* =====================================================
   RESET PROFILO
===================================================== */

function resetProfile() {

    const confirmation =
        confirm(
            "Vuoi cancellare il profilo e tutti i dati della trasformazione?"
        );


    if (!confirmation) {

        return;

    }


    if (
        typeof storageResetAll ===
        "function"
    ) {

        storageResetAll();

    } else {

        localStorage.clear();

    }


    location.reload();

}


/* =====================================================
   DASHBOARD
===================================================== */

function updateDashboard() {

    const profile =
        appGetProfile();


    if (!profile) {

        return;

    }


    const target =
        typeof getNutritionTarget ===
        "function"
            ? getNutritionTarget()
            : null;


    const progress =
        typeof getProgressSummary ===
        "function"
            ? getProgressSummary()
            : null;


    /* ================================================
       PESO
    ================================================ */

    setText(
        "homeWeight",
        `${profile.weight} kg`
    );


    /* ================================================
       OBIETTIVO
    ================================================ */

    const goalNames = {

        fatloss:
            "Perdita di grasso",

        definition:
            "Definizione",

        recomp:
            "Ricomposizione",

        muscle:
            "Massa"

    };


    setText(
        "homeGoal",
        goalNames[
            profile.goal
        ] || profile.goal
    );


    /* ================================================
       ALLENAMENTI
    ================================================ */

    setText(
        "homeTraining",
        profile.trainingDays
    );


    /* ================================================
       PASTI
    ================================================ */

    setText(
        "homeMeals",
        profile.meals
    );


    /* ================================================
       CALORIE
    ================================================ */

    if (target) {

        setText(
            "homeCalories",
            `${target.calories} kcal`
        );

    }


    /* ================================================
       PROGRESSO
    ================================================ */

    if (progress) {

        setText(
            "homeProgressWeight",
            progress.latestWeight !== null
                ? `${progress.latestWeight} kg`
                : "—"
        );


        setText(
            "homeWorkoutAdherence",
            `${progress.workoutAdherence}%`
        );


        setText(
            "homeMealAdherence",
            `${progress.mealAdherence}%`
        );

    }

}


/* =====================================================
   SCHERMATA DIETA
===================================================== */

function updateDietScreen() {

    const target =
        typeof getNutritionTarget ===
        "function"
            ? getNutritionTarget()
            : null;


    if (target) {

        setText(
            "dietCalories",
            `${target.calories}`
        );


        setText(
            "dietProtein",
            `${target.protein} g`
        );


        setText(
            "dietCarbs",
            `${target.carbs} g`
        );


        setText(
            "dietFat",
            `${target.fat} g`
        );

    }


    const plan =
        typeof getSavedMealsPlan ===
        "function"
            ? getSavedMealsPlan()
            : null;


    if (!plan) {

        return;

    }


    renderMealsPlan(
        plan
    );

}


/* =====================================================
   RENDER PASTI
===================================================== */

function renderMealsPlan(
    plan
) {

    if (
        !plan ||
        !plan.meals
    ) {

        return;

    }


    plan.meals.forEach(
        (
            meal,
            index
        ) => {

            const element =
                document.getElementById(
                    `meal${index + 1}`
                );


            if (!element) {

                return;

            }


            const foods =
                meal.foods
                    .map(
                        food => `
                            <div class="meal-food">
                                <span>
                                    ${escapeHTML(
                                        food.name
                                    )}
                                    <small>
                                        ${food.grams} g
                                    </small>
                                </span>

                                <strong>
                                    ${food.kcal} kcal
                                </strong>
                            </div>
                        `
                    )
                    .join("");


            element.innerHTML = `

                <div class="meal-header">

                    <strong>
                        ${escapeHTML(
                            meal.name
                        )}
                    </strong>

                    <span>
                        ${meal.totals.kcal} kcal
                    </span>

                </div>

                <div class="meal-foods">

                    ${foods}

                </div>

                <div class="meal-macros">

                    P ${meal.totals.protein} g

                    ·

                    C ${meal.totals.carbs} g

                    ·

                    G ${meal.totals.fat} g

                </div>

            `;

        }
    );


    setText(
        "dietTotalCalories",
        `${plan.totals.kcal} kcal`
    );


    setText(
        "dietTotalProtein",
        `${plan.totals.protein} g`
    );


    setText(
        "dietTotalCarbs",
        `${plan.totals.carbs} g`
    );


    setText(
        "dietTotalFat",
        `${plan.totals.fat} g`
    );

}


/* =====================================================
   SCHERMATA ALLENAMENTO
===================================================== */

function updateWorkoutScreen() {

    const workout =
        typeof getStoredWorkout ===
        "function"
            ? getStoredWorkout()
            : null;


    if (!workout) {

        return;

    }


    const todayIndex =
        getTrainingDayIndex(
            workout
        );


    const todayWorkout =
        workout.workouts[
            todayIndex
        ];


    if (!todayWorkout) {

        return;

    }


    setText(
        "workoutTitle",
        todayWorkout.name
    );


    setText(
        "workoutExerciseCount",
        `${todayWorkout.exercises.length} esercizi`
    );


    todayWorkout.exercises.forEach(
        (
            exercise,
            index
        ) => {

            const element =
                document.getElementById(
                    `exercise${index + 1}`
                );


            if (!element) {

                return;

            }


            element.innerHTML = `

                <div class="exercise-name">

                    <strong>
                        ${escapeHTML(
                            exercise.name
                        )}
                    </strong>

                    <small>
                        ${escapeHTML(
                            exercise.muscle
                        )}
                    </small>

                </div>

                <div class="exercise-data">

                    ${exercise.sets} ×
                    ${escapeHTML(
                        exercise.reps
                    )}

                    <span>
                        RIR ${exercise.rir}
                    </span>

                </div>

                <div class="exercise-rest">

                    Recupero:
                    ${exercise.rest}s

                </div>

            `;

        }
    );

}


/* =====================================================
   GIORNO ALLENAMENTO
===================================================== */

function getTrainingDayIndex(
    workout
) {

    if (
        !workout ||
        !workout.workouts ||
        !workout.workouts.length
    ) {

        return 0;

    }


    /*
       Usiamo il giorno della settimana.
       Se oggi è domenica, utilizziamo l'ultimo
       allenamento disponibile.
    */

    const day =
        new Date()
            .getDay();


    if (day === 0) {

        return (
            workout.workouts.length -
            1
        );

    }


    return Math.min(
        day - 1,
        workout.workouts.length - 1
    );

}


/* =====================================================
   PROGRESSI
===================================================== */

function updateProgressScreen() {

    if (
        typeof getProgressSummary !==
        "function"
    ) {

        return;

    }


    const progress =
        getProgressSummary();


    if (!progress) {

        return;

    }


    setText(
        "progressWeight",
        progress.latestWeight !== null
            ? `${progress.latestWeight} kg`
            : "—"
    );


    setText(
        "progressAverage",
        progress.averageWeight7 !== null
            ? `${progress.averageWeight7} kg`
            : "—"
    );


    setText(
        "progressChange",
        progress.weightChange !== null
            ? `${progress.weightChange > 0 ? "+" : ""}${progress.weightChange} kg`
            : "—"
    );


    setText(
        "progressWorkoutAdherence",
        `${progress.workoutAdherence}%`
    );


    setText(
        "progressMealAdherence",
        `${progress.mealAdherence}%`
    );

}


/* =====================================================
   COACH
===================================================== */

function updateCoachScreen() {

    const message =
        typeof generateCoachMessage ===
        "function"
            ? generateCoachMessage()
            : null;


    if (message) {

        setText(
            "coachMessage",
            message
        );

    }


    const analysis =
        typeof generateCoachAnalysis ===
        "function"
            ? generateCoachAnalysis()
            : null;


    if (!analysis) {

        return;

    }


    setText(
        "coachWeightAnalysis",
        analysis.weight.message
    );


    setText(
        "coachTrainingAnalysis",
        analysis.training.message
    );


    setText(
        "coachNutritionAnalysis",
        analysis.nutrition.message
    );

}


/* =====================================================
   PROFILO
===================================================== */

function updateProfileScreen() {

    const profile =
        appGetProfile();


    if (!profile) {

        return;

    }


    setText(
        "profileAge",
        profile.age
    );


    setText(
        "profileHeight",
        `${profile.height} cm`
    );


    setText(
        "profileWeight",
        `${profile.weight} kg`
    );


    setText(
        "profileTrainingDays",
        profile.trainingDays
    );


    setText(
        "profileMeals",
        profile.meals
    );

}


/* =====================================================
   AGGIORNA TUTTE LE SCHERMATE
===================================================== */

function updateAllScreens() {

    updateDashboard();

    updateDietScreen();

    updateWorkoutScreen();

    updateProgressScreen();

    updateCoachScreen();

    updateProfileScreen();

}


/* =====================================================
   NAVIGAZIONE
===================================================== */

function showScreen(
    screenId,
    button = null
) {

    const screens =
        document.querySelectorAll(
            ".screen"
        );


    screens.forEach(
        screen => {

            screen.classList.remove(
                "active"
            );

        }
    );


    const target =
        document.getElementById(
            screenId
        );


    if (!target) {

        return;

    }


    target.classList.add(
        "active"
    );


    const buttons =
        document.querySelectorAll(
            ".nav button"
        );


    buttons.forEach(
        navButton => {

            navButton.classList.remove(
                "active"
            );

        }
    );


    if (button) {

        button.classList.add(
            "active"
        );

    }


    else {

        const matchingButton =
            document.querySelector(
                `.nav button[data-screen="${screenId}"]`
            );


        if (matchingButton) {

            matchingButton.classList.add(
                "active"
            );

        }

    }


    /*
       Aggiorna la schermata appena aperta.
    */

    if (
        screenId ===
        "home"
    ) {

        updateDashboard();

    }


    if (
        screenId ===
        "diet"
    ) {

        updateDietScreen();

    }


    if (
        screenId ===
        "workout"
    ) {

        updateWorkoutScreen();

    }


    if (
        screenId ===
        "progress"
    ) {

        updateProgressScreen();

    }


    if (
        screenId ===
        "coach"
    ) {

        updateCoachScreen();

    }


    if (
        screenId ===
        "profile"
    ) {

        updateProfileScreen();

    }


    window.scrollTo(
        0,
        0
    );

}


/* =====================================================
   COMPLETA ALLENAMENTO
===================================================== */

function completeWorkout(
    workoutIndex,
    exerciseIndex
) {

    if (
        typeof completeExercise !==
        "function"
    ) {

        return;

    }


    const result =
        completeExercise(
            workoutIndex,
            exerciseIndex
        );


    if (result) {

        updateWorkoutScreen();

    }

}


/* =====================================================
   COMPLETA PASTO
===================================================== */

function completeMeal(
    mealId
) {

    if (
        typeof toggleMealCompleted !==
        "function"
    ) {

        return;

    }


    toggleMealCompleted(
        mealId
    );


    updateDietScreen();

    updateDashboard();

}


/* =====================================================
   REGISTRA PESO
===================================================== */

function recordWeight(
    weight
) {

    if (
        typeof addWeightEntry !==
        "function"
    ) {

        return false;

    }


    const result =
        addWeightEntry(
            weight
        );


    if (result) {

        updateProgressScreen();

        updateDashboard();

        updateCoachScreen();

    }


    return result;

}


/* =====================================================
   REGISTRA MISURE
===================================================== */

function recordMeasurements(
    measurements
) {

    if (
        typeof addMeasurementEntry !==
        "function"
    ) {

        return false;

    }


    const result =
        addMeasurementEntry(
            measurements
        );


    if (result) {

        updateProgressScreen();

        updateCoachScreen();

    }


    return result;

}


/* =====================================================
   RIGENERA DIETA
===================================================== */

function regenerateDailyMeals() {

    if (
        typeof refreshDailyMeals !==
        "function"
    ) {

        return null;

    }


    const plan =
        refreshDailyMeals();


    updateDietScreen();


    return plan;

}


/* =====================================================
   RIGENERA ALLENAMENTO
===================================================== */

function regenerateWorkout() {

    if (
        typeof refreshWorkout !==
        "function"
    ) {

        return null;

    }


    const workout =
        refreshWorkout();


    updateWorkoutScreen();


    return workout;

}


/* =====================================================
   UTILITY TESTO
===================================================== */

function setText(
    id,
    value
) {

    const element =
        document.getElementById(
            id
        );


    if (!element) {

        return;

    }


    element.textContent =
        value ?? "";

}


/* =====================================================
   SICUREZZA HTML
===================================================== */

function escapeHTML(
    value
) {

    return String(
        value ?? ""
    )
        .replaceAll(
            "&",
            "&amp;"
        )
        .replaceAll(
            "<",
            "&lt;"
        )
        .replaceAll(
            ">",
            "&gt;"
        )
        .replaceAll(
            '"',
            "&quot;"
        )
        .replaceAll(
            "'",
            "&#039;"
        );

}


/* =====================================================
   DATA
===================================================== */

function getCurrentDateString() {

    return new Date()
        .toISOString()
        .split("T")[0];

}


/* =====================================================
   INIZIALIZZAZIONE APP
===================================================== */

function initializeApp() {

    console.log(
        `${APP_NAME} v${APP_VERSION}`
    );


    const profile =
        appGetProfile();


    /*
       Se il profilo non esiste,
       mostra la configurazione.
    */

    if (!profile) {

        showSetupScreen();

        return;

    }


    /*
       Se il profilo esiste,
       entra direttamente nell'app.
    */

    showMainApplication();


    /*
       Assicuriamoci che esista
       il target nutrizionale.
    */

    if (
        typeof getNutritionTarget ===
        "function"
    ) {

        if (
            !getNutritionTarget()
        ) {

            refreshNutrition();

        }

    }


    /*
       Assicuriamoci che esista
       un piano alimentare.
    */

    if (
        typeof getSavedMealsPlan ===
        "function"
    ) {

        if (
            !getSavedMealsPlan()
        ) {

            refreshDailyMeals();

        }

    }


    /*
       Assicuriamoci che esista
       la scheda.
    */

    if (
        typeof getStoredWorkout ===
        "function"
    ) {

        if (
            !getStoredWorkout()
        ) {

            refreshWorkout();

        }

    }


    /*
       Coach.
    */

    if (
        typeof refreshCoach ===
        "function"
    ) {

        refreshCoach();

    }


    updateAllScreens();

    showScreen(
        "home"
    );

}


/* =====================================================
   AVVIO
===================================================== */

document.addEventListener(
    "DOMContentLoaded",
    initializeApp
);
/* =====================================================
   COACH IA — GENERA SETTIMANA
===================================================== */

function openCoachWeeklyPlan() {

    const profile =
        typeof storageGetProfile === "function"
            ? storageGetProfile()
            : JSON.parse(
                localStorage.getItem(
                    "myTransformationProfile"
                ) || "{}"
            );

    const target =
        typeof getNutritionTarget === "function"
            ? getNutritionTarget()
            : null;

    const prompt = `
Sei il Coach IA di MY TRANSFORMATION.

Devi creare il piano alimentare PERSONALIZZATO
per i prossimi 7 giorni.

IMPORTANTE:
- Non usare una dieta fissa.
- Non usare una dieta hard-coded.
- Non chiedere all'utente di scegliere i pasti.
- Devi decidere tu il piano in base ai dati ricevuti.
- La settimana deve essere VARIATA.
- I pasti devono cambiare durante i 7 giorni.
- Rispetta preferenze, alimenti esclusi e allergie.
- Considera allenamento e giorni di riposo.
- Mantieni le calorie e i macronutrienti coerenti
  con l'obiettivo dell'utente.
- Usa grammature realistiche.
- Ogni giorno deve avere pasti completi.
- Alla settimana successiva devi poter modificare
  il piano in base ai progressi dell'utente.

PROFILO UTENTE:
${JSON.stringify(profile, null, 2)}

TARGET NUTRIZIONALE:
${JSON.stringify(target, null, 2)}

DATI DELLA SETTIMANA:
- Genera 7 giorni.
- Indica per ogni giorno:
  colazione
  pranzo
  cena
  eventuali spuntini
- Per ogni alimento indica i grammi.
- Calcola calorie e macronutrienti di ogni pasto.
- Calcola il totale giornaliero.

Alla fine restituisci il risultato in questo formato:

=== MY_TRANSFORMATION_DIET_START ===

{
  "type": "weekly",
  "days": [
    {
      "day": 1,
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
            "kcal": 0,
            "protein": 0,
            "carbs": 0,
            "fat": 0
          }
        }
      ],
      "totals": {
        "kcal": 0,
        "protein": 0,
        "carbs": 0,
        "fat": 0
      }
    }
  ]
}

=== MY_TRANSFORMATION_DIET_END ===

Non aggiungere spiegazioni fuori dal formato.
`;

    /* Copia automaticamente il prompt */

    if (
        navigator.clipboard &&
        navigator.clipboard.writeText
    ) {

        navigator.clipboard.writeText(
            prompt.trim()
        );

    }

    /* Prova ad aprire direttamente l'app ChatGPT */

    window.location.href =
        "chatgpt://";

    /* Fallback se l'app non viene aperta */

    setTimeout(() => {

        window.location.href =
            "https://chatgpt.com/";

    }, 1200);

}