/* =====================================================
   MY TRANSFORMATION
   APP ENGINE — COACH IA WEEKLY SYSTEM
===================================================== */

const APP_NAME = "MY TRANSFORMATION";
const APP_VERSION = "2.0.0";


/* =====================================================
   PROFILO
===================================================== */

function appGetProfile() {

    if (typeof storageGetProfile === "function") {
        return storageGetProfile();
    }

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
   MOSTRA / NASCONDI SETUP
===================================================== */

function showSetupScreen() {

    const setup = document.getElementById("setupScreen");
    const app = document.getElementById("mainApp");

    if (setup) {
        setup.classList.remove("hidden");
    }

    if (app) {
        app.classList.add("hidden");
    }
}


function showMainApplication() {

    const setup = document.getElementById("setupScreen");
    const app = document.getElementById("mainApp");

    if (setup) {
        setup.classList.add("hidden");
    }

    if (app) {
        app.classList.remove("hidden");
    }
}


/* =====================================================
   SALVA PROFILO
===================================================== */

function saveUserProfile(profile) {

    if (!profile) {
        return false;
    }

    if (typeof storageSaveProfile === "function") {
        return storageSaveProfile(profile);
    }

    localStorage.setItem(
        "myTransformationProfile",
        JSON.stringify(profile)
    );

    return true;
}


/* =====================================================
   LETTURA CAMPI
===================================================== */

function getInputValue(id) {

    const element = document.getElementById(id);

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

        age: getInputValue("setupAge"),
        sex: getInputValue("setupSex"),
        height: getInputValue("setupHeight"),
        weight: getInputValue("setupWeight"),
        goal: getInputValue("setupGoal"),

        trainingDays:
            getInputValue("setupTrainingDays"),

        trainingDuration:
            getInputValue("setupTrainingDuration"),

        trainingPlace:
            getInputValue("setupTrainingPlace"),

        meals:
            getInputValue("setupMeals"),

        likes:
            getInputValue("setupLikes"),

        dislikes:
            getInputValue("setupDislikes"),

        allergies:
            getInputValue("setupAllergies"),

        createdAt:
            new Date().toISOString(),

        updatedAt:
            new Date().toISOString()
    };


    const age = Number(profile.age);
    const height = Number(profile.height);
    const weight = Number(profile.weight);
    const trainingDays = Number(profile.trainingDays);
    const meals = Number(profile.meals);


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

        alert("Inserisci un'età valida.");
        return false;
    }


    if (
        !Number.isFinite(height) ||
        height < 100 ||
        height > 250
    ) {

        alert("Inserisci un'altezza valida.");
        return false;
    }


    if (
        !Number.isFinite(weight) ||
        weight < 30 ||
        weight > 300
    ) {

        alert("Inserisci un peso valido.");
        return false;
    }


    if (
        !Number.isFinite(trainingDays) ||
        trainingDays < 1 ||
        trainingDays > 7
    ) {

        alert(
            "Inserisci un numero di allenamenti valido."
        );

        return false;
    }


    if (
        !Number.isFinite(meals) ||
        meals < 3 ||
        meals > 5
    ) {

        alert(
            "Il numero di pasti deve essere tra 3 e 5."
        );

        return false;
    }


    saveUserProfile(profile);


    if (typeof refreshNutrition === "function") {
        refreshNutrition();
    }


    /*
       IMPORTANTE:
       NON generiamo più una dieta locale.
       La dieta verrà creata esclusivamente
       dal Coach IA.
    */


    if (typeof resetMealsPlan === "function") {
        resetMealsPlan();
    }


    if (typeof refreshWorkout === "function") {
        refreshWorkout();
    }


    if (typeof refreshCoach === "function") {
        refreshCoach();
    }


    showMainApplication();

    updateAllScreens();

    showScreen("home");

    return true;
}


/* =====================================================
   MODIFICA PROFILO
===================================================== */

