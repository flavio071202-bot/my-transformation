/* =====================================================
   MY TRANSFORMATION
   MEALS ENGINE — DEFINITIVE V1

   Responsabilità:
   - generazione dei pasti
   - grammature
   - calorie
   - proteine
   - carboidrati
   - grassi
   - preferenze
   - esclusioni
   - varietà
   - giorni allenamento / riposo
   - sostituzione alimenti
   - salvataggio piano

   Dipendenze:
   - database.js
   - nutrition.js
   - storage.js
===================================================== */

const MEALS_STORAGE_KEY =
    "myTransformationMeals";


/* =====================================================
   UTILITÀ
===================================================== */

function mealsNumber(
    value,
    fallback = 0
) {

    const number =
        Number(value);

    return Number.isFinite(number)
        ? number
        : fallback;

}


function mealsRound(
    value,
    decimals = 0
) {

    const multiplier =
        Math.pow(
            10,
            decimals
        );

    return Math.round(
        value * multiplier
    ) / multiplier;

}


function mealsNormalize(
    text
) {

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

function parsePreferenceList(
    value
) {

    return String(value || "")
        .split(
            /[,;\n]+/
        )
        .map(
            item =>
                mealsNormalize(
                    item
                )
        )
        .filter(Boolean);

}


function foodMatchesText(
    food,
    searchText
) {

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

function isFoodExcluded(
    food,
    profile
) {

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


    const excluded = [

        ...dislikes,

        ...allergies

    ];


    return excluded.some(
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

function isFoodPreferred(
    food,
    profile
) {

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
        .filter(
            food => {

                if (
                    category &&
                    food.category !==
                    category
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

            }
        );

}


/* =====================================================
   SCEGLI ALIMENTO
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


    /*
       Prima proviamo alimenti preferiti
       non ancora utilizzati.
    */

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


    /*
       Poi alimenti non ancora utilizzati.
    */

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


    /*
       Se abbiamo esaurito le alternative,
       permettiamo una ripetizione.
    */

    return foods[
        Math.floor(
            Math.random() *
            foods.length
        )
    ];

}


/* =====================================================
   NUTRIZIONE DI UN ALIMENTO
===================================================== */

function calculateMealFoodNutrition(
    food,
    grams
) {

    const factor =
        grams / 100;


    return {

        kcal:
            mealsRound(
                food.kcal *
                factor
            ),

        protein:
            mealsRound(
                food.protein *
                factor,
                1
            ),

        carbs:
            mealsRound(
                food.carbs *
                factor,
                1
            ),

        fat:
            mealsRound(
                food.fat *
                factor,
                1
            ),

        fiber:
            mealsRound(
                (food.fiber || 0) *
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

function calculateMealTotals(
    foods
) {

    const totals = {

        kcal: 0,

        protein: 0,

        carbs: 0,

        fat: 0,

        fiber: 0

    };


    foods.forEach(
        food => {

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

        }
    );


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
        grams <= 0
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
   DISTRIBUZIONE TARGET
===================================================== */

function getMealTargets(
    target,
    numberOfMeals
) {

    /*
       3 pasti:

       Colazione 25%
       Pranzo    40%
       Cena      35%

       Le percentuali sono iniziali.
       Il generatore corregge poi le grammature.
    */

    let percentages;


    if (
        numberOfMeals === 3
    ) {

        percentages = [
            0.25,
            0.40,
            0.35
        ];

    }

    else if (
        numberOfMeals === 4
    ) {

        percentages = [
            0.22,
            0.33,
            0.15,
            0.30
        ];

    }

    else if (
        numberOfMeals === 5
    ) {

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
                    target.calories *
                    percentage
                ),

            protein:
                mealsRound(
                    target.protein *
                    percentage
                ),

            carbs:
                mealsRound(
                    target.carbs *
                    percentage
                ),

            fat:
                mealsRound(
                    target.fat *
                    percentage
                )

        })
    );

}


/* =====================================================
   COSTRUZIONE COLAZIONE
===================================================== */

function buildBreakfast(
    profile,
    target,
    usedIds
) {

    const foods = [];


    /*
       Struttura:

       proteina latticino
       + carboidrato
       + frutta
       + grasso
    */

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

        /*
           Avena è particolarmente adatta
           alla colazione.
        */

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
            )

    };

}


/* =====================================================
   COSTRUZIONE PRANZO
===================================================== */

function buildLunch(
    profile,
    target,
    usedIds
) {

    const foods = [];


    /*
       Struttura:

       proteina
       + carboidrato
       + verdure
       + olio EVO
    */

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

        /*
           10 g di olio EVO.
        */

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
            )

    };

}


/* =====================================================
   COSTRUZIONE CENA
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
            )

    };

}


/* =====================================================
   CREA SPUNTINO
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
            )

    };

}


/* =====================================================
   CREA GIORNATA BASE
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


    if (
        numberOfMeals === 3
    ) {

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


    else if (
        numberOfMeals === 4
    ) {

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


    else if (
        numberOfMeals === 5
    ) {

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
   SCALA UN ALIMENTO
===================================================== */

function scaleIngredient(
    ingredient,
    factor
) {

    return {

        ...ingredient,

        grams:
            mealsRound(
                ingredient.grams *
                factor
            ),

        kcal:
            mealsRound(
                ingredient.kcal *
                factor
            ),

        protein:
            mealsRound(
                ingredient.protein *
                factor,
                1
            ),

        carbs:
            mealsRound(
                ingredient.carbs *
                factor,
                1
            ),

        fat:
            mealsRound(
                ingredient.fat *
                factor,
                1
            ),

        fiber:
            mealsRound(
                ingredient.fiber *
                factor,
                1
            )

    };

}


/* =====================================================
   SCALA PASTO
===================================================== */

function scaleMeal(
    meal,
    factor
) {

    return {

        ...meal,

        foods:
            meal.foods.map(
                food =>
                    scaleIngredient(
                        food,
                        factor
                    )
            ),

        totals:
            calculateMealTotals(
                meal.foods.map(
                    food =>
                        scaleIngredient(
                            food,
                            factor
                        )
                )
            )

    };

}


/* =====================================================
   CORREZIONE CALORICA
===================================================== */

function adjustMealCalories(
    meal,
    targetCalories
) {

    const current =
        mealsNumber(
            meal.totals.kcal
        );


    if (
        current <= 0 ||
        targetCalories <= 0
    ) {

        return meal;

    }


    const difference =
        Math.abs(
            current -
            targetCalories
        );


    /*
       Se siamo già abbastanza vicini,
       non tocchiamo inutilmente il pasto.
    */

    if (
        difference <=
        targetCalories * 0.08
    ) {

        return meal;

    }


    const factor =
        targetCalories /
        current;


    /*
       Limitiamo la correzione.
       Non vogliamo creare porzioni assurde
       con una semplice moltiplicazione.
    */

    const safeFactor =
        Math.max(
            0.70,
            Math.min(
                1.30,
                factor
            )
        );


    return scaleMeal(
        meal,
        safeFactor
    );

}


/* =====================================================
   CORREZIONE TARGET GIORNALIERO
===================================================== */

function rebalanceDailyPlan(
    meals,
    target
) {

    if (
        !meals.length
    ) {

        return meals;

    }


    const currentTotals =
        calculateDailyTotals(
            meals
        );


    /*
       Prima correzione:
       se le calorie sono molto lontane,
       ridistribuiamo leggermente i pasti.
    */

    const calorieRatio =
        target.calories /
        Math.max(
            currentTotals.kcal,
            1
        );


    if (
        calorieRatio < 0.88 ||
        calorieRatio > 1.12
    ) {

        return meals.map(
            meal =>
                adjustMealCalories(
                    meal,
                    meal.target.calories
                )
        );

    }


    return meals;

}


/* =====================================================
   TOTALI GIORNATA
===================================================== */

function calculateDailyTotals(
    meals
) {

    return meals.reduce(
        (
            total,
            meal
        ) => {

            total.kcal +=
                meal.totals.kcal;

            total.protein +=
                meal.totals.protein;

            total.carbs +=
                meal.totals.carbs;

            total.fat +=
                meal.totals.fat;

            total.fiber +=
                meal.totals.fiber;


            return total;

        },
        {
            kcal: 0,
            protein: 0,
            carbs: 0,
            fat: 0,
            fiber: 0
        }
    );

}


/* =====================================================
   ARROTONDA TOTALI GIORNALIERI
===================================================== */

function roundDailyTotals(
    totals
) {

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
   CALCOLA DIFFERENZA TARGET
===================================================== */

function calculateDailyDifference(
    totals,
    target
) {

    return {

        calories:
            mealsRound(
                totals.kcal -
                target.calories
            ),

        protein:
            mealsRound(
                totals.protein -
                target.protein,
                1
            ),

        carbs:
            mealsRound(
                totals.carbs -
                target.carbs,
                1
            ),

        fat:
            mealsRound(
                totals.fat -
                target.fat,
                1
            )

    };

}


/* =====================================================
   GIORNO ALLENAMENTO / RIPOSO
===================================================== */

function isTrainingDay(
    date = new Date()
) {

    /*
       Per ora utilizziamo il giorno della settimana
       e i giorni di allenamento disponibili.

       Il calendario definitivo della scheda verrà
       collegato con workout.js nella fase successiva.
    */

    const day =
        date.getDay();


    /*
       Domenica = riposo.
       Gli altri giorni sono potenzialmente
       disponibili per l'allenamento.

       Questo non cambia drasticamente le calorie:
       evita ciclizzazioni aggressive.
    */

    return day !== 0;

}


/* =====================================================
   METADATI DEL GIORNO
===================================================== */

function getMealDayType(
    date = new Date()
) {

    return isTrainingDay(
        date
    )
        ? "training"
        : "rest";

}


/* =====================================================
   GENERA GIORNATA
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


    let meals =
        createBaseDailyPlan(
            profile,
            target
        );


    meals =
        rebalanceDailyPlan(
            meals,
            target
        );


    const totals =
        roundDailyTotals(
            calculateDailyTotals(
                meals
            )
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
            getMealDayType(
                date
            ),

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
            totals,

        difference:
            calculateDailyDifference(
                totals,
                target
            ),

        generatedAt:
            new Date()
                .toISOString()

    };

}


/* =====================================================
   GENERA SETTIMANA
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
            new Date(
                startDate
            );


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
            new Date()
                .toISOString()

    };

}


/* =====================================================
   GENERA MESE
===================================================== */

function generateMonthlyMealPlan(
    year,
    month
) {

    const days = [];


    /*
       month:
       1 = gennaio
       12 = dicembre
    */

    const totalDays =
        new Date(
            year,
            month,
            0
        ).getDate();


    for (
        let day = 1;
        day <= totalDays;
        day++
    ) {

        const date =
            new Date(
                year,
                month - 1,
                day
            );


        days.push(
            generateDailyMealPlan(
                date
            )
        );

    }


    return {

        type:
            "monthly",

        year:
            year,

        month:
            month,

        days:
            days,

        generatedAt:
            new Date()
                .toISOString()

    };

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
        typeof storageSaveMeals ===
        "function"
    ) {

        return storageSaveMeals(
            plan
        );

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

        return storageGetMeals();

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
   GENERA E SALVA GIORNATA
===================================================== */

function refreshDailyMeals(
    date = new Date()
) {

    const plan =
        generateDailyMealPlan(
            date
        );


    if (plan) {

        saveMealsPlan(
            plan
        );

    }


    return plan;

}


/* =====================================================
   GENERA E SALVA SETTIMANA
===================================================== */

function refreshWeeklyMeals(
    startDate = new Date()
) {

    const plan =
        generateWeeklyMealPlan(
            startDate
        );


    if (plan) {

        saveMealsPlan(
            plan
        );

    }


    return plan;

}


/* =====================================================
   GENERA E SALVA MESE
===================================================== */

function refreshMonthlyMeals(
    year,
    month
) {

    const plan =
        generateMonthlyMealPlan(
            year,
            month
        );


    if (plan) {

        /*
           Il piano mensile viene salvato
           nello storage dedicato quando disponibile.
        */

        if (
            typeof storageSaveMonthlyPlan ===
            "function"
        ) {

            storageSaveMonthlyPlan(
                plan
            );

        } else {

            saveMealsPlan(
                plan
            );

        }

    }


    return plan;

}


/* =====================================================
   TROVA ALIMENTO
===================================================== */

function findMealFood(
    foodId
) {

    const database =
        getMealsDatabase();


    return database.find(
        food =>
            food.id === foodId
    ) || null;

}


/* =====================================================
   SOSTITUZIONE ALIMENTO
===================================================== */

function replaceMealFood(
    meal,
    oldFoodId,
    newFoodId,
    grams = null
) {

    if (
        !meal ||
        !meal.foods
    ) {

        return false;

    }


    const newFood =
        findMealFood(
            newFoodId
        );


    if (!newFood) {

        return false;

    }


    const index =
        meal.foods.findIndex(
            food =>
                food.id ===
                oldFoodId
        );


    if (
        index < 0
    ) {

        return false;

    }


    const oldFood =
        meal.foods[index];


    const newGrams =
        grams !== null
            ? Number(grams)
            : oldFood.grams;


    const replacement =
        createMealIngredient(
            newFood,
            newGrams
        );


    if (!replacement) {

        return false;

    }


    meal.foods[index] =
        replacement;


    meal.totals =
        calculateMealTotals(
            meal.foods
        );


    return true;

}


/* =====================================================
   RIGENERA PASTO
===================================================== */

function regenerateMeal(
    mealType,
    date = new Date()
) {

    const profile =
        getMealsProfile();


    const target =
        getMealsTarget();


    if (
        !profile ||
        !target
    ) {

        return null;

    }


    const targets =
        getMealTargets(
            target,
            mealsNumber(
                profile.meals,
                3
            )
        );


    const usedIds = [];


    let meal;


    if (
        mealType ===
        "breakfast"
    ) {

        meal =
            buildBreakfast(
                profile,
                targets[0],
                usedIds
            );

    }


    else if (
        mealType ===
        "lunch"
    ) {

        meal =
            buildLunch(
                profile,
                targets[1],
                usedIds
            );

    }


    else if (
        mealType ===
        "dinner"
    ) {

        meal =
            buildDinner(
                profile,
                targets[
                    targets.length - 1
                ],
                usedIds
            );

    }


    else {

        meal =
            buildSnack(
                profile,
                targets[2] ||
                targets[0],
                usedIds,
                1
            );

    }


    return meal || null;

}


/* =====================================================
   COMPLETAMENTO PASTO
===================================================== */

function toggleMealCompleted(
    mealId
) {

    const plan =
        getSavedMealsPlan();


    if (
        !plan ||
        !plan.meals
    ) {

        return false;

    }


    const meal =
        plan.meals.find(
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


    /*
       Registra anche nel sistema progressi.
    */

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
   STATO COMPLETAMENTO
===================================================== */

function getMealCompletionStats(
    plan = null
) {

    const currentPlan =
        plan ||
        getSavedMealsPlan();


    if (
        !currentPlan ||
        !currentPlan.meals
    ) {

        return {

            completed: 0,

            total: 0,

            percentage: 0

        };

    }


    const total =
        currentPlan.meals.length;


    const completed =
        currentPlan.meals.filter(
            meal =>
                meal.completed
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
                    ) * 100
                )
                : 0

    };

}


/* =====================================================
   RESET PIANO
===================================================== */

function resetMealsPlan() {

    if (
        typeof storageDeleteMeals ===
        "function"
    ) {

        return storageDeleteMeals();

    }


    localStorage.removeItem(
        MEALS_STORAGE_KEY
    );


    return true;

}


/* =====================================================
   INIZIALIZZAZIONE
===================================================== */

function initializeMeals() {

    const profile =
        getMealsProfile();


    if (!profile) {

        return;

    }


    /*
       Se non esiste un piano,
       generiamo quello di oggi.
    */

    if (
        !getSavedMealsPlan()
    ) {

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