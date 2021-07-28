export const allowed_on_campus = (data) => {
  const { symptomatic, exposed, fully_vaccinated } = data

  return !(symptomatic || (exposed && !fully_vaccinated))
}

export const all_questions_non_null = (symptom_data) => {
  return !Object.values(symptom_data).some((symptom) => symptom === null)
}
