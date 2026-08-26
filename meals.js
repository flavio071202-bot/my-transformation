/* =====================================================
   MY TRANSFORMATION
   MEALS ENGINE — COACH IA + WEEKLY IMPORT
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

    if (
        typeof refreshNutrition ===
        "function"
    ) {

        return refreshNutrition();

    }

    return null;

}


/* =====================================================
   DATABASE
===================================================== */

function getMealsDatabase() {

    if (
        typeof FOOD_DATABASE !==
        "undefined"
    ) {

        return FOOD_DATABASE;

    }

    return [];

}


/* =====================================================
   PREFERENZE
===================================================== */

function parsePreferenceList(value) {

    return String(value || "")
        .split(/[,;\n]+/)
        .map(
            item =>
                mealsNormalize(item)
        )
        .filter(Boolean);

}


function foodMatchesText(food, searchText) {

    const searchable = [

        food.name,

        ...(food.tags || [])

    ]
        .map(
            item =>
                mealsNormalize(item)
        )
        .join(" ");

    return searchable.includes(
        searchText
    );

}


/* =====================================================
   ESCLUSIONI
===================================================== */

function isFoodExcluded(food, profile) {

    if (!profile) {

        return false;

    }

    const dislikes =
        parsePreferenceList(
            profile.dislikes
        );

    const allergies =
        parsePreferenceList(
            profile.allergies
        );

    return [
        ...dislikes,
        ...allergies
    ].some(
        item =>
            foodMatchesText(
                food,
                item
            )
    );

}


/* =====================================================
   PREFERITI
===================================================== */

function isFoodPreferred(food, profile) {

    if (!profile) {

        return false;

    }

    const likes =
        parsePreferenceList(
            profile.likes
        );

    if (!likes.length) {

        return false;

    }

    return likes.some(
        item =>
            foodMatchesText(
                food,
                item
            )
    );

}


/* =====================================================
   ALIMENTI DISPONIBILI
===================================================== */

function getAvailableMealFoods(
    profile,
    category
) {

    return getMealsDatabase()
        .filter(food => {

            if (
                category &&
                food.category !== category
            ) {

                return false;

            }

            if (
                isFoodExcluded(
                    food,
                    profile
                )
            ) {

                return false;

            }

            return true;

        });

}


/* =====================================================
   SCELTA ALIMENTO
===================================================== */

function chooseMealFood(
    profile,
    category,
    usedIds = []
) {

    const foods =
        getAvailableMealFoods(
            profile,
            category
        );

    if (!foods.length) {

        return null;

    }

    const preferred =
        foods.filter(
            food =>
                isFoodPreferred(
                    food,
                    profile
                ) &&
                !usedIds.includes(
                    food.id
                )
        );

    if (preferred.length) {

        return preferred[
            Math.floor(
                Math.random() *
                preferred.length
            )
        ];

    }

    const unused =
        foods.filter(
            food =>
                !usedIds.includes(
                    food.id
                )
        );

    if (unused.length) {

        return unused[
            Math.floor(
                Math.random() *
                unused.length
            )
        ];

    }

    return foods[
        Math.floor(
            Math.random() *
            foods.length
        )
    ];

}


/* =====================================================
   NUTRIZIONE ALIMENTO
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
   CREA INGREDIENTE
===================================================== */

function createMealIngredient(
    food,
    grams
) {

    if (!food) {

        return null;

    }

    const nutrition =
        calculateMealFoodNutrition(
            food,
            grams
        );

    return {

        id:
            food.id,

        name:
            food.name,

        category:
            food.category,

        grams:
            mealsRound(
                grams
            ),

        kcal:
            nutrition.kcal,

        protein:
            nutrition.protein,

        carbs:
            nutrition.carbs,

        fat:
            nutrition.fat,

        fiber:
            nutrition.fiber

    };

}


/* =====================================================
   TOTALI PASTO
===================================================== */

