export const allowed_on_campus = (data) => {
  return !(data.symptomatic || (data.exposed && !data.fully_vaccinated))
}

export const all_questions_non_null = (symptom_data) => {
  return !Object.values(symptom_data).some((symptom) => symptom === null)
}
