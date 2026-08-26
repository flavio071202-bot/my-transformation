/* =====================================================
   MY TRANSFORMATION — APP.JS
   Versione 2
===================================================== */


/* =====================================================
   CONFIGURAZIONE
===================================================== */

const STORAGE_KEY = "myTransformationProfile";


/* =====================================================
   NOMI VISUALIZZATI
===================================================== */

const goalNames = {
    fatloss: "Perdere grasso",
    recomp: "Ricomposizione",
    muscle: "Massa muscolare",
    definition: "Definizione"
};

const placeNames = {
    gym: "Palestra",
    home: "Casa",
    both: "Palestra + casa"
};


/* =====================================================
   GESTIONE PROFILO
===================================================== */

function getProfile() {

    const data = localStorage.getItem(STORAGE_KEY);

    if (!data) {
        return null;
    }

    try {
        return JSON.parse(data);
    } catch (error) {

        console.error(
            "Errore nella lettura del profilo:",
            error
        );

        return null;
    }
}


/* =====================================================
   SALVATAGGIO PROFILO
===================================================== */

function saveProfile(profile) {

    localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(profile)
    );
}


/* =====================================================
   CONFIGURAZIONE INIZIALE
===================================================== */

function completeSetup() {

    const profile = {

        age:
            document.getElementById(
                "setupAge"
            ).value.trim(),

        sex:
            document.getElementById(
                "setupSex"
            ).value,

        height:
            document.getElementById(
                "setupHeight"
            ).value.trim(),

        weight:
            document.getElementById(
                "setupWeight"
            ).value.trim(),

        goal:
            document.getElementById(
                "setupGoal"
            ).value,

        trainingDays:
            document.getElementById(
                "setupTrainingDays"
            ).value,

        trainingDuration:
            document.getElementById(
                "setupTrainingDuration"
            ).value,

        trainingPlace:
            document.getElementById(
                "setupTrainingPlace"
            ).value,

        meals:
            document.getElementById(
                "setupMeals"
            ).value,

        likes:
            document.getElementById(
                "setupLikes"
            ).value.trim(),

        dislikes:
            document.getElementById(
                "setupDislikes"
            ).value.trim(),

        allergies:
            document.getElementById(
                "setupAllergies"
            ).value.trim(),

        createdAt:
            new Date().toISOString()

    };


    /* ---------------------------------------------
       CONTROLLO CAMPI OBBLIGATORI
    --------------------------------------------- */

    const requiredFields = [
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


    const missingField =
        requiredFields.some(
            field => !field
        );


    if (missingField) {

        alert(
            "Completa tutti i campi principali prima di continuare."
        );

        return;
    }


    /* ---------------------------------------------
       CONTROLLO NUMERI
    --------------------------------------------- */

    const age = Number(profile.age);
    const height = Number(profile.height);
    const weight = Number(profile.weight);


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


    /* ---------------------------------------------
       SALVA
    --------------------------------------------- */

    saveProfile(profile);


    /* ---------------------------------------------
       MOSTRA APP
    --------------------------------------------- */

    showMainApp();

    updateDashboard();

    updateProfileSummary();

    showScreen("home");

}


/* =====================================================
   MOSTRA APP PRINCIPALE
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
        setup.classList.add("hidden");
    }

    if (app) {
        app.classList.remove("hidden");
    }

}


/* =====================================================
   MOSTRA CONFIGURAZIONE
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
        app.classList.add("hidden");
    }

    if (setup) {
        setup.classList.remove("hidden");
    }


    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });

}


/* =====================================================
   MODIFICA PROFILO
===================================================== */

function editProfile() {

    const profile = getProfile();


    if (!profile) {

        showSetup();

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


    showSetup();

}


/* =====================================================
   CANCELLA PROFILO
===================================================== */

function resetProfile() {

    const confirmation =
        confirm(
            "Sei sicuro di voler cancellare il profilo?"
        );


    if (!confirmation) {
        return;
    }


    localStorage.removeItem(
        STORAGE_KEY
    );


    location.reload();

}


/* =====================================================
   AGGIORNA DASHBOARD
===================================================== */

function updateDashboard() {

    const profile = getProfile();


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
            goalNames[profile.goal] || "—";

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

    const profile = getProfile();

    const summary =
        document.getElementById(
            "profileSummary"
        );


    if (!profile || !summary) {
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
            goalNames[profile.goal] || "—"
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
            placeNames[profile.trainingPlace] || "—"
        )}

        <br>

        Pasti:
        ${escapeHTML(profile.meals)}
        al giorno

    `;

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
        document.getElementById(id);


    if (!target) {
        return;
    }


    target.classList.add(
        "active"
    );


    /* ---------------------------------------------
       AGGIORNA NAVIGAZIONE
    --------------------------------------------- */

    const navButtons =
        document.querySelectorAll(
            ".nav button"
        );


    navButtons.forEach(
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
            Array.from(navButtons)
                .find(
                    btn =>
                        btn.getAttribute(
                            "onclick"
                        )?.includes(
                            `'${id}'`
                        )
                );


        if (matchingButton) {

            matchingButton.classList.add(
                "active"
            );

        }

    }


    /* ---------------------------------------------
       AGGIORNAMENTI SPECIFICI
    --------------------------------------------- */

    if (id === "profile") {

        updateProfileSummary();

    }


    if (id === "home") {

        updateDashboard();

    }


    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });

}


/* =====================================================
   CHECKLIST
===================================================== */

function toggleCheck(button) {

    if (!button) {
        return;
    }


    button.classList.toggle(
        "done"
    );

}


/* =====================================================
   SICUREZZA HTML
===================================================== */

function escapeHTML(value) {

    return String(value)
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");

}


/* =====================================================
   CONTROLLO PROFILO
===================================================== */

function initializeApp() {

    const profile =
        getProfile();


    if (profile) {

        showMainApp();

        updateDashboard();

        showScreen("home");

    } else {

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

}

/* =====================================================
   AGGIORNAMENTO SCHERMATA DIETA
===================================================== */

function updateDietScreen() {

    const target =
        getNutritionTarget();

    if (!target) {
        return;
    }

    const dietScreen =
        document.getElementById("diet");

    if (!dietScreen) {
        return;
    }

    const stats =
        dietScreen.querySelectorAll(".stat-value");

    if (stats.length >= 2) {

        stats[0].textContent =
            target.calories + " kcal";

        stats[1].textContent =
            target.protein + " g";

    }

}


/* =====================================================
   AGGIORNA DIETA QUANDO SI APRE
===================================================== */

function initializeDietScreen() {

    updateDietScreen();

}
/* =====================================================
   AVVIO
===================================================== */

document.addEventListener(
    "DOMContentLoaded",
    initializeApp
);