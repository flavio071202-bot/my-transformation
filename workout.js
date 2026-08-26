/* =====================================================
   MY TRANSFORMATION
   WORKOUT ENGINE — V1
===================================================== */

const WORKOUT_KEY = "myTransformationWorkout";


/* =====================================================
   DATABASE ESERCIZI
===================================================== */

const EXERCISE_DATABASE = [

    /* =========================
       PETTO
    ========================= */

    {
        id: "bench_press",
        name: "Panca piana con bilanciere",
        muscle: "Petto",
        secondary: ["Tricipiti", "Deltoidi anteriori"],
        equipment: "gym",
        pattern: "horizontal_push",
        level: "intermediate"
    },

    {
        id: "incline_press",
        name: "Panca inclinata con manubri",
        muscle: "Petto alto",
        secondary: ["Tricipiti", "Deltoidi anteriori"],
        equipment: "gym",
        pattern: "incline_push",
        level: "beginner"
    },

    {
        id: "chest_press",
        name: "Chest press",
        muscle: "Petto",
        secondary: ["Tricipiti", "Spalle"],
        equipment: "gym",
        pattern: "horizontal_push",
        level: "beginner"
    },

    {
        id: "push_up",
        name: "Push-up",
        muscle: "Petto",
        secondary: ["Tricipiti", "Core"],
        equipment: "home",
        pattern: "horizontal_push",
        level: "beginner"
    },


    /* =========================
       SCHIENA
    ========================= */

    {
        id: "lat_pulldown",
        name: "Lat machine presa larga",
        muscle: "Dorsali",
        secondary: ["Bicipiti", "Parte alta schiena"],
        equipment: "gym",
        pattern: "vertical_pull",
        level: "beginner"
    },

    {
        id: "pull_up",
        name: "Trazioni alla sbarra",
        muscle: "Dorsali",
        secondary: ["Bicipiti", "Core"],
        equipment: "gym",
        pattern: "vertical_pull",
        level: "intermediate"
    },

    {
        id: "barbell_row",
        name: "Rematore con bilanciere",
        muscle: "Schiena",
        secondary: ["Bicipiti", "Deltoidi posteriori"],
        equipment: "gym",
        pattern: "horizontal_pull",
        level: "intermediate"
    },

    {
        id: "cable_row",
        name: "Pulley basso",
        muscle: "Schiena",
        secondary: ["Bicipiti"],
        equipment: "gym",
        pattern: "horizontal_pull",
        level: "beginner"
    },

    {
        id: "one_arm_row",
        name: "Rematore con manubrio",
        muscle: "Dorsali",
        secondary: ["Bicipiti"],
        equipment: "gym",
        pattern: "horizontal_pull",
        level: "beginner"
    },


    /* =========================
       SPALLE
    ========================= */

    {
        id: "shoulder_press",
        name: "Shoulder press",
        muscle: "Spalle",
        secondary: ["Tricipiti"],
        equipment: "gym",
        pattern: "vertical_push",
        level: "beginner"
    },

    {
        id: "lateral_raise",
        name: "Alzate laterali",
        muscle: "Deltoidi laterali",
        secondary: [],
        equipment: "gym",
        pattern: "lateral_raise",
        level: "beginner"
    },

    {
        id: "rear_delt",
        name: "Alzate posteriori",
        muscle: "Deltoidi posteriori",
        secondary: ["Schiena alta"],
        equipment: "gym",
        pattern: "rear_delt",
        level: "beginner"
    },


    /* =========================
       GAMBE
    ========================= */

    {
        id: "squat",
        name: "Squat con bilanciere",
        muscle: "Quadricipiti",
        secondary: ["Glutei", "Femorali", "Core"],
        equipment: "gym",
        pattern: "squat",
        level: "intermediate"
    },

    {
        id: "leg_press",
        name: "Leg press",
        muscle: "Quadricipiti",
        secondary: ["Glutei"],
        equipment: "gym",
        pattern: "squat",
        level: "beginner"
    },

    {
        id: "leg_extension",
        name: "Leg extension",
        muscle: "Quadricipiti",
        secondary: [],
        equipment: "gym",
        pattern: "knee_extension",
        level: "beginner"
    },

    {
        id: "romanian_deadlift",
        name: "Stacco rumeno",
        muscle: "Femorali",
        secondary: ["Glutei", "Lombari"],
        equipment: "gym",
        pattern: "hip_hinge",
        level: "intermediate"
    },

    {
        id: "leg_curl",
        name: "Leg curl",
        muscle: "Femorali",
        secondary: [],
        equipment: "gym",
        pattern: "knee_flexion",
        level: "beginner"
    },

    {
        id: "calf_raise",
        name: "Calf raise",
        muscle: "Polpacci",
        secondary: [],
        equipment: "gym",
        pattern: "calf",
        level: "beginner"
    },


    /* =========================
       BRACCIA
    ========================= */

    {
        id: "barbell_curl",
        name: "Curl con bilanciere",
        muscle: "Bicipiti",
        secondary: [],
        equipment: "gym",
        pattern: "elbow_flexion",
        level: "beginner"
    },

    {
        id: "hammer_curl",
        name: "Curl a martello",
        muscle: "Bicipiti",
        secondary: ["Brachiale"],
        equipment: "gym",
        pattern: "elbow_flexion",
        level: "beginner"
    },

    {
        id: "triceps_pushdown",
        name: "Pushdown ai cavi",
        muscle: "Tricipiti",
        secondary: [],
        equipment: "gym",
        pattern: "elbow_extension",
        level: "beginner"
    },

    {
        id: "overhead_triceps",
        name: "Estensioni tricipiti sopra la testa",
        muscle: "Tricipiti",
        secondary: [],
        equipment: "gym",
        pattern: "elbow_extension",
        level: "beginner"
    },


    /* =========================
       CORE
    ========================= */

    {
        id: "cable_crunch",
        name: "Crunch ai cavi",
        muscle: "Addominali",
        secondary: [],
        equipment: "gym",
        pattern: "core_flexion",
        level: "beginner"
    },

    {
        id: "leg_raise",
        name: "Sollevamento gambe",
        muscle: "Addominali",
        secondary: ["Flessori dell'anca"],
        equipment: "home",
        pattern: "core",
        level: "beginner"
    },

    {
        id: "plank",
        name: "Plank",
        muscle: "Core",
        secondary: [],
        equipment: "home",
        pattern: "core",
        level: "beginner"
    }

];


