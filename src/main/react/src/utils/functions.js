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

export const all_symptoms_non_null = (symptom_data) => {
  return (
    symptom_data.coughing !== null &&
    symptom_data.feverish !== null &&
    symptom_data.exposed !== null &&
    ((symptom_data.exposed === true && symptom_data.fully_vaccinated !== null) ||
      symptom_data.exposed === false) &&
    symptom_data.congested !== null &&
    symptom_data.diarrhea !== null &&
    symptom_data.tested_positive !== null &&
    symptom_data.headache !== null &&
    symptom_data.loss_of_taste_or_smell !== null &&
    symptom_data.muscle_ache !== null &&
    symptom_data.nauseous !== null &&
    symptom_data.short_of_breath !== null &&
    symptom_data.sore_throat !== null
  )
}
