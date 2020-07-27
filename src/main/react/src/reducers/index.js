/*global PHONE*/
/*global EMAIL*/
/*global NAME*/
/*global ACCOUNT_TYPE*/

// modal page can be either:
// 'campus-check'
// 'campus-check'
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
  modal_page: 'campus-check',
  name: NAME.includes('Guest') ? '' : NAME,
  name_error: false,
  phone: PHONE,
  phone_error: false,
  submission_time: '',
  user_status: 'loading',
  face_covering: null,
  good_hygiene: null,
  distancing: null,
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
    case 'UPDATE_FACE_COVERING': {
      return { ...state, face_covering: action.payload }
    }
    case 'UPDATE_GOOD_HYGIENE': {
      return { ...state, good_hygiene: action.payload }
    }
    case 'UPDATE_DISTANCING': {
      return { ...state, distancing: action.payload }
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

    case 'CLEAR_MDOAL': {
      return {
        ...state,
        cough: null,
        coming_to_campus: null,
        email_error: false,
        exposure: null,
        fever: null,
        modal_page: 'campus-check',
        name_error: false,
        phone: PHONE,
        phone_error: false,
        submission_time: '',
        user_status: 'loading',
        face_covering: null,
        good_hygiene: null,
        distancing: null,
      }
    }

    case 'NEXT_MODAL_PAGE': {
      const modal_page = state.modal_page

      if (modal_page === 'campus-check') {
        if (state.coming_to_campus) {
          return { ...state, modal_page: 'pledge' }
        } else {
          return { ...state, user_status: 'not-coming' }
        }
      } else if (modal_page === 'pledge') {
        const { face_covering, good_hygiene, distancing } = state

        if (
          face_covering === false ||
          good_hygiene === false ||
          distancing === false
        ) {
          return {
            ...state,
            modal_page: 'submitted',
            user_status: 'disallowed',
          }
        } else if (face_covering && good_hygiene && distancing) {
          const next_page =
            state.account_type === '' ? 'user-info' : 'health-screening'
          return { ...state, modal_page: next_page }
        }

        return state
      } else if (modal_page === 'user-info') {
        const name_error = state.name ? false : true
        const email_error = state.email ? false : true
        const phone_error = state.phone ? false : true

        const modal_page =
          name_error || email_error || phone_error
            ? state.modal_page
            : 'health-screening'

        return { ...state, name_error, email_error, phone_error, modal_page }
      } else if (modal_page === 'health-screening') {
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
      console.error('ESCAPING')
      return { ...state }
    }

    default:
      return state
  }
}
