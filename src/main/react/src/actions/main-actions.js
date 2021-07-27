import { get_user_submission, submit_form, get_supervisor_email } from '../api/api'

import { actions, user_statuses, account_types, modal_pages } from '../utils/enums'
import { allowed_on_campus, all_questions_non_null } from '../utils/functions'

export const fetch_past_submission = () => (dispatch) => {
  get_user_submission().then((data) => {
    let user_status = user_statuses.DISALLOWED

    if (data === null || data === undefined) {
      user_status = user_statuses.NOT_COMPLETED
    } else if (allowed_on_campus(data)) {
      user_status = user_statuses.ALLOWED
    }

    dispatch({ type: actions.GET_PREVIOUS_HEALTH_INFO, payload: user_status })
  })
}

export const fetch_supervisor_email = () => (dispatch, getState) => {
  const account_type = getState().account_type

  if (account_type !== account_types.GUEST) {
    get_supervisor_email().then((data) => {
      if (data !== null && data !== undefined) {
        dispatch({ type: actions.UPDATE_SUPERVISOR_EMAIL, payload: data })
      }
    })
  }
}

export const update_coming_to_campus = (new_coming_to_campus) => (dispatch) => {
  dispatch({ type: actions.UPDATE_COMING_TO_CAMPUS, payload: new_coming_to_campus })
}

export const update_student_employee = (new_student_employee) => (dispatch) => {
  dispatch({ type: actions.UPDATE_STUDENT_EMPLOYEE, payload: new_student_employee })
}

export const update_name = (new_name) => (dispatch) => {
  dispatch({ type: actions.UPDATE_NAME, payload: new_name })
}

export const update_email = (new_email) => (dispatch) => {
  dispatch({ type: actions.UPDATE_EMAIL, payload: new_email })
}

export const update_phone = (new_phone) => (dispatch) => {
  dispatch({ type: actions.UPDATE_PHONE, payload: new_phone })
}

export const update_supervisor_email = (new_supervisor_email) => (dispatch) => {
  dispatch({ type: actions.UPDATE_SUPERVISOR_EMAIL, payload: new_supervisor_email })
}

export const update_exposure = (new_exposure) => (dispatch) => {
  dispatch({ type: actions.UPDATE_EXPOSED, payload: new_exposure })
}

export const update_symptomatic = (new_symptomatic) => (dispatch) => {
  dispatch({ type: actions.UPDATE_SYMPTOMATIC, payload: new_symptomatic })
}

export const update_fully_vaccinated = (new_fully_vaccinated) => (dispatch) => {
  dispatch({ type: actions.UPDATE_FULLY_VACCINATED, payload: new_fully_vaccinated })
}

export const update_user_status = (new_user_status) => (dispatch) => {
  dispatch({ type: actions.UPDATE_USER_STATUS, payload: new_user_status })
}

export const close_modal = () => (dispatch) => {
  dispatch({ type: actions.CLEAR_MODAL })
}

export const press_modal_button = () => (dispatch, getState) => {
  const current_page = getState().modal_page

  let payload = ''

  if (current_page === modal_pages.HEALTH_SCREENING) {
    payload = modal_pages.SUBMITTED

    const {
      exposed,
      name,
      email,
      phone,
      account_type,
      supervisor_email,
      student_employee,
      fully_vaccinated,
    } = getState()

    const is_employee = account_type === account_types.EMPLOYEE || student_employee
    const can_submit = (is_employee && supervisor_email.length !== 0) || student_employee !== null

    if (all_questions_non_null(getState()) && can_submit) {
      submit_form({ name, email, phone, account_type, supervisor_email, exposed, fully_vaccinated })
    }
  }

  dispatch({ type: actions.NEXT_MODAL_PAGE, payload })
}
