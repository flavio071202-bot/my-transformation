/* =====================================================
   MY TRANSFORMATION
   DATABASE ALIMENTARE — V1
   Valori medi per 100 g di alimento
===================================================== */

const FOOD_DATABASE = [

    /* =========================
       PROTEINE — CARNE
    ========================= */

    {
        id: "pollo",
        name: "Petto di pollo",
        category: "protein",
        kcal: 120,
        protein: 23.1,
        carbs: 0,
        fat: 2.6,
        fiber: 0,
        tags: ["pollo", "carne", "proteine"]
    },

    {
        id: "tacchino",
        name: "Petto di tacchino",
        category: "protein",
        kcal: 114,
        protein: 24,
        carbs: 0,
        fat: 1.5,
        fiber: 0,
        tags: ["tacchino", "carne", "proteine"]
    },

    {
        id: "manzo_magro",
        name: "Manzo magro",
        category: "protein",
        kcal: 150,
        protein: 26,
        carbs: 0,
        fat: 5,
        fiber: 0,
        tags: ["manzo", "carne", "proteine"]
    },

    {
        id: "vitello",
        name: "Vitello magro",
        category: "protein",
        kcal: 140,
        protein: 23,
        carbs: 0,
        fat: 5,
        fiber: 0,
        tags: ["vitello", "carne"]
    },


    /* =========================
       PROTEINE — PESCE
    ========================= */

    {
        id: "tonno_naturale",
        name: "Tonno al naturale sgocciolato",
        category: "protein",
        kcal: 116,
        protein: 26,
        carbs: 0,
        fat: 1,
        fiber: 0,
        tags: ["tonno", "pesce"]
    },

    {
        id: "merluzzo",
        name: "Merluzzo",
        category: "protein",
        kcal: 82,
        protein: 18,
        carbs: 0,
        fat: 0.7,
        fiber: 0,
        tags: ["merluzzo", "pesce"]
    },

    {
        id: "orata",
        name: "Orata",
        category: "protein_fat",
        kcal: 121,
        protein: 20,
        carbs: 0,
        fat: 4.5,
        fiber: 0,
        tags: ["orata", "pesce"]
    },

    {
        id: "salmone",
        name: "Salmone",
        category: "protein_fat",
        kcal: 208,
        protein: 20,
        carbs: 0,
        fat: 13,
        fiber: 0,
        tags: ["salmone", "pesce", "omega3"]
    },

    {
        id: "gamberi",
        name: "Gamberi",
        category: "protein",
        kcal: 85,
        protein: 20,
        carbs: 0.2,
        fat: 0.5,
        fiber: 0,
        tags: ["gamberi", "pesce", "crostacei"]
    },


    /* =========================
       UOVA
    ========================= */

    {
        id: "uova_intere",
        name: "Uova intere",
        category: "protein_fat",
        kcal: 143,
        protein: 12.6,
        carbs: 0.7,
        fat: 9.5,
        fiber: 0,
        tags: ["uova", "proteine"]
    },

    {
        id: "albumi",
        name: "Albumi",
        category: "protein",
        kcal: 52,
        protein: 10.9,
        carbs: 0.7,
        fat: 0.2,
        fiber: 0,
        tags: ["albumi", "uova", "proteine"]
    },


    /* =========================
       CARBOIDRATI — CEREALI
    ========================= */

    {
        id: "riso_basmati",
        name: "Riso basmati secco",
        category: "carb",
        kcal: 356,
        protein: 7.5,
        carbs: 79,
        fat: 0.7,
        fiber: 1.3,
        tags: ["riso", "basmati", "carboidrati"]
    },

    {
        id: "riso_integrale",
        name: "Riso integrale secco",
        category: "carb",
        kcal: 362,
        protein: 7.5,
        carbs: 76,
        fat: 2.7,
        fiber: 3.4,
        tags: ["riso", "integrale", "carboidrati"]
    },

    {
        id: "pasta_semola",
        name: "Pasta di semola secca",
        category: "carb",
        kcal: 350,
        protein: 13,
        carbs: 72,
        fat: 1.5,
        fiber: 2.9,
        tags: ["pasta", "carboidrati"]
    },

    {
        id: "pasta_integrale",
        name: "Pasta integrale secca",
        category: "carb",
        kcal: 348,
        protein: 13,
        carbs: 65,
        fat: 2.5,
        fiber: 7,
        tags: ["pasta", "integrale", "carboidrati"]
    },

    {
        id: "avena",
        name: "Fiocchi d'avena",
        category: "carb",
        kcal: 389,
        protein: 16.9,
        carbs: 66.3,
        fat: 6.9,
        fiber: 10.6,
        tags: ["avena", "colazione"]
    },


    /* =========================
       CARBOIDRATI — PANE
    ========================= */

    {
        id: "pane_comune",
        name: "Pane",
        category: "carb",
        kcal: 265,
        protein: 9,
        carbs: 49,
        fat: 3.2,
        fiber: 2.7,
        tags: ["pane", "carboidrati"]
    },

    {
        id: "pane_integrale",
        name: "Pane integrale",
        category: "carb",
        kcal: 247,
        protein: 13,
        carbs: 41,
        fat: 3.4,
        fiber: 6,
        tags: ["pane", "integrale", "carboidrati"]
    },


    /* =========================
       PATATE
    ========================= */

    {
        id: "patate",
        name: "Patate",
        category: "carb",
        kcal: 77,
        protein: 2,
        carbs: 17,
        fat: 0.1,
        fiber: 2.2,
        tags: ["patate", "carboidrati"]
    },


    /* =========================
       LATTICINI
    ========================= */

    {
        id: "yogurt_greco_0",
        name: "Yogurt greco 0%",
        category: "dairy_protein",
        kcal: 59,
        protein: 10,
        carbs: 3.6,
        fat: 0.4,
        fiber: 0,
        tags: ["yogurt", "yogurt greco", "colazione"]
    },

    {
        id: "skyr",
        name: "Skyr",
        category: "dairy_protein",
        kcal: 63,
        protein: 11,
        carbs: 4,
        fat: 0.2,
        fiber: 0,
        tags: ["skyr", "yogurt", "colazione"]
    },

    {
        id: "fiocchi_latte",
        name: "Fiocchi di latte",
        category: "dairy_protein",
        kcal: 98,
        protein: 11,
        carbs: 3.4,
        fat: 4.3,
        fiber: 0,
        tags: ["fiocchi di latte", "latticini"]
    },


    /* =========================
       GRASSI
    ========================= */

    {
        id: "olio_evo",
        name: "Olio extravergine d'oliva",
        category: "fat",
        kcal: 884,
        protein: 0,
        carbs: 0,
        fat: 100,
        fiber: 0,
        tags: ["olio", "olio evo", "grassi"]
    },

    {
        id: "mandorle",
        name: "Mandorle",
        category: "fat",
        kcal: 579,
        protein: 21.2,
        carbs: 21.6,
        fat: 49.9,
        fiber: 12.5,
        tags: ["mandorle", "frutta secca"]
    },

    {
        id: "noci",
        name: "Noci",
        category: "fat",
        kcal: 654,
        protein: 15.2,
        carbs: 13.7,
        fat: 65.2,
        fiber: 6.7,
        tags: ["noci", "frutta secca"]
    },

    {
        id: "burro_arachidi",
        name: "Burro di arachidi 100%",
        category: "fat_protein",
        kcal: 588,
        protein: 25,
        carbs: 20,
        fat: 50,
        fiber: 6,
        tags: ["arachidi", "burro di arachidi"]
    },

    {
        id: "avocado",
        name: "Avocado",
        category: "fat",
        kcal: 160,
        protein: 2,
        carbs: 8.5,
        fat: 14.7,
        fiber: 6.7,
        tags: ["avocado", "grassi"]
    },


    /* =========================
       FRUTTA
    ========================= */

    {
        id: "banana",
        name: "Banana",
        category: "fruit",
        kcal: 89,
        protein: 1.1,
        carbs: 22.8,
        fat: 0.3,
        fiber: 2.6,
        tags: ["banana", "frutta"]
    },

    {
        id: "mela",
        name: "Mela",
        category: "fruit",
        kcal: 52,
        protein: 0.3,
        carbs: 13.8,
        fat: 0.2,
        fiber: 2.4,
        tags: ["mela", "frutta"]
    },

    {
        id: "pera",
        name: "Pera",
        category: "fruit",
        kcal: 57,
        protein: 0.4,
        carbs: 15.2,
        fat: 0.1,
        fiber: 3.1,
        tags: ["pera", "frutta"]
    },

    {
        id: "kiwi",
        name: "Kiwi",
        category: "fruit",
        kcal: 61,
        protein: 1.1,
        carbs: 14.7,
        fat: 0.5,
        fiber: 3,
        tags: ["kiwi", "frutta"]
    },

    {
        id: "frutti_bosco",
        name: "Frutti di bosco",
        category: "fruit",
        kcal: 50,
        protein: 1,
        carbs: 11,
        fat: 0.4,
        fiber: 4,
        tags: ["frutti di bosco", "frutta"]
    },


    /* =========================
       VERDURE
    ========================= */

    {
        id: "zucchine",
        name: "Zucchine",
        category: "vegetable",
        kcal: 17,
        protein: 1.2,
        carbs: 3.1,
        fat: 0.3,
        fiber: 1,
        tags: ["zucchine", "verdure"]
    },

    {
        id: "pomodori",
        name: "Pomodori",
        category: "vegetable",
        kcal: 18,
        protein: 0.9,
        carbs: 3.9,
        fat: 0.2,
        fiber: 1.2,
        tags: ["pomodori", "verdure"]
    },

    {
        id: "broccoli",
        name: "Broccoli",
        category: "vegetable",
        kcal: 34,
        protein: 2.8,
        carbs: 7,
        fat: 0.4,
        fiber: 2.6,
        tags: ["broccoli", "verdure"]
    },

    {
        id: "spinaci",
        name: "Spinaci",
        category: "vegetable",
        kcal: 23,
        protein: 2.9,
        carbs: 3.6,
        fat: 0.4,
        fiber: 2.2,
        tags: ["spinaci", "verdure"]
    },

    {
        id: "insalata",
        name: "Insalata mista",
        category: "vegetable",
        kcal: 20,
        protein: 1.2,
        carbs: 3,
        fat: 0.2,
        fiber: 1.8,
        tags: ["insalata", "verdure"]
    },


    /* =========================
       EXTRA CARBOIDRATI
    ========================= */

    {
        id: "miele",
        name: "Miele",
        category: "carb_extra",
        kcal: 304,
        protein: 0.3,
        carbs: 82.4,
        fat: 0,
        fiber: 0,
        tags: ["miele"]
    }

];


/* =====================================================
   FUNZIONI DATABASE
===================================================== */

/*
   Recupera un alimento tramite ID.
*/

function getFoodById(id) {

    return FOOD_DATABASE.find(
        food =>
            food.id === id
    ) || null;

}


/*
   Cerca alimenti per nome o tag.
*/

function searchFoods(query) {

    const search =
        String(query || "")
            .toLowerCase()
            .trim();

    if (!search) {
        return [];
    }

    return FOOD_DATABASE.filter(
        food => {

            const searchable = [

                food.name,

                ...food.tags

            ]
                .join(" ")
                .toLowerCase();

            return searchable.includes(
                search
            );

        }
    );

}


/*
   Recupera alimenti per categoria.
*/

function getFoodsByCategory(
    category
) {

    return FOOD_DATABASE.filter(
        food =>
            food.category === category
    );

}


/*
   Conta gli alimenti disponibili.
*/

function getFoodDatabaseSize() {

    return FOOD_DATABASE.length;

}