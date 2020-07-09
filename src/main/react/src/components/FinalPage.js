import React from 'react'
import Typography from '@material-ui/core/Typography'

const FinalPage = (props) => {
  const { cough, fever, exposure } = props.questions

  if (cough || fever || exposure) {
    return (
      <Typography variant='body1' component='p'>
        Please do not come to campus. GHC will be notified, and may reach out to
        you.
      </Typography>
    )
  } else {
    return (
      <Typography variant='body1' component='p'>
        Thank you for taking the time to fill out this form.
      </Typography>
    )
  }
}

export default FinalPage