/* =====================================================
   PROFILO
===================================================== */

function getWorkoutProfile() {

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
   ESERCIZI DISPONIBILI
===================================================== */

function getAvailableExercises(
    profile
) {

    if (!profile) {
        return [];
    }


    const place =
        profile.trainingPlace;


    return EXERCISE_DATABASE.filter(
        exercise => {

            if (
                place === "gym"
            ) {

                return (
                    exercise.equipment ===
                    "gym"
                );

            }


            if (
                place === "home"
            ) {

                return (
                    exercise.equipment ===
                    "home"
                );

            }


            /*
               Palestra + casa:
               permetti entrambi.
            */

            if (
                place === "both"
            ) {

                return true;

            }


            return true;

        }
    );

}


/* =====================================================
   TROVA ESERCIZIO
===================================================== */

function getExerciseById(
    id
) {

    return EXERCISE_DATABASE.find(
        exercise =>
            exercise.id === id
    ) || null;

}


/* =====================================================
   CREA ESERCIZIO PROGRAMMATO
===================================================== */

function createExercise(
    id,
    sets,
    reps,
    rest,
    rir
) {

    const exercise =
        getExerciseById(id);


    if (!exercise) {
        return null;
    }


    return {

        exerciseId:
            exercise.id,

        name:
            exercise.name,

        muscle:
            exercise.muscle,

        secondary:
            exercise.secondary,

        sets:
            sets,

        reps:
            reps,

        rest:
            rest,

        rir:
            rir,

        completed:
            false,

        logs: []

    };

}


/* =====================================================
   SCHEDE BASE
===================================================== */

function buildPushWorkout() {

    return {

        name: "PUSH",

        focus: [
            "Petto",
            "Spalle",
            "Tricipiti"
        ],

        exercises: [

            createExercise(
                "bench_press",
                4,
                "6-8",
                150,
                2
            ),

            createExercise(
                "incline_press",
                3,
                "8-10",
                120,
                2
            ),

            createExercise(
                "lateral_raise",
                4,
                "12-15",
                75,
                1
            ),

            createExercise(
                "chest_press",
                3,
                "10-12",
                90,
                1
            ),

            createExercise(
                "triceps_pushdown",
                3,
                "10-15",
                75,
                1
            ),

            createExercise(
                "overhead_triceps",
                2,
                "10-15",
                75,
                1
            )

        ]

    };

}


function buildPullWorkout() {

    return {

        name: "PULL",

        focus: [
            "Schiena",
            "Bicipiti",
            "Deltoidi posteriori"
        ],

        exercises: [

            createExercise(
                "lat_pulldown",
                4,
                "8-10",
                120,
                2
            ),

            createExercise(
                "barbell_row",
                3,
                "6-8",
                150,
                2
            ),

            createExercise(
                "cable_row",
                3,
                "8-12",
                105,
                1
            ),

            createExercise(
                "rear_delt",
                3,
                "12-15",
                75,
                1
            ),

            createExercise(
                "barbell_curl",
                3,
                "8-12",
                90,
                1
            ),

            createExercise(
                "hammer_curl",
                2,
                "10-12",
                75,
                1
            )

        ]

    };

}


function buildLegsWorkout() {

    return {

        name: "LEGS",

        focus: [
            "Quadricipiti",
            "Femorali",
            "Glutei",
            "Polpacci"
        ],

        exercises: [

            createExercise(
                "squat",
                4,
                "6-8",
                180,
                2
            ),

            createExercise(
                "leg_press",
                3,
                "8-12",
                120,
                1
            ),

            createExercise(
                "romanian_deadlift",
                3,
                "8-10",
                150,
                2
            ),

            createExercise(
                "leg_extension",
                3,
                "10-15",
                75,
                1
            ),

            createExercise(
                "leg_curl",
                3,
                "10-15",
                75,
                1
            ),

            createExercise(
                "calf_raise",
                4,
                "10-15",
                60,
                1
            )

        ]

    };

}


/* =====================================================
   FULL BODY
===================================================== */

function buildFullBodyWorkout() {

    return {

        name: "FULL BODY",

        focus: [
            "Full body"
        ],

        exercises: [

            createExercise(
                "squat",
                3,
                "6-8",
                150,
                2
            ),

            createExercise(
                "bench_press",
                3,
                "6-8",
                150,
                2
            ),

            createExercise(
                "lat_pulldown",
                3,
                "8-10",
                120,
                2
            ),

            createExercise(
                "romanian_deadlift",
                3,
                "8-10",
                150,
                2
            ),

            createExercise(
                "lateral_raise",
                3,
                "12-15",
                75,
                1
            ),

            createExercise(
                "cable_crunch",
                3,
                "10-15",
                60,
                1
            )

        ]

    };

}


/* =====================================================
   CREA SETTIMANA
===================================================== */

function generateWeeklyWorkout() {

    const profile =
        getWorkoutProfile();


    if (!profile) {
        return null;
    }


    const days =
        Number(
            profile.trainingDays
        );


    let workouts = [];


    /*
       2 giorni
    */

    if (days === 2) {

        workouts = [

            buildFullBodyWorkout(),

            buildFullBodyWorkout()

        ];

    }


    /*
       3 giorni
    */

    else if (days === 3) {

        workouts = [

            buildPushWorkout(),

            buildPullWorkout(),

            buildLegsWorkout()

        ];

    }


    /*
       4 giorni
    */

    else if (days === 4) {

        workouts = [

            buildPushWorkout(),

            buildPullWorkout(),

            buildLegsWorkout(),

            buildFullBodyWorkout()

        ];

    }


    /*
       5 giorni
    */

    else if (days === 5) {

        workouts = [

            buildPushWorkout(),

            buildPullWorkout(),

            buildLegsWorkout(),

            buildPushWorkout(),

            buildPullWorkout()

        ];

    }


    /*
       6 giorni
    */

    else {

        workouts = [

            buildPushWorkout(),

            buildPullWorkout(),

            buildLegsWorkout(),

            buildPushWorkout(),

            buildPullWorkout(),

            buildLegsWorkout()

        ];

    }


    return {

        generatedAt:
            new Date()
                .toISOString(),

        trainingDays:
            days,

        duration:
            Number(
                profile.trainingDuration
            ),

        place:
            profile.trainingPlace,

        workouts:
            workouts

    };

}


/* =====================================================
   PROGRESSIONE
===================================================== */

/*
   Regola principale:

   Se completi il range alto di ripetizioni
   con il RIR previsto, nella prossima sessione
   aumentiamo leggermente il carico.

   Il peso esatto viene registrato dall'utente.
*/

function calculateNextWeight(
    currentWeight,
    completedReps,
    targetRange
) {

    const weight =
        Number(
            currentWeight
        );


    if (
        !Number.isFinite(weight) ||
        weight <= 0
    ) {

        return null;

    }


    const range =
        String(
            targetRange
        )
        .split("-");


    if (range.length !== 2) {
        return weight;
    }


    const minimum =
        Number(
            range[0]
        );

    const maximum =
        Number(
            range[1]
        );


    if (
        completedReps >= maximum
    ) {

        /*
           Incremento conservativo.
           2.5% del carico attuale,
           arrotondato a incrementi da 0.5 kg.
        */

        const increase =
            Math.max(
                0.5,
                weight * 0.025
            );


        return Math.round(
            (
                weight +
                increase
            ) * 2
        ) / 2;

    }


    return weight;

}


/* =====================================================
   REGISTRA PERFORMANCE
===================================================== */

function logExercisePerformance(
    workoutIndex,
    exerciseIndex,
    weight,
    reps,
    rir
) {

    const workout =
        getStoredWorkout();


    if (!workout) {
        return false;
    }


    const selectedWorkout =
        workout.workouts[
            workoutIndex
        ];


    if (!selectedWorkout) {
        return false;
    }


    const exercise =
        selectedWorkout.exercises[
            exerciseIndex
        ];


    if (!exercise) {
        return false;
    }


    exercise.logs.push({

        date:
            new Date()
                .toISOString(),

        weight:
            Number(weight),

        reps:
            Number(reps),

        rir:
            Number(rir)

    });


    if (
        typeof storageSaveWorkout ===
        "function"
    ) {

        storageSaveWorkout(
            workout
        );

    } else {

        localStorage.setItem(
            WORKOUT_KEY,
            JSON.stringify(
                workout
            )
        );

    }


    return true;

}


/* =====================================================
   COMPLETAMENTO ESERCIZIO
===================================================== */

function completeExercise(
    workoutIndex,
    exerciseIndex
) {

    const workout =
        getStoredWorkout();


    if (!workout) {
        return false;
    }


    const selectedWorkout =
        workout.workouts[
            workoutIndex
        ];


    if (!selectedWorkout) {
        return false;
    }


    const exercise =
        selectedWorkout.exercises[
            exerciseIndex
        ];


    if (!exercise) {
        return false;
    }


    exercise.completed =
        !exercise.completed;


    saveWorkout(
        workout
    );


    return true;

}


/* =====================================================
   SALVATAGGIO
===================================================== */

function saveWorkout(
    workout
) {

    if (
        typeof storageSaveWorkout ===
        "function"
    ) {

        return storageSaveWorkout(
            workout
        );

    }


    localStorage.setItem(
        WORKOUT_KEY,
        JSON.stringify(
            workout
        )
    );


    return true;

}


/* =====================================================
   LETTURA
===================================================== */

function getStoredWorkout() {

    if (
        typeof storageGetWorkout ===
        "function"
    ) {

        return storageGetWorkout();

    }


    const data =
        localStorage.getItem(
            WORKOUT_KEY
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
   GENERA E SALVA
===================================================== */

function refreshWorkout() {

    const workout =
        generateWeeklyWorkout();


    if (workout) {

        saveWorkout(
            workout
        );

    }


    return workout;

}


/* =====================================================
   AVVIO
===================================================== */

document.addEventListener(
    "DOMContentLoaded",
    () => {

        if (
            getWorkoutProfile()
        ) {

            /*
               Genera la scheda soltanto se
               non esiste già.
            */

            if (
                !getStoredWorkout()
            ) {

                refreshWorkout();

            }

        }

    }
);