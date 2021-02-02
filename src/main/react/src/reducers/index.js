import { actions, user_statuses, modal_pages, account_types } from '../utils/enums'
import { all_symptoms_non_null, has_symptoms } from '../utils/functions'

/*global PHONE*/
/*global EMAIL*/
/*global NAME*/
/*global ACCOUNT_TYPE*/

const {
  UPDATE_COMING_TO_CAMPUS,
  UPDATE_NAME,
  UPDATE_EMAIL,
  UPDATE_PHONE,
  UPDATE_SUPERVISOR_EMAIL,
  UPDATE_STUDENT_EMPLOYEE,
  UPDATE_ACCOUNT,
  UPDATE_COUGHING,
  UPDATE_FEVERISH,
  UPDATE_EXPOSED,
  UPDATE_FACE_COVERING,
  UPDATE_GOOD_HYGIENE,
  UPDATE_DISTANCING,
  UPDATE_USER_STATUS,
  GET_PREVIOUS_HEALTH_INFO,
  CLEAR_MODAL,
  NEXT_MODAL_PAGE,
  UPDATE_CONGESTED,
  UPDATE_DIARRHEA,
  UPDATE_HEADACHE,
  UPDATE_LOSS_OF_TASTE_OR_SMELL,
  UPDATE_MUSCLE_ACHE,
  UPDATE_NAUSEOUS,
  UPDATE_SHORT_OF_BREATH,
  UPDATE_SORE_THROAT,
  UPDATE_CONFIRMATION,
  UPDATE_TESTED_POSITIVE
} = actions

const initial_state = {
  account_type: ACCOUNT_TYPE,
  coming_to_campus: null,
  congested: null,
  coughing: null,
  diarrhea: null,
  distancing: null,
  email: EMAIL.includes('guest') ? '' : EMAIL,
  email_error: false,
  exposed: null,
  face_covering: null,
  feverish: null,
  good_hygiene: null,
  headache: null,
  loss_of_taste_or_smell: null,
  modal_page: modal_pages.CAMPUS_CHECK,
  muscle_ache: null,
  name: NAME.includes('Guest') ? '' : NAME,
  name_error: false,
  nauseous: null,
  phone: PHONE,
  phone_error: false,
  short_of_breath: null,
  sore_throat: null,
  student_employee: null,
  submission_time: '',
  supervisor_email: '',
  supervisor_email_error: false,
  user_status: user_statuses.LOADING,
  confirmation: null,
  tested_positive: null
}

const email_expression = /.+@.+\..+/

