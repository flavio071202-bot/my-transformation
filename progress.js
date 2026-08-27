/* MY TRANSFORMATION — PROGRESS ENGINE v5 */
function progressToday(){ return new Date().toISOString().slice(0,10); }
function progressData(){ return storageGetProgress() || {weights:[],measurements:[],mealLogs:[],workoutLogs:[]}; }
function saveProgressData(d){ storageSaveProgress(d); return d; }
function addWeightEntry(weight){ const w=Number(weight); if(!Number.isFinite(w)||w<30||w>300) return false; const d=progressData(); d.weights.push({date:progressToday(),weight:Number(w.toFixed(1))}); d.weights=d.weights.slice(-365); saveProgressData(d); return true; }
function addMeasurementEntry(measurements){ const d=progressData(); d.measurements.push({date:progressToday(),...measurements}); d.measurements=d.measurements.slice(-365); saveProgressData(d); return true; }
function logMealCompletion(name,kcal){ const d=progressData(); d.mealLogs.push({date:progressToday(),name,kcal}); d.mealLogs=d.mealLogs.slice(-1000); saveProgressData(d); return true; }
function logWorkoutCompletion(){ const d=progressData(); d.workoutLogs.push({date:progressToday()}); d.workoutLogs=d.workoutLogs.slice(-1000); saveProgressData(d); return true; }
function average(arr){ return arr.length?arr.reduce((a,b)=>a+b,0)/arr.length:null; }
function getProgressSummary(){ const d=progressData(); const weights=d.weights.map(x=>Number(x.weight)).filter(Number.isFinite); const latest=weights.length?weights[weights.length-1]:null; const avg7=weights.length?average(weights.slice(-7)):null; const prev=weights.length>1?weights[weights.length-2]:null; return {latestWeight:latest,averageWeight7:avg7===null?null:Number(avg7.toFixed(1)),weightChange:latest!==null&&prev!==null?Number((latest-prev).toFixed(1)):null,workoutAdherence:Math.min(100,d.workoutLogs.filter(x=>x.date===progressToday()).length?100:0),mealAdherence:Math.min(100,d.mealLogs.filter(x=>x.date===progressToday()).length?100:0)}; }
