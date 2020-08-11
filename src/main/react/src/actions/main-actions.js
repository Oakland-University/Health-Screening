import { get_user_submission, submit_form, send_pledge_info } from '../api/api'

import { actions, user_statuses, account_types } from '../utils/enums'

export const fetch_past_submission = () => (dispatch) => {
  get_user_submission().then((data) => {
    let user_status = user_statuses.DISALLOWED
    if (data === null || data === undefined) {
      user_status = user_statuses.NOT_COMPLETED
    } else {
      const has_symptoms = data.coughing || data.feverish || data.exposed

      const { faceCovering, goodHygiene, distancing } = data.pledge

      const agreed_to_pledge = faceCovering && goodHygiene && distancing

      if (agreed_to_pledge && !has_symptoms) {
        user_status = user_statuses.ALLOWED
      }
    }
      dispatch({ type: actions.GET_PREVIOUS_HEALTH_INFO, payload: user_status })
  })
}

export const update_coming_to_campus = (new_coming_to_campus) => (dispatch) => {
  dispatch({ type: actions.UPDATE_COMING_TO_CAMPUS, payload: new_coming_to_campus })
}

export const update_student_employee = (new_student_employee) => (dispatch) => {
  dispatch({ type: actions.UPDATE_STUDENT_EMPLOYEE,  payload: new_student_employee })
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
  dispatch({ type: actions.UPDATE_SUPERVISOR_EMAIL,  payload: new_supervisor_email })
}

export const update_cough = (new_cough) => (dispatch) => {
  dispatch({ type: actions.UPDATE_COUGH, payload: new_cough })
}

export const update_exposure = (new_exposure) => (dispatch) => {
  dispatch({ type: actions.UPDATE_EXPOSURE, payload: new_exposure })
}

export const update_fever = (new_fever) => (dispatch) => {
  dispatch({ type: actions.UPDATE_FEVER, payload: new_fever })
}

export const update_face_covering = (new_face_covering) => (dispatch) => {
  dispatch({ type: actions.UPDATE_FACE_COVERING, payload: new_face_covering })
}

export const update_good_hygiene = (new_good_hygiene) => (dispatch) => {
  dispatch({ type: actions.UPDATE_GOOD_HYGIENE, payload: new_good_hygiene })
}

export const update_distancing = (new_distancing) => (dispatch) => {
  dispatch({ type: actions.UPDATE_DISTANCING, payload: new_distancing })
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

  if (current_page === 'pledge') {
    const { face_covering, good_hygiene, distancing, supervisor_email } = getState()

    if (face_covering === false || good_hygiene === false || distancing === false) {
      send_pledge_info({ face_covering, good_hygiene, distancing, supervisor_email })
    }
  }

  if (current_page === 'health-screening') {
    payload = 'submitted'

    const {
      fever,
      cough,
      exposure,
      name,
      email,
      phone,
      account_type,
      face_covering,
      good_hygiene,
      distancing,
      supervisor_email,
      student_employee
    } = getState()

    const is_employee = (account_type === account_types.EMPLOYEE || student_employee)
    const can_submit = ((is_employee && supervisor_email.length !== 0) || student_employee !== null)

    if (cough !== null && fever !== null && exposure !== null && can_submit) {
      submit_form(
        { face_covering, good_hygiene, distancing, supervisor_email },
        { name, email, phone, account_type },
        { fever, cough, exposure }
      )
    }
  }

  dispatch({ type: actions.NEXT_MODAL_PAGE, payload })
}