function editProfile() {

    const profile = appGetProfile();

    if (!profile) {
        showSetupScreen();
        return;
    }


    const fields = {

        setupAge: profile.age,
        setupSex: profile.sex,
        setupHeight: profile.height,
        setupWeight: profile.weight,
        setupGoal: profile.goal,

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


    Object.entries(fields).forEach(
        ([id, value]) => {

            const element =
                document.getElementById(id);

            if (element) {
                element.value = value;
            }
        }
    );


    showSetupScreen();
}


/* =====================================================
   RESET
===================================================== */

function resetProfile() {

    const confirmation =
        confirm(
            "Vuoi cancellare il profilo e tutti i dati della trasformazione?"
        );


    if (!confirmation) {
        return;
    }


    if (typeof storageResetAll === "function") {
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

    const profile = appGetProfile();

    if (!profile) {
        return;
    }


    const target =
        typeof getNutritionTarget === "function"
            ? getNutritionTarget()
            : null;


    const progress =
        typeof getProgressSummary === "function"
            ? getProgressSummary()
            : null;


    setText(
        "homeWeight",
        `${profile.weight} kg`
    );


    const goalNames = {

        fatloss: "Perdita di grasso",
        definition: "Definizione",
        recomp: "Ricomposizione",
        muscle: "Massa"
    };


    setText(
        "homeGoal",
        goalNames[profile.goal] || profile.goal
    );


    setText(
        "homeTraining",
        profile.trainingDays
    );


    setText(
        "homeMeals",
        profile.meals
    );


    if (target) {

        setText(
            "homeCalories",
            `${target.calories} kcal`
        );
    }


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
        typeof getNutritionTarget === "function"
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
        typeof getSavedMealsPlan === "function"
            ? getSavedMealsPlan()
            : null;


    /*
       NESSUNA DIETA LOCALE.
       Se non esiste una settimana Coach,
       mostriamo solamente lo stato di attesa.
    */

    if (
        !plan ||
        plan.source !== "coach_ai"
    ) {

        renderWaitingForCoachDiet();

        return;
    }


    const today =
        typeof getMealsDay === "function"
            ? getMealsDay(new Date())
            : null;


    if (!today) {

        renderWaitingForCoachDiet();

        return;
    }


    renderMealsPlan(today);
}


/* =====================================================
   ATTESA COACH
===================================================== */

function renderWaitingForCoachDiet() {

    const mealIds = [
        "meal1",
        "meal2",
        "meal3",
        "meal4",
        "meal5"
    ];


    mealIds.forEach(id => {

        const element =
            document.getElementById(id);

        if (!element) {
            return;
        }

        element.innerHTML = `
            <div class="loading">
                🤖 In attesa della settimana del Coach IA...
            </div>
        `;
    });


    setText(
        "dietTotalCalories",
        "—"
    );

    setText(
        "dietTotalProtein",
        "—"
    );

    setText(
        "dietTotalCarbs",
        "—"
    );

    setText(
        "dietTotalFat",
        "—"
    );
}


/* =====================================================
   RENDER PASTI
===================================================== */

function renderMealsPlan(day) {

    if (
        !day ||
        !Array.isArray(day.meals)
    ) {

        renderWaitingForCoachDiet();

        return;
    }


    const mealIds = [
        "meal1",
        "meal2",
        "meal3",
        "meal4",
        "meal5"
    ];


    /*
       Pulizia completa.
       Evita che rimangano vecchi pasti.
    */

    mealIds.forEach(id => {

        const element =
            document.getElementById(id);

        if (element) {
            element.innerHTML = "";
        }
    });


    day.meals.forEach(
        (meal, index) => {

            if (index >= 5) {
                return;
            }


            const element =
                document.getElementById(
                    `meal${index + 1}`
                );


            if (!element) {
                return;
            }


            const foods =
                Array.isArray(meal.foods)
                    ? meal.foods
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
                        .join("")
                    : "";


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

                <button
                    type="button"
                    class="primary-button"
                    onclick="
                        completeMeal(
                            '${meal.id}'
                        )
                    "
                >
                    ${meal.completed
                        ? "✓ PASTO COMPLETATO"
                        : "SEGNA COME COMPLETATO"}
                </button>

            `;
        }
    );


    const totals =
        day.totals || {
            kcal: 0,
            protein: 0,
            carbs: 0,
            fat: 0
        };


    setText(
        "dietTotalCalories",
        `${totals.kcal} kcal`
    );


    setText(
        "dietTotalProtein",
        `${totals.protein} g`
    );


    setText(
        "dietTotalCarbs",
        `${totals.carbs} g`
    );


    setText(
        "dietTotalFat",
        `${totals.fat} g`
    );
}


/* =====================================================
   IMPORTA SETTIMANA DAL COACH
===================================================== */

async function importWeeklyCoachDiet() {

    if (
        typeof importCoachDietFromClipboard !==
        "function"
    ) {

        alert(
            "Motore di importazione non disponibile."
        );

        return false;
    }


    try {

        const result =
            await importCoachDietFromClipboard();


        if (!result || !result.success) {

            alert(
                result?.message ||
                "Non è stato possibile importare la settimana."
            );

            return false;
        }


        alert(
            "✅ Settimana del Coach importata correttamente!"
        );


        updateDietScreen();

        updateDashboard();

        updateCoachScreen();

        return true;


    } catch (error) {

        alert(
            error.message ||
            "Errore durante l'importazione."
        );

        return false;
    }
}


/* =====================================================
   SCHERMATA ALLENAMENTO
===================================================== */

function updateWorkoutScreen() {

    const workout =
        typeof getStoredWorkout === "function"
            ? getStoredWorkout()
            : null;


    if (!workout) {
        return;
    }


    const todayIndex =
        getTrainingDayIndex(workout);


    const todayWorkout =
        workout.workouts[todayIndex];


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
        (exercise, index) => {

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

function getTrainingDayIndex(workout) {

    if (
        !workout ||
        !workout.workouts ||
        !workout.workouts.length
    ) {

        return 0;
    }


    const day =
        new Date().getDay();


    if (day === 0) {

        return (
            workout.workouts.length - 1
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
   COACH LOCALE
===================================================== */

function updateCoachScreen() {

    const message =
        typeof generateCoachMessage === "function"
            ? generateCoachMessage()
            : null;


    if (message) {

        setText(
            "coachMessage",
            message
        );
    }


    const analysis =
        typeof generateCoachAnalysis === "function"
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
   AGGIORNA TUTTO
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
        document.querySelectorAll(".screen");


    screens.forEach(
        screen => {

            screen.classList.remove("active");

        }
    );


    const target =
        document.getElementById(screenId);


    if (!target) {
        return;
    }


    target.classList.add("active");


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

        button.classList.add("active");

    } else {

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


    if (screenId === "home") {
        updateDashboard();
    }


    if (screenId === "diet") {
        updateDietScreen();
    }


    if (screenId === "workout") {
        updateWorkoutScreen();
    }


    if (screenId === "progress") {
        updateProgressScreen();
    }


    if (screenId === "coach") {
        updateCoachScreen();
    }


    if (screenId === "profile") {
        updateProfileScreen();
    }


    window.scrollTo(0, 0);
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

function completeMeal(mealId) {

    if (
        typeof toggleMealCompleted !==
        "function"
    ) {

        return;
    }


    toggleMealCompleted(mealId);

    updateDietScreen();

    updateDashboard();

    updateProgressScreen();
}


/* =====================================================
   REGISTRA PESO
===================================================== */

function recordWeight(weight) {

    if (
        typeof addWeightEntry !==
        "function"
    ) {

        return false;
    }


    const result =
        addWeightEntry(weight);


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

async function regenerateDailyMeals() {

    /*
       NON generiamo più una dieta locale.

       Il pulsante ↻ ora prova a importare
       la settimana copiata da ChatGPT.
    */

    return importWeeklyCoachDiet();
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


    const progress =
        typeof getProgressSummary === "function"
            ? getProgressSummary()
            : null;


    const prompt = `

SEI IL COACH IA UFFICIALE DI MY TRANSFORMATION.

Devi creare una nuova settimana alimentare
personalizzata per l'utente.

NON usare una dieta fissa.
NON usare una dieta hard-coded.
La settimana deve essere generata sulla base
dei dati ricevuti.

REGOLE:

- Genera esattamente 7 giorni.
- Rispetta il numero di pasti indicato nel profilo.
- Varia gli alimenti durante la settimana.
- Rispetta rigorosamente likes, dislikes e allergies.
- Considera obiettivo, peso, allenamenti e progressi.
- Considera la differenza tra giorni di allenamento
  e giorni di riposo quando appropriato.
- Usa grammature realistiche.
- Le quantità di riso, pasta, avena e couscous
  devono essere espresse a SECCO.
- La carne e il pesce devono essere espressi
  in grammi.
- Frutta e verdura devono essere espresse
  in grammi netti.
- Olio espresso in grammi.
- Calcola calorie e macronutrienti.
- Mantieni i valori nutrizionali coerenti.
- Non usare valori come "circa".
- kcal deve essere un NUMERO.
- protein deve essere un NUMERO.
- carbs deve essere un NUMERO.
- fat deve essere un NUMERO.
- grams deve essere un NUMERO.
- Non utilizzare stringhe al posto dei numeri.

PROFILO UTENTE:

${JSON.stringify(
    profile,
    null,
    2
)}

TARGET NUTRIZIONALE:

${JSON.stringify(
    target,
    null,
    2
)}

DATI PROGRESSI:

${JSON.stringify(
    progress,
    null,
    2
)}

IMPORTANTE:

La risposta deve contenere ESATTAMENTE
questo blocco JSON.

=== MY_TRANSFORMATION_DIET_START ===

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
              "grams": 100,
              "kcal": 100,
              "protein": 10,
              "carbs": 10,
              "fat": 5
            }
          ],
          "totals": {
            "kcal": 100,
            "protein": 10,
            "carbs": 10,
            "fat": 5
          }
        }
      ],
      "totals": {
        "kcal": 100,
        "protein": 10,
        "carbs": 10,
        "fat": 5
      }
    },
    {
      "day": "Martedì",
      "meals": []
    },
    {
      "day": "Mercoledì",
      "meals": []
    },
    {
      "day": "Giovedì",
      "meals": []
    },
    {
      "day": "Venerdì",
      "meals": []
    },
    {
      "day": "Sabato",
      "meals": []
    },
    {
      "day": "Domenica",
      "meals": []
    }
  ]
}

