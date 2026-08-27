/* =====================================================
   MY TRANSFORMATION
   MEALS ENGINE — COACH IA ONLY
   VERSIONE 4.2
===================================================== */

const MEALS_STORAGE_KEY =
    "myTransformationMeals";

const MEALS_IMPORTED_WEEK_KEY =
    "myTransformationImportedWeek";

const MEALS_SOURCE =
    "coach_ai";


/* =====================================================
   UTILITÀ NUMERICHE
===================================================== */

function mealsNumber(value, fallback = 0) {

    if (
        value === null ||
        value === undefined ||
        value === ""
    ) {
        return fallback;
    }

    const normalized =
        String(value)
            .replace(",", ".")
            .trim();

    const number =
        Number(normalized);

    return Number.isFinite(number)
        ? number
        : fallback;
}


function mealsRound(value, decimals = 1) {

    const number =
        mealsNumber(value);

    const multiplier =
        Math.pow(10, decimals);

    return Math.round(
        number * multiplier
    ) / multiplier;
}


/* =====================================================
   NORMALIZZAZIONE TESTO
===================================================== */

function mealsNormalize(text) {

    return String(text || "")
        .toLowerCase()
        .normalize("NFD")
        .replace(
            /[\u0300-\u036f]/g,
            ""
        )
        .trim();

}


/* =====================================================
   PROFILO
===================================================== */

