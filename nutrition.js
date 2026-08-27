/* MY TRANSFORMATION — NUTRITION ENGINE v5 */
function nutritionNumber(v, fallback=0){ const n=Number(v); return Number.isFinite(n)?n:fallback; }
function nutritionRound(v,d=0){ const m=10**d; return Math.round(nutritionNumber(v)*m)/m; }
function calculateNutrition(profile){
  if(!profile) return null;
  const age=nutritionNumber(profile.age), h=nutritionNumber(profile.height), w=nutritionNumber(profile.weight);
  const sex=profile.sex==='female' ? -161 : 5;
  const bmr=10*w+6.25*h-5*age+sex;
  const trainingDays=nutritionNumber(profile.trainingDays,3);
  const activity=trainingDays<=1?1.35:trainingDays<=3?1.5:trainingDays<=5?1.65:1.8;
  let tdee=bmr*activity;
  const goal={fatloss:-300,definition:-220,recomp:-100,muscle:220}[profile.goal] ?? 0;
  const calories=Math.max(1400, nutritionRound(tdee+goal,0));
  const protein=nutritionRound(Math.max(1.6*w, profile.goal==='muscle'?1.8*w:1.7*w),0);
  const fat=nutritionRound(Math.max(0.6*w, Math.min(0.9*w, calories*0.25/9)),0);
  const carbs=nutritionRound(Math.max(0,(calories-protein*4-fat*9)/4),0);
  return {calories,protein,carbs,fat,bmr:nutritionRound(bmr,0),tdee:nutritionRound(tdee,0),updatedAt:new Date().toISOString()};
}
function getNutritionTarget(){ return storageGetNutrition(); }
function refreshNutrition(){ const p=storageGetProfile(); const t=calculateNutrition(p); if(t) storageSaveNutrition(t); return t; }
