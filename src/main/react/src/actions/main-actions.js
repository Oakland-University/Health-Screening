import { get_user_submission, submit_form, send_pledge_info, get_supervisor_email } from '../api/api'

import { actions, user_statuses, account_types, modal_pages } from '../utils/enums'

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

export const fetch_supervisor_email = () => (dispatch, getState) => {
  const account_type = getState().account_type

  if (account_type !== account_types.GUEST) {
    get_supervisor_email().then(data => {
      if (data !== null && data !== undefined) {
        dispatch({type: actions.UPDATE_SUPERVISOR_EMAIL, payload: data})
      }
    })
  }
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

export const update_congestion = (new_congestion) => (dispatch) => {
  dispatch({ type: actions.UPDATE_CONGESTION, payload: new_congestion })
}

export const update_diarrhea = (new_diarrhea) => (dispatch) => {
  dispatch({ type: actions.UPDATE_DIARRHEA, payload: new_diarrhea })
}

export const update_good_hygiene = (new_good_hygiene) => (dispatch) => {
  dispatch({ type: actions.UPDATE_GOOD_HYGIENE, payload: new_good_hygiene })
}

export const update_headache = (new_headache) => (dispatch) => {
  dispatch({ type: actions.UPDATE_HEADACHE, payload: new_headache })
}

export const update_loss_of_taste_or_smell = (new_loss_of_taste_or_smell) => (dispatch) => {
  dispatch({ type: actions.UPDATE_LOSS_OF_TASTE_OR_SMELL, payload: new_loss_of_taste_or_smell })
}

export const update_muscle_ache = (new_muscle_ache) => (dispatch) => {
  dispatch({ type: actions.UPDATE_MUSCLE_ACHE, payload: new_muscle_ache })
}

export const update_nausea = (new_nausea) => (dispatch) => {
  dispatch({ type: actions.UPDATE_NAUSEA, payload: new_nausea })
}

export const update_short_of_breath = (new_short_of_breath) => (dispatch) => {
  dispatch({ type: actions.UPDATE_SHORT_OF_BREATH, payload: new_short_of_breath })
}

export const update_sore_throat = (new_sore_throat) => (dispatch) => {
  dispatch({ type: actions.UPDATE_SORE_THROAT, payload: new_sore_throat })
}

export const update_confirmation = (new_confirmation) => (dispatch) => {
  dispatch({ type: actions.UPDATE_CONFIRMATION, payload: new_confirmation })
}

export const update_positive_test = (new_positive_test) => (dispatch) => {
  dispatch({ type: actions.UPDATE_POSITIVE_TEST, payload: new_positive_test })
}

export const update_face_covering = (new_face_covering) => (dispatch) => {
  dispatch({ type: actions.UPDATE_FACE_COVERING, payload: new_face_covering })
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

  if (current_page === modal_pages.PLEDGE) {
    const { face_covering, good_hygiene, distancing, supervisor_email, account_type, student_employee, email, name } = getState()
    const is_employee = (account_type === account_types.EMPLOYEE || student_employee)
    const can_submit = ((is_employee && supervisor_email.length !== 0) || student_employee === false)

    if ((face_covering === false || good_hygiene === false || distancing === false) && can_submit) {
      send_pledge_info({ face_covering, good_hygiene, distancing, name, email, supervisor_email: is_employee ? supervisor_email : null })
    }
  }

  if (current_page === modal_pages.HEALTH_SCREENING) {
    payload = modal_pages.SUBMITTED

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
      student_employee,
      short_of_breath,
      congestion,
      diarrhea,
      headache,
      loss_of_taste_or_smell,
      muscle_ache,
      nausea,
      sore_throat,
      positive_test,
      confirmation
    } = getState()

    const is_employee = (account_type === account_types.EMPLOYEE || student_employee)
    const can_submit = ((is_employee && supervisor_email.length !== 0) || student_employee !== null)

    if (cough !== null && fever !== null && exposure !== null && congestion !== null && diarrhea !== null &&
            headache !== null && loss_of_taste_or_smell !== null && muscle_ache !== null && nausea !== null &&
            short_of_breath !== null && sore_throat !== null && can_submit) {
      submit_form(
        { face_covering, good_hygiene, distancing, supervisor_email: is_employee ? supervisor_email : null },
        { name, email, phone, account_type },
        {
          fever,
          cough,
          exposure,
          short_of_breath,
          congestion,
          diarrhea,
          headache,
          loss_of_taste_or_smell,
          muscle_ache,
          nausea,
          sore_throat,
          positive_test,
          confirmation
        }
      )
    }
  }

  dispatch({ type: actions.NEXT_MODAL_PAGE, payload })
}
