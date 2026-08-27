/* =====================================================
   MY TRANSFORMATION
   APP ENGINE — COACH IA WEEKLY SYSTEM
   VERSIONE 4.0
===================================================== */

const APP_NAME = "MY TRANSFORMATION";
const APP_VERSION = "4.0.0";


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
   MOSTRA SETUP
===================================================== */

function showSetupScreen() {

    const setup =
        document.getElementById("setupScreen");

    const app =
        document.getElementById("mainApp");

    if (setup) {
        setup.classList.remove("hidden");
    }

    if (app) {
        app.classList.add("hidden");
    }
}


/* =====================================================
   MOSTRA APP
===================================================== */

function showMainApplication() {

    const setup =
        document.getElementById("setupScreen");

    const app =
        document.getElementById("mainApp");

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
   LETTURA INPUT
===================================================== */

function getInputValue(id) {

    const element =
        document.getElementById(id);

    if (!element) {
        return "";
    }

    return String(
        element.value || ""
    ).trim();
}


/* =====================================================
   CONFIGURAZIONE PROFILO
===================================================== */

function completeSetup() {

    const profile = {

        age:
            getInputValue("setupAge"),

        sex:
            getInputValue("setupSex"),

        height:
            getInputValue("setupHeight"),

        weight:
            getInputValue("setupWeight"),

        goal:
            getInputValue("setupGoal"),

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


    profile.updatedAt =
        new Date().toISOString();


    if (!saveUserProfile(profile)) {

        alert(
            "Errore durante il salvataggio del profilo."
        );

        return false;
    }


    /*
       TARGET NUTRIZIONALE
    */

    if (typeof refreshNutrition === "function") {
        refreshNutrition();
    }


    /*
       Il cambio del profilo invalida
       la settimana precedente.
    */

    if (typeof resetMealsPlan === "function") {
        resetMealsPlan();
    }


    /*
       ALLENAMENTO
    */

    if (typeof refreshWorkout === "function") {
        refreshWorkout();
    }


    /*
       COACH LOCALE
    */

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


    Object.entries(fields).forEach(
        ([id, value]) => {

            const element =
                document.getElementById(id);

            if (element) {
                element.value =
                    value ?? "";
            }

        }
    );


    showSetupScreen();
}


/* =====================================================
   RESET COMPLETO
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

    const profile =
        appGetProfile();

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
        goalNames[profile.goal] ||
        profile.goal
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
   DIETA
===================================================== */

function updateDietScreen() {

    const target =
        typeof getNutritionTarget === "function"
            ? getNutritionTarget()
            : null;


    if (target) {

        setText(
            "dietCalories",
            target.calories
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


    if (
        !plan ||
        plan.source !== "coach_ai" ||
        !Array.isArray(plan.days) ||
        plan.days.length !== 7
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
                🤖 Nessuna settimana disponibile.
                <br><br>
                Premi
                <strong>
                    "GENERA LA MIA SETTIMANA"
                </strong>
                per crearla con il Coach IA.
            </div>
        `;

    });


    setText("dietTotalCalories", "—");
    setText("dietTotalProtein", "—");
    setText("dietTotalCarbs", "—");
    setText("dietTotalFat", "—");
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


            const totals =
                meal.totals || {

                    kcal: 0,
                    protein: 0,
                    carbs: 0,
                    fat: 0

                };


            const mealId =
                String(
                    meal.id || ""
                )
                    .replace(
                        /'/g,
                        "\\'"
                    );


            element.innerHTML = `

                <div class="meal-header">

                    <strong>
                        ${escapeHTML(
                            meal.name ||
                            "Pasto"
                        )}
                    </strong>

                    <span>
                        ${totals.kcal} kcal
                    </span>

                </div>


                <div class="meal-foods">

                    ${foods}

                </div>


                <div class="meal-macros">

                    P ${totals.protein} g

                    ·

                    C ${totals.carbs} g

                    ·

                    G ${totals.fat} g

                </div>


                <button
                    type="button"
                    class="primary-button"
                    onclick="completeMeal('${mealId}')"
                >

                    ${
                        meal.completed
                            ? "✓ PASTO COMPLETATO"
                            : "SEGNA COME COMPLETATO"
                    }

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
   IMPORTAZIONE SETTIMANA
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


        if (
            !result ||
            !result.success
        ) {

            alert(
                result?.message ||
                "La settimana non è stata importata."
            );

            return false;
        }


        updateAllScreens();

        alert(
            "✅ Settimana alimentare importata correttamente!"
        );

        return true;

    } catch (error) {

        alert(
            error?.message ||
            "Errore durante l'importazione."
        );

        return false;
    }
}


/* =====================================================
   ALLENAMENTO
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


    for (let i = 1; i <= 10; i++) {

        const element =
            document.getElementById(
                `exercise${i}`
            );

        if (element) {
            element.innerHTML = "";
        }

    }


    todayWorkout.exercises.forEach(
        (exercise, index) => {

            if (index >= 10) {
                return;
            }


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
        !Array.isArray(workout.workouts) ||
        !workout.workouts.length
    ) {

        return 0;
    }


    const day =
        new Date().getDay();


    if (day === 0) {

        return workout.workouts.length - 1;
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
            ? `${
                progress.weightChange > 0
                    ? "+"
                    : ""
            }${progress.weightChange} kg`
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


    if (analysis.weight) {

        setText(
            "coachWeightAnalysis",
            analysis.weight.message
        );

    }


    if (analysis.training) {

        setText(
            "coachTrainingAnalysis",
            analysis.training.message
        );

    }


    if (analysis.nutrition) {

        setText(
            "coachNutritionAnalysis",
            analysis.nutrition.message
        );

    }
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
            navButton.classList.remove("active");
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
            matchingButton.classList.add("active");
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
    updateProgressScreen();
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
   PULSANTE DIETA
===================================================== */

async function regenerateDailyMeals() {

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
   PROMPT COACH IA — VERSIONE COMPATTA
===================================================== */

function buildCoachWeeklyPrompt() {

    const profile =
        appGetProfile();


    const target =
        typeof getNutritionTarget === "function"
            ? getNutritionTarget()
            : null;


    const progress =
        typeof getProgressSummary === "function"
            ? getProgressSummary()
            : null;


    const mealsNumber =
        Number(
            profile?.meals || 3
        );


    /*
       Prompt volutamente compatto.
       Tutti i dati reali vengono inseriti
       automaticamente dall'app.
    */

    const prompt = `

Sei il Coach IA di MY TRANSFORMATION.

Crea una nuova dieta personalizzata di 7 giorni.

REGOLE:
- 7 giorni esatti.
- ${mealsNumber} pasti esatti ogni giorno.
- Piano diverso e variato.
- Rispetta rigorosamente preferenze, dislikes e allergie.
- Considera obiettivo, profilo, allenamenti, target e progressi.
- Differenzia allenamento/riposo quando utile.
- Riso, pasta, avena, couscous e cereali: peso a secco.
- Carne, pesce, frutta, verdura e olio: grammi.
- Usa valori nutrizionali numerici.
- Ogni alimento deve avere grams, kcal, protein, carbs, fat.
- Ogni pasto deve avere totals.
- Ogni giorno deve avere totals.
- I totali devono essere coerenti con gli alimenti.
- Mantieni il totale giornaliero vicino al target.

PROFILO:
${JSON.stringify(profile)}

TARGET:
${JSON.stringify(target)}

PROGRESSI:
${JSON.stringify(progress)}

RESTITUISCI SOLO JSON VALIDO TRA QUESTI MARKER:

=== MY_TRANSFORMATION_DIET_START ===
{
  "version": "4.0",
  "type": "weekly",
  "week": [
    {
      "day": "Lunedì",
      "dayType": "training",
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
    }
  ]
}
=== MY_TRANSFORMATION_DIET_END ===

Completa il blocco con tutti i 7 giorni e tutti i ${mealsNumber} pasti per giorno.

NON aggiungere testo fuori dai marker.
NON usare markdown.
NON usare triple backtick.
NON usare valori come "100g" o "100 kcal": i valori devono essere numeri JSON.
Controlla che il JSON sia valido prima di rispondere.
`;

    return prompt.trim();
}


/* =====================================================
   COPIA PROMPT
===================================================== */

async function copyCoachPrompt() {

    const prompt =
        buildCoachWeeklyPrompt();


    if (
        !navigator.clipboard ||
        !navigator.clipboard.writeText
    ) {

        return false;
    }


    try {

        await navigator.clipboard.writeText(
            prompt
        );

        return true;

    } catch {

        return false;

    }
}


/* =====================================================
   APERTURA CHATGPT
===================================================== */

function openChatGPT() {

    try {

        window.location.href =
            "chatgpt://";

    } catch {

        window.location.href =
            "https://chatgpt.com/";

    }


    setTimeout(
        () => {

            if (
                document.visibilityState ===
                "visible"
            ) {

                window.location.href =
                    "https://chatgpt.com/";

            }

        },
        1800
    );
}


/* =====================================================
   COACH — GENERA SETTIMANA
===================================================== */

async function openCoachWeeklyPlan() {

    const profile =
        appGetProfile();


    if (!profile) {

        alert(
            "Prima devi completare il profilo."
        );

        showSetupScreen();

        return false;
    }


    const copied =
        await copyCoachPrompt();


    if (!copied) {

        alert(
            "Non sono riuscito a copiare automaticamente il prompt."
        );

        return false;
    }


    alert(
        "✅ Prompt copiato!\n\n" +
        "Ora si aprirà ChatGPT.\n\n" +
        "1. Incolla il prompt.\n" +
        "2. Invia.\n" +
        "3. Copia tutta la risposta.\n" +
        "4. Torna nell'app.\n" +
        "5. Premi ↻ nella sezione Dieta."
    );


    openChatGPT();

    return true;
}


/* =====================================================
   IMPORTAZIONE MANUALE
===================================================== */

function importWeeklyCoachDietManual() {

    const text =
        prompt(
            "Incolla qui TUTTA la risposta di ChatGPT:"
        );


    if (!text) {
        return false;
    }


    const result =
        typeof importCoachDiet === "function"
            ? importCoachDiet(text)
            : null;


    if (
        !result ||
        !result.success
    ) {

        alert(
            result?.message ||
            "La dieta non è stata importata."
        );

        return false;
    }


    updateAllScreens();


    alert(
        "✅ Settimana importata correttamente!"
    );


    return true;
}


/* =====================================================
   IMPORTAZIONE APPUNTI
===================================================== */

async function importWeeklyCoachDietFromClipboard() {

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


        if (
            !result ||
            !result.success
        ) {

            alert(
                result?.message ||
                "La dieta non è stata importata."
            );

            return false;
        }


        updateAllScreens();


        alert(
            "✅ Settimana alimentare importata correttamente!"
        );


        return true;

    } catch (error) {

        alert(
            error?.message ||
            "Errore durante l'importazione."
        );

        return false;
    }
}


/* =====================================================
   PULSANTE ↻
===================================================== */

async function regenerateDailyMealsFromClipboard() {

    return importWeeklyCoachDietFromClipboard();

}


/* =====================================================
   UTILITY TESTO
===================================================== */

function setText(
    id,
    value
) {

    const element =
        document.getElementById(id);


    if (!element) {
        return;
    }


    element.textContent =
        value ?? "";
}


/* =====================================================
   ESCAPE HTML
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
   INIZIALIZZAZIONE
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
       TARGET
    */

    if (
        typeof getNutritionTarget ===
        "function"
    ) {

        if (
            !getNutritionTarget() &&
            typeof refreshNutrition ===
            "function"
        ) {

            refreshNutrition();

        }

    }


    /*
       NON GENERIAMO MAI
       UNA DIETA LOCALE.
    */


    /*
       ALLENAMENTO
    */

    if (
        typeof getStoredWorkout ===
        "function"
    ) {

        if (
            !getStoredWorkout() &&
            typeof refreshWorkout ===
            "function"
        ) {

            refreshWorkout();

        }

    }


    /*
       COACH LOCALE
    */

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

    buildCoachWeeklyPrompt,

    copyCoachPrompt,

    importWeeklyCoachDiet,

    importWeeklyCoachDietFromClipboard,

    importWeeklyCoachDietManual,

    regenerateDailyMeals,

    regenerateDailyMealsFromClipboard,

    regenerateWorkout,

    updateAllScreens,

    updateDietScreen

};