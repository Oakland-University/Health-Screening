import reducer from './index'
import { actions, user_statuses, modal_pages, account_types } from '../utils/enums'

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
  fully_vaccinated: null,
  tested_positive: null,
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
})

describe('Honor Pledge Page', () => {
  const not_filled_out_state = {
    ...initial_state,
    user_status: user_statuses.NOT_COMPLETED,
    modal_page: modal_pages.PLEDGE,
    coming_to_campus: true,
    account_type: account_types.STUDENT,
    student_employee: false,
  }

  const all_true_state = {
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

  it('should NOT proceed to symptom page if no pledge questions are filled out', () => {
    expect(reducer(not_filled_out_state, { type: actions.NEXT_MODAL_PAGE })).toEqual({
      ...not_filled_out_state,
    })
  })

  it('should NOT proceed to symptom page if face_covering is NOT filled out', () => {
    const action = { type: actions.NEXT_MODAL_PAGE }

    expect(
      reducer({ ...not_filled_out_state, good_hygiene: true, distancing: true }, action)
    ).toEqual({
      ...not_filled_out_state,
      good_hygiene: true,
      distancing: true,
    })
  })

  it('should NOT proceed to symptom page if good_hygiene is NOT filled out', () => {
    const action = { type: actions.NEXT_MODAL_PAGE }

    expect(
      reducer({ ...not_filled_out_state, face_covering: true, distancing: true }, action)
    ).toEqual({
      ...not_filled_out_state,
      face_covering: true,
      distancing: true,
    })
  })

  it('should NOT proceed to symptom page if distancing is NOT filled out', () => {
    const action = { type: actions.NEXT_MODAL_PAGE }

    expect(
      reducer({ ...not_filled_out_state, face_covering: true, good_hygiene: true }, action)
    ).toEqual({
      ...not_filled_out_state,
      face_covering: true,
      good_hygiene: true,
    })
  })

  it('should proceed to symptom page if all pledge questions are "true"', () => {
    expect(reducer(all_true_state, { type: actions.NEXT_MODAL_PAGE })).toEqual({
      ...all_true_state,
      modal_page: modal_pages.HEALTH_SCREENING,
    })
  })

  it('should set state to DISALLOWED if face_covering is false', () => {
    const action = { type: actions.NEXT_MODAL_PAGE }

    expect(reducer({ ...all_true_state, face_covering: false }, action)).toEqual({
      ...all_true_state,
      face_covering: false,
      user_status: user_statuses.DISALLOWED,
      modal_page: modal_pages.SUBMITTED,
    })
  })

  it('should set state to DISALLOWED if good_hygiene is false', () => {
    const action = { type: actions.NEXT_MODAL_PAGE }

    expect(reducer({ ...all_true_state, good_hygiene: false }, action)).toEqual({
      ...all_true_state,
      good_hygiene: false,
      user_status: user_statuses.DISALLOWED,
      modal_page: modal_pages.SUBMITTED,
    })
  })

  it('should set state to DISALLOWED if distancing is false', () => {
    const action = { type: actions.NEXT_MODAL_PAGE }

    expect(reducer({ ...all_true_state, distancing: false }, action)).toEqual({
      ...all_true_state,
      distancing: false,
      user_status: user_statuses.DISALLOWED,
      modal_page: modal_pages.SUBMITTED,
    })
  })
})

describe('Health Questions Page', () => {
  const all_false = {
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
    fully_vaccinated: false,
    sore_throat: false,
  }

  it('should not submit a HS if coughing is null', () => {
    const action = { type: actions.NEXT_MODAL_PAGE }

    expect(reducer({ ...all_false, coughing: null }, action)).toEqual({
      ...all_false,
      coughing: null,
    })
  })

  it('should not submit a HS if feverish field is null', () => {
    const action = { type: actions.NEXT_MODAL_PAGE }

    expect(reducer({ ...all_false, feverish: null }, action)).toEqual({
      ...all_false,
      feverish: null,
    })
  })

  it('should not submit a HS if exposed field is null', () => {
    const action = { type: actions.NEXT_MODAL_PAGE }

    expect(reducer({ ...all_false, exposed: null }, action)).toEqual({
      ...all_false,
      exposed: null,
    })
  })

  it('should not submit a HS if congested is null', () => {
    const action = { type: actions.NEXT_MODAL_PAGE }

    expect(reducer({ ...all_false, congested: null }, action)).toEqual({
      ...all_false,
      congested: null,
    })
  })

  it('should not submit a HS if diarrhea is null', () => {
    const action = { type: actions.NEXT_MODAL_PAGE }

    expect(reducer({ ...all_false, diarrhea: null }, action)).toEqual({
      ...all_false,
      diarrhea: null,
    })
  })

  it('should not submit a HS if tested_positive is null', () => {
    const action = { type: actions.NEXT_MODAL_PAGE }

    expect(reducer({ ...all_false, tested_positive: null }, action)).toEqual({
      ...all_false,
      tested_positive: null,
    })
  })

  it('should not submit a HS if headache is null', () => {
    const action = { type: actions.NEXT_MODAL_PAGE }

    expect(reducer({ ...all_false, headache: null }, action)).toEqual({
      ...all_false,
      headache: null,
    })
  })

  it('should not submit a HS if loss_of_taste_smell is null', () => {
    const action = { type: actions.NEXT_MODAL_PAGE }

    expect(reducer({ ...all_false, loss_of_taste_or_smell: null }, action)).toEqual({
      ...all_false,
      loss_of_taste_or_smell: null,
    })
  })

  it('should not submit a HS if muscle_ache is null', () => {
    const action = { type: actions.NEXT_MODAL_PAGE }

    expect(reducer({ ...all_false, muscle_ache: null }, action)).toEqual({
      ...all_false,
      muscle_ache: null,
    })
  })

  it('should not submit a HS if nauseous is null', () => {
    const action = { type: actions.NEXT_MODAL_PAGE }

    expect(reducer({ ...all_false, nauseous: null }, action)).toEqual({
      ...all_false,
      nauseous: null,
    })
  })

  it('should not submit a HS if exposed is null', () => {
    const action = { type: actions.NEXT_MODAL_PAGE }

    expect(reducer({ ...all_false, exposed: null }, action)).toEqual({
      ...all_false,
      exposed: null,
    })
  })

  it('should not submit a HS if exposed is true and fully_vaccinated is null', () => {
    const action = { type: actions.NEXT_MODAL_PAGE }

    expect(reducer({ ...all_false, exposed: true, fully_vaccinated: null }, action)).toEqual({
      ...all_false,
      exposed: true,
      fully_vaccinated: null,
    })
  })

  it('should not submit a HS if short_of_breath is null', () => {
    const action = { type: actions.NEXT_MODAL_PAGE }

    expect(reducer({ ...all_false, short_of_breath: null }, action)).toEqual({
      ...all_false,
      short_of_breath: null,
    })
  })

  it('should not submit a HS if sore_throat is null', () => {
    const action = { type: actions.NEXT_MODAL_PAGE }

    expect(reducer({ ...all_false, sore_throat: null }, action)).toEqual({
      ...all_false,
      sore_throat: null,
    })
  })

  it('should give DISALLOWED if coughing symptom is true', () => {
    const action = { type: actions.NEXT_MODAL_PAGE, payload: modal_pages.SUBMITTED }

    expect(reducer({ ...all_false, coughing: true }, action)).toEqual({
      ...all_false,
      user_status: user_statuses.DISALLOWED,
      modal_page: modal_pages.SUBMITTED,
      coughing: true,
    })
  })

  it('should give DISALLOWED if feverish is true', () => {
    const action = { type: actions.NEXT_MODAL_PAGE, payload: modal_pages.SUBMITTED }

    expect(reducer({ ...all_false, feverish: true }, action)).toEqual({
      ...all_false,
      user_status: user_statuses.DISALLOWED,
      modal_page: modal_pages.SUBMITTED,
      feverish: true,
    })
  })

  it('should give DISALLOWED if exposed is true and fully_vaccinated is false', () => {
    const action = { type: actions.NEXT_MODAL_PAGE, payload: modal_pages.SUBMITTED }

    expect(reducer({ ...all_false, exposed: true, fully_vaccinated: false }, action)).toEqual({
      ...all_false,
      user_status: user_statuses.DISALLOWED,
      modal_page: modal_pages.SUBMITTED,
      exposed: true,
      fully_vaccinated: false,
    })
  })

  it('should give ALLOWED if both exposed and fully_vaccinated are true', () => {
    const action = { type: actions.NEXT_MODAL_PAGE, payload: modal_pages.SUBMITTED }

    expect(reducer({ ...all_false, exposed: true, fully_vaccinated: true }, action)).toEqual({
      ...all_false,
      user_status: user_statuses.ALLOWED,
      modal_page: modal_pages.SUBMITTED,
      exposed: true,
      fully_vaccinated: true,
    })
  })

  it('should give DISALLOWED if congested is true', () => {
    const action = { type: actions.NEXT_MODAL_PAGE, payload: modal_pages.SUBMITTED }

    expect(reducer({ ...all_false, congested: true }, action)).toEqual({
      ...all_false,
      user_status: user_statuses.DISALLOWED,
      modal_page: modal_pages.SUBMITTED,
      congested: true,
    })
  })

  it('should give DISALLOWED if diarrhea is true', () => {
    const action = { type: actions.NEXT_MODAL_PAGE, payload: modal_pages.SUBMITTED }

    expect(reducer({ ...all_false, diarrhea: true }, action)).toEqual({
      ...all_false,
      user_status: user_statuses.DISALLOWED,
      modal_page: modal_pages.SUBMITTED,
      diarrhea: true,
    })
  })

  it('should give DISALLOWED if tested_positive is true', () => {
    const action = { type: actions.NEXT_MODAL_PAGE, payload: modal_pages.SUBMITTED }

    expect(reducer({ ...all_false, tested_positive: true }, action)).toEqual({
      ...all_false,
      user_status: user_statuses.DISALLOWED,
      modal_page: modal_pages.SUBMITTED,
      tested_positive: true,
    })
  })

  it('should give DISALLOWED if headache is true', () => {
    const action = { type: actions.NEXT_MODAL_PAGE, payload: modal_pages.SUBMITTED }

    expect(reducer({ ...all_false, headache: true }, action)).toEqual({
      ...all_false,
      user_status: user_statuses.DISALLOWED,
      modal_page: modal_pages.SUBMITTED,
      headache: true,
    })
  })

  it('should give DISALLOWED if loss_of_taste_smell is true', () => {
    const action = { type: actions.NEXT_MODAL_PAGE, payload: modal_pages.SUBMITTED }

    expect(reducer({ ...all_false, loss_of_taste_or_smell: true }, action)).toEqual({
      ...all_false,
      user_status: user_statuses.DISALLOWED,
      modal_page: modal_pages.SUBMITTED,
      loss_of_taste_or_smell: true,
    })
  })

  it('should give DISALLOWED if muscle_ache is true', () => {
    const action = { type: actions.NEXT_MODAL_PAGE, payload: modal_pages.SUBMITTED }

    expect(reducer({ ...all_false, muscle_ache: true }, action)).toEqual({
      ...all_false,
      user_status: user_statuses.DISALLOWED,
      modal_page: modal_pages.SUBMITTED,
      muscle_ache: true,
    })
  })

  it('should give DISALLOWED if nauseous is true', () => {
    const action = { type: actions.NEXT_MODAL_PAGE, payload: modal_pages.SUBMITTED }

    expect(reducer({ ...all_false, nauseous: true }, action)).toEqual({
      ...all_false,
      user_status: user_statuses.DISALLOWED,
      modal_page: modal_pages.SUBMITTED,
      nauseous: true,
    })
  })

  it('should give DISALLOWED if short_of_breath is true', () => {
    const action = { type: actions.NEXT_MODAL_PAGE, payload: modal_pages.SUBMITTED }

    expect(reducer({ ...all_false, short_of_breath: true }, action)).toEqual({
      ...all_false,
      user_status: user_statuses.DISALLOWED,
      modal_page: modal_pages.SUBMITTED,
      short_of_breath: true,
    })
  })

  it('should give DISALLOWED if sore_throat is true', () => {
    const action = { type: actions.NEXT_MODAL_PAGE, payload: modal_pages.SUBMITTED }

    expect(reducer({ ...all_false, sore_throat: true }, action)).toEqual({
      ...all_false,
      user_status: user_statuses.DISALLOWED,
      modal_page: modal_pages.SUBMITTED,
      sore_throat: true,
    })
  })

  it('should give ALL CLEAR if all symptoms are false', () => {
    const action = { type: actions.NEXT_MODAL_PAGE, payload: modal_pages.SUBMITTED }

    expect(reducer(all_false, action)).toEqual({
      ...all_false,
      user_status: user_statuses.ALLOWED,
      modal_page: modal_pages.SUBMITTED,
    })
  })
})
