import reducer from './reducers/index'
import { actions, user_statuses, modal_pages, account_types } from './utils/enums'

/*global PHONE*/
/*global EMAIL*/
/*global NAME*/
/*global ACCOUNT_TYPE*/

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
  tested_positive: null,
}

describe('main reducer', () => {
  it('should return the initial state', () => {
    expect(reducer(undefined, {})).toEqual(initial_state)
  })

  it('should not go to next page if coming_to_campus is unanswered', () => {
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

  it('should proceed to pledge page if coming_to_campus is true (AUTHENTICATED)', () => {
    const state_going_in = {
      ...initial_state,
      user_status: user_statuses.NOT_COMING,
      coming_to_campus: true,
      account_type: account_types.STUDENT,
    }

    expect(reducer(state_going_in, { type: actions.NEXT_MODAL_PAGE })).toEqual({
      ...state_going_in,
      user_status: user_statuses.NOT_COMPLETED,
      modal_page: modal_pages.PLEDGE,
    })
  })

  it('should NOT proceed to symptom page if no pledge questions are filled out', () => {
    const state_going_in = {
      ...initial_state,
      user_status: user_statuses.NOT_COMPLETED,
      modal_page: modal_pages.PLEDGE,
      coming_to_campus: true,
      account_type: account_types.STUDENT,
      student_employee: false,
    }

    expect(reducer(state_going_in, { type: actions.NEXT_MODAL_PAGE })).toEqual({
      ...state_going_in,
    })
  })

  it('should NOT proceed to symptom page if any pledge questions are NOT filled out', () => {
    const state_going_in = {
      ...initial_state,
      user_status: user_statuses.NOT_COMPLETED,
      modal_page: modal_pages.PLEDGE,
      coming_to_campus: true,
      account_type: account_types.STUDENT,
      student_employee: false,
    }

    const action = { type: actions.NEXT_MODAL_PAGE }

    // None are filled out
    expect(reducer(state_going_in, action)).toEqual({
      ...state_going_in,
    })

    // face_covering not filled out
    expect(reducer({ ...state_going_in, good_hygiene: true, distancing: true }, action)).toEqual({
      ...state_going_in,
      good_hygiene: true,
      distancing: true,
    })

    // good_hygiene not filled out
    expect(reducer({ ...state_going_in, face_covering: true, distancing: true }, action)).toEqual({
      ...state_going_in,
      face_covering: true,
      distancing: true,
    })

    // distancing not filled out
    expect(reducer({ ...state_going_in, face_covering: true, good_hygiene: true }, action)).toEqual(
      {
        ...state_going_in,
        face_covering: true,
        good_hygiene: true,
      }
    )
  })

  it('should set state to DISALLOWED if any pledge question is false', () => {
    const state_going_in = {
      ...initial_state,
      user_status: user_statuses.NOT_COMPLETED,
      modal_page: modal_pages.PLEDGE,
      coming_to_campus: true,
      account_type: account_types.STUDENT,
      student_employee: false,
      face_covering: true,
      good_hygiene: true,
      distancing: true,
    }

    const action = { type: actions.NEXT_MODAL_PAGE }

    // face_covering false
    expect(reducer({ ...state_going_in, face_covering: false }, action)).toEqual({
      ...state_going_in,
      face_covering: false,
      user_status: user_statuses.DISALLOWED,
      modal_page: modal_pages.SUBMITTED,
    })

    // good_hygiene false
    expect(reducer({ ...state_going_in, good_hygiene: false }, action)).toEqual({
      ...state_going_in,
      good_hygiene: false,
      user_status: user_statuses.DISALLOWED,
      modal_page: modal_pages.SUBMITTED,
    })

    // distancing false
    expect(reducer({ ...state_going_in, distancing: false }, action)).toEqual({
      ...state_going_in,
      distancing: false,
      user_status: user_statuses.DISALLOWED,
      modal_page: modal_pages.SUBMITTED,
    })
  })

  it('should proceed to symptom page if all pledge questions are "true"', () => {
    const state_going_in = {
      ...initial_state,
      user_status: user_statuses.NOT_COMPLETED,
      modal_page: modal_pages.PLEDGE,
      coming_to_campus: true,
      account_type: account_types.STUDENT,
      student_employee: false,
      face_covering: true,
      good_hygiene: true,
      distancing: true,
    }

    expect(reducer(state_going_in, { type: actions.NEXT_MODAL_PAGE })).toEqual({
      ...state_going_in,
      modal_page: modal_pages.HEALTH_SCREENING,
    })
  })

  it('should not submit a HS if any field is null', () => {
    const state_going_in = {
      ...initial_state,
      user_status: user_statuses.NOT_COMPLETED,
      modal_page: modal_pages.HEALTH_SCREENING,
      coming_to_campus: true,
      account_type: account_types.STUDENT,
      student_employee: false,
      face_covering: true,
      good_hygiene: true,
      distancing: true,
      coughing: false,
      feverish: false,
      exposed: false,
      congested: false,
      diarrhea: false,
      tested_positive: false,
      headache: false,
      loss_of_taste_or_smell: false,
      muscle_ache: false,
      nauseous: false,
      short_of_breath: false,
      sore_throat: false,
    }

    const action = { type: actions.NEXT_MODAL_PAGE }

    // coughing is null
    expect(reducer({ ...state_going_in, coughing: null }, action)).toEqual({
      ...state_going_in,
      coughing: null,
    })

    // feverish is null
    expect(reducer({ ...state_going_in, feverish: null }, action)).toEqual({
      ...state_going_in,
      feverish: null,
    })

    // congested is null
    expect(reducer({ ...state_going_in, congested: null }, action)).toEqual({
      ...state_going_in,
      congested: null,
    })

    // diarrhea is null
    expect(reducer({ ...state_going_in, diarrhea: null }, action)).toEqual({
      ...state_going_in,
      diarrhea: null,
    })

    // tested_positive is null
    expect(reducer({ ...state_going_in, tested_positive: null }, action)).toEqual({
      ...state_going_in,
      tested_positive: null,
    })

    // headache is null
    expect(reducer({ ...state_going_in, headache: null }, action)).toEqual({
      ...state_going_in,
      headache: null,
    })

    // loss_of_taste_smell is null
    expect(reducer({ ...state_going_in, loss_of_taste_or_smell: null }, action)).toEqual({
      ...state_going_in,
      loss_of_taste_or_smell: null,
    })

    // muscle_ache is null
    expect(reducer({ ...state_going_in, muscle_ache: null }, action)).toEqual({
      ...state_going_in,
      muscle_ache: null,
    })

    // nauseous is null
    expect(reducer({ ...state_going_in, nauseous: null }, action)).toEqual({
      ...state_going_in,
      nauseous: null,
    })

    // short_of_breath is null
    expect(reducer({ ...state_going_in, short_of_breath: null }, action)).toEqual({
      ...state_going_in,
      short_of_breath: null,
    })

    // sore_throat is null
    expect(reducer({ ...state_going_in, sore_throat: null }, action)).toEqual({
      ...state_going_in,
      sore_throat: null,
    })
  })

  it('should give ALL CLEAR if all symptoms are false', () => {
    const state_going_in = {
      ...initial_state,
      user_status: user_statuses.NOT_COMPLETED,
      modal_page: modal_pages.HEALTH_SCREENING,
      coming_to_campus: true,
      account_type: account_types.STUDENT,
      student_employee: false,
      face_covering: true,
      good_hygiene: true,
      distancing: true,
      coughing: false,
      feverish: false,
      exposed: false,
      congested: false,
      diarrhea: false,
      tested_positive: false,
      headache: false,
      loss_of_taste_or_smell: false,
      muscle_ache: false,
      nauseous: false,
      short_of_breath: false,
      sore_throat: false,
    }

    const action = { type: actions.NEXT_MODAL_PAGE, payload: modal_pages.SUBMITTED }

    expect(reducer(state_going_in, action)).toEqual({
      ...state_going_in,
      user_status: user_statuses.ALLOWED,
      modal_page: modal_pages.SUBMITTED,
    })
  })

  it('should give DISALLOWED if any symptom is true', () => {
    const state_going_in = {
      ...initial_state,
      user_status: user_statuses.NOT_COMPLETED,
      modal_page: modal_pages.HEALTH_SCREENING,
      coming_to_campus: true,
      account_type: account_types.STUDENT,
      student_employee: false,
      face_covering: true,
      good_hygiene: true,
      distancing: true,
      coughing: false,
      feverish: false,
      exposed: false,
      congested: false,
      diarrhea: false,
      tested_positive: false,
      headache: false,
      loss_of_taste_or_smell: false,
      muscle_ache: false,
      nauseous: false,
      short_of_breath: false,
      sore_throat: false,
    }

    const action = { type: actions.NEXT_MODAL_PAGE, payload: modal_pages.SUBMITTED }

    // coughing is true
    expect(reducer({ ...state_going_in, coughing: true }, action)).toEqual({
      ...state_going_in,
      user_status: user_statuses.DISALLOWED,
      modal_page: modal_pages.SUBMITTED,
      coughing: true,
    })

    // feverish is true
    expect(reducer({ ...state_going_in, feverish: true }, action)).toEqual({
      ...state_going_in,
      user_status: user_statuses.DISALLOWED,
      modal_page: modal_pages.SUBMITTED,
      feverish: true,
    })

    // congested is true
    expect(reducer({ ...state_going_in, congested: true }, action)).toEqual({
      ...state_going_in,
      user_status: user_statuses.DISALLOWED,
      modal_page: modal_pages.SUBMITTED,
      congested: true,
    })

    // diarrhea is true
    expect(reducer({ ...state_going_in, diarrhea: true }, action)).toEqual({
      ...state_going_in,
      user_status: user_statuses.DISALLOWED,
      modal_page: modal_pages.SUBMITTED,
      diarrhea: true,
    })

    // tested_positive is true
    expect(reducer({ ...state_going_in, tested_positive: true }, action)).toEqual({
      ...state_going_in,
      user_status: user_statuses.DISALLOWED,
      modal_page: modal_pages.SUBMITTED,
      tested_positive: true,
    })

    // headache is true
    expect(reducer({ ...state_going_in, headache: true }, action)).toEqual({
      ...state_going_in,
      user_status: user_statuses.DISALLOWED,
      modal_page: modal_pages.SUBMITTED,
      headache: true,
    })

    // loss_of_taste_smell is true
    expect(reducer({ ...state_going_in, loss_of_taste_or_smell: true }, action)).toEqual({
      ...state_going_in,
      user_status: user_statuses.DISALLOWED,
      modal_page: modal_pages.SUBMITTED,
      loss_of_taste_or_smell: true,
    })

    // muscle_ache is true
    expect(reducer({ ...state_going_in, muscle_ache: true }, action)).toEqual({
      ...state_going_in,
      user_status: user_statuses.DISALLOWED,
      modal_page: modal_pages.SUBMITTED,
      muscle_ache: true,
    })

    // nauseous is true
    expect(reducer({ ...state_going_in, nauseous: true }, action)).toEqual({
      ...state_going_in,
      user_status: user_statuses.DISALLOWED,
      modal_page: modal_pages.SUBMITTED,
      nauseous: true,
    })

    // short_of_breath is true
    expect(reducer({ ...state_going_in, short_of_breath: true }, action)).toEqual({
      ...state_going_in,
      user_status: user_statuses.DISALLOWED,
      modal_page: modal_pages.SUBMITTED,
      short_of_breath: true,
    })

    // sore_throat is true
    expect(reducer({ ...state_going_in, sore_throat: true }, action)).toEqual({
      ...state_going_in,
      user_status: user_statuses.DISALLOWED,
      modal_page: modal_pages.SUBMITTED,
      sore_throat: true,
    })
  })
})
