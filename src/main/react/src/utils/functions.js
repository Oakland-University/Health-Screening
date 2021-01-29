export const allowed_on_campus = (data) => {
  return agrees_to_pledge(data) && !has_symptoms(data)
}

export const has_symptoms = (data) => {
  return (
    data.coughing ||
    data.feverish ||
    data.exposed ||
    data.congested ||
    data.diarrhea ||
    data.testedPositive ||
    data.headache ||
    data.lossOfTasteOrSmell ||
    data.muscleAche ||
    data.nauseous ||
    data.shortOfBreath ||
    data.soreThroat
  )
}

export const agrees_to_pledge = (obj) => {
  let data = obj.pledge ? obj.pledge : obj
  return data.faceCovering && data.goodHygiene && data.distancing
}

export const all_symptoms_non_null = (symptom_data) => {
  return (
    symptom_data.cough !== null &&
    symptom_data.fever !== null &&
    symptom_data.exposure !== null &&
    symptom_data.congestion !== null &&
    symptom_data.diarrhea !== null &&
    symptom_data.headache !== null &&
    symptom_data.loss_of_taste_or_smell !== null &&
    symptom_data.muscle_ache !== null &&
    symptom_data.nausea !== null &&
    symptom_data.short_of_breath !== null &&
    symptom_data.sore_throat !== null &&
    symptom_data.positive_test !== null &&
    symptom_data.confirmation
  )
}
