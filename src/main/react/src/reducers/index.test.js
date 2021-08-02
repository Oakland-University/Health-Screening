import reducer from './index'
import { actions, user_statuses, modal_pages, account_types } from '../utils/enums'

/*global PHONE*/
/*global EMAIL*/
/*global NAME*/
/*global ACCOUNT_TYPE*/

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
}

describe('General', () => {
  it('should return the initial state on initial load', () => {
    expect(reducer(undefined, {})).toEqual(initial_state)
  })
})

describe('Coming to Campus Page', () => {
  it('should not continue if coming_to_campus is unanswered', () => {
    expect(
      reducer({ ...initial_state, coming_to_campus: null }, { type: actions.NEXT_MODAL_PAGE })
    ).toEqual(initial_state)
  })

  it('should set user status to NOT_COMING if coming_to_campus is false', () => {
    expect(
      reducer(
        { ...initial_state, user_status: user_statuses.NOT_COMPLETED, coming_to_campus: false },
        { type: actions.NEXT_MODAL_PAGE }
      )
    ).toEqual({ ...initial_state, user_status: user_statuses.NOT_COMING, coming_to_campus: false })
  })

  it('should proceed to user info page if coming_to_campus is true (GUEST)', () => {
    const state_going_in = {
      ...initial_state,
      user_status: user_statuses.NOT_COMING,
      coming_to_campus: true,
      account_type: account_types.GUEST,
    }

    expect(reducer(state_going_in, { type: actions.NEXT_MODAL_PAGE })).toEqual({
      ...state_going_in,
      user_status: user_statuses.NOT_COMPLETED,
      modal_page: modal_pages.USER_INFO,
    })
  })
})

describe('Health Questions Page', () => {
  const all_clear = {
    ...initial_state,
    user_status: user_statuses.NOT_COMPLETED,
    modal_page: modal_pages.HEALTH_SCREENING,
    coming_to_campus: true,
    account_type: account_types.STUDENT,
    student_employee: false,
    exposed: false,
    symptomatic: false,
  }

  it('should not submit a HS if symptomatic is null', () => {
    const action = { type: actions.NEXT_MODAL_PAGE }

    expect(reducer({ ...all_clear, symptomatic: null }, action)).toEqual({
      ...all_clear,
      symptomatic: null,
    })
  })

  it('should not submit a HS if exposed is null', () => {
    const action = { type: actions.NEXT_MODAL_PAGE }

    expect(reducer({ ...all_clear, exposed: null }, action)).toEqual({
      ...all_clear,
      exposed: null,
    })
  })

  it('should not submit a HS if phone is null', () => {
    const action = { type: actions.NEXT_MODAL_PAGE }

    expect(reducer({ ...all_clear, phone: null }, action)).toEqual({
      ...all_clear,
      phone: null,
      phone_error: true,
    })
  })

  it('should not submit a HS if user is employee and supervisor_email is null', () => {
    const action = { type: actions.NEXT_MODAL_PAGE }

    expect(
      reducer({ ...all_clear, student_employee: true, supervisor_email: null }, action)
    ).toEqual({
      ...all_clear,
      supervisor_email_error: true,
      supervisor_email: null,
      student_employee: true,
    })
  })

  it('should give DISALLOWED if symptomatic is true', () => {
    const action = { type: actions.NEXT_MODAL_PAGE, payload: modal_pages.SUBMITTED }

    expect(reducer({ ...all_clear, symptomatic: true }, action)).toEqual({
      ...all_clear,
      user_status: user_statuses.DISALLOWED,
      modal_page: modal_pages.SUBMITTED,
      symptomatic: true,
    })
  })

  it('should give DISALLOWED if exposed is true', () => {
    const action = { type: actions.NEXT_MODAL_PAGE, payload: modal_pages.SUBMITTED }

    expect(reducer({ ...all_clear, exposed: true }, action)).toEqual({
      ...all_clear,
      user_status: user_statuses.DISALLOWED,
      modal_page: modal_pages.SUBMITTED,
      exposed: true,
    })
  })

  it('should give ALL CLEAR if symptomatic and exposed are false', () => {
    const action = { type: actions.NEXT_MODAL_PAGE, payload: modal_pages.SUBMITTED }

    expect(reducer({ ...all_clear }, action)).toEqual({
      ...all_clear,
      user_status: user_statuses.ALLOWED,
      modal_page: modal_pages.SUBMITTED,
    })
  })
})
