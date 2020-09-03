import React from 'react'
import CardContent from '@material-ui/core/CardContent'
import Typography from '@material-ui/core/Typography'
import TextField from '@material-ui/core/TextField'
import Grid from '@material-ui/core/Grid'
import { useSelector, useDispatch } from 'react-redux'
import {
  update_name,
  update_email,
  update_phone,
} from '../actions/main-actions'

export default function UserInfo(props) {
  const dispatch = useDispatch()
  const {
    name,
    name_error,
    email,
    email_error,
    phone,
    phone_error,
  } = useSelector((state) => state)

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
              onChange={(event) => dispatch(update_name(event.target.value))}
            />
          </Grid>
          <Grid item sm={4}>
            <TextField
              required
              error={email_error}
              id='outlined-required'
              label='Email'
              variant='outlined'
              type='email'
              value={email}
              onChange={(event) => dispatch(update_email(event.target.value))}
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
              onChange={(event) => dispatch(update_phone(event.target.value))}
            />
          </Grid>
        </Grid>
      </CardContent>
    </>
  )
}
