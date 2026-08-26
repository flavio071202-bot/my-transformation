/* =====================================================
   MY TRANSFORMATION
   APP ENGINE
===================================================== */

const PROFILE_KEY = "myTransformationProfile";


/* =====================================================
   NOMI
===================================================== */

const GOAL_NAMES = {
    fatloss: "Perdere grasso",
    recomp: "Ricomposizione",
    muscle: "Massa",
    definition: "Definizione"
};

const PLACE_NAMES = {
    gym: "Palestra",
    home: "Casa",
    both: "Palestra + casa"
};


/* =====================================================
   PROFILO
===================================================== */

function getProfile() {

    const data =
        localStorage.getItem(
            PROFILE_KEY
        );

    if (!data) {
        return null;
    }

    try {
        return JSON.parse(data);
    } catch (error) {

        console.error(
            "Errore profilo:",
            error
        );

        return null;
    }
}


function saveProfile(profile) {

    localStorage.setItem(
        PROFILE_KEY,
        JSON.stringify(profile)
    );

}


/* =====================================================
   CONFIGURAZIONE
===================================================== */

function completeSetup() {

    const profile = {

        age:
            document
                .getElementById("setupAge")
                .value
                .trim(),

        sex:
            document
                .getElementById("setupSex")
                .value,

        height:
            document
                .getElementById("setupHeight")
                .value
                .trim(),

        weight:
            document
                .getElementById("setupWeight")
                .value
                .trim(),

        goal:
            document
                .getElementById("setupGoal")
                .value,

        trainingDays:
            document
                .getElementById("setupTrainingDays")
                .value,

        trainingDuration:
            document
                .getElementById("setupTrainingDuration")
                .value,

        trainingPlace:
            document
                .getElementById("setupTrainingPlace")
                .value,

        meals:
            document
                .getElementById("setupMeals")
                .value,

        likes:
            document
                .getElementById("setupLikes")
                .value
                .trim(),

        dislikes:
            document
                .getElementById("setupDislikes")
                .value
                .trim(),

        allergies:
            document
                .getElementById("setupAllergies")
                .value
                .trim(),

        createdAt:
            new Date().toISOString()

    };


    /* =================================================
       CONTROLLO
    ================================================= */

    const required = [
        profile.age,
        profile.sex,
        profile.height,
        profile.weight,
        profile.goal,
        profile.trainingDays,
        profile.trainingDuration,
        profile.trainingPlace,
        profile.meals
    ];


    if (
        required.some(
            value => !value
        )
    ) {

        alert(
            "Completa tutti i campi principali."
        );

        return;
    }


    const age =
        Number(profile.age);

    const height =
        Number(profile.height);

    const weight =
        Number(profile.weight);


    if (
        !Number.isFinite(age) ||
        age < 13 ||
        age > 100
    ) {

        alert(
            "Inserisci un'età valida."
        );

        return;
    }


    if (
        !Number.isFinite(height) ||
        height < 100 ||
        height > 250
    ) {

        alert(
            "Inserisci un'altezza valida."
        );

        return;
    }


    if (
        !Number.isFinite(weight) ||
        weight < 30 ||
        weight > 300
    ) {

        alert(
            "Inserisci un peso valido."
        );

        return;
    }


    /* =================================================
       SALVA
    ================================================= */

    saveProfile(profile);


    /* =================================================
       GENERA NUTRIZIONE
    ================================================= */

    if (
        typeof refreshNutrition ===
        "function"
    ) {

        refreshNutrition();

    }


    /* =================================================
       MOSTRA APP
    ================================================= */

    showMainApp();

    updateDashboard();

    updateProfileSummary();

    updateDietScreen();

    showScreen("home");

}


/* =====================================================
   MOSTRA APP
===================================================== */