function calculateMealTotals(foods = []) {

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
   AGGIUNGI INGREDIENTE
===================================================== */

function addMealIngredient(
    foods,
    food,
    grams
) {

    if (
        !food ||
        mealsNumber(grams) <= 0
    ) {

        return;

    }

    const ingredient =
        createMealIngredient(
            food,
            grams
        );

    if (ingredient) {

        foods.push(
            ingredient
        );

    }

}


/* =====================================================
   TARGET PASTI
===================================================== */

function getMealTargets(
    target,
    numberOfMeals
) {

    let percentages;

    if (numberOfMeals === 3) {

        percentages = [
            0.25,
            0.40,
            0.35
        ];

    }

    else if (numberOfMeals === 4) {

        percentages = [
            0.22,
            0.33,
            0.15,
            0.30
        ];

    }

    else if (numberOfMeals === 5) {

        percentages = [
            0.20,
            0.30,
            0.15,
            0.10,
            0.25
        ];

    }

    else {

        percentages = [
            0.25,
            0.40,
            0.35
        ];

    }

    return percentages.map(
        percentage => ({

            calories:
                mealsRound(
                    mealsNumber(
                        target.calories
                    ) * percentage
                ),

            protein:
                mealsRound(
                    mealsNumber(
                        target.protein
                    ) * percentage
                ),

            carbs:
                mealsRound(
                    mealsNumber(
                        target.carbs
                    ) * percentage
                ),

            fat:
                mealsRound(
                    mealsNumber(
                        target.fat
                    ) * percentage
                )

        })
    );

}


/* =====================================================
   COLAZIONE
===================================================== */

function buildBreakfast(
    profile,
    target,
    usedIds
) {

    const foods = [];

    const dairy =
        chooseMealFood(
            profile,
            "dairy_protein",
            usedIds
        );

    const carb =
        chooseMealFood(
            profile,
            "carb",
            usedIds
        );

    const fruit =
        chooseMealFood(
            profile,
            "fruit",
            usedIds
        );

    const fat =
        chooseMealFood(
            profile,
            "fat",
            usedIds
        );

    if (dairy) {

        addMealIngredient(
            foods,
            dairy,
            250
        );

        usedIds.push(
            dairy.id
        );

    }

    if (carb) {

        let grams = 60;

        if (
            carb.id === "pane_comune" ||
            carb.id === "pane_integrale"
        ) {

            grams = 80;

        }

        addMealIngredient(
            foods,
            carb,
            grams
        );

        usedIds.push(
            carb.id
        );

    }

    if (fruit) {

        addMealIngredient(
            foods,
            fruit,
            150
        );

        usedIds.push(
            fruit.id
        );

    }

    if (fat) {

        addMealIngredient(
            foods,
            fat,
            15
        );

        usedIds.push(
            fat.id
        );

    }

    return {

        id:
            "breakfast",

        type:
            "breakfast",

        name:
            "Colazione",

        foods:
            foods,

        target:
            target,

        totals:
            calculateMealTotals(
                foods
            ),

        completed:
            false

    };

}


/* =====================================================
   PRANZO
===================================================== */

function buildLunch(
    profile,
    target,
    usedIds
) {

    const foods = [];

    const protein =
        chooseMealFood(
            profile,
            "protein",
            usedIds
        );

    const carb =
        chooseMealFood(
            profile,
            "carb",
            usedIds
        );

    const vegetable =
        chooseMealFood(
            profile,
            "vegetable",
            usedIds
        );

    const oil =
        chooseMealFood(
            profile,
            "fat",
            usedIds
        );

    if (protein) {

        addMealIngredient(
            foods,
            protein,
            180
        );

        usedIds.push(
            protein.id
        );

    }

    if (carb) {

        addMealIngredient(
            foods,
            carb,
            100
        );

        usedIds.push(
            carb.id
        );

    }

    if (vegetable) {

        addMealIngredient(
            foods,
            vegetable,
            250
        );

        usedIds.push(
            vegetable.id
        );

    }

    if (oil) {

        addMealIngredient(
            foods,
            oil,
            10
        );

        usedIds.push(
            oil.id
        );

    }

    return {

        id:
            "lunch",

        type:
            "lunch",

        name:
            "Pranzo",

        foods:
            foods,

        target:
            target,

        totals:
            calculateMealTotals(
                foods
            ),

        completed:
            false

    };

}


/* =====================================================
   CENA
===================================================== */

function buildDinner(
    profile,
    target,
    usedIds
) {

    const foods = [];

    const protein =
        chooseMealFood(
            profile,
            "protein",
            usedIds
        );

    const carb =
        chooseMealFood(
            profile,
            "carb",
            usedIds
        );

    const vegetable =
        chooseMealFood(
            profile,
            "vegetable",
            usedIds
        );

    const oil =
        chooseMealFood(
            profile,
            "fat",
            usedIds
        );

    if (protein) {

        addMealIngredient(
            foods,
            protein,
            180
        );

        usedIds.push(
            protein.id
        );

    }

    if (carb) {

        addMealIngredient(
            foods,
            carb,
            100
        );

        usedIds.push(
            carb.id
        );

    }

    if (vegetable) {

        addMealIngredient(
            foods,
            vegetable,
            250
        );

        usedIds.push(
            vegetable.id
        );

    }

    if (oil) {

        addMealIngredient(
            foods,
            oil,
            10
        );

        usedIds.push(
            oil.id
        );

    }

    return {

        id:
            "dinner",

        type:
            "dinner",

        name:
            "Cena",

        foods:
            foods,

        target:
            target,

        totals:
            calculateMealTotals(
                foods
            ),

        completed:
            false

    };

}


/* =====================================================
   SPUNTINO
===================================================== */

function buildSnack(
    profile,
    target,
    usedIds,
    index
) {

    const foods = [];

    const dairy =
        chooseMealFood(
            profile,
            "dairy_protein",
            usedIds
        );

    const fruit =
        chooseMealFood(
            profile,
            "fruit",
            usedIds
        );

    if (dairy) {

        addMealIngredient(
            foods,
            dairy,
            170
        );

        usedIds.push(
            dairy.id
        );

    }

    if (fruit) {

        addMealIngredient(
            foods,
            fruit,
            120
        );

        usedIds.push(
            fruit.id
        );

    }

    return {

        id:
            `snack_${index}`,

        type:
            "snack",

        name:
            `Spuntino ${index}`,

        foods:
            foods,

        target:
            target,

        totals:
            calculateMealTotals(
                foods
            ),

        completed:
            false

    };

}


/* =====================================================
   GIORNATA BASE
===================================================== */

function createBaseDailyPlan(
    profile,
    target
) {

    const numberOfMeals =
        mealsNumber(
            profile.meals,
            3
        );

    const targets =
        getMealTargets(
            target,
            numberOfMeals
        );

    const usedIds = [];

    const meals = [];

    if (numberOfMeals === 3) {

        meals.push(
            buildBreakfast(
                profile,
                targets[0],
                usedIds
            )
        );

        meals.push(
            buildLunch(
                profile,
                targets[1],
                usedIds
            )
        );

        meals.push(
            buildDinner(
                profile,
                targets[2],
                usedIds
            )
        );

    }

    else if (numberOfMeals === 4) {

        meals.push(
            buildBreakfast(
                profile,
                targets[0],
                usedIds
            )
        );

        meals.push(
            buildLunch(
                profile,
                targets[1],
                usedIds
            )
        );

        meals.push(
            buildSnack(
                profile,
                targets[2],
                usedIds,
                1
            )
        );

        meals.push(
            buildDinner(
                profile,
                targets[3],
                usedIds
            )
        );

    }

    else if (numberOfMeals === 5) {

        meals.push(
            buildBreakfast(
                profile,
                targets[0],
                usedIds
            )
        );

        meals.push(
            buildLunch(
                profile,
                targets[1],
                usedIds
            )
        );

        meals.push(
            buildSnack(
                profile,
                targets[2],
                usedIds,
                1
            )
        );

        meals.push(
            buildSnack(
                profile,
                targets[3],
                usedIds,
                2
            )
        );

        meals.push(
            buildDinner(
                profile,
                targets[4],
                usedIds
            )
        );

    }

    return meals;

}


/* =====================================================
   TOTALI GIORNALI
===================================================== */

function calculateDailyTotals(meals = []) {

    const total = {

        kcal: 0,
        protein: 0,
        carbs: 0,
        fat: 0,
        fiber: 0

    };

    meals.forEach(meal => {

        if (!meal || !meal.totals) {

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
   GENERAZIONE GIORNATA
===================================================== */

function generateDailyMealPlan(
    date = new Date()
) {

    const profile =
        getMealsProfile();

    if (!profile) {

        return null;

    }

    const target =
        getMealsTarget();

    if (!target) {

        return null;

    }

    const meals =
        createBaseDailyPlan(
            profile,
            target
        );

    return {

        id:
            `day_${date
                .toISOString()
                .split("T")[0]}`,

        date:
            date
                .toISOString()
                .split("T")[0],

        dayType:
            date.getDay() === 0
                ? "rest"
                : "training",

        target: {

            calories:
                target.calories,

            protein:
                target.protein,

            carbs:
                target.carbs,

            fat:
                target.fat

        },

        meals:
            meals,

        totals:
            calculateDailyTotals(
                meals
            ),

        generatedAt:
            new Date().toISOString(),

        source:
            "local"

    };

}


/* =====================================================
   GENERAZIONE SETTIMANA LOCALE
===================================================== */

function generateWeeklyMealPlan(
    startDate = new Date()
) {

    const days = [];

    for (
        let i = 0;
        i < 7;
        i++
    ) {

        const date =
            new Date(startDate);

        date.setDate(
            date.getDate() + i
        );

        days.push(
            generateDailyMealPlan(
                date
            )
        );

    }

    return {

        version:
            "1.0",

        type:
            "weekly",

        startDate:
            days[0]
                ? days[0].date
                : null,

        endDate:
            days[6]
                ? days[6].date
                : null,

        days:
            days,

        generatedAt:
            new Date().toISOString(),

        source:
            "local"

    };

}


/* =====================================================
   SALVATAGGIO
===================================================== */

function saveMealsPlan(plan) {

    if (!plan) {

        return false;

    }

    if (
        typeof storageSaveMeals ===
        "function"
    ) {

        storageSaveMeals(
            plan
        );

        return true;

    }

    localStorage.setItem(
        MEALS_STORAGE_KEY,
        JSON.stringify(
            plan
        )
    );

    return true;

}


/* =====================================================
   LETTURA
===================================================== */

function getSavedMealsPlan() {

    if (
        typeof storageGetMeals ===
        "function"
    ) {

        const stored =
            storageGetMeals();

        if (stored) {

            return stored;

        }

    }

    const data =
        localStorage.getItem(
            MEALS_STORAGE_KEY
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
   TROVA GIORNO ATTIVO
===================================================== */

function getMealsDay(
    date = new Date()
) {

    const plan =
        getSavedMealsPlan();

    if (!plan) {

        return null;

    }

    const dateKey =
        date
            .toISOString()
            .split("T")[0];

    if (
        Array.isArray(plan.days)
    ) {

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
           Se il piano importato usa
           solo il nome del giorno,
           usiamo l'indice corretto.
        */

        const index =
            date.getDay() === 0
                ? 6
                : date.getDay() - 1;

        return plan.days[index] || null;

    }

    /*
       Compatibilità con vecchio formato.
    */

    if (plan.date === dateKey) {

        return plan;

    }

    return null;

}


/* =====================================================
   GIORNO DELLA SETTIMANA
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


/* =====================================================
   IMPORTAZIONE JSON
===================================================== */

function parseCoachDietText(text) {

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

    const jsonText =
        text
            .substring(
                start + startMarker.length,
                end
            )
            .trim()
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

    let data;

    try {

        data =
            JSON.parse(
                jsonText
            );

    } catch (error) {

        throw new Error(
            "Il JSON della dieta non è valido."
        );

    }

    return data;

}


/* =====================================================
   NORMALIZZA DIETA IMPORTATA
===================================================== */

function normalizeImportedDiet(
    data
) {

    if (
        !data ||
        !Array.isArray(data.week)
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
            (day, dayIndex) => {

                const dayName =
                    day.day ||
                    getItalianDayName(
                        dayIndex
                    );

                const meals =
                    Array.isArray(day.meals)
                        ? day.meals
                        : [];

                const normalizedMeals =
                    meals.map(
                        (
                            meal,
                            mealIndex
                        ) => {

                            const foods =
                                Array.isArray(
                                    meal.foods
                                )
                                    ? meal.foods
                                    : [];

                            const normalizedFoods =
                                foods.map(
                                    food => ({

                                        id:
                                            "coach_" +
                                            mealsNormalize(
                                                food.name
                                            )
                                                .replace(
                                                    /[^a-z0-9]+/g,
                                                    "_"
                                                ),

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
                                            mealsNumber(
                                                food.kcal
                                            ),

                                        protein:
                                            mealsNumber(
                                                food.protein
                                            ),

                                        carbs:
                                            mealsNumber(
                                                food.carbs
                                            ),

                                        fat:
                                            mealsNumber(
                                                food.fat
                                            )

                                    })
                                );

                            const calculatedTotals =
                                calculateMealTotals(
                                    normalizedFoods
                                );

                            return {

                                id:
                                    `coach_meal_${dayIndex}_${mealIndex}`,

                                type:
                                    mealsNormalize(
                                        meal.name
                                    )
                                        .replace(
                                            /\s+/g,
                                            "_"
                                        ),

                                name:
                                    meal.name ||
                                    `Pasto ${mealIndex + 1}`,

                                foods:
                                    normalizedFoods,

                                totals:
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
                                                )

                                        }
                                        : calculatedTotals,

                                completed:
                                    false

                            };

                        }
                    );

                return {

                    id:
                        `coach_day_${dayIndex}`,

                    date:
                        getImportedDate(
                            dayIndex
                        ),

                    day:
                        dayName,

                    dayType:
                        dayIndex < 6
                            ? "training"
                            : "rest",

                    meals:
                        normalizedMeals,

                    totals:
                        day.totals
                            ? {

                                kcal:
                                    mealsNumber(
                                        day.totals.kcal
                                    ),

                                protein:
                                    mealsNumber(
                                        day.totals.protein
                                    ),

                                carbs:
                                    mealsNumber(
                                        day.totals.carbs
                                    ),

                                fat:
                                    mealsNumber(
                                        day.totals.fat
                                    )

                            }
                            : calculateDailyTotals(
                                normalizedMeals
                            ),

                    target:
                        getMealsTarget() || null,

                    completed:
                        false

                };

            }
        );

    const plan = {

        version:
            data.version ||
            "1.0",

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
   DATA IMPORTATA
===================================================== */

function getImportedDate(
    dayIndex
) {

    const now =
        new Date();

    /*
       La settimana importata parte
       dal giorno corrente.

       Manteniamo comunque i 7 giorni
       nell'ordine generato dal Coach.
    */

    const date =
        new Date(now);

    date.setDate(
        date.getDate() + dayIndex
    );

    return date
        .toISOString()
        .split("T")[0];

}


/* =====================================================
   IMPORTA DIETA
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

        saveMealsPlan(
            plan
        );

        localStorage.setItem(
            MEALS_IMPORTED_WEEK_KEY,
            JSON.stringify(
                plan
            )
        );

        return {

            success:
                true,

            plan:
                plan,

            message:
                "La settimana alimentare è stata importata correttamente."

        };

    } catch (error) {

        return {

            success:
                false,

            plan:
                null,

            message:
                error.message ||
                "Errore durante l'importazione."

        };

    }

}


/* =====================================================
   IMPORTA DAGLI APPUNTI
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

        storageDeleteMeals();

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

    if (!day || !day.meals) {

        return false;

    }

    const meal =
        day.meals.find(
            item =>
                item.id === mealId
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

        logMealCompletion(
            meal.name,
            meal.totals.kcal
        );

    }

    return meal.completed;

}


/* =====================================================
   STATISTICHE COMPLETAMENTO
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
            : [currentPlan];

    const meals = [];

    days.forEach(day => {

        if (
            day &&
            Array.isArray(day.meals)
        ) {

            meals.push(
                ...day.meals
            );

        }

    });

    const total =
        meals.length;

    const completed =
        meals.filter(
            meal =>
                meal.completed
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
   SETTIMANA IMPORTATA?
===================================================== */

function hasImportedCoachWeek() {

    const plan =
        getSavedMealsPlan();

    return !!(
        plan &&
        plan.imported === true &&
        plan.source === "coach_ai" &&
        Array.isArray(plan.days) &&
        plan.days.length === 7
    );

}


/* =====================================================
   INFO DIETA
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
                0

        };

    }

    return {

        exists:
            true,

        source:
            plan.source ||
            "local",

        days:
            Array.isArray(plan.days)
                ? plan.days.length
                : 1,

        imported:
            plan.imported === true

    };

}


/* =====================================================
   RIGENERA DIETA LOCALE
===================================================== */

function refreshDailyMeals(
    date = new Date()
) {

    const plan =
        generateDailyMealPlan(
            date
        );

    if (!plan) {

        return null;

    }

    saveMealsPlan(
        plan
    );

    return plan;

}


/* =====================================================
   RIGENERA SETTIMANA LOCALE
===================================================== */

function refreshWeeklyMeals(
    startDate = new Date()
) {

    const plan =
        generateWeeklyMealPlan(
            startDate
        );

    if (!plan) {

        return null;

    }

    saveMealsPlan(
        plan
    );

    return plan;

}


/* =====================================================
   INIZIALIZZAZIONE
===================================================== */

function initializeMeals() {

    /*
       IMPORTANTE:

       Se esiste una settimana generata
       dal Coach IA NON la sostituiamo
       automaticamente con una dieta locale.
    */

    if (
        hasImportedCoachWeek()
    ) {

        return;

    }

    const profile =
        getMealsProfile();

    if (!profile) {

        return;

    }

    if (!getSavedMealsPlan()) {

        refreshDailyMeals();

    }

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

    generateDailyMealPlan,
    generateWeeklyMealPlan,

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
    refreshWeeklyMeals

};