import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import CardContent from '@material-ui/core/CardContent'
import Typography from '@material-ui/core/Typography'
import TextField from '@material-ui/core/TextField'
import Grid from '@material-ui/core/Grid'

const useStyles = makeStyles(theme => ({
  radioGroup: {
    display: 'flex',
    flexDirection: 'row'
  }
}))

export default function UserInfo(props) {
  const classes = useStyles()

  const {
    name,
    name_error,
    email,
    email_error,
    phone,
    phone_error
  } = props.user_info

  return (
    <>
      <CardContent>
        <Typography paragraph>
          Please fill out the following information before taking the
          self-screening:
        </Typography>
        <Grid container spacing={3}>
          <Grid item sm={4}>
            <TextField
              required
              error={name_error}
              id='outlined-required'
              label='Name'
              variant='outlined'
              value={name}
              onChange={event =>
                props.set_user_info({
                  ...props.user_info,
                  name: event.target.value
                })
              }
            />
          </Grid>
          <Grid item sm={4}>
            <TextField
              required
              error={email_error}
              id='outlined-required'
              label='Email'
              variant='outlined'
              value={email}
              onChange={event =>
                props.set_user_info({
                  ...props.user_info,
                  email: event.target.value
                })
              }
            />
          </Grid>
          <Grid item sm={4}>
            <TextField
              required
              error={phone_error}
              id='outlined-required'
              label='Phone Number'
              variant='outlined'
              value={phone}
              onChange={event =>
                props.set_user_info({
                  ...props.user_info,
                  phone: event.target.value
                })
              }
            />
          </Grid>
        </Grid>
      </CardContent>
    </>
  )
}
