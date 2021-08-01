export const allowed_on_campus = (data) => {
  return !(data.symptomatic || data.exposed)
}

export const all_questions_non_null = (state) => {
  return state.exposed !== null && state.symptomatic !== null
}
