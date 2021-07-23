import React from 'react'
import Typography from '@material-ui/core/Typography'
import { useSelector } from 'react-redux'
import { user_statuses } from '../utils/enums'

const FinalPage = (props) => {
  const { user_status, face_covering, good_hygiene, distancing } = useSelector((state) => state)

  const person_notified = !face_covering || !good_hygiene || !distancing ? 'The University' : 'GHC'

  if (user_status === user_statuses.DISALLOWED) {
    return (
      <Typography variant='body1' component='p'>
        Please do not come to campus. {person_notified} will be notified, and may reach out to you.
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
