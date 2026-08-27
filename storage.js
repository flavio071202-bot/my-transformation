/* MY TRANSFORMATION — STORAGE ENGINE v5 */
const MT_KEYS = {
  profile: 'mt.profile.v5',
  nutrition: 'mt.nutrition.v5',
  meals: 'mt.meals.v5',
  workout: 'mt.workout.v5',
  progress: 'mt.progress.v5',
  coach: 'mt.coach.v5'
};

function mtRead(key, fallback = null) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch (e) { console.warn('Storage read', key, e); return fallback; }
}
function mtWrite(key, value) {
  try { localStorage.setItem(key, JSON.stringify(value)); return true; }
  catch (e) { console.error('Storage write', key, e); return false; }
}
function mtRemove(key) { try { localStorage.removeItem(key); } catch {} }

function storageGetProfile(){ return mtRead(MT_KEYS.profile, null); }
function storageSaveProfile(profile){ return mtWrite(MT_KEYS.profile, profile); }
function storageGetNutrition(){ return mtRead(MT_KEYS.nutrition, null); }
function storageSaveNutrition(data){ return mtWrite(MT_KEYS.nutrition, data); }
function storageGetMeals(){ return mtRead(MT_KEYS.meals, null); }
function storageSaveMeals(data){ return mtWrite(MT_KEYS.meals, data); }
function storageDeleteMeals(){ mtRemove(MT_KEYS.meals); return true; }
function storageGetWorkout(){ return mtRead(MT_KEYS.workout, null); }
function storageSaveWorkout(data){ return mtWrite(MT_KEYS.workout, data); }
function storageGetProgress(){ return mtRead(MT_KEYS.progress, {weights:[], measurements:[], mealLogs:[], workoutLogs:[]}); }
function storageSaveProgress(data){ return mtWrite(MT_KEYS.progress, data); }
function storageGetCoach(){ return mtRead(MT_KEYS.coach, {}); }
function storageSaveCoach(data){ return mtWrite(MT_KEYS.coach, data); }
function storageResetAll(){ Object.values(MT_KEYS).forEach(mtRemove); return true; }
