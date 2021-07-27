import { actions, user_statuses, modal_pages, account_types } from '../utils/enums'
import { all_questions_non_null, all_symptoms_non_null, has_symptoms } from '../utils/functions'

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
  UPDATE_EXPOSED,
  UPDATE_USER_STATUS,
  GET_PREVIOUS_HEALTH_INFO,
  CLEAR_MODAL,
  NEXT_MODAL_PAGE,
  UPDATE_FULLY_VACCINATED,
  UPDATE_TESTED_POSITIVE,
  UPDATE_SYMPTOMATIC,
} = actions

const initial_state = {
  account_type: ACCOUNT_TYPE,
  coming_to_campus: null,
  email: EMAIL.includes('guest') ? '' : EMAIL,
  email_error: false,
  exposed: null,
  modal_page: modal_pages.CAMPUS_CHECK,
  name: NAME.includes('Guest') ? '' : NAME,
  name_error: false,
  phone: PHONE,
  phone_error: false,
  student_employee: null,
  submission_time: '',
  supervisor_email: '',
  supervisor_email_error: false,
  symptomatic: null,
  user_status: user_statuses.LOADING,
  fully_vaccinated: null,
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
    case UPDATE_EXPOSED: {
      return { ...state, exposed: action.payload }
    }
    case UPDATE_USER_STATUS: {
      return { ...state, user_status: action.payload }
    }
    case UPDATE_SYMPTOMATIC: {
      return { ...state, symptomatic: action.payload }
    }
    case GET_PREVIOUS_HEALTH_INFO: {
      return { ...state, user_status: action.payload }
    }
    case CLEAR_MODAL: {
      return {
        ...initial_state,
        user_status: state.user_status,
        modal_page: modal_pages.CAMPUS_CHECK,
        supervisor_email: state.supervisor_email,
        name: state.name,
        phone: state.phone,
        email: state.email,
      }
    }
    case UPDATE_FULLY_VACCINATED: {
      return { ...state, fully_vaccinated: action.payload }
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
          new_modal_page =
            state.account_type === account_types.GUEST
              ? modal_pages.USER_INFO
              : modal_pages.HEALTH_SCREENING
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
          name_error || email_error || phone_error ? state.modal_page : modal_pages.HEALTH_SCREENING

        return { ...state, name_error, email_error, phone_error, modal_page }
      } else if (current_modal_page === modal_pages.HEALTH_SCREENING) {
        const { phone, supervisor_email, account_type, student_employee } = state
        const is_employee = account_type === account_types.EMPLOYEE || student_employee

        if (!phone) {
          return { ...state, phone_error: true }
        }

        const can_submit =
          (is_employee && supervisor_email.length !== 0) || student_employee !== null

        if (all_questions_non_null(state) && can_submit) {
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
