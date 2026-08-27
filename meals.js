/* =====================================================
   MY TRANSFORMATION
   MEALS ENGINE — COACH IA ONLY
   VERSIONE DEFINITIVA 5.0
===================================================== */


/* =====================================================
   STORAGE
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

function mealsNumber(
    value,
    fallback = 0
) {

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


function mealsRound(
    value,
    decimals = 1
) {

    const number =
        mealsNumber(value);


    const multiplier =
        Math.pow(
            10,
            decimals
        );


    return Math.round(
        number * multiplier
    ) / multiplier;

}


/* =====================================================
   NORMALIZZAZIONE TESTO
===================================================== */

function mealsNormalize(
    text
) {

    return String(
        text || ""
    )
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

function getItalianDayName(
    index
) {

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

function getItalianWeekDayIndex(
    date = new Date()
) {

    const day =
        date.getDay();


    /*
       JavaScript:
       Domenica = 0
       Lunedì = 1
       ...
       Sabato = 6

       Noi utilizziamo:
       Lunedì = 0
       ...
       Domenica = 6
    */

    return day === 0
        ? 6
        : day - 1;

}


/* =====================================================
   DATA LOCALE YYYY-MM-DD
===================================================== */

function getLocalDateKey(
    date = new Date()
) {

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
   LUNEDÌ DELLA SETTIMANA CORRENTE
===================================================== */

function getCurrentWeekMonday(
    date = new Date()
) {

    const monday =
        new Date(
            date
        );


    monday.setHours(
        0,
        0,
        0,
        0
    );


    const index =
        getItalianWeekDayIndex(
            date
        );


    monday.setDate(
        monday.getDate() -
        index
    );


    return monday;

}


/* =====================================================
   DATA GIORNO DELLA SETTIMANA
===================================================== */

function getCurrentWeekDate(
    dayIndex,
    referenceDate = new Date()
) {

    const monday =
        getCurrentWeekMonday(
            referenceDate
        );


    const date =
        new Date(
            monday
        );


    date.setDate(
        monday.getDate() +
        dayIndex
    );


    return getLocalDateKey(
        date
    );

}


/* =====================================================
   DATA IMPORTAZIONE
===================================================== */

function getImportedDate(
    dayIndex
) {

    /*
       IMPORTANTE:

       La settimana viene sempre
       sincronizzata con la settimana
       del calendario reale.

       Esempio:
       se oggi è Giovedì,

       Lunedì -> data del lunedì
       Martedì -> data del martedì
       Mercoledì -> data del mercoledì
       Giovedì -> data di oggi
       ...
    */

    return getCurrentWeekDate(
        dayIndex,
        new Date()
    );

}


/* =====================================================
   PARSE NUMERO JSON
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
                .replace(
                    ",",
                    "."
                )
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
   TOTALI ALIMENTI
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

            if (!food) {

                return;

            }


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
   PULIZIA RISPOSTA CHATGPT
===================================================== */

function cleanCoachResponse(
    text
) {

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


    if (
        markerStart !== -1
    ) {

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


    if (
        markerEnd !== -1
    ) {

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

function extractJsonObject(
    text
) {

    const source =
        cleanCoachResponse(
            text
        );


    const firstBrace =
        source.indexOf(
            "{"
        );


    if (
        firstBrace === -1
    ) {

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


        if (
            char === '"'
        ) {

            inString =
                !inString;

            continue;

        }


        if (inString) {

            continue;

        }


        if (
            char === "{"
        ) {

            depth++;

        }


        if (
            char === "}"
        ) {

            depth--;


            if (
                depth === 0
            ) {

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
   RIMOZIONE VIRGOLE FINALI
===================================================== */

function removeTrailingCommas(
    json
) {

    return String(
        json
    ).replace(
        /,\s*([}\]])/g,
        "$1"
    );

}


/* =====================================================
   PARSER COACH
===================================================== */

function parseCoachDietText(
    text
) {

    const jsonText =
        extractJsonObject(
            text
        );


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

        console.error(
            "JSON ricevuto dal Coach:",
            cleanedJson
        );


        throw new Error(
            "Il JSON della dieta non è valido."
        );

    }


    if (
        !data ||
        typeof data !==
        "object"
    ) {

        throw new Error(
            "La risposta del Coach non contiene un oggetto valido."
        );

    }


    if (
        Array.isArray(
            data.week
        )
    ) {

        return data;

    }


    if (
        Array.isArray(
            data.days
        )
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
        typeof food ===
        "object"
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
        typeof meal ===
        "object"
            ? meal
            : {};


    const foods =
        Array.isArray(
            source.foods
        )
            ? source.foods
            : [];


    const normalizedFoods =
        foods.map(
            (
                food,
                foodIndex
            ) => {

                return normalizeCoachFood(
                    food,
                    dayIndex,
                    mealIndex,
                    foodIndex
                );

            }
        );


    if (
        normalizedFoods.length === 0
    ) {

        throw new Error(
            `Il pasto ${mealIndex + 1} del giorno ${dayIndex + 1} non contiene alimenti.`
        );

    }


    const calculatedTotals =
        calculateMealTotals(
            normalizedFoods
        );


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
            calculatedTotals,

        completed:
            false

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
        typeof day ===
        "object"
            ? day
            : {};


    const meals =
        Array.isArray(
            source.meals
        )
            ? source.meals
            : [];


    if (
        meals.length === 0
    ) {

        throw new Error(
            `Il giorno ${dayIndex + 1} non contiene pasti.`
        );

    }


    const normalizedMeals =
        meals.map(
            (
                meal,
                mealIndex
            ) => {

                return normalizeCoachMeal(
                    meal,
                    dayIndex,
                    mealIndex
                );

            }
        );


    const calculatedTotals =
        calculateDailyTotals(
            normalizedMeals
        );


    /*
       Il giorno viene determinato
       dall'ordine ufficiale della settimana.

       Lunedì = indice 0
       ...
       Domenica = indice 6
    */

    const officialDayName =
        getItalianDayName(
            dayIndex
        );


    return {

        id:
            `coach_day_${dayIndex}`,

        date:
            getImportedDate(
                dayIndex
            ),

        day:
            officialDayName,

        dayType:
            source.dayType ||
            "unknown",

        meals:
            normalizedMeals,

        totals:
            calculatedTotals,

        target:
            getMealsTarget(),

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
        typeof data !==
        "object"
    ) {

        throw new Error(
            "La risposta del Coach non è valida."
        );

    }


    let week =
        Array.isArray(
            data.week
        )
            ? data.week
            : null;


    if (
        !week &&
        Array.isArray(
            data.days
        )
    ) {

        week =
            data.days;

    }


    if (
        !Array.isArray(
            week
        )
    ) {

        throw new Error(
            "La risposta non contiene una settimana valida."
        );

    }


    if (
        week.length !== 7
    ) {

        throw new Error(
            `La settimana deve contenere esattamente 7 giorni. Ricevuti: ${week.length}.`
        );

    }


    const profile =
        getMealsProfile();


    const expectedMeals =
        profile
            ? Number(
                profile.meals
            )
            : null;


    const days =
        week.map(
            (
                day,
                dayIndex
            ) => {

                const normalizedDay =
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
                        normalizedDay.meals.length !==
                        expectedMeals
                    ) {

                        throw new Error(
                            `Il giorno ${dayIndex + 1} contiene ${normalizedDay.meals.length} pasti invece di ${expectedMeals}.`
                        );

                    }

                }


                return normalizedDay;

            }
        );


    return {

        version:
            String(
                data.version ||
                "5.0"
            ),

        type:
            "weekly",

        source:
            MEALS_SOURCE,

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

}


/* =====================================================
   LETTURA PIANO SALVATO
===================================================== */

function getSavedMealsPlan() {

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
                plan.source ===
                    MEALS_SOURCE &&
                plan.imported === true &&
                Array.isArray(
                    plan.days
                ) &&
                plan.days.length === 7
            ) {

                return plan;

            }

        } catch {

            localStorage.removeItem(
                MEALS_IMPORTED_WEEK_KEY
            );

        }

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
                stored.source ===
                    MEALS_SOURCE &&
                stored.imported === true &&
                Array.isArray(
                    stored.days
                ) &&
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


    if (!data) {

        return null;

    }


    try {

        const plan =
            JSON.parse(
                data
            );


        if (
            plan &&
            plan.source ===
                MEALS_SOURCE &&
            plan.imported === true &&
            Array.isArray(
                plan.days
            ) &&
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
   SALVATAGGIO
===================================================== */

function saveMealsPlan(
    plan
) {

    if (!plan) {

        return false;

    }


    if (
        plan.source !==
            MEALS_SOURCE ||
        plan.imported !== true ||
        !Array.isArray(
            plan.days
        ) ||
        plan.days.length !== 7
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

        } catch {}

    }


    return true;

}


/* =====================================================
   TROVA GIORNO CORRENTE
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
        ) ||
        plan.days.length !== 7
    ) {

        return null;

    }


    /*
       PRIMA SCELTA:
       data esatta del calendario.
    */

    const dateKey =
        getLocalDateKey(
            date
        );


    const foundByDate =
        plan.days.find(
            item =>
                item &&
                item.date ===
                dateKey
        );


    if (foundByDate) {

        return foundByDate;

    }


    /*
       SECONDA SCELTA:
       indice del giorno della settimana.

       Questo è fondamentale perché
       anche se la settimana è stata
       importata in precedenza,
       sappiamo comunque che:

       Giovedì = indice 3.
    */

    const dayIndex =
        getItalianWeekDayIndex(
            date
        );


    const foundByIndex =
        plan.days[dayIndex];


    if (foundByIndex) {

        /*
           Sincronizziamo la data
           del giorno con il calendario.
        */

        foundByIndex.date =
            getCurrentWeekDate(
                dayIndex,
                date
            );


        return foundByIndex;

    }


    return null;

}


/* =====================================================
   GIORNO SUCCESSIVO
===================================================== */

function getNextMealsDay(
    date = new Date()
) {

    const plan =
        getSavedMealsPlan();


    if (
        !plan ||
        !Array.isArray(
            plan.days
        ) ||
        plan.days.length !== 7
    ) {

        return null;

    }


    const currentIndex =
        getItalianWeekDayIndex(
            date
        );


    const nextIndex =
        currentIndex + 1;


    if (
        nextIndex > 6
    ) {

        return null;

    }


    return (
        plan.days[nextIndex] ||
        null
    );

}


/* =====================================================
   CONTROLLA GIORNO COMPLETATO
===================================================== */

function isMealsDayCompleted(
    day
) {

    if (
        !day ||
        !Array.isArray(
            day.meals
        ) ||
        day.meals.length === 0
    ) {

        return false;

    }


    return day.meals.every(
        meal =>
            meal &&
            meal.completed === true
    );

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
                item &&
                item.id ===
                mealId
        );


    if (!meal) {

        return false;

    }


    meal.completed =
        !meal.completed;


    /*
       Aggiorna automaticamente
       lo stato della giornata.
    */

    day.completed =
        isMealsDayCompleted(
            day
        );


    saveMealsPlan(
        plan
    );


    /*
       Registra il completamento
       solo quando il pasto viene
       effettivamente completato.
    */

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


    /*
       Evento personalizzato.
       Permette all'interfaccia di
       aggiornarsi senza ricaricare
       tutta la pagina.
    */

    try {

        window.dispatchEvent(
            new CustomEvent(
                "myTransformationMealUpdated",
                {
                    detail: {

                        mealId:
                            meal.id,

                        day:
                            day,

                        dayCompleted:
                            day.completed

                    }

                }
            )
        );

    } catch {}


    return meal.completed;

}


/* =====================================================
   COMPLETA GIORNO E PASSA AL SUCCESSIVO
===================================================== */

function completeCurrentDayAndGetNext(
    date = new Date()
) {

    const currentDay =
        getMealsDay(
            date
        );


    if (!currentDay) {

        return null;

    }


    if (
        !isMealsDayCompleted(
            currentDay
        )
    ) {

        return currentDay;

    }


    const currentIndex =
        getItalianWeekDayIndex(
            date
        );


    const nextIndex =
        currentIndex + 1;


    if (
        nextIndex > 6
    ) {

        return null;

    }


    const plan =
        getSavedMealsPlan();


    if (!plan) {

        return null;

    }


    return (
        plan.days[nextIndex] ||
        null
    );

}


/* =====================================================
   STATISTICHE PASTI
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
            total > 0
                ? Math.round(
                    (
                        completed /
                        total
                    ) *
                    100
                )
                : 0

    };

}


/* =====================================================
   SETTIMANA COACH PRESENTE
===================================================== */

function hasImportedCoachWeek() {

    const plan =
        getSavedMealsPlan();


    return !!(
        plan &&
        plan.source ===
            MEALS_SOURCE &&
        plan.imported === true &&
        Array.isArray(
            plan.days
        ) &&
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
            MEALS_SOURCE,

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
   REFRESH GIORNALIERO
===================================================== */

function refreshDailyMeals(
    date = new Date()
) {

    return getMealsDay(
        date
    );

}


/* =====================================================
   REFRESH SETTIMANALE
===================================================== */

function refreshWeeklyMeals() {

    const plan =
        getSavedMealsPlan();


    if (
        hasImportedCoachWeek()
    ) {

        return plan;

    }


    return null;

}


/* =====================================================
   RIGENERA / RICARICA PASTO
===================================================== */

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
   IMPORTAZIONE DIETA COACH
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


        return {

            success:
                true,

            plan:
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
                error &&
                error.message
                    ? error.message
                    : "Errore durante l'importazione della dieta."

        };

    }

}


/* =====================================================
   IMPORTAZIONE DA CLIPBOARD
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
                    plan.source !==
                        MEALS_SOURCE ||
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


    if (
        typeof storageGetMeals ===
        "function" &&
        typeof storageDeleteMeals ===
        "function"
    ) {

        try {

            const current =
                storageGetMeals();


            if (
                current &&
                (
                    current.source !==
                        MEALS_SOURCE ||
                    current.imported !== true
                )
            ) {

                storageDeleteMeals();

                changed =
                    true;

            }

        } catch {}

    }


    return changed;

}


/* =====================================================
   SINCRONIZZA SETTIMANA CON CALENDARIO
===================================================== */

function syncImportedWeekDates(
    referenceDate = new Date()
) {

    const plan =
        getSavedMealsPlan();


    if (
        !plan ||
        !Array.isArray(
            plan.days
        ) ||
        plan.days.length !== 7
    ) {

        return false;

    }


    let changed =
        false;


    plan.days.forEach(
        (
            day,
            index
        ) => {

            if (!day) {

                return;

            }


            const correctDate =
                getCurrentWeekDate(
                    index,
                    referenceDate
                );


            const correctName =
                getItalianDayName(
                    index
                );


            if (
                day.date !==
                correctDate
            ) {

                day.date =
                    correctDate;

                changed =
                    true;

            }


            if (
                day.day !==
                correctName
            ) {

                day.day =
                    correctName;

                changed =
                    true;

            }

        }
    );


    if (changed) {

        plan.startDate =
            plan.days[0].date;

        plan.endDate =
            plan.days[6].date;


        saveMealsPlan(
            plan
        );

    }


    return changed;

}


/* =====================================================
   INIZIALIZZAZIONE
===================================================== */

function initializeMeals() {

    removeLegacyLocalDiet();


    if (
        hasImportedCoachWeek()
    ) {

        /*
           Mantiene la settimana del Coach
           sincronizzata con il calendario
           corrente.
        */

        syncImportedWeekDates(
            new Date()
        );

    }

}


/* =====================================================
   EVENTO AGGIORNAMENTO
===================================================== */

window.addEventListener(
    "myTransformationMealUpdated",
    event => {

        const detail =
            event &&
            event.detail
                ? event.detail
                : null;


        if (!detail) {

            return;

        }


        /*
           Se tutti i pasti del giorno
           sono completati, aggiorniamo
           l'interfaccia.

           L'index.js potrà mostrare
           automaticamente il giorno
           successivo.
        */

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

    }
);


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

    getNextMealsDay,

    getItalianDayName,

    getItalianWeekDayIndex,

    getCurrentWeekDate,

    getMealsStatus,

    saveMealsPlan,

    importCoachDiet,

    importCoachDietFromClipboard,

    importCoachDietFromTextArea,

    hasImportedCoachWeek,

    toggleMealCompleted,

    isMealsDayCompleted,

    completeCurrentDayAndGetNext,

    getMealCompletionStats,

    resetMealsPlan,

    refreshDailyMeals,

    refreshWeeklyMeals,

    regenerateDailyMeals,

    calculateMealTotals,

    calculateDailyTotals,

    parseCoachDietText,

    normalizeImportedDiet,

    syncImportedWeekDates

};