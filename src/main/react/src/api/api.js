/*global IS_DEMO*/

export const submit_form = async (user_info, questions) => {
  if (IS_DEMO) {
    return
  }

  let request_body = {
    accountType: user_info == null ? 'student' : 'guest',
    name: user_info.name,
    phone: user_info.phone,
    email: user_info.email,
    coughing: questions.cough,
    feverish: questions.fever,
    exposed: questions.exposure,
  }

  try {
    const response = await fetch('/api/v1/health-info', {
      credentials: 'include',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      method: 'POST',
      body: JSON.stringify(request_body),
    })
    return await response.json()
  } catch (err) {
    return err
  }
}
