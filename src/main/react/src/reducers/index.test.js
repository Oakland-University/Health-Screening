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

  it('should NOT proceed to symptom page if face_covering is NOT filled out', () => {
    const state_going_in = {
      ...initial_state,
      user_status: user_statuses.NOT_COMPLETED,
      modal_page: modal_pages.PLEDGE,
      coming_to_campus: true,
      account_type: account_types.STUDENT,
      student_employee: false,
    }

    const action = { type: actions.NEXT_MODAL_PAGE }
    // face_covering not filled out
    expect(reducer({ ...state_going_in, good_hygiene: true, distancing: true }, action)).toEqual({
      ...state_going_in,
      good_hygiene: true,
      distancing: true,
    })

  })

  it('should NOT proceed to symptom page if good_hygiene is NOT filled out', () => {
    const state_going_in = {
      ...initial_state,
      user_status: user_statuses.NOT_COMPLETED,
      modal_page: modal_pages.PLEDGE,
      coming_to_campus: true,
      account_type: account_types.STUDENT,
      student_employee: false,
    }

    const action = { type: actions.NEXT_MODAL_PAGE }

    // good_hygiene not filled out
    expect(reducer({ ...state_going_in, face_covering: true, distancing: true }, action)).toEqual({
      ...state_going_in,
      face_covering: true,
      distancing: true,
    })

  })

  it('should NOT proceed to symptom page if distancing is NOT filled out', () => {
    const state_going_in = {
      ...initial_state,
      user_status: user_statuses.NOT_COMPLETED,
      modal_page: modal_pages.PLEDGE,
      coming_to_campus: true,
      account_type: account_types.STUDENT,
      student_employee: false,
    }

    const action = { type: actions.NEXT_MODAL_PAGE }

    // distancing not filled out
    expect(reducer({ ...state_going_in, face_covering: true, good_hygiene: true }, action)).toEqual(
      {
        ...state_going_in,
        face_covering: true,
        good_hygiene: true,
      }
    )
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


  it('should set state to DISALLOWED if face_covering is false', () => {
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

  })

  it('should set state to DISALLOWED if good_hygiene is false', () => {
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

    // good_hygiene false
    expect(reducer({ ...state_going_in, good_hygiene: false }, action)).toEqual({
      ...state_going_in,
      good_hygiene: false,
      user_status: user_statuses.DISALLOWED,
      modal_page: modal_pages.SUBMITTED,
    })

  })

  it('should set state to DISALLOWED if distancing is false', () => {
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

    // distancing false
    expect(reducer({ ...state_going_in, distancing: false }, action)).toEqual({
      ...state_going_in,
      distancing: false,
      user_status: user_statuses.DISALLOWED,
      modal_page: modal_pages.SUBMITTED,
    })
  })
})

