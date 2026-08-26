/* =====================================================
   MY TRANSFORMATION
   PROGRESS ENGINE — V1
===================================================== */

const PROGRESS_KEY = "myTransformationProgress";


/* =====================================================
   LETTURA PROFILO
===================================================== */

function getProgressProfile() {

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
   LETTURA DATI PROGRESSI
===================================================== */

function getProgressData() {

    if (
        typeof storageGetProgress ===
        "function"
    ) {
        return (
            storageGetProgress() || {
                weighIns: [],
                measurements: [],
                photos: [],
                workouts: [],
                meals: [],
                water: []
            }
        );
    }

    const data =
        localStorage.getItem(
            PROGRESS_KEY
        );

    if (!data) {

        return {
            weighIns: [],
            measurements: [],
            photos: [],
            workouts: [],
            meals: [],
            water: []
        };

    }

    try {

        return JSON.parse(data);

    } catch {

        return {
            weighIns: [],
            measurements: [],
            photos: [],
            workouts: [],
            meals: [],
            water: []
        };

    }

}


/* =====================================================
   SALVATAGGIO
===================================================== */

function saveProgressData(
    data
) {

    if (
        typeof storageSaveProgress ===
        "function"
    ) {

        return storageSaveProgress(
            data
        );

    }

    localStorage.setItem(
        PROGRESS_KEY,
        JSON.stringify(data)
    );

    return true;

}


/* =====================================================
   DATA ODIERNA
===================================================== */

function getTodayDate() {

    return new Date()
        .toISOString()
        .split("T")[0];

}


/* =====================================================
   REGISTRA PESO
===================================================== */

function addWeightEntry(
    weight,
    date = getTodayDate()
) {

    const value =
        Number(weight);

    if (
        !Number.isFinite(value) ||
        value < 30 ||
        value > 300
    ) {

        return false;

    }


    const data =
        getProgressData();


    const existingIndex =
        data.weighIns.findIndex(
            entry =>
                entry.date === date
        );


    const entry = {

        date: date,

        weight:
            Math.round(
                value * 10
            ) / 10

    };


    if (
        existingIndex >= 0
    ) {

        data.weighIns[
            existingIndex
        ] = entry;

    } else {

        data.weighIns.push(
            entry
        );

    }


    data.weighIns.sort(
        (a, b) =>
            new Date(a.date) -
            new Date(b.date)
    );


    saveProgressData(
        data
    );


    return true;

}


/* =====================================================
   ULTIMO PESO
===================================================== */

function getLatestWeight() {

    const data =
        getProgressData();


    if (
        !data.weighIns.length
    ) {

        return null;

    }


    return data.weighIns[
        data.weighIns.length - 1
    ];

}


/* =====================================================
   MEDIA PESO
===================================================== */

function calculateAverageWeight(
    entries
) {

    if (
        !entries ||
        !entries.length
    ) {

        return null;

    }


    const total =
        entries.reduce(
            (
                sum,
                entry
            ) =>
                sum +
                Number(entry.weight),
            0
        );


    return Math.round(
        (
            total /
            entries.length
        ) * 10
    ) / 10;

}


/* =====================================================
   MEDIA ULTIMI N GIORNI
===================================================== */

function getAverageWeightLastDays(
    days = 7
) {

    const data =
        getProgressData();


    if (
        !data.weighIns.length
    ) {

        return null;

    }


    const now =
        new Date();


    const minimumDate =
        new Date(now);


    minimumDate.setDate(
        minimumDate.getDate() -
        days
    );


    const entries =
        data.weighIns.filter(
            entry => {

                const date =
                    new Date(
                        entry.date
                    );

                return (
                    date >=
                    minimumDate
                );

            }
        );


    return calculateAverageWeight(
        entries
    );

}


/* =====================================================
   PRIMO PESO
===================================================== */

function getStartingWeight() {

    const data =
        getProgressData();


    if (
        !data.weighIns.length
    ) {

        const profile =
            getProgressProfile();


        if (
            profile &&
            Number.isFinite(
                Number(
                    profile.weight
                )
            )
        ) {

            return Number(
                profile.weight
            );

        }


        return null;

    }


    return Number(
        data.weighIns[0].weight
    );

}


/* =====================================================
   CAMBIAMENTO PESO
===================================================== */

function calculateWeightChange() {

    const starting =
        getStartingWeight();


    const latest =
        getLatestWeight();


    if (
        starting === null ||
        !latest
    ) {

        return null;

    }


    return Math.round(
        (
            Number(
                latest.weight
            ) -
            starting
        ) * 10
    ) / 10;

}


/* =====================================================
   REGISTRA CIRCONFERENZE
===================================================== */

function addMeasurementEntry(
    measurements,
    date = getTodayDate()
) {

    if (
        !measurements ||
        typeof measurements !==
        "object"
    ) {

        return false;

    }


    const clean = {};

    const allowed = [

        "waist",
        "chest",
        "arm",
        "thigh",
        "neck"

    ];


    allowed.forEach(
        key => {

            if (
                measurements[key] !==
                undefined &&
                measurements[key] !==
                ""
            ) {

                const value =
                    Number(
                        measurements[key]
                    );


                if (
                    Number.isFinite(
                        value
                    ) &&
                    value > 0
                ) {

                    clean[key] =
                        Math.round(
                            value * 10
                        ) / 10;

                }

            }

        }
    );


    if (
        !Object.keys(clean).length
    ) {

        return false;

    }


    const data =
        getProgressData();


    const entry = {

        date: date,

        ...clean

    };


    const existingIndex =
        data.measurements.findIndex(
            item =>
                item.date === date
        );


    if (
        existingIndex >= 0
    ) {

        data.measurements[
            existingIndex
        ] = entry;

    } else {

        data.measurements.push(
            entry
        );

    }


    data.measurements.sort(
        (a, b) =>
            new Date(a.date) -
            new Date(b.date)
    );


    saveProgressData(
        data
    );


    return true;

}


/* =====================================================
   ULTIME MISURE
===================================================== */

function getLatestMeasurements() {

    const data =
        getProgressData();


    if (
        !data.measurements.length
    ) {

        return null;

    }


    return data.measurements[
        data.measurements.length - 1
    ];

}


/* =====================================================
   REGISTRA FOTO
===================================================== */

function addProgressPhoto(
    photoData,
    type = "front",
    date = getTodayDate()
) {

    if (!photoData) {
        return false;
    }


    const data =
        getProgressData();


    data.photos.push({

        date: date,

        type: type,

        data: photoData

    });


    saveProgressData(
        data
    );


    return true;

}


/* =====================================================
   REGISTRA ALLENAMENTO COMPLETATO
===================================================== */

function logCompletedWorkout(
    workoutName,
    duration = null,
    date = getTodayDate()
) {

    const data =
        getProgressData();


    data.workouts.push({

        date: date,

        name:
            String(
                workoutName ||
                "Allenamento"
            ),

        duration:
            duration !== null
                ? Number(duration)
                : null,

        completed: true

    });


    saveProgressData(
        data
    );


    return true;

}


/* =====================================================
   REGISTRA PASTO
===================================================== */

function logMealCompletion(
    mealName,
    calories = 0,
    date = getTodayDate()
) {

    const data =
        getProgressData();


    data.meals.push({

        date: date,

        name:
            String(
                mealName ||
                "Pasto"
            ),

        calories:
            Number(calories) || 0,

        completed: true

    });


    saveProgressData(
        data
    );


    return true;

}


/* =====================================================
   REGISTRA ACQUA
===================================================== */

function logWater(
    liters,
    date = getTodayDate()
) {

    const value =
        Number(liters);


    if (
        !Number.isFinite(value) ||
        value < 0
    ) {

        return false;

    }


    const data =
        getProgressData();


    const existingIndex =
        data.water.findIndex(
            entry =>
                entry.date === date
        );


    const entry = {

        date: date,

        liters:
            Math.round(
                value * 10
            ) / 10

    };


    if (
        existingIndex >= 0
    ) {

        data.water[
            existingIndex
        ] = entry;

    } else {

        data.water.push(
            entry
        );

    }


    saveProgressData(
        data
    );


    return true;

}


/* =====================================================
   ALLENAMENTI ULTIMI 7 GIORNI
===================================================== */

function getWorkoutsLastDays(
    days = 7
) {

    const data =
        getProgressData();


    const now =
        new Date();


    const minimum =
        new Date(now);


    minimum.setDate(
        minimum.getDate() -
        days
    );


    return data.workouts.filter(
        workout =>
            new Date(
                workout.date
            ) >= minimum
    );

}


/* =====================================================
   PASTI ULTIMI 7 GIORNI
===================================================== */

function getMealsLastDays(
    days = 7
) {

    const data =
        getProgressData();


    const now =
        new Date();


    const minimum =
        new Date(now);


    minimum.setDate(
        minimum.getDate() -
        days
    );


    return data.meals.filter(
        meal =>
            new Date(
                meal.date
            ) >= minimum
    );

}


/* =====================================================
   ADERENZA ALLENAMENTO
===================================================== */

function calculateWorkoutAdherence(
    expectedWorkouts
) {

    const completed =
        getWorkoutsLastDays(
            7
        ).length;


    const expected =
        Number(
            expectedWorkouts
        );


    if (
        !expected ||
        expected <= 0
    ) {

        return 0;

    }


    return Math.min(
        100,
        Math.round(
            (
                completed /
                expected
            ) * 100
        )
    );

}


/* =====================================================
   ADERENZA PASTI
===================================================== */

function calculateMealAdherence(
    expectedMeals
) {

    const completed =
        getMealsLastDays(
            7
        ).length;


    const expected =
        Number(
            expectedMeals
        );


    if (
        !expected ||
        expected <= 0
    ) {

        return 0;

    }


    return Math.min(
        100,
        Math.round(
            (
                completed /
                expected
            ) * 100
        )
    );

}


/* =====================================================
   STATO PROGRESSI
===================================================== */

function getProgressSummary() {

    const profile =
        getProgressProfile();


    const latest =
        getLatestWeight();


    const starting =
        getStartingWeight();


    const change =
        calculateWeightChange();


    const average7 =
        getAverageWeightLastDays(
            7
        );


    const workouts =
        profile
            ? calculateWorkoutAdherence(
                profile.trainingDays
            )
            : 0;


    const meals =
        profile
            ? calculateMealAdherence(
                Number(
                    profile.meals
                ) * 7
            )
            : 0;


    return {

        startingWeight:
            starting,

        latestWeight:
            latest
                ? Number(
                    latest.weight
                )
                : null,

        averageWeight7:
            average7,

        weightChange:
            change,

        workoutAdherence:
            workouts,

        mealAdherence:
            meals,

        totalWeighIns:
            getProgressData()
                .weighIns.length,

        totalMeasurements:
            getProgressData()
                .measurements.length,

        totalPhotos:
            getProgressData()
                .photos.length

    };

}


/* =====================================================
   RIEPILOGO MENSILE
===================================================== */

function getMonthlyProgress(
    year,
    month
) {

    const data =
        getProgressData();


    const prefix =
        `${year}-${String(month)
            .padStart(2, "0")}`;


    const weighIns =
        data.weighIns.filter(
            entry =>
                entry.date.startsWith(
                    prefix
                )
        );


    const workouts =
        data.workouts.filter(
            entry =>
                entry.date.startsWith(
                    prefix
                )
        );


    const meals =
        data.meals.filter(
            entry =>
                entry.date.startsWith(
                    prefix
                )
        );


    return {

        year: year,

        month: month,

        averageWeight:
            calculateAverageWeight(
                weighIns
            ),

        weighIns:
            weighIns.length,

        workouts:
            workouts.length,

        meals:
            meals.length

    };

}


/* =====================================================
   RESET PROGRESSI
===================================================== */

function resetProgressData() {

    if (
        typeof storageSaveProgress ===
        "function"
    ) {

        storageSaveProgress({

            weighIns: [],
            measurements: [],
            photos: [],
            workouts: [],
            meals: [],
            water: []

        });

        return true;

    }


    localStorage.removeItem(
        PROGRESS_KEY
    );

    return true;

}


/* =====================================================
   AVVIO
===================================================== */

function initializeProgress() {

    const existing =
        getProgressData();


    if (!existing) {

        saveProgressData({

            weighIns: [],
            measurements: [],
            photos: [],
            workouts: [],
            meals: [],
            water: []

        });

    }

}


document.addEventListener(
    "DOMContentLoaded",
    initializeProgress
);