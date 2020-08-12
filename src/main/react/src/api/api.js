/*global IS_DEMO*/
/* global token */

export const submit_form = async (pledge_info, user_info, questions) => {
  if (IS_DEMO) {
    return
  }

  let request_body = {
    accountType: user_info == null ? 'student' : 'guest',
    name: user_info.name,
    phone: user_info.phone,
    email: user_info.email,
    supervisor_email: pledge_info.supervisor_email,
    coughing: questions.cough,
    feverish: questions.fever,
    exposed: questions.exposure,
    pledge: {
      faceCovering: pledge_info.face_covering,
      goodHygiene: pledge_info.good_hygiene,
      distancing: pledge_info.distancing,
    },
  }

  try {
    const response = await fetch('/health-screening/api/v1/health-info', {
      credentials: 'include',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + token,
      },
      method: 'POST',
      body: JSON.stringify(request_body),
    })
    return await response.json()
  } catch (err) {
    return err
  }
}

export const get_user_submission = async () => {
  if (IS_DEMO) {
    return
  }

  try {
    const response = await fetch(
      '/health-screening/api/v1/health-info/current-user',
      {
        credentials: 'include',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + token,
        },
        method: 'GET',
      }
    )
    return await response.json()
  } catch (err) {
    return err
  }
}

export const send_certificate_email = async (name, email, phone) => {
  if (IS_DEMO) {
    return
  }

  const query_params = `?name=${name}&email=${email}&phone=${phone}`

  try {
    const response = await fetch(
      '/health-screening/api/v1/health-info/certificate-email' + query_params,
      {
        credentials: 'include',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + token,
        },
        method: 'GET',
      }
    )
    return await response.ok()
  } catch (err) {
    return err
  }
}

export const send_pledge_info = async (pledge_info) => {
  if (IS_DEMO) {
    return
  }

  let request_body = {
    faceCovering: pledge_info.face_covering,
    goodHygiene: pledge_info.good_hygiene,
    distancing: pledge_info.distancing,
    supervisorEmail: pledge_info.supervisor_email
  }

  try {
    const response = await fetch('/health-screening/api/v1/pledge', {
      credentials: 'include',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + token,
      },
      method: 'POST',
      body: JSON.stringify(request_body),
    })
    return await response.ok
  } catch (err) {
    console.error(err)
    return err
  }
}