describe('Health Questions Page', () => {

  it('should not submit a HS if coughing is null', () => {
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

  })

  it('should not submit a HS if feverish field is null', () => {
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
    // feverish is null
    expect(reducer({ ...state_going_in, feverish: null }, action)).toEqual({
      ...state_going_in,
      feverish: null,
    })

  })

  it('should not submit a HS if congested is null', () => {
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
    // congested is null
    expect(reducer({ ...state_going_in, congested: null }, action)).toEqual({
      ...state_going_in,
      congested: null,
    })

  })

  it('should not submit a HS if diarrhea is null', () => {
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
    // diarrhea is null
    expect(reducer({ ...state_going_in, diarrhea: null }, action)).toEqual({
      ...state_going_in,
      diarrhea: null,
    })

  })

  it('should not submit a HS if tested_positive is null', () => {
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
    // tested_positive is null
    expect(reducer({ ...state_going_in, tested_positive: null }, action)).toEqual({
      ...state_going_in,
      tested_positive: null,
    })

  })

  it('should not submit a HS if headache is null', () => {
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
    // headache is null
    expect(reducer({ ...state_going_in, headache: null }, action)).toEqual({
      ...state_going_in,
      headache: null,
    })

  })

  it('should not submit a HS if loss_of_taste_smell is null', () => {
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
    // loss_of_taste_smell is null
    expect(reducer({ ...state_going_in, loss_of_taste_or_smell: null }, action)).toEqual({
      ...state_going_in,
      loss_of_taste_or_smell: null,
    })

  })

  it('should not submit a HS if muscle_ache is null', () => {
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
    // muscle_ache is null
    expect(reducer({ ...state_going_in, muscle_ache: null }, action)).toEqual({
      ...state_going_in,
      muscle_ache: null,
    })

  })

  it('should not submit a HS if nauseous is null', () => {
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
    // nauseous is null
    expect(reducer({ ...state_going_in, nauseous: null }, action)).toEqual({
      ...state_going_in,
      nauseous: null,
    })

  })

  it('should not submit a HS if short_of_breath is null', () => {
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
    // short_of_breath is null
    expect(reducer({ ...state_going_in, short_of_breath: null }, action)).toEqual({
      ...state_going_in,
      short_of_breath: null,
    })

  })

  it('should not submit a HS if sore_throat is null', () => {
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
    // sore_throat is null
    expect(reducer({ ...state_going_in, sore_throat: null }, action)).toEqual({
      ...state_going_in,
      sore_throat: null,
    })
  })



  it('should give DISALLOWED if coughing symptom is true', () => {
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

  })

  it('should give DISALLOWED if feverish is true', () => {
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


    // feverish is true
    expect(reducer({ ...state_going_in, feverish: true }, action)).toEqual({
      ...state_going_in,
      user_status: user_statuses.DISALLOWED,
      modal_page: modal_pages.SUBMITTED,
      feverish: true,
    })

  })

  it('should give DISALLOWED if congested is true', () => {
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


    // congested is true
    expect(reducer({ ...state_going_in, congested: true }, action)).toEqual({
      ...state_going_in,
      user_status: user_statuses.DISALLOWED,
      modal_page: modal_pages.SUBMITTED,
      congested: true,
    })

  })

  it('should give DISALLOWED if diarrhea is true', () => {
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


    // diarrhea is true
    expect(reducer({ ...state_going_in, diarrhea: true }, action)).toEqual({
      ...state_going_in,
      user_status: user_statuses.DISALLOWED,
      modal_page: modal_pages.SUBMITTED,
      diarrhea: true,
    })

  })

  it('should give DISALLOWED if tested_positive is true', () => {
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


    // tested_positive is true
    expect(reducer({ ...state_going_in, tested_positive: true }, action)).toEqual({
      ...state_going_in,
      user_status: user_statuses.DISALLOWED,
      modal_page: modal_pages.SUBMITTED,
      tested_positive: true,
    })

  })

  it('should give DISALLOWED if headache is true', () => {
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


    // headache is true
    expect(reducer({ ...state_going_in, headache: true }, action)).toEqual({
      ...state_going_in,
      user_status: user_statuses.DISALLOWED,
      modal_page: modal_pages.SUBMITTED,
      headache: true,
    })

  })

  it('should give DISALLOWED if loss_of_taste_smell is true', () => {
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


    // loss_of_taste_smell is true
    expect(reducer({ ...state_going_in, loss_of_taste_or_smell: true }, action)).toEqual({
      ...state_going_in,
      user_status: user_statuses.DISALLOWED,
      modal_page: modal_pages.SUBMITTED,
      loss_of_taste_or_smell: true,
    })

  })

  it('should give DISALLOWED if muscle_ache is true', () => {
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


    // muscle_ache is true
    expect(reducer({ ...state_going_in, muscle_ache: true }, action)).toEqual({
      ...state_going_in,
      user_status: user_statuses.DISALLOWED,
      modal_page: modal_pages.SUBMITTED,
      muscle_ache: true,
    })

  })

  it('should give DISALLOWED if nauseous is true', () => {
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


    // nauseous is true
    expect(reducer({ ...state_going_in, nauseous: true }, action)).toEqual({
      ...state_going_in,
      user_status: user_statuses.DISALLOWED,
      modal_page: modal_pages.SUBMITTED,
      nauseous: true,
    })

  })

  it('should give DISALLOWED if short_of_breath is true', () => {
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


    // short_of_breath is true
    expect(reducer({ ...state_going_in, short_of_breath: true }, action)).toEqual({
      ...state_going_in,
      user_status: user_statuses.DISALLOWED,
      modal_page: modal_pages.SUBMITTED,
      short_of_breath: true,
    })

  })

  it('should give DISALLOWED if sore_throat is true', () => {
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


    // sore_throat is true
    expect(reducer({ ...state_going_in, sore_throat: true }, action)).toEqual({
      ...state_going_in,
      user_status: user_statuses.DISALLOWED,
      modal_page: modal_pages.SUBMITTED,
      sore_throat: true,
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
})
