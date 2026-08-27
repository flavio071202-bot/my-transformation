/* MY TRANSFORMATION — DATA VALIDATION v5 */
function validateProfile(p){ return !!p&&Number(p.age)>=13&&Number(p.age)<=100&&Number(p.height)>=100&&Number(p.height)<=250&&Number(p.weight)>=30&&Number(p.weight)<=300&&['male','female'].includes(p.sex)&&['fatloss','definition','recomp','muscle'].includes(p.goal)&&Number(p.trainingDays)>=1&&Number(p.trainingDays)<=7&&Number(p.meals)>=3&&Number(p.meals)<=5; }
function sanitizeText(v){ return String(v??'').trim(); }
