import React from 'react'
import Typography from '@material-ui/core/Typography'
import { useSelector } from 'react-redux'
import { user_statuses } from '../utils/enums'

const FinalPage = (props) => {
  const { user_status } = useSelector((state) => state)

  if (user_status === user_statuses.DISALLOWED) {
    return (
      <Typography variant='body1' component='p'>
        Please do not come to campus. Your response requires you to be cleared by Graham Health
        Center <a href='tel:248-370-2341'>248-370-2341</a>
      </Typography>
    )
  } else {
    return (
      <Typography variant='body1' component='p'>
        Thank you for completing your Daily Health Screening, if you have not uploaded your vaccine
        record, please do so
        <a
          style={{ marginLeft: '5px', color: '#0000EE' }}
          href='https://myhealth.oakland.edu/home.aspx'
          aria-label='Upload Vaccination Card'
          target='_blank'
          rel='noopener noreferrer'
        >
          here
        </a>
      </Typography>
    )
  }
}

export default FinalPage
