/*global IS_DEMO*/
/* global token */

export const submit_form = async (data) => {
  if (IS_DEMO) {
    console.log(data)
    return
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
      body: JSON.stringify(data),
    })
    const status = response.status
    if (status > 399 && status < 500) {
      alert(
        'Your MySAIL session has expired. You may have to sign in again and fill out the health screening form again.'
      )
      if (window.location.hostname.includes('mysaildev')) {
        window.location.href = 'https://mysaildev.oakland.edu'
      } else if (window.location.hostname.includes('mysailtest')) {
        window.location.href = 'https://mysailtest.oakland.edu'
      } else {
        window.location.href = 'https://mysail.oakland.edu'
      }
    }
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
    const response = await fetch('/health-screening/api/v1/health-info/current-user', {
      credentials: 'include',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + token,
      },
      method: 'GET',
    })
    return await response.json()
  } catch (err) {
    return err
  }
}

export const get_previous_info = async () => {
  if (IS_DEMO) {
    let previous_info = {
      supervisorEmail: 'supervisor@oakland.edu',
      phoneNumber: '5555555555',
    }
    return {
      previous_info,
    }
  }

  try {
    const response = await fetch('/health-screening/api/v1/previous-information', {
      credentials: 'include',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + token,
      },
      method: 'GET',
    })
    return await response.json()
  } catch (err) {
    return err
  }
}

export const send_certificate_email = async (name, email, phone) => {
  if (IS_DEMO) {
    return
  }

  const query_params = `?name=${encodeURIComponent(name)}&email=${encodeURIComponent(
    email
  )}&phone=${encodeURIComponent(phone)}`

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
