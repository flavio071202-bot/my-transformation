/* =====================================================
   MY TRANSFORMATION
   APP ENGINE — COACH IA WEEKLY SYSTEM
   VERSIONE 4.1
===================================================== */

const APP_NAME = "MY TRANSFORMATION";
const APP_VERSION = "4.1.0";


/* =====================================================
   PROFILO
===================================================== */

function appGetProfile() {

    if (typeof storageGetProfile === "function") {

        try {
            return storageGetProfile();
        } catch {}

    }

    const data =
        localStorage.getItem(
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
   SETUP
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
   STORAGE PROFILO
===================================================== */

function saveUserProfile(profile) {

    if (!profile) return false;

    if (typeof storageSaveProfile === "function") {

        try {
            return storageSaveProfile(profile);
        } catch {}

    }

    localStorage.setItem(
        "myTransformationProfile",
        JSON.stringify(profile)
    );

    return true;

}


function getInputValue(id) {

    const element =
        document.getElementById(id);

    return element
        ? String(element.value || "").trim()
        : "";

}


/* =====================================================
   CREAZIONE PROFILO
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


    const age =
        Number(profile.age);

    const height =
        Number(profile.height);

    const weight =
        Number(profile.weight);

    const trainingDays =
        Number(profile.trainingDays);

    const meals =
        Number(profile.meals);


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


    saveUserProfile(profile);


    if (
        typeof refreshNutrition ===
        "function"
    ) {

        refreshNutrition();

    }


    /*
       Il piano precedente non è più valido
       dopo una modifica del profilo.
    */

    if (
        typeof resetMealsPlan ===
        "function"
    ) {

        resetMealsPlan();

    }


    if (
        typeof refreshWorkout ===
        "function"
    ) {

        refreshWorkout();

    }


    if (
        typeof refreshCoach ===
        "function"
    ) {

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
   RESET
===================================================== */

function resetProfile() {

    if (
        !confirm(
            "Vuoi cancellare il profilo e tutti i dati della trasformazione?"
        )
    ) {

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

    if (!profile) return;


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
   DATA / CALENDARIO
===================================================== */

function getTodayWeekdayIndex(
    date = new Date()
) {

    const day =
        date.getDay();

    return day === 0
        ? 6
        : day - 1;

}


function getTodayItalianName(
    date = new Date()
) {

    const names = [

        "Lunedì",
        "Martedì",
        "Mercoledì",
        "Giovedì",
        "Venerdì",
        "Sabato",
        "Domenica"

    ];

    return names[
        getTodayWeekdayIndex(date)
    ];

}


function getCalendarMealsDay(
    date = new Date()
) {

    const plan =
        typeof getSavedMealsPlan ===
        "function"
            ? getSavedMealsPlan()
            : null;


    if (
        !plan ||
        !Array.isArray(plan.days) ||
        plan.days.length !== 7
    ) {

        return null;

    }


    /*
       La settimana del Coach è sempre:
       Lunedì → Domenica.

       Non importa quale giorno sia stato
       effettuato l'import.
    */

    const index =
        getTodayWeekdayIndex(date);


    const day =
        plan.days[index];


    if (!day) {

        return null;

    }


    return day;

}


/* =====================================================
   DIETA
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
        typeof getSavedMealsPlan ===
        "function"
            ? getSavedMealsPlan()
            : null;


    if (
        !plan ||
        plan.imported !== true ||
        plan.source !== "coach_ai" ||
        !Array.isArray(plan.days) ||
        plan.days.length !== 7
    ) {

        renderWaitingForCoachDiet();

        return;

    }


    const today =
        getCalendarMealsDay(
            new Date()
        );


    if (!today) {

        renderWaitingForCoachDiet();

        return;

    }


    renderMealsPlan(
        today
    );

}


/* =====================================================
   ATTESA DIETA
===================================================== */

function renderWaitingForCoachDiet() {

    const section =
        document.getElementById(
            "dietTodaySection"
        );


    if (section) {

        section.style.display =
            "none";

    }


    const status =
        document.getElementById(
            "dietCoachStatus"
        );


    if (status) {

        status.innerHTML = `

            <span>
                STATO PIANO
            </span>

            <strong>
                Nessuna settimana del Coach importata.
            </strong>

            <div class="meal-macros">
                Premi "Genera la mia settimana",
                poi copia la risposta di ChatGPT
                e torna qui per importarla.
            </div>

        `;

    }


    const ids = [

        "meal1",
        "meal2",
        "meal3",
        "meal4",
        "meal5"

    ];


    ids.forEach(
        id => {

            const element =
                document.getElementById(id);

            if (element) {

                element.innerHTML =
                    "";

            }

        }
    );


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
   RENDER DIETA COACH
===================================================== */

function renderMealsPlan(day) {

    if (
        !day ||
        !Array.isArray(day.meals)
    ) {

        renderWaitingForCoachDiet();

        return;

    }


    const section =
        document.getElementById(
            "dietTodaySection"
        );


    if (section) {

        section.style.display =
            "block";

    }


    const status =
        document.getElementById(
            "dietCoachStatus"
        );


    /*
       Il nome mostrato viene sempre ricavato
       dal calendario reale.
    */

    const todayName =
        getTodayItalianName(
            new Date()
        );


    if (status) {

        status.innerHTML = `

            <span>
                STATO PIANO
            </span>

            <strong>
                ✅ Settimana del Coach attiva
            </strong>

            <div class="meal-macros">
                ${todayName} ·
                ${day.meals.length} pasti
            </div>

        `;

    }


    const ids = [

        "meal1",
        "meal2",
        "meal3",
        "meal4",
        "meal5"

    ];


    ids.forEach(
        id => {

            const element =
                document.getElementById(id);

            if (element) {

                element.innerHTML =
                    "";

            }

        }
    );


    day.meals.forEach(
        (
            meal,
            index
        ) => {

            if (index >= 5) return;


            const element =
                document.getElementById(
                    `meal${index + 1}`
                );


            if (!element) return;


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
                escapeHTML(
                    String(
                        meal.id || ""
                    )
                );


            element.innerHTML = `

                <div class="meal-header">

                    <strong>
                        ${escapeHTML(
                            meal.name ||
                            `Pasto ${index + 1}`
                        )}
                    </strong>

                    <span>
                        ${totals.kcal || 0} kcal
                    </span>

                </div>


                <div class="meal-foods">

                    ${foods}

                </div>


                <div class="meal-macros">

                    P ${totals.protein || 0} g
                    ·
                    C ${totals.carbs || 0} g
                    ·
                    G ${totals.fat || 0} g

                </div>


                <button
                    type="button"
                    class="primary-button"
                    data-meal-id="${mealId}"
                    onclick="completeMeal(this.dataset.mealId)"
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
        `${totals.kcal || 0} kcal`
    );


    setText(
        "dietTotalProtein",
        `${totals.protein || 0} g`
    );


    setText(
        "dietTotalCarbs",
        `${totals.carbs || 0} g`
    );


    setText(
        "dietTotalFat",
        `${totals.fat || 0} g`
    );

}


/* =====================================================
   IMPORTA SETTIMANA
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
            result.success !== true
        ) {

            alert(
                result?.message ||
                "La dieta non è stata importata."
            );

            return false;

        }


        /*
           Verifica reale del salvataggio.
           Non mostriamo "importata" se il piano
           non è effettivamente presente nello storage.
        */

        const savedPlan =
            typeof getSavedMealsPlan ===
            "function"
                ? getSavedMealsPlan()
                : null;


        const valid =
            savedPlan &&
            savedPlan.imported === true &&
            savedPlan.source === "coach_ai" &&
            Array.isArray(savedPlan.days) &&
            savedPlan.days.length === 7;


        if (!valid) {

            alert(
                "La risposta è stata letta, ma la settimana non risulta salvata correttamente."
            );

            return false;

        }


        updateAllScreens();


        showScreen(
            "diet"
        );


        alert(
            "✅ Settimana alimentare importata correttamente!"
        );


        return true;

    } catch (error) {

        console.error(
            "Errore importazione:",
            error
        );


        alert(
            error?.message ||
            "Errore durante l'importazione."
        );


        return false;

    }

}


/* =====================================================
   COMPLETAMENTO PASTO
===================================================== */

function completeMeal(
    mealId
) {

    if (
        !mealId ||
        typeof toggleMealCompleted !==
        "function"
    ) {

        return false;

    }


    const result =
        toggleMealCompleted(
            mealId,
            new Date()
        );


    /*
       Se il toggle non trova il pasto,
       non fingiamo che sia stato completato.
    */

    if (
        result === false ||
        result === undefined
    ) {

        updateDietScreen();

        return false;

    }


    /*
       Ricarica sempre il piano dallo storage.
       In questo modo il rendering utilizza
       esattamente i dati salvati.
    */

    updateDietScreen();

    updateDashboard();

    updateProgressScreen();


    /*
       Se tutti i pasti del giorno sono stati
       completati, mostriamo il giorno successivo
       quando il calendario passa al giorno successivo.

       Non spostiamo artificialmente la data del telefono:
       il giorno successivo viene quindi mostrato
       automaticamente al cambio di giornata.
    */

    return true;

}


/* =====================================================
   ALLENAMENTO
===================================================== */

function updateWorkoutScreen() {

    const workout =
        typeof getStoredWorkout ===
        "function"
            ? getStoredWorkout()
            : null;


    if (!workout) return;


    const index =
        getTrainingDayIndex(
            workout
        );


    const today =
        workout.workouts[index];


    if (!today) return;


    setText(
        "workoutTitle",
        today.name
    );


    setText(
        "workoutExerciseCount",
        `${today.exercises.length} esercizi`
    );


    for (
        let i = 1;
        i <= 10;
        i++
    ) {

        const element =
            document.getElementById(
                `exercise${i}`
            );

        if (element) {

            element.innerHTML =
                "";

        }

    }


    today.exercises.forEach(
        (
            exercise,
            index
        ) => {

            if (index >= 10) return;


            const element =
                document.getElementById(
                    `exercise${index + 1}`
                );


            if (!element) return;


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


function getTrainingDayIndex(
    workout
) {

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


    if (!progress) return;


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


    if (!analysis) return;


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


    if (!profile) return;


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

    document
        .querySelectorAll(".screen")
        .forEach(
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


    if (!target) return;


    target.classList.add(
        "active"
    );


    document
        .querySelectorAll(".nav button")
        .forEach(
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


    window.scrollTo(
        0,
        0
    );

}


/* =====================================================
   COMPLETAMENTO ALLENAMENTO
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
   PESO
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
   PROMPT COACH
===================================================== */

function buildCoachWeeklyPrompt() {

    const profile =
        appGetProfile();


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


    const meals =
        Number(
            profile?.meals || 3
        );


    return `Sei il Coach IA ufficiale di MY TRANSFORMATION.

Crea una settimana alimentare PERSONALIZZATA.

OBBLIGATORIO:
- 7 giorni esatti.
- Ogni giorno esattamente ${meals} pasti.
- Rispetta obiettivo, profilo, target, progressi, allenamenti, likes, dislikes e allergie.
- Varia gli alimenti.
- Pasta, riso, avena, couscous e cereali: peso a secco.
- Carne, pesce, frutta e verdura: grammi.
- Olio: grammi.
- Calcola kcal, protein, carbs e fat.
- Tutti i valori numerici devono essere numeri JSON.
- I totali devono essere coerenti.
- JSON rigorosamente valido.
- Nessun testo fuori dai marker.

PROFILO:
${JSON.stringify(profile)}

TARGET:
${JSON.stringify(target)}

PROGRESSI:
${JSON.stringify(progress)}

USA ESATTAMENTE QUESTA STRUTTURA:

=== MY_TRANSFORMATION_DIET_START ===
{"version":"4.0","type":"weekly","week":[{"day":"Lunedì","dayType":"training","meals":[{"name":"Colazione","foods":[{"name":"Alimento","grams":100,"kcal":100,"protein":10,"carbs":10,"fat":5}],"totals":{"kcal":100,"protein":10,"carbs":10,"fat":5}}],"totals":{"kcal":100,"protein":10,"carbs":10,"fat":5}}]}
=== MY_TRANSFORMATION_DIET_END ===

Sostituisci completamente l'esempio con i 7 giorni reali e ${meals} pasti per giorno.
Non usare markdown.
Non usare triple backtick.
Non aggiungere spiegazioni.
Prima di rispondere verifica che il JSON sia valido.`;

}


/* =====================================================
   COPIA PROMPT
===================================================== */

async function copyCoachPrompt() {

    const prompt =
        buildCoachWeeklyPrompt();


    if (
        navigator.clipboard &&
        navigator.clipboard.writeText
    ) {

        try {

            await navigator.clipboard.writeText(
                prompt
            );

            return true;

        } catch {

            return false;

        }

    }


    return false;

}


/* =====================================================
   APERTURA CHATGPT
===================================================== */

function openChatGPT() {

    window.open(
        "https://chatgpt.com/",
        "_blank"
    );

}


/* =====================================================
   GENERA SETTIMANA
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
            "Non sono riuscito a copiare il prompt. Riprova."
        );

        return false;

    }


    alert(
        "✅ Prompt copiato!\n\n" +
        "Si aprirà ChatGPT nel browser.\n\n" +
        "Incolla il prompt e invialo.\n\n" +
        "Quando ChatGPT ha finito:\n" +
        "1. Copia tutta la risposta.\n" +
        "2. Torna in MY TRANSFORMATION.\n" +
        "3. Premi \"IMPORTA SETTIMANA DEL COACH\"."
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
            "Incolla qui tutta la risposta di ChatGPT:"
        );


    if (!text) return false;


    const result =
        typeof importCoachDiet ===
        "function"
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


    const savedPlan =
        typeof getSavedMealsPlan ===
        "function"
            ? getSavedMealsPlan()
            : null;


    if (
        !savedPlan ||
        savedPlan.imported !== true ||
        savedPlan.source !== "coach_ai" ||
        !Array.isArray(savedPlan.days) ||
        savedPlan.days.length !== 7
    ) {

        alert(
            "La settimana non risulta salvata correttamente."
        );

        return false;

    }


    updateAllScreens();

    showScreen(
        "diet"
    );


    alert(
        "✅ Settimana importata correttamente!"
    );


    return true;

}


/* =====================================================
   IMPORTAZIONE CLIPBOARD
===================================================== */

async function importWeeklyCoachDietFromClipboard() {

    return importWeeklyCoachDiet();

}


/* =====================================================
   UTILITY
===================================================== */

function setText(
    id,
    value
) {

    const element =
        document.getElementById(
            id
        );


    if (!element) return;


    element.textContent =
        value ?? "";

}


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


function getCurrentDateString() {

    const date =
        new Date();


    const year =
        date.getFullYear();


    const month =
        String(
            date.getMonth() + 1
        ).padStart(
            2,
            "0"
        );


    const day =
        String(
            date.getDate()
        ).padStart(
            2,
            "0"
        );


    return (
        `${year}-${month}-${day}`
    );

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


    if (
        typeof getNutritionTarget ===
        "function"
    ) {

        if (!getNutritionTarget()) {

            if (
                typeof refreshNutrition ===
                "function"
            ) {

                refreshNutrition();

            }

        }

    }


    if (
        typeof getStoredWorkout ===
        "function"
    ) {

        if (!getStoredWorkout()) {

            if (
                typeof refreshWorkout ===
                "function"
            ) {

                refreshWorkout();

            }

        }

    }


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
   API GLOBALE
===================================================== */

window.MY_TRANSFORMATION_APP = {

    openCoachWeeklyPlan,

    buildCoachWeeklyPrompt,

    copyCoachPrompt,

    importWeeklyCoachDiet,

    importWeeklyCoachDietFromClipboard,

    importWeeklyCoachDietManual,

    regenerateDailyMeals,

    regenerateWorkout,

    updateAllScreens,

    updateDietScreen,

    getCalendarMealsDay,

    getTodayItalianName

};


/* =====================================================
   PROTEZIONE CONTRO OVERRIDE INDEX.HTML
===================================================== */

/*
   index.html aveva vecchie funzioni globali
   updateDietScreen() e completeMeal() definite
   direttamente nello script finale.

   Questo blocco riporta in primo piano
   le funzioni corrette dopo il caricamento
   completo della pagina.
*/

window.addEventListener(
    "load",
    function () {

        window.updateDietScreen =
            updateDietScreen;

        window.completeMeal =
            completeMeal;

        window.importWeeklyCoachDiet =
            importWeeklyCoachDiet;

        updateAllScreens();

    }
);