=== MY_TRANSFORMATION_DIET_END ===

NON aggiungere spiegazioni fuori dal blocco.
NON modificare i nomi dei marker.
NON usare markdown attorno al JSON.
`;


    /*
       Copia il prompt negli appunti.
    */

    if (
        navigator.clipboard &&
        navigator.clipboard.writeText
    ) {

        navigator.clipboard
            .writeText(prompt.trim())
            .then(() => {

                openChatGPT();

            })
            .catch(() => {

                openChatGPT();

            });

    } else {

        openChatGPT();

    }
}


/* =====================================================
   APERTURA CHATGPT
===================================================== */

function openChatGPT() {

    /*
       Prima prova ad aprire l'app ChatGPT.
    */

    window.location.href = "chatgpt://";


    /*
       Fallback web.
    */

    setTimeout(
        () => {

            window.location.href =
                "https://chatgpt.com/";

        },
        1200
    );
}


/* =====================================================
   UTILITY TESTO
===================================================== */

function setText(id, value) {

    const element =
        document.getElementById(id);


    if (!element) {
        return;
    }


    element.textContent =
        value ?? "";
}


/* =====================================================
   SICUREZZA HTML
===================================================== */

function escapeHTML(value) {

    return String(value ?? "")

        .replaceAll("&", "&amp;")

        .replaceAll("<", "&lt;")

        .replaceAll(">", "&gt;")

        .replaceAll('"', "&quot;")

        .replaceAll("'", "&#039;");
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


    if (!profile) {

        showSetupScreen();

        return;
    }


    showMainApplication();


    /*
       Target nutrizionale.
    */

    if (
        typeof getNutritionTarget ===
        "function"
    ) {

        if (!getNutritionTarget()) {
            refreshNutrition();
        }
    }


    /*
       IMPORTANTE:

       NON creare MAI automaticamente
       una dieta locale.

       Se esiste una settimana Coach,
       viene utilizzata.

       Se non esiste, la schermata
       rimane in attesa.
    */


    if (
        typeof getStoredWorkout ===
        "function"
    ) {

        if (!getStoredWorkout()) {
            refreshWorkout();
        }
    }


    if (
        typeof refreshCoach ===
        "function"
    ) {

        refreshCoach();
    }


    updateAllScreens();

    showScreen("home");
}


/* =====================================================
   AVVIO
===================================================== */

document.addEventListener(
    "DOMContentLoaded",
    initializeApp
);


/* =====================================================
   ESPOSIZIONE GLOBALE
===================================================== */

window.MY_TRANSFORMATION_APP = {

    openCoachWeeklyPlan,

    importWeeklyCoachDiet,

    regenerateDailyMeals,

    regenerateWorkout,

    updateAllScreens,

    updateDietScreen

};