/*global PHONE*/
/*global EMAIL*/
/*global NAME*/
/*global ACCOUNT_TYPE*/

// modal page can be either:
// 'coming-to-campus
// 'user-info'
// 'health-screening'
// 'submitted'

// user status can be either:
// 'allowed'
// 'disallowed'
// 'not-coming'
// 'not-completed'

const initial_state = {
  account_type: ACCOUNT_TYPE,
  cough: null,
  coming_to_campus: null,
  email: EMAIL.includes('guest') ? '' : EMAIL,
  email_error: false,
  exposure: null,
  fever: null,
  modal_page: 'coming-to-campus',
  name: NAME.includes('Guest') ? '' : NAME,
  name_error: false,
  phone: PHONE,
  phone_error: false,
  submission_time: '',
  user_status: 'loading',
}

export default function reducer(state = initial_state, action) {
  switch (action.type) {
    case 'UPDATE_COMING_TO_CAMPUS': {
      return { ...state, coming_to_campus: action.payload }
    }
    case 'UPDATE_NAME': {
      return { ...state, name: action.payload, name_error: false }
    }
    case 'UPDATE_EMAIL': {
      return { ...state, email: action.payload, email_error: false }
    }
    case 'UPDATE_PHONE': {
      return { ...state, phone: action.payload, phone_error: false }
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
      if (action.payload === 'not-coming-to-campus') {
        const coming_to_campus = state.coming_to_campus

        if (coming_to_campus === null) {
          return { ...state }
        } else if (!coming_to_campus) {
          return { ...state, user_status: 'not-coming' }
        }
      } else if (action.payload === 'user-info') {
        const coming_to_campus = state.coming_to_campus

        if (coming_to_campus) {
          return { ...state, user_status: 'not-completed', modal_page: action.payload }
        } else {
          return { ...state }
        }
      } else if (action.payload === 'health-screening') {
        const coming_to_campus = state.coming_to_campus
        const user_status = coming_to_campus ? 'not-completed' : 'not-coming'
        const name_error = state.name ? false : true
        const email_error = state.email ? false : true
        const phone_error = state.phone ? false : true

        const modal_page =
          name_error || email_error || phone_error
            ? state.modal_page
            : action.payload

        return { ...state, name_error, email_error, phone_error, user_status, modal_page }
      } else if (action.payload === 'submitted') {
        const { cough, fever, exposure, phone } = state

        if (!phone) {
          return { ...state, phone_error: true }
        }

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
