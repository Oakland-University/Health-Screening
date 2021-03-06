import React from 'react'
import Typography from '@material-ui/core/Typography'
import { useSelector } from 'react-redux'

const FinalPage = (props) => {
  const user_status = useSelector((state) => state.user_status)

  if (user_status === 'disallowed') {
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
