/* =====================================================
   MY TRANSFORMATION
   MEALS ENGINE — COACH IA ONLY
   VERSIONE DEFINITIVA
===================================================== */

const MEALS_STORAGE_KEY = "myTransformationMeals";
const MEALS_IMPORTED_WEEK_KEY = "myTransformationImportedWeek";


/* =====================================================
   UTILITÀ
===================================================== */

function mealsNumber(value, fallback = 0) {

    const number = Number(value);

    return Number.isFinite(number)
        ? number
        : fallback;

}


function mealsRound(value, decimals = 0) {

    const multiplier =
        Math.pow(10, decimals);

    return Math.round(
        mealsNumber(value) * multiplier
    ) / multiplier;

}


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

        const target =
            getNutritionTarget();

        if (target) {

            return target;

        }

    }

    return null;

}


/* =====================================================
   TOTALI ALIMENTO
===================================================== */

function calculateMealFoodNutrition(
    food,
    grams
) {

    const factor =
        mealsNumber(grams) / 100;

    return {

        kcal:
            mealsRound(
                mealsNumber(food.kcal) *
                factor
            ),

        protein:
            mealsRound(
                mealsNumber(food.protein) *
                factor,
                1
            ),

        carbs:
            mealsRound(
                mealsNumber(food.carbs) *
                factor,
                1
            ),

        fat:
            mealsRound(
                mealsNumber(food.fat) *
                factor,
                1
            ),

        fiber:
            mealsRound(
                mealsNumber(food.fiber) *
                factor,
                1
            )

    };

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

    foods.forEach(food => {

        totals.kcal +=
            mealsNumber(
                food.kcal
            );

        totals.protein +=
            mealsNumber(
                food.protein
            );

        totals.carbs +=
            mealsNumber(
                food.carbs
            );

        totals.fat +=
            mealsNumber(
                food.fat
            );

        totals.fiber +=
            mealsNumber(
                food.fiber
            );

    });

    return {

        kcal:
            mealsRound(
                totals.kcal
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
   TOTALI GIORNATA
===================================================== */

function calculateDailyTotals(
    meals = []
) {

    const total = {

        kcal: 0,
        protein: 0,
        carbs: 0,
        fat: 0,
        fiber: 0

    };

    meals.forEach(meal => {

        if (
            !meal ||
            !meal.totals
        ) {

            return;

        }

        total.kcal +=
            mealsNumber(
                meal.totals.kcal
            );

        total.protein +=
            mealsNumber(
                meal.totals.protein
            );

        total.carbs +=
            mealsNumber(
                meal.totals.carbs
            );

        total.fat +=
            mealsNumber(
                meal.totals.fat
            );

        total.fiber +=
            mealsNumber(
                meal.totals.fiber
            );

    });

    return {

        kcal:
            mealsRound(
                total.kcal
            ),

        protein:
            mealsRound(
                total.protein,
                1
            ),

        carbs:
            mealsRound(
                total.carbs,
                1
            ),

        fat:
            mealsRound(
                total.fat,
                1
            ),

        fiber:
            mealsRound(
                total.fiber,
                1
            )

    };

}


/* =====================================================
   GIORNI
===================================================== */

function getItalianDayName(
    index
) {

    return [

        "Lunedì",
        "Martedì",
        "Mercoledì",
        "Giovedì",
        "Venerdì",
        "Sabato",
        "Domenica"

    ][index] || "";

}


function getImportedDate(
    dayIndex
) {

    const now =
        new Date();

    const date =
        new Date(now);

    /*
       La settimana del Coach viene
       associata ai prossimi 7 giorni
       partendo da oggi.
    */

    date.setHours(
        0,
        0,
        0,
        0
    );

    date.setDate(
        date.getDate() +
        dayIndex
    );

    return date
        .toISOString()
        .split("T")[0];

}


/* =====================================================
   PARSER COACH
===================================================== */

function parseCoachDietText(
    text
) {

    if (!text) {

        throw new Error(
            "Nessun testo trovato."
        );

    }

    const startMarker =
        "=== MY_TRANSFORMATION_DIET_START ===";

    const endMarker =
        "=== MY_TRANSFORMATION_DIET_END ===";

    const start =
        text.indexOf(
            startMarker
        );

    const end =
        text.indexOf(
            endMarker
        );

    if (
        start === -1 ||
        end === -1 ||
        end <= start
    ) {

        throw new Error(
            "Non trovo il blocco della dieta MY TRANSFORMATION."
        );

    }

    let jsonText =
        text.substring(
            start +
            startMarker.length,
            end
        )
        .trim();


    /*
       Rimuove eventuali blocchi
       Markdown ```json
    */

    jsonText =
        jsonText
            .replace(
                /^```json\s*/i,
                ""
            )
            .replace(
                /^```\s*/i,
                ""
            )
            .replace(
                /```\s*$/i,
                ""
            )
            .trim();


    /*
       Se ChatGPT ha inserito testo
       prima/dopo il JSON, proviamo
       comunque a recuperare l'oggetto.
    */

    const firstBrace =
        jsonText.indexOf("{");

    const lastBrace =
        jsonText.lastIndexOf("}");

    if (
        firstBrace !== -1 &&
        lastBrace !== -1 &&
        lastBrace > firstBrace
    ) {

        jsonText =
            jsonText.substring(
                firstBrace,
                lastBrace + 1
            );

    }


    let data;

    try {

        data =
            JSON.parse(
                jsonText
            );

    } catch {

        throw new Error(
            "Il JSON della dieta non è valido."
        );

    }

    return data;

}


/* =====================================================
   NORMALIZZA ALIMENTO COACH
===================================================== */

function normalizeCoachFood(
    food,
    dayIndex,
    mealIndex,
    foodIndex
) {

    if (!food) {

        return {

            id:
                `coach_food_${dayIndex}_${mealIndex}_${foodIndex}`,

            name:
                "Alimento",

            grams:
                0,

            kcal:
                0,

            protein:
                0,

            carbs:
                0,

            fat:
                0,

            fiber:
                0

        };

    }

    return {

        id:
            `coach_food_${dayIndex}_${mealIndex}_${foodIndex}`,

        name:
            String(
                food.name ||
                "Alimento"
            ),

        grams:
            mealsRound(
                mealsNumber(
                    food.grams
                )
            ),

        kcal:
            mealsRound(
                mealsNumber(
                    food.kcal
                ),
                1
            ),

        protein:
            mealsRound(
                mealsNumber(
                    food.protein
                ),
                1
            ),

        carbs:
            mealsRound(
                mealsNumber(
                    food.carbs
                ),
                1
            ),

        fat:
            mealsRound(
                mealsNumber(
                    food.fat
                ),
                1
            ),

        fiber:
            mealsRound(
                mealsNumber(
                    food.fiber
                ),
                1
            )

    };

}


/* =====================================================
   NORMALIZZA PASTO COACH
===================================================== */

function normalizeCoachMeal(
    meal,
    dayIndex,
    mealIndex
) {

    const foods =
        Array.isArray(
            meal &&
            meal.foods
        )
            ? meal.foods
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


    const calculatedTotals =
        calculateMealTotals(
            normalizedFoods
        );


    const coachTotals =
        meal &&
        meal.totals
            ? {

                kcal:
                    mealsNumber(
                        meal.totals.kcal,
                        calculatedTotals.kcal
                    ),

                protein:
                    mealsNumber(
                        meal.totals.protein,
                        calculatedTotals.protein
                    ),

                carbs:
                    mealsNumber(
                        meal.totals.carbs,
                        calculatedTotals.carbs
                    ),

                fat:
                    mealsNumber(
                        meal.totals.fat,
                        calculatedTotals.fat
                    ),

                fiber:
                    mealsNumber(
                        meal.totals.fiber,
                        calculatedTotals.fiber
                    )

            }
            : calculatedTotals;


    return {

        id:
            `coach_meal_${dayIndex}_${mealIndex}`,

        type:
            mealsNormalize(
                meal &&
                meal.name
            )
            .replace(
                /\s+/g,
                "_"
            ),

        name:
            String(
                meal &&
                meal.name
                    ? meal.name
                    : `Pasto ${mealIndex + 1}`
            ),

        foods:
            normalizedFoods,

        totals:
            coachTotals,

        completed:
            false

    };

}


/* =====================================================
   NORMALIZZA GIORNO COACH
===================================================== */

function normalizeCoachDay(
    day,
    dayIndex
) {

    const meals =
        Array.isArray(
            day &&
            day.meals
        )
            ? day.meals
            : [];


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


    const calculatedTotals =
        calculateDailyTotals(
            normalizedMeals
        );


    const coachTotals =
        day &&
        day.totals
            ? {

                kcal:
                    mealsNumber(
                        day.totals.kcal,
                        calculatedTotals.kcal
                    ),

                protein:
                    mealsNumber(
                        day.totals.protein,
                        calculatedTotals.protein
                    ),

                carbs:
                    mealsNumber(
                        day.totals.carbs,
                        calculatedTotals.carbs
                    ),

                fat:
                    mealsNumber(
                        day.totals.fat,
                        calculatedTotals.fat
                    ),

                fiber:
                    mealsNumber(
                        day.totals.fiber,
                        calculatedTotals.fiber
                    )

            }
            : calculatedTotals;


    return {

        id:
            `coach_day_${dayIndex}`,

        date:
            getImportedDate(
                dayIndex
            ),

        day:
            String(
                day &&
                day.day
                    ? day.day
                    : getItalianDayName(
                        dayIndex
                    )
            ),

        dayType:
            day &&
            day.dayType
                ? day.dayType
                : (
                    dayIndex === 6
                        ? "rest"
                        : "training"
                ),

        meals:
            normalizedMeals,

        totals:
            coachTotals,

        target:
            getMealsTarget() || null,

        completed:
            false

    };

}


/* =====================================================
   NORMALIZZA SETTIMANA
===================================================== */

function normalizeImportedDiet(
    data
) {

    if (
        !data ||
        !Array.isArray(
            data.week
        )
    ) {

        throw new Error(
            "La risposta non contiene una settimana valida."
        );

    }


    if (
        data.week.length !== 7
    ) {

        throw new Error(
            "La dieta deve contenere esattamente 7 giorni."
        );

    }


    const days =
        data.week.map(
            (
                day,
                dayIndex
            ) =>
                normalizeCoachDay(
                    day,
                    dayIndex
                )
        );


    const plan = {

        version:
            data.version ||
            "2.0",

        type:
            "weekly",

        source:
            "coach_ai",

        imported:
            true,

        importedAt:
            new Date().toISOString(),

        startDate:
            days[0].date,

        endDate:
            days[6].date,

        days:
            days

    };


    return plan;

}


/* =====================================================
   LETTURA PIANO
===================================================== */

function getSavedMealsPlan() {

    /*
       Prima controlliamo il piano Coach.
    */

    let data =
        localStorage.getItem(
            MEALS_IMPORTED_WEEK_KEY
        );

    if (data) {

        try {

            const plan =
                JSON.parse(
                    data
                );

            if (
                plan &&
                plan.source === "coach_ai" &&
                plan.imported === true &&
                Array.isArray(plan.days)
            ) {

                return plan;

            }

        } catch {

            localStorage.removeItem(
                MEALS_IMPORTED_WEEK_KEY
            );

        }

    }


    /*
       Compatibilità con il vecchio storage.
       Accettiamo SOLO piani Coach.
    */

    if (
        typeof storageGetMeals ===
        "function"
    ) {

        const stored =
            storageGetMeals();

        if (
            stored &&
            stored.source === "coach_ai" &&
            stored.imported === true &&
            Array.isArray(stored.days)
        ) {

            return stored;

        }

    }


    data =
        localStorage.getItem(
            MEALS_STORAGE_KEY
        );

    if (!data) {

        return null;

    }


    try {

        const plan =
            JSON.parse(
                data
            );

        /*
           BLOCCO FONDAMENTALE:
           le vecchie diete locali
           NON vengono più utilizzate.
        */

        if (
            !plan ||
            plan.source !== "coach_ai" ||
            plan.imported !== true
        ) {

            return null;

        }

        return plan;

    } catch {

        return null;

    }

}


/* =====================================================
   SALVATAGGIO
===================================================== */

function saveMealsPlan(
    plan
) {

    if (!plan) {

        return false;

    }


    /*
       L'app può salvare solamente
       una dieta proveniente dal Coach.
    */

    if (
        plan.source !== "coach_ai" ||
        plan.imported !== true ||
        !Array.isArray(plan.days)
    ) {

        return false;

    }


    const serialized =
        JSON.stringify(
            plan
        );


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

            storageSaveMeals(
                plan
            );

        } catch {

            /*
               Il localStorage rimane
               comunque la fonte principale.
            */

        }

    }


    return true;

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
        !Array.isArray(
            plan.days
        )
    ) {

        return null;

    }


    const dateKey =
        date
            .toISOString()
            .split("T")[0];


    const found =
        plan.days.find(
            day =>
                day &&
                day.date ===
                dateKey
        );


    if (found) {

        return found;

    }


    /*
       Fallback:
       usa l'indice del giorno
       all'interno della settimana.
    */

    const index =
        date.getDay() === 0
            ? 6
            : date.getDay() - 1;


    return (
        plan.days[index] ||
        null
    );

}


/* =====================================================
   IMPORTAZIONE COACH
===================================================== */

function importCoachDiet(
    text
) {

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


        /*
           Aggiorniamo immediatamente
           l'interfaccia se la funzione
           esiste nell'app.
        */

        if (
            typeof updateAllScreens ===
            "function"
        ) {

            try {

                updateAllScreens();

            } catch {}

        }


        if (
            typeof updateDietScreen ===
            "function"
        ) {

            try {

                updateDietScreen();

            } catch {}

        }


        if (
            typeof refreshDietUI ===
            "function"
        ) {

            try {

                refreshDietUI();

            } catch {}

        }


        return {

            success:
                true,

            plan:
                plan,

            message:
                "La settimana alimentare del Coach è stata importata correttamente."

        };

    } catch (error) {

        return {

            success:
                false,

            plan:
                null,

            message:
                error &&
                error.message
                    ? error.message
                    : "Errore durante l'importazione."

        };

    }

}


/* =====================================================
   IMPORTAZIONE APPUNTI
===================================================== */

async function importCoachDietFromClipboard() {

    if (
        !navigator.clipboard ||
        !navigator.clipboard.readText
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
        prompt(
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
   RESET DIETA
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
   ELIMINA VECCHIA DIETA LOCALE
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

            if (!data) {

                return;

            }


            try {

                const plan =
                    JSON.parse(
                        data
                    );


                if (
                    !plan ||
                    plan.source !== "coach_ai" ||
                    plan.imported !== true
                ) {

                    localStorage.removeItem(
                        key
                    );

                    changed =
                        true;

                }

            } catch {

                localStorage.removeItem(
                    key
                );

                changed =
                    true;

            }

        }
    );


    /*
       Elimina anche eventuali
       vecchie diete gestite da storage.js.
    */

    if (
        typeof storageDeleteMeals ===
        "function"
    ) {

        const current =
            typeof storageGetMeals ===
            "function"
                ? storageGetMeals()
                : null;


        if (
            current &&
            (
                current.source !==
                "coach_ai" ||
                current.imported !== true
            )
        ) {

            try {

                storageDeleteMeals();

                changed =
                    true;

            } catch {}

        }

    }


    return changed;

}


/* =====================================================
   COMPLETAMENTO PASTO
===================================================== */

function toggleMealCompleted(
    mealId,
    date = new Date()
) {

    const plan =
        getSavedMealsPlan();

    if (!plan) {

        return false;

    }


    const day =
        getMealsDay(
            date
        );


    if (
        !day ||
        !Array.isArray(
            day.meals
        )
    ) {

        return false;

    }


    const meal =
        day.meals.find(
            item =>
                item.id ===
                mealId
        );


    if (!meal) {

        return false;

    }


    meal.completed =
        !meal.completed;


    saveMealsPlan(
        plan
    );


    if (
        meal.completed &&
        typeof logMealCompletion ===
        "function"
    ) {

        try {

            logMealCompletion(
                meal.name,
                meal.totals.kcal
            );

        } catch {}

    }


    return meal.completed;

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

            completed:
                0,

            total:
                0,

            percentage:
                0

        };

    }


    const days =
        Array.isArray(
            currentPlan.days
        )
            ? currentPlan.days
            : [];


    const meals = [];


    days.forEach(
        day => {

            if (
                day &&
                Array.isArray(
                    day.meals
                )
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

        completed:
            completed,

        total:
            total,

        percentage:
            total
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
   SETTIMANA COACH PRESENTE?
===================================================== */

function hasImportedCoachWeek() {

    const plan =
        getSavedMealsPlan();


    return !!(
        plan &&
        plan.source === "coach_ai" &&
        plan.imported === true &&
        Array.isArray(plan.days) &&
        plan.days.length === 7
    );

}


/* =====================================================
   STATO DIETA
===================================================== */

function getMealsStatus() {

    const plan =
        getSavedMealsPlan();


    if (!plan) {

        return {

            exists:
                false,

            source:
                null,

            days:
                0,

            imported:
                false,

            waitingForCoach:
                true

        };

    }


    return {

        exists:
            true,

        source:
            "coach_ai",

        days:
            Array.isArray(
                plan.days
            )
                ? plan.days.length
                : 0,

        imported:
            true,

        waitingForCoach:
            false

    };

}


/* =====================================================
   NESSUNA GENERAZIONE LOCALE
===================================================== */

/*
   Queste funzioni vengono mantenute
   per compatibilità con il resto dell'app.

   IMPORTANTE:
   NON generano più nessuna dieta.

   La dieta può arrivare SOLO dal Coach IA.
*/


function refreshDailyMeals(
    date = new Date()
) {

    const day =
        getMealsDay(
            date
        );


    /*
       Se esiste una dieta Coach,
       restituiamo il giorno corrente.

       Se non esiste, restituiamo null.
    */

    return day || null;

}


function refreshWeeklyMeals() {

    const plan =
        getSavedMealsPlan();


    return (
        hasImportedCoachWeek()
            ? plan
            : null
    );

}


/* =====================================================
   RIGENERA PASTI
===================================================== */

/*
   Il pulsante ↻ della vecchia dieta
   non deve più creare una dieta locale.

   Se esiste una settimana Coach,
   semplicemente ricarica quella.
*/

function regenerateDailyMeals(
    date = new Date()
) {

    const day =
        getMealsDay(
            date
        );


    if (!day) {

        return null;

    }


    if (
        typeof updateAllScreens ===
        "function"
    ) {

        try {

            updateAllScreens();

        } catch {}

    }


    return day;

}


/* =====================================================
   INIZIALIZZAZIONE DEFINITIVA
===================================================== */

function initializeMeals() {

    /*
       1.
       Eliminiamo eventuali vecchie
       diete generate dal vecchio sistema.
    */

    removeLegacyLocalDiet();


    /*
       2.
       Se esiste una settimana Coach,
       NON generiamo nient'altro.
    */

    if (
        hasImportedCoachWeek()
    ) {

        return;

    }


    /*
       3.
       Se non esiste una settimana Coach,
       NON creiamo nessuna dieta.

       L'app deve rimanere vuota/in attesa.
    */

    return;

}


/* =====================================================
   AVVIO
===================================================== */

document.addEventListener(
    "DOMContentLoaded",
    initializeMeals
);


/* =====================================================
   ESPOSIZIONE GLOBALE
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
    getMealCompletionStats,

    resetMealsPlan,

    refreshDailyMeals,
    refreshWeeklyMeals,
    regenerateDailyMeals,

    calculateMealTotals,
    calculateDailyTotals

};