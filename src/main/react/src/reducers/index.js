/*global PICTURE_URL*/
/*global PHONE*/
/*global ACCOUNT_TYPE*/

// modal page can be either:
// 'user-info'
// 'health-screening'
// 'submitted'

const initial_state = {
  account_type: ACCOUNT_TYPE,
  cough: null,
  coming_to_campus: true,
  email: '',
  email_error: false,
  exposure: null,
  fever: null,
  modal_page: 'user-info',
  name: '',
  name_error: false,
  phone: '',
  phone_error: false,
  submission_time: '',
  user_status: 'not-completed',
}

export default function reducer(state = initial_state, action) {
  switch (action.type) {
    case 'UPDATE_NAME': {
      return { ...state, name: action.payload }
    }
    case 'UPDATE_EMAIL': {
      return { ...state, email: action.payload }
    }
    case 'UPDATE_PHONE': {
      return { ...state, phone: action.payload }
    }
    case 'UPDATE_ACCOUNT': {
      return { ...state, account: action.payload }
    }
    case 'UPDATE_COUGH': {
      return { ...state, cough: action.payload }
    }
    case 'UPDATE_FEVER': {
      return { ...state, fever: action.payload }
    }
    case 'UPDATE_EXPOSURE': {
      return { ...state, exposure: action.payload }
    }
    case 'GET_PREVIOUS_HEALTH_INFO': {
      const {
        cough,
        fever,
        exposure,
        submission_time,
        user_status,
      } = action.payload

      return { ...state, cough, fever, exposure, submission_time, user_status }
    }
    case 'UPDATE_MODAL_PAGE': {
      if (action.payload === 'health-screening') {
        const name_error = state.name ? false : true
        const email_error = state.email ? false : true
        const phone_error = state.phone ? false : true

        const modal_page =
          name_error || email_error || phone_error
            ? state.modal_page
            : action.payload

        return { ...state, name_error, email_error, phone_error, modal_page }
      } else if (action.payload === 'submitted') {
        const { cough, fever, exposure } = state
        const user_status =
          cough || fever || exposure ? 'disallowed' : 'allowed'

        if (cough !== null && fever !== null && exposure !== null) {
          return { ...state, modal_page: action.payload, user_status }
        }
      }
      return { ...state }
    }

    default:
      return state
  }
}
