import { get_user_submission, submit_form } from '../api/api'

export function update_lookup_id(new_id) {
  return function (dispatch) {
    dispatch({ type: 'UPDATE_LOOKUP_ID', payload: new_id })
  }
}

export const fetch_past_submission = () => (dispatch) => {
  get_user_submission().then((data) => {
    // User has not filled out the form. Defaults are fine
    if (data === null || data === undefined) {
      const payload = {
        coming_to_campus: null,
        cough: null,
        fever: null,
        exposure: null,
        submission_time: null,
        user_status: 'not-completed',
      }

      dispatch({ type: 'GET_PREVIOUS_HEALTH_INFO', payload })
      return
    }

    const cough = data.coughing
    const fever = data.feverish
    const exposure = data.exposed
    const submission_time = data.submissionTime

    const user_status = cough || fever || exposure ? 'disallowed' : 'allowed'

    const payload = {
      cough,
      fever,
      exposure,
      submission_time,
      user_status,
    }

    dispatch({ type: 'GET_PREVIOUS_HEALTH_INFO', payload })
  })
}

export const update_coming_to_campus = (new_coming_to_campus) => (dispatch) => {
  dispatch({ type: 'UPDATE_COMING_TO_CAMPUS', payload: new_coming_to_campus })
}

export const update_name = (new_name) => (dispatch) => {
  dispatch({ type: 'UPDATE_NAME', payload: new_name })
}

export const update_email = (new_email) => (dispatch) => {
  dispatch({ type: 'UPDATE_EMAIL', payload: new_email })
}

export const update_phone = (new_phone) => (dispatch) => {
  dispatch({ type: 'UPDATE_PHONE', payload: new_phone })
}

export const update_cough = (new_cough) => (dispatch) => {
  dispatch({ type: 'UPDATE_COUGH', payload: new_cough })
}

export const update_exposure = (new_exposure) => (dispatch) => {
  dispatch({ type: 'UPDATE_EXPOSURE', payload: new_exposure })
}

export const update_fever = (new_fever) => (dispatch) => {
  dispatch({ type: 'UPDATE_FEVER', payload: new_fever })
}

export const update_face_covering = (new_face_covering) => (dispatch) => {
  dispatch({ type: 'UPDATE_FACE_COVERING', payload: new_face_covering })
}

export const update_good_hygiene = (new_good_hygiene) => (dispatch) => {
  dispatch({ type: 'UPDATE_GOOD_HYGIENE', payload: new_good_hygiene })
}

export const update_distancing = (new_distancing) => (dispatch) => {
  dispatch({ type: 'UPDATE_DISTANCING', payload: new_distancing })
}

export const update_pledge = (new_pledge) => (dispatch) => {
  dispatch({ type: 'UPDATE_PLEDGE', payload: new_pledge })
}

export const press_modal_button = () => (dispatch, getState) => {
  const current_page = getState().modal_page

  let payload = ''

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
    } = getState()

    if (cough !== null && fever !== null && exposure !== null) {
      submit_form(
        { name, email, phone, account_type },
        { fever, cough, exposure }
      )
    }
  }

  dispatch({ type: 'NEXT_MODAL_PAGE', payload })
}