function getMealsProfile() {

    if (
        typeof storageGetProfile ===
        "function"
    ) {

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
   TARGET NUTRIZIONALE
===================================================== */

function getMealsTarget() {

    if (
        typeof getNutritionTarget ===
        "function"
    ) {

        try {

            const target =
                getNutritionTarget();

            if (target) {
                return target;
            }

        } catch {}

    }

    return null;

}


/* =====================================================
   GIORNI ITALIANI
===================================================== */

function getItalianDayName(index) {

    const days = [

        "Lunedì",
        "Martedì",
        "Mercoledì",
        "Giovedì",
        "Venerdì",
        "Sabato",
        "Domenica"

    ];

    return days[index] || "";

}


/* =====================================================
   INDICE GIORNO SETTIMANA
===================================================== */

function getMealsWeekdayIndex(
    date = new Date()
) {

    const day =
        date.getDay();

    return day === 0
        ? 6
        : day - 1;

}


/* =====================================================
   DATA INIZIO SETTIMANA
===================================================== */

function getMondayOfCurrentWeek(
    date = new Date()
) {

    const result =
        new Date(date);

    result.setHours(
        0,
        0,
        0,
        0
    );

    const day =
        result.getDay();

    const difference =
        day === 0
            ? -6
            : 1 - day;

    result.setDate(
        result.getDate() +
        difference
    );

    return result;

}


/* =====================================================
   DATA GIORNO SETTIMANA
===================================================== */

function getImportedDate(
    dayIndex
) {

    const monday =
        getMondayOfCurrentWeek(
            new Date()
        );

    monday.setDate(
        monday.getDate() +
        Number(dayIndex)
    );

    const year =
        monday.getFullYear();

    const month =
        String(
            monday.getMonth() + 1
        ).padStart(
            2,
            "0"
        );

    const day =
        String(
            monday.getDate()
        ).padStart(
            2,
            "0"
        );

    return `${year}-${month}-${day}`;

}


/* =====================================================
   PARSE NUMERI
===================================================== */

function parseMealsNumericValue(
    value,
    fallback = 0
) {

    if (
        typeof value ===
        "number"
    ) {

        return Number.isFinite(value)
            ? value
            : fallback;

    }

    if (
        typeof value ===
        "string"
    ) {

        const cleaned =
            value
                .replace(",", ".")
                .replace(
                    /[^0-9.\-]/g,
                    ""
                );

        const number =
            Number(cleaned);

        return Number.isFinite(number)
            ? number
            : fallback;

    }

    return fallback;

}


/* =====================================================
   TOTALI PASTO
===================================================== */

function calculateMealTotals(
    foods = []
) {

    const totals = {

        kcal: 0,
        protein: 0,
        carbs: 0,
        fat: 0,
        fiber: 0

    };


    if (
        !Array.isArray(foods)
    ) {

        return totals;

    }


    foods.forEach(
        food => {

            if (!food) return;

            totals.kcal +=
                parseMealsNumericValue(
                    food.kcal
                );

            totals.protein +=
                parseMealsNumericValue(
                    food.protein
                );

            totals.carbs +=
                parseMealsNumericValue(
                    food.carbs
                );

            totals.fat +=
                parseMealsNumericValue(
                    food.fat
                );

            totals.fiber +=
                parseMealsNumericValue(
                    food.fiber
                );

        }
    );


    return {

        kcal:
            mealsRound(
                totals.kcal,
                0
            ),

        protein:
            mealsRound(
                totals.protein,
                1
            ),

        carbs:
            mealsRound(
                totals.carbs,
                1
            ),

        fat:
            mealsRound(
                totals.fat,
                1
            ),

        fiber:
            mealsRound(
                totals.fiber,
                1
            )

    };

}


/* =====================================================
   TOTALI GIORNALIERI
===================================================== */

function calculateDailyTotals(
    meals = []
) {

    const totals = {

        kcal: 0,
        protein: 0,
        carbs: 0,
        fat: 0,
        fiber: 0

    };


    if (
        !Array.isArray(meals)
    ) {

        return totals;

    }


    meals.forEach(
        meal => {

            if (
                !meal ||
                !meal.totals
            ) {
                return;
            }

            totals.kcal +=
                parseMealsNumericValue(
                    meal.totals.kcal
                );

            totals.protein +=
                parseMealsNumericValue(
                    meal.totals.protein
                );

            totals.carbs +=
                parseMealsNumericValue(
                    meal.totals.carbs
                );

            totals.fat +=
                parseMealsNumericValue(
                    meal.totals.fat
                );

            totals.fiber +=
                parseMealsNumericValue(
                    meal.totals.fiber
                );

        }
    );


    return {

        kcal:
            mealsRound(
                totals.kcal,
                0
            ),

        protein:
            mealsRound(
                totals.protein,
                1
            ),

        carbs:
            mealsRound(
                totals.carbs,
                1
            ),

        fat:
            mealsRound(
                totals.fat,
                1
            ),

        fiber:
            mealsRound(
                totals.fiber,
                1
            )

    };

}


/* =====================================================
   PULIZIA RISPOSTA COACH
===================================================== */

function cleanCoachResponse(text) {

    if (!text) {

        throw new Error(
            "Nessuna risposta ricevuta da ChatGPT."
        );

    }


    let cleaned =
        String(text).trim();


    const startMarker =
        "=== MY_TRANSFORMATION_DIET_START ===";

    const endMarker =
        "=== MY_TRANSFORMATION_DIET_END ===";


    const markerStart =
        cleaned.indexOf(
            startMarker
        );


    if (markerStart !== -1) {

        cleaned =
            cleaned.substring(
                markerStart +
                startMarker.length
            );

    }


    const markerEnd =
        cleaned.indexOf(
            endMarker
        );


    if (markerEnd !== -1) {

        cleaned =
            cleaned.substring(
                0,
                markerEnd
            );

    }


    cleaned =
        cleaned.trim();


    cleaned =
        cleaned.replace(
            /^```json\s*/i,
            ""
        );


    cleaned =
        cleaned.replace(
            /^```\s*/i,
            ""
        );


    cleaned =
        cleaned.replace(
            /```\s*$/i,
            ""
        );


    cleaned =
        cleaned
            .replace(
                /[\u201C\u201D]/g,
                '"'
            )
            .replace(
                /[\u2018\u2019]/g,
                "'"
            );


    return cleaned.trim();

}


/* =====================================================
   ESTRAZIONE JSON
===================================================== */

function extractJsonObject(text) {

    const source =
        cleanCoachResponse(text);

    const firstBrace =
        source.indexOf("{");


    if (firstBrace === -1) {

        throw new Error(
            "Non trovo un oggetto JSON nella risposta del Coach."
        );

    }


    let depth = 0;
    let inString = false;
    let escaped = false;


    for (
        let i = firstBrace;
        i < source.length;
        i++
    ) {

        const char =
            source[i];


        if (escaped) {

            escaped = false;

            continue;

        }


        if (
            char === "\\" &&
            inString
        ) {

            escaped = true;

            continue;

        }


        if (char === '"') {

            inString =
                !inString;

            continue;

        }


        if (inString) continue;


        if (char === "{") {
            depth++;
        }


        if (char === "}") {

            depth--;

            if (depth === 0) {

                return source.substring(
                    firstBrace,
                    i + 1
                );

            }

        }

    }


    throw new Error(
        "Il JSON della dieta è incompleto."
    );

}


/* =====================================================
   VIRGOLE FINALI
===================================================== */

function removeTrailingCommas(json) {

    return String(json)
        .replace(
            /,\s*([}\]])/g,
            "$1"
        );

}


/* =====================================================
   PARSER COACH
===================================================== */

function parseCoachDietText(text) {

    const jsonText =
        extractJsonObject(text);


    const cleanedJson =
        removeTrailingCommas(
            jsonText
        );


    let data;


    try {

        data =
            JSON.parse(
                cleanedJson
            );

    } catch {

        throw new Error(
            "Il JSON della dieta non è valido."
        );

    }


    if (
        !data ||
        typeof data !== "object"
    ) {

        throw new Error(
            "La risposta del Coach non è valida."
        );

    }


    if (
        Array.isArray(data.week)
    ) {

        return data;

    }


    if (
        Array.isArray(data.days)
    ) {

        data.week =
            data.days;

        delete data.days;

        return data;

    }


    throw new Error(
        "La risposta non contiene la settimana alimentare."
    );

}


/* =====================================================
   NORMALIZZA ALIMENTO
===================================================== */

function normalizeCoachFood(
    food,
    dayIndex,
    mealIndex,
    foodIndex
) {

    const source =
        food &&
        typeof food === "object"
            ? food
            : {};


    return {

        id:
            `coach_food_${dayIndex}_${mealIndex}_${foodIndex}`,

        name:
            String(
                source.name ||
                "Alimento"
            ).trim(),

        grams:
            mealsRound(
                parseMealsNumericValue(
                    source.grams
                ),
                0
            ),

        kcal:
            mealsRound(
                parseMealsNumericValue(
                    source.kcal
                ),
                0
            ),

        protein:
            mealsRound(
                parseMealsNumericValue(
                    source.protein
                ),
                1
            ),

        carbs:
            mealsRound(
                parseMealsNumericValue(
                    source.carbs
                ),
                1
            ),

        fat:
            mealsRound(
                parseMealsNumericValue(
                    source.fat
                ),
                1
            ),

        fiber:
            mealsRound(
                parseMealsNumericValue(
                    source.fiber
                ),
                1
            )

    };

}


/* =====================================================
   NORMALIZZA PASTO
===================================================== */

function normalizeCoachMeal(
    meal,
    dayIndex,
    mealIndex
) {

    const source =
        meal &&
        typeof meal === "object"
            ? meal
            : {};


    const foods =
        Array.isArray(source.foods)
            ? source.foods
            : [];


    const normalizedFoods =
        foods.map(
            (
                food,
                foodIndex
            ) =>
                normalizeCoachFood(
                    food,
                    dayIndex,
                    mealIndex,
                    foodIndex
                )
        );


    if (
        normalizedFoods.length === 0
    ) {

        throw new Error(
            `Il pasto ${mealIndex + 1} del giorno ${dayIndex + 1} non contiene alimenti.`
        );

    }


    return {

        id:
            `coach_meal_${dayIndex}_${mealIndex}`,

        type:
            mealsNormalize(
                source.name ||
                `Pasto ${mealIndex + 1}`
            )
            .replace(
                /\s+/g,
                "_"
            ),

        name:
            String(
                source.name ||
                `Pasto ${mealIndex + 1}`
            ).trim(),

        foods:
            normalizedFoods,

        totals:
            calculateMealTotals(
                normalizedFoods
            ),

        completed:
            false,

        completedAt:
            null

    };

}


/* =====================================================
   NORMALIZZA GIORNO
===================================================== */

function normalizeCoachDay(
    day,
    dayIndex
) {

    const source =
        day &&
        typeof day === "object"
            ? day
            : {};


    const meals =
        Array.isArray(source.meals)
            ? source.meals
            : [];


    if (!meals.length) {

        throw new Error(
            `Il giorno ${dayIndex + 1} non contiene pasti.`
        );

    }


    const normalizedMeals =
        meals.map(
            (
                meal,
                mealIndex
            ) =>
                normalizeCoachMeal(
                    meal,
                    dayIndex,
                    mealIndex
                )
        );


    return {

        id:
            `coach_day_${dayIndex}`,

        date:
            getImportedDate(
                dayIndex
            ),

        day:
            getItalianDayName(
                dayIndex
            ),

        dayType:
            source.dayType ||
            "unknown",

        meals:
            normalizedMeals,

        totals:
            calculateDailyTotals(
                normalizedMeals
            ),

        target:
            getMealsTarget(),

        completed:
            false

    };

}


/* =====================================================
   NORMALIZZA SETTIMANA
===================================================== */

function normalizeImportedDiet(data) {

    if (
        !data ||
        typeof data !== "object"
    ) {

        throw new Error(
            "La risposta del Coach non è valida."
        );

    }


    const week =
        Array.isArray(data.week)
            ? data.week
            : null;


    if (!week) {

        throw new Error(
            "La risposta non contiene una settimana valida."
        );

    }


    if (week.length !== 7) {

        throw new Error(
            `La settimana deve contenere esattamente 7 giorni. Ricevuti: ${week.length}.`
        );

    }


    const profile =
        getMealsProfile();


    const expectedMeals =
        profile
            ? Number(profile.meals)
            : null;


    const days =
        week.map(
            (
                day,
                dayIndex
            ) => {

                const normalized =
                    normalizeCoachDay(
                        day,
                        dayIndex
                    );


                if (
                    Number.isFinite(
                        expectedMeals
                    ) &&
                    expectedMeals >= 3 &&
                    expectedMeals <= 5
                ) {

                    if (
                        normalized.meals.length !==
                        expectedMeals
                    ) {

                        throw new Error(
                            `Il giorno ${dayIndex + 1} contiene ${normalized.meals.length} pasti invece di ${expectedMeals}.`
                        );

                    }

                }


                return normalized;

            }
        );


    const monday =
        getMondayOfCurrentWeek(
            new Date()
        );


    const startDate =
        formatMealsDate(
            monday
        );


    const sunday =
        new Date(monday);


    sunday.setDate(
        sunday.getDate() + 6
    );


    const endDate =
        formatMealsDate(
            sunday
        );


    return {

        version:
            String(
                data.version ||
                "4.0"
            ),

        type:
            "weekly",

        source:
            MEALS_SOURCE,

        imported:
            true,

        importedAt:
            new Date().toISOString(),

        startDate,

        endDate,

        days

    };

}


/* =====================================================
   FORMATTA DATA
===================================================== */

function formatMealsDate(date) {

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

    return `${year}-${month}-${day}`;

}


/* =====================================================
   LETTURA PIANO
===================================================== */

function getSavedMealsPlan() {

    let data =
        localStorage.getItem(
            MEALS_IMPORTED_WEEK_KEY
        );


    if (data) {

        try {

            const plan =
                JSON.parse(data);


            if (
                plan &&
                plan.source === MEALS_SOURCE &&
                plan.imported === true &&
                Array.isArray(plan.days) &&
                plan.days.length === 7
            ) {

                return plan;

            }

        } catch {}

    }


    if (
        typeof storageGetMeals ===
        "function"
    ) {

        try {

            const stored =
                storageGetMeals();


            if (
                stored &&
                stored.source === MEALS_SOURCE &&
                stored.imported === true &&
                Array.isArray(stored.days) &&
                stored.days.length === 7
            ) {

                return stored;

            }

        } catch {}

    }


    data =
        localStorage.getItem(
            MEALS_STORAGE_KEY
        );


    if (!data) return null;


    try {

        const plan =
            JSON.parse(data);


        if (
            plan &&
            plan.source === MEALS_SOURCE &&
            plan.imported === true &&
            Array.isArray(plan.days) &&
            plan.days.length === 7
        ) {

            return plan;

        }


        return null;

    } catch {

        return null;

    }

}


/* =====================================================
   SALVATAGGIO PIANO
===================================================== */

function saveMealsPlan(plan) {

    if (!plan) return false;


    if (
        plan.source !== MEALS_SOURCE ||
        plan.imported !== true ||
        !Array.isArray(plan.days) ||
        plan.days.length !== 7
    ) {

        return false;

    }


    const serialized =
        JSON.stringify(plan);


    try {

        localStorage.setItem(
            MEALS_STORAGE_KEY,
            serialized
        );

        localStorage.setItem(
            MEALS_IMPORTED_WEEK_KEY,
            serialized
        );


        if (
            typeof storageSaveMeals ===
            "function"
        ) {

            try {
                storageSaveMeals(plan);
            } catch {}

        }


        /*
           Verifica reale del salvataggio.
        */

        const verification =
            localStorage.getItem(
                MEALS_IMPORTED_WEEK_KEY
            );


        if (!verification) {

            return false;

        }


        return true;

    } catch (error) {

        console.error(
            "Errore salvataggio dieta:",
            error
        );

        return false;

    }

}


/* =====================================================
   TROVA GIORNO
===================================================== */

function getMealsDay(
    date = new Date()
) {

    const plan =
        getSavedMealsPlan();


    if (
        !plan ||
        !Array.isArray(plan.days) ||
        plan.days.length !== 7
    ) {

        return null;

    }


    const index =
        getMealsWeekdayIndex(
            date
        );


    return (
        plan.days[index] ||
        null
    );

}


/* =====================================================
   IMPORTAZIONE COACH
===================================================== */

function importCoachDiet(text) {

    try {

        const data =
            parseCoachDietText(
                text
            );


        const plan =
            normalizeImportedDiet(
                data
            );


        const saved =
            saveMealsPlan(
                plan
            );


        if (!saved) {

            throw new Error(
                "Non è stato possibile salvare la settimana."
            );

        }


        if (
            typeof updateAllScreens ===
            "function"
        ) {

            try {
                updateAllScreens();
            } catch {}

        }


        return {

            success:
                true,

            plan,

            message:
                "Settimana del Coach importata correttamente."

        };

    } catch (error) {

        console.error(
            "Errore importazione dieta:",
            error
        );


        return {

            success:
                false,

            plan:
                null,

            message:
                error?.message ||
                "Errore durante l'importazione della dieta."

        };

    }

}


/* =====================================================
   IMPORTAZIONE CLIPBOARD
===================================================== */

async function importCoachDietFromClipboard() {

    if (
        !navigator.clipboard ||
        typeof navigator.clipboard.readText !==
        "function"
    ) {

        return {

            success:
                false,

            message:
                "Il browser non permette di leggere gli appunti."

        };

    }


    try {

        const text =
            await navigator.clipboard.readText();


        if (!text) {

            return {

                success:
                    false,

                message:
                    "Gli appunti sono vuoti."

            };

        }


        return importCoachDiet(
            text
        );

    } catch {

        return {

            success:
                false,

            message:
                "Non è stato possibile leggere gli appunti."

        };

    }

}


/* =====================================================
   IMPORTAZIONE MANUALE
===================================================== */

function importCoachDietFromTextArea() {

    const text =
        window.prompt(
            "Incolla qui la risposta completa di ChatGPT:"
        );


    if (!text) {

        return {

            success:
                false,

            message:
                "Importazione annullata."

        };

    }


    return importCoachDiet(
        text
    );

}


/* =====================================================
   COMPLETAMENTO PASTO — DEFINITIVO
===================================================== */

function toggleMealCompleted(
    mealId,
    date = new Date()
) {

    const plan =
        getSavedMealsPlan();


    if (!plan) {

        console.error(
            "Nessun piano Coach salvato."
        );

        return false;

    }


    if (
        !Array.isArray(plan.days) ||
        plan.days.length !== 7
    ) {

        return false;

    }


    const day =
        getMealsDay(
            date
        );


    if (
        !day ||
        !Array.isArray(day.meals)
    ) {

        console.error(
            "Giorno della dieta non trovato."
        );

        return false;

    }


    /*
       Prima cerchiamo il pasto nel giorno
       corretto.
    */

    let meal =
        day.meals.find(
            item =>
                item &&
                String(item.id) ===
                String(mealId)
        );


    /*
       Fallback:
       se il vecchio piano ha date generate
       diversamente, cerchiamo comunque
       nell'intera settimana.
    */

    if (!meal) {

        for (
            const planDay of plan.days
        ) {

            if (
                !planDay ||
                !Array.isArray(
                    planDay.meals
                )
            ) {

                continue;

            }


            const found =
                planDay.meals.find(
                    item =>
                        item &&
                        String(item.id) ===
                        String(mealId)
                );


            if (found) {

                meal =
                    found;

                break;

            }

        }

    }


    if (!meal) {

        console.error(
            "Pasto non trovato:",
            mealId
        );

        return false;

    }


    /*
       TOGGLE REALE.
    */

    meal.completed =
        meal.completed !== true;


    meal.completedAt =
        meal.completed
            ? new Date().toISOString()
            : null;


    /*
       Salvataggio obbligatorio.
    */

    const saved =
        saveMealsPlan(
            plan
        );


    if (!saved) {

        console.error(
            "Impossibile salvare il completamento del pasto."
        );

        return false;

    }


    /*
       Log aderenza.
    */

    if (
        meal.completed &&
        typeof logMealCompletion ===
        "function"
    ) {

        try {

            logMealCompletion(
                meal.name,
                meal.totals?.kcal || 0
            );

        } catch {}

    }


    /*
       Restituisce lo stato reale.
    */

    return meal.completed;

}


/* =====================================================
   COMPLETA PASTO
===================================================== */

function completeMeal(
    mealId
) {

    const completed =
        toggleMealCompleted(
            mealId,
            new Date()
        );


    if (
        typeof updateDietScreen ===
        "function"
    ) {

        try {
            updateDietScreen();
        } catch {}

    }


    if (
        typeof updateDashboard ===
        "function"
    ) {

        try {
            updateDashboard();
        } catch {}

    }


    if (
        typeof updateProgressScreen ===
        "function"
    ) {

        try {
            updateProgressScreen();
        } catch {}

    }


    return completed;

}


/* =====================================================
   STATISTICHE
===================================================== */

function getMealCompletionStats(
    plan = null
) {

    const currentPlan =
        plan ||
        getSavedMealsPlan();


    if (!currentPlan) {

        return {

            completed: 0,
            total: 0,
            percentage: 0

        };

    }


    const days =
        Array.isArray(currentPlan.days)
            ? currentPlan.days
            : [];


    const meals = [];


    days.forEach(
        day => {

            if (
                day &&
                Array.isArray(day.meals)
            ) {

                meals.push(
                    ...day.meals
                );

            }

        }
    );


    const total =
        meals.length;


    const completed =
        meals.filter(
            meal =>
                meal &&
                meal.completed === true
        ).length;


    return {

        completed,

        total,

        percentage:
            total > 0
                ? Math.round(
                    (
                        completed /
                        total
                    ) * 100
                )
                : 0

    };

}


/* =====================================================
   SETTIMANA PRESENTE
===================================================== */

function hasImportedCoachWeek() {

    const plan =
        getSavedMealsPlan();


    return !!(
        plan &&
        plan.source === MEALS_SOURCE &&
        plan.imported === true &&
        Array.isArray(plan.days) &&
        plan.days.length === 7
    );

}


/* =====================================================
   STATO
===================================================== */

function getMealsStatus() {

    const plan =
        getSavedMealsPlan();


    if (!plan) {

        return {

            exists: false,
            source: null,
            days: 0,
            imported: false,
            waitingForCoach: true

        };

    }


    return {

        exists: true,
        source: MEALS_SOURCE,
        days:
            Array.isArray(plan.days)
                ? plan.days.length
                : 0,
        imported: true,
        waitingForCoach: false

    };

}


/* =====================================================
   REFRESH
===================================================== */

function refreshDailyMeals(
    date = new Date()
) {

    return getMealsDay(
        date
    );

}


function refreshWeeklyMeals() {

    return hasImportedCoachWeek()
        ? getSavedMealsPlan()
        : null;

}


function regenerateDailyMeals(
    date = new Date()
) {

    return getMealsDay(
        date
    );

}


/* =====================================================
   RESET
===================================================== */

function resetMealsPlan() {

    if (
        typeof storageDeleteMeals ===
        "function"
    ) {

        try {
            storageDeleteMeals();
        } catch {}

    }


    localStorage.removeItem(
        MEALS_STORAGE_KEY
    );

    localStorage.removeItem(
        MEALS_IMPORTED_WEEK_KEY
    );


    return true;

}


/* =====================================================
   RIMOZIONE LEGACY
===================================================== */

function removeLegacyLocalDiet() {

    let changed =
        false;


    const keys = [

        MEALS_STORAGE_KEY,
        MEALS_IMPORTED_WEEK_KEY

    ];


    keys.forEach(
        key => {

            const data =
                localStorage.getItem(
                    key
                );


            if (!data) return;


            try {

                const plan =
                    JSON.parse(data);


                if (
                    !plan ||
                    plan.source !== MEALS_SOURCE ||
                    plan.imported !== true
                ) {

                    localStorage.removeItem(
                        key
                    );

                    changed = true;

                }

            } catch {

                localStorage.removeItem(
                    key
                );

                changed = true;

            }

        }
    );


    return changed;

}


/* =====================================================
   INIZIALIZZAZIONE
===================================================== */

function initializeMeals() {

    removeLegacyLocalDiet();

}


/* =====================================================
   AVVIO
===================================================== */

document.addEventListener(
    "DOMContentLoaded",
    initializeMeals
);


/* =====================================================
   API GLOBALE
===================================================== */

window.MY_TRANSFORMATION_MEALS = {

    getSavedMealsPlan,

    getMealsDay,

    getMealsStatus,

    saveMealsPlan,

    importCoachDiet,

    importCoachDietFromClipboard,

    importCoachDietFromTextArea,

    hasImportedCoachWeek,

    toggleMealCompleted,

    completeMeal,

    getMealCompletionStats,

    resetMealsPlan,

    refreshDailyMeals,

    refreshWeeklyMeals,

    regenerateDailyMeals,

    calculateMealTotals,

    calculateDailyTotals,

    parseCoachDietText,

    normalizeImportedDiet,

    getMealsWeekdayIndex,

    getTodayItalianName:
        function () {
            return getItalianDayName(
                getMealsWeekdayIndex(
                    new Date()
                )
            );
        }

};