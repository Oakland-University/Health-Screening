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
      return
    }

    const { cough, fever, exposure, submission_time } = data

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

export const press_modal_button = () => (dispatch, getState) => {
  const current_page = getState().modal_page
  let payload = ''

  if (current_page === 'user-info') {
    payload = 'health-screening'
  } else if (current_page === 'health-screening') {
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
        { fever, cough, exposure },
        { name, email, phone, account_type }
      )
    }
  } else {
    console.error('Trying to switch from page', current_page)
    return
  }

  dispatch({ type: 'UPDATE_MODAL_PAGE', payload })
}