export default function reducer(state = initial_state, action) {
  switch (action.type) {
    case UPDATE_COMING_TO_CAMPUS: {
      return { ...state, coming_to_campus: action.payload }
    }
    case UPDATE_NAME: {
      return { ...state, name: action.payload, name_error: false }
    }
    case UPDATE_EMAIL: {
      return { ...state, email: action.payload, email_error: false }
    }
    case UPDATE_PHONE: {
      return { ...state, phone: action.payload, phone_error: false }
    }
    case UPDATE_SUPERVISOR_EMAIL: {
      return { ...state, supervisor_email: action.payload, supervisor_email_error: false }
    }
    case UPDATE_STUDENT_EMPLOYEE: {
      return { ...state, student_employee: action.payload }
    }
    case UPDATE_ACCOUNT: {
      return { ...state, account: action.payload }
    }
    case UPDATE_COUGHING: {
      return { ...state, coughing: action.payload }
    }
    case UPDATE_FEVERISH: {
      return { ...state, feverish: action.payload }
    }
    case UPDATE_EXPOSED: {
      return { ...state, exposed: action.payload }
    }
    case UPDATE_FACE_COVERING: {
      return { ...state, face_covering: action.payload }
    }
    case UPDATE_GOOD_HYGIENE: {
      return { ...state, good_hygiene: action.payload }
    }
    case UPDATE_DISTANCING: {
      return { ...state, distancing: action.payload }
    }
    case UPDATE_USER_STATUS: {
      return { ...state, user_status: action.payload }
    }
    case GET_PREVIOUS_HEALTH_INFO: {
      return { ...state, user_status: action.payload }
    }
    case CLEAR_MODAL: {
      return { ...initial_state, user_status: state.user_status, modal_page: modal_pages.CAMPUS_CHECK, supervisor_email: state.supervisor_email }
    }
    case UPDATE_CONGESTED: {
      return { ...state, congested: action.payload }
    }
    case UPDATE_DIARRHEA: {
      return { ...state, diarrhea: action.payload }
    }
    case UPDATE_HEADACHE: {
          return { ...state, headache: action.payload }
    }
    case UPDATE_LOSS_OF_TASTE_OR_SMELL: {
          return { ...state, loss_of_taste_or_smell: action.payload }
    }
    case UPDATE_MUSCLE_ACHE: {
      return { ...state, muscle_ache: action.payload }
    }
    case UPDATE_NAUSEOUS: {
      return { ...state, nauseous: action.payload }
    }
    case UPDATE_SHORT_OF_BREATH: {
      return { ...state, short_of_breath: action.payload }
    }
    case UPDATE_SORE_THROAT: {
      return { ...state, sore_throat: action.payload }
    }
    case UPDATE_CONFIRMATION: {
      return { ...state, confirmation: action.payload }
    }
    case UPDATE_TESTED_POSITIVE: {
      return { ...state, tested_positive: action.payload }
    }

    case NEXT_MODAL_PAGE: {
      const current_modal_page = state.modal_page

      let new_user_status = state.user_status
      let new_modal_page = state.modal_page

      if (current_modal_page === modal_pages.CAMPUS_CHECK) {
        if (state.coming_to_campus) {
          new_modal_page = state.account_type === (account_types.GUEST) ? modal_pages.USER_INFO : modal_pages.PLEDGE
          new_user_status = user_statuses.NOT_COMPLETED
        } else if (state.coming_to_campus === false) {
          new_user_status = user_statuses.NOT_COMING
        }
      } else if (current_modal_page === modal_pages.USER_INFO) {
        const name_error = !state.name
        let email_error = !state.email
        const phone_error = !state.phone

        if (!email_error) {
          email_error = !email_expression.test(state.email)
        }

        const modal_page =
          name_error || email_error || phone_error ? state.modal_page : modal_pages.PLEDGE

        return { ...state, name_error, email_error, phone_error, modal_page }
      } else if (current_modal_page === modal_pages.PLEDGE) {
        const { face_covering, good_hygiene, distancing, supervisor_email, account_type, student_employee } = state
        const is_employee = (account_type === account_types.EMPLOYEE || student_employee)

        if (is_employee && (supervisor_email.length === 0 || !email_expression.test(supervisor_email))) {
          return { ...state, supervisor_email_error: true }
        }

        const can_submit = ((is_employee && supervisor_email.length !== 0) || student_employee === false)

        if ((face_covering === false || good_hygiene === false || distancing === false) && can_submit) {
          new_modal_page = modal_pages.SUBMITTED
          new_user_status = user_statuses.DISALLOWED
        } else if ((face_covering && good_hygiene && distancing) && can_submit) {
          new_modal_page =
            state.account_type === '' ? modal_pages.USER_INFO : modal_pages.HEALTH_SCREENING
        }
      } else if (current_modal_page === modal_pages.HEALTH_SCREENING) {
        const { phone, supervisor_email, account_type, student_employee } = state
        const is_employee = (account_type === account_types.EMPLOYEE || student_employee)

        if (!phone) {
          return { ...state, phone_error: true }
        }

        const can_submit = ((is_employee && supervisor_email.length !== 0) || student_employee !== null)

        if (all_symptoms_non_null(state) && can_submit) {
          new_user_status = has_symptoms(state) ? user_statuses.DISALLOWED : user_statuses.ALLOWED
          new_modal_page = action.payload
        }
      }

      return { ...state, user_status: new_user_status, modal_page: new_modal_page }
    }

    default:
      return state
  }
}
