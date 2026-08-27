/* MY TRANSFORMATION — WORKOUT ENGINE v5 */
const WORKOUT_VERSION='5.0';
const WORKOUT_EXERCISES={
  gym:{push:[['Panca piana','Petto'],['Chest press','Petto'],['Shoulder press','Spalle'],['Alzate laterali','Spalle'],['Pushdown cavo','Tricipiti']],pull:[['Lat machine','Dorso'],['Rematore macchina','Dorso'],['Pulley basso','Dorso'],['Curl manubri','Bicipiti'],['Curl cavo','Bicipiti']],legs:[['Leg press','Gambe'],['Romanian deadlift','Femorali'],['Leg extension','Quadricipiti'],['Leg curl','Femorali'],['Calf raise','Polpacci']]},
  home:{full:[['Squat a corpo libero','Gambe'],['Push-up','Petto'],['Rematore elastico','Dorso'],['Affondi','Gambe'],['Shoulder press manubri','Spalle'],['Curl manubri','Bicipiti']],upper:[['Push-up','Petto'],['Rematore manubri','Dorso'],['Shoulder press','Spalle'],['Alzate laterali','Spalle'],['Curl','Bicipiti']],lower:[['Squat','Gambe'],['Affondi','Gambe'],['Hip thrust','Glutei'],['Leg curl elastico','Femorali'],['Calf raise','Polpacci']]},
  outdoor:{cardio:[['Corsa facile','Cardio'],['Camminata veloce','Cardio'],['Sprint brevi','Cardio'],['Step-up','Gambe'],['Plank','Core']],full:[['Corsa facile','Cardio'],['Push-up','Petto'],['Affondi','Gambe'],['Dip panca','Tricipiti'],['Plank','Core']]}
};
function monthCycle(date=new Date()){ return Math.floor((date.getFullYear()*12+date.getMonth()))%4; }
function workoutPhase(date=new Date()){ return ['Base','Progressione','Intensificazione','Deload'][monthCycle(date)]; }
function makeWorkout(profile){
  const place=profile?.trainingPlace||'gym', days=Math.max(1,Math.min(7,Number(profile?.trainingDays)||3)), phase=workoutPhase();
  const templates=place==='gym'?['push','pull','legs']:place==='home'?['upper','lower','full']:['cardio','full'];
  const setsByPhase={Base:3,Progressione:4,Intensificazione:4,Deload:2}[phase];
  const repsByPhase={Base:'8-12',Progressione:'8-10',Intensificazione:'6-10',Deload:'10-15'}[phase];
  const workouts=[];
  for(let i=0;i<days;i++){ const type=templates[i%templates.length]; const pool=(WORKOUT_EXERCISES[place]?.[type]||[]); workouts.push({name:`${type[0].toUpperCase()+type.slice(1)} · ${phase}`,type,exercises:pool.map((e,j)=>({name:e[0],muscle:e[1],sets:setsByPhase,reps:repsByPhase,rir:phase==='Deload'?3:2,rest:phase==='Intensificazione'?120:90,done:false,id:`ex_${i}_${j}`}))}); }
  return {version:WORKOUT_VERSION,phase,monthKey:`${new Date().getFullYear()}-${String(new Date().getMonth()+1).padStart(2,'0')}`,workouts};
}
function ensureWorkoutCurrentMonth(){ const p=storageGetProfile(); if(!p) return null; const cur=storageGetWorkout(); const key=`${new Date().getFullYear()}-${String(new Date().getMonth()+1).padStart(2,'0')}`; if(!cur||cur.monthKey!==key){ const fresh=makeWorkout(p); storageSaveWorkout(fresh); return fresh; } return cur; }
function refreshWorkout(){ return ensureWorkoutCurrentMonth(); }
function getStoredWorkout(){ return ensureWorkoutCurrentMonth(); }
function getTrainingDayIndex(workout){ const day=new Date().getDay(); const monday=day===0?6:day-1; return Math.min(monday,workout?.workouts?.length?workout.workouts.length-1:0); }
function completeExercise(workoutIndex,exerciseIndex){ const w=ensureWorkoutCurrentMonth(); if(!w?.workouts?.[workoutIndex]?.exercises?.[exerciseIndex]) return false; w.workouts[workoutIndex].exercises[exerciseIndex].done=!w.workouts[workoutIndex].exercises[exerciseIndex].done; storageSaveWorkout(w); if(w.workouts[workoutIndex].exercises[exerciseIndex].done) logWorkoutCompletion(); return true; }
