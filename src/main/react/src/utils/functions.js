export const allowed_on_campus = (data) => {
  const { symptomatic, exposed, fully_vaccinated } = data

  return !(symptomatic || (exposed && !fully_vaccinated))
}

export const has_symptoms = (data) => {
  return data.exposed || data.symptomatic
}

export const all_questions_non_null = (symptom_data) => {
  return (
    symptom_data.exposed !== null &&
    symptom_data.fully_vaccinated !== null &&
    symptom_data.symptomatic !== null
  )
}
