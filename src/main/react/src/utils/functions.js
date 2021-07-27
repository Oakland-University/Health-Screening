export const allowed_on_campus = (data) => {
  return !has_symptoms(data)
}

export const has_symptoms = (data) => {
  return (
    data.coughing ||
    data.feverish ||
    (data.exposed && !data.fully_vaccinated) ||
    data.congested ||
    data.diarrhea ||
    data.tested_positive ||
    data.headache ||
    data.loss_of_taste_or_smell ||
    data.muscle_ache ||
    data.nauseous ||
    data.short_of_breath ||
    data.sore_throat
  )
}

export const all_questions_non_null = (symptom_data) => {
  return (
    symptom_data.exposed !== null &&
    symptom_data.fully_vaccinated !== null &&
    symptom_data.symptomatic !== null
  )
}