function showMainApp() {

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
   MOSTRA SETUP
===================================================== */

function showSetup() {

    const app =
        document.getElementById(
            "mainApp"
        );

    const setup =
        document.getElementById(
            "setupScreen"
        );


    if (app) {

        app.classList.add(
            "hidden"
        );

    }


    if (setup) {

        setup.classList.remove(
            "hidden"
        );

    }


    window.scrollTo(
        0,
        0
    );

}


/* =====================================================
   MODIFICA PROFILO
===================================================== */

function editProfile() {

    const profile =
        getProfile();


    if (!profile) {

        showSetup();

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


    Object.entries(fields)
        .forEach(
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


    showSetup();

}


/* =====================================================
   CANCELLA PROFILO
===================================================== */

function resetProfile() {

    const confirmation =
        confirm(
            "Vuoi davvero cancellare il profilo?"
        );


    if (!confirmation) {
        return;
    }


    localStorage.removeItem(
        PROFILE_KEY
    );


    localStorage.removeItem(
        "myTransformationNutrition"
    );


    location.reload();

}


/* =====================================================
   DASHBOARD
===================================================== */

function updateDashboard() {

    const profile =
        getProfile();


    if (!profile) {
        return;
    }


    const weight =
        document.getElementById(
            "homeWeight"
        );

    const goal =
        document.getElementById(
            "homeGoal"
        );

    const training =
        document.getElementById(
            "homeTraining"
        );

    const meals =
        document.getElementById(
            "homeMeals"
        );


    if (weight) {

        weight.textContent =
            `${profile.weight} kg`;

    }


    if (goal) {

        goal.textContent =
            GOAL_NAMES[
                profile.goal
            ] || "—";

    }


    if (training) {

        training.textContent =
            profile.trainingDays;

    }


    if (meals) {

        meals.textContent =
            profile.meals;

    }


    updateProfileSummary();

}


/* =====================================================
   RIEPILOGO PROFILO
===================================================== */

function updateProfileSummary() {

    const profile =
        getProfile();

    const summary =
        document.getElementById(
            "profileSummary"
        );


    if (
        !profile ||
        !summary
    ) {

        return;

    }


    summary.innerHTML = `

        <strong
            style="
                color:white;
                font-size:17px;
            "
        >
            Profilo configurato
        </strong>

        <br><br>

        Età:
        ${escapeHTML(profile.age)}

        <br>

        Altezza:
        ${escapeHTML(profile.height)}
        cm

        <br>

        Peso:
        ${escapeHTML(profile.weight)}
        kg

        <br>

        Obiettivo:
        ${escapeHTML(
            GOAL_NAMES[
                profile.goal
            ] || "—"
        )}

        <br>

        Allenamenti:
        ${escapeHTML(profile.trainingDays)}
        giorni/settimana

        <br>

        Durata:
        ${escapeHTML(profile.trainingDuration)}
        minuti

        <br>

        Luogo:
        ${escapeHTML(
            PLACE_NAMES[
                profile.trainingPlace
            ] || "—"
        )}

        <br>

        Pasti:
        ${escapeHTML(profile.meals)}
        al giorno

    `;

}


/* =====================================================
   DIETA
===================================================== */

function updateDietScreen() {

    const profile =
        getProfile();


    if (!profile) {
        return;
    }


    let target = null;


    if (
        typeof getNutritionTarget ===
        "function"
    ) {

        target =
            getNutritionTarget();

    }


    if (!target) {

        if (
            typeof refreshNutrition ===
            "function"
        ) {

            target =
                refreshNutrition();

        }

    }


    if (!target) {

        console.error(
            "Target nutrizionale non disponibile."
        );

        return;
    }


    const calories =
        document.getElementById(
            "dietCalories"
        );

    const protein =
        document.getElementById(
            "dietProtein"
        );

    const carbs =
        document.getElementById(
            "dietCarbs"
        );

    const fat =
        document.getElementById(
            "dietFat"
        );


    if (calories) {

        calories.textContent =
            `${target.calories}`;

    }


    if (protein) {

        protein.textContent =
            `${target.protein}`;

    }


    if (carbs) {

        carbs.textContent =
            `${target.carbs}`;

    }


    if (fat) {

        fat.textContent =
            `${target.fat}`;

    }


    updateMealPlaceholders(
        target
    );

}


/* =====================================================
   PASTI
===================================================== */

function updateMealPlaceholders(
    target
) {

    const profile =
        getProfile();


    if (!profile) {
        return;
    }


    if (
        typeof getMealDistribution !==
        "function"
    ) {

        return;
    }


    const distribution =
        getMealDistribution(
            target
        );


    const names = [
        "🥣 Colazione",
        "🍝 Pranzo",
        "🥩 Cena",
        "🍎 Spuntino",
        "🥛 Spuntino"
    ];


    distribution.forEach(
        (meal, index) => {

            const element =
                document.getElementById(
                    `meal${index + 1}`
                );


            if (!element) {
                return;
            }


            element.innerHTML = `

                <strong>
                    ${names[index]}
                </strong>

                <span>
                    ${meal.calories} kcal
                    · ${meal.protein} g
                    proteine
                </span>

            `;

        }
    );

}


/* =====================================================
   NAVIGAZIONE
===================================================== */

function showScreen(
    id,
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
            id
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

    } else {

        const matching =
            document.querySelector(
                `.nav button[data-screen="${id}"]`
            );


        if (matching) {

            matching.classList.add(
                "active"
            );

        }

    }


    if (id === "home") {

        updateDashboard();

    }


    if (id === "diet") {

        updateDietScreen();

    }


    if (id === "profile") {

        updateProfileSummary();

    }


    window.scrollTo(
        0,
        0
    );

}


/* =====================================================
   CHECKLIST
===================================================== */

function toggleCheck(
    button
) {

    if (!button) {
        return;
    }


    button.classList.toggle(
        "done"
    );

}


/* =====================================================
   ESCAPE HTML
===================================================== */

function escapeHTML(
    value
) {

    return String(value)
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
   INIZIALIZZAZIONE
===================================================== */

function initializeApp() {

    const profile =
        getProfile();


    if (profile) {

        showMainApp();

        updateDashboard();

        updateDietScreen();

        showScreen(
            "home"
        );

        return;
    }


    const app =
        document.getElementById(
            "mainApp"
        );

    const setup =
        document.getElementById(
            "setupScreen"
        );


    if (app) {

        app.classList.add(
            "hidden"
        );

    }


    if (setup) {

        setup.classList.remove(
            "hidden"
        );

    }

}


/* =====================================================
   AVVIO
===================================================== */

document.addEventListener(
    "DOMContentLoaded",
    initializeApp
);