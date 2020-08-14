import React, { useState, useEffect } from 'react'

import Box from '@material-ui/core/Box'
import Button from '@material-ui/core/Button'
import Card from '@material-ui/core/Card'
import CardActions from '@material-ui/core/CardActions'
import CardContent from '@material-ui/core/CardContent'
import CardHeader from '@material-ui/core/CardHeader'
import CardMedia from '@material-ui/core/CardMedia'
import CheckCircle from '@material-ui/icons/CheckCircle'
import CloseIcon from '@material-ui/icons/Close'
import ErrorIcon from '@material-ui/icons/Error'
import IconButton from '@material-ui/core/IconButton'
import Snackbar from '@material-ui/core/Snackbar'
import Typography from '@material-ui/core/Typography'
import WarningIcon from '@material-ui/icons/Warning'
import { makeStyles } from '@material-ui/styles'
import { useSelector, useDispatch } from 'react-redux'
import { send_certificate_email } from '../api/api'
import { update_user_status } from '../actions/main-actions'
import { user_statuses } from '../utils/enums'

const useStyles = makeStyles((theme) => ({
  avatar: {
    minWidth: 32,
  },
  card: {
    marginTop: 10,
  },
  headerContent: {
    paddingLeft: 10,
  },
  media: {
    paddingTop: '20%', // 16:9
    height: 0,
    color: 'red',
  },
  certificateMedia: {
    paddingTop: '12%',
    height: 0,
    backgroundImage: 'linear-gradient(green, green)',
  },
  disallowedMedia: {
    paddingTop: '12%',
    height: 0,
    backgroundImage: 'linear-gradient(#d32f2f, #d32f2f)',
  },
  mainText: {
    marginTop: 10,
    fontSize: '1rem',
  },
  bannerCardActions: {
    justifyContent: 'right',
  },
}))

const determine_color = (type) => {
  const fontSize = 32
  let color = '#FFCA28'

  switch (type.toLowerCase()) {
    case user_statuses.NOT_COMPLETED:
    case user_statuses.NOT_COMING:
    case user_statuses.DISMISSED:
    case user_statuses.LOADING:
      return <WarningIcon style={{ color, fontSize }} />
    case user_statuses.ALLOWED:
      color = '#388E3C'
      return <CheckCircle style={{ color, fontSize }} />
    case user_statuses.DISALLOWED:
      color = '#D32F2F'
      return <ErrorIcon style={{ color, fontSize }} />
    default:
      console.error('Unknown banner type: ' + type)
      return <WarningIcon style={{ color, fontSize }} />
  }
}

const BannerCard = (props) => {
  const classes = useStyles()
  const { type, submission_time, banner_action } = props

  const icon = determine_color(type)

  return (
    <Card className={classes.card}>
      <CardHeader
        avatar={icon}
        title='OU Health Screening'
        subheader={
          submission_time &&
          `Submitted at ${submission_time.toLocaleTimeString()}`
        }
      />
      {(type === user_statuses.NOT_COMPLETED ||
        type === user_statuses.NOT_COMING ||
        type === user_statuses.DISMISSED ||
        type === user_statuses.LOADING) && (
        <Prompt set_modal_open={props.set_modal_open} />
      )}
      {type === user_statuses.ALLOWED && <Certificate action={banner_action} />}
      {type === user_statuses.DISALLOWED && <Warning />}
    </Card>
  )
}

const Certificate = (props) => {
  const classes = useStyles()
  const { name, email, phone } = useSelector((state) => state)
  const display_name = name || email
  const [open, set_open] = useState(false)
  const [email_error, set_email_error] = useState(false)

  const handle_click = () => {
    send_certificate_email(name, email, phone).then((response) => {
      set_email_error(!response)
      set_open(true)
    })
  }

  return (
    <>
      <CardMedia className={classes.certificateMedia} />
      <CardContent>
        <Typography variant='body1' gutterBottom>
          <Box textAlign='center'>
            Thank you for doing your part to keep the campus healthy!
            <br />
            This is a certificate for {display_name} to be on campus for the
            duration of
          </Box>
        </Typography>
        <Typography variant='body1' style={{ fontSize: 34, padding: 16 }}>
          <Box textAlign='center'>{new Date().toDateString()}</Box>
        </Typography>
        <Typography variant='body1'>
          <Box textAlign='center'>Email {email} a copy of this certificate</Box>
        </Typography>
      </CardContent>
      <CardActions className={classes.bannerCardActions}>
        <Button color='secondary' variant='outlined' onClick={handle_click}>
          Send Email
        </Button>
      </CardActions>
      <Snackbar
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
        open={open}
        autoHideDuration={6000}
        onClose={() => set_open(false)}
        message={
          email_error 
            ? 'Email was not sent. Please contact uts@oakland.edu if this problem persists'
            : 'Email sent'
        }
        action={
          <IconButton size="small" aria-label="close" color="inherit" onClick={() => set_open(false)}>
            <CloseIcon fontSize="small" />
          </IconButton>
        }
      />
    </>
  )
}

const Prompt = (props) => {
  const classes = useStyles()
  const dispatch = useDispatch()
  const { user_status } = useSelector((state) => state)
  const [open, set_open] = useState(false)

  useEffect(() => {
    if(user_status === user_statuses.NOT_COMING) {
      set_open(true)
    }
  }, [user_status])

  const handle_close = () => {
    props.set_modal_open(true)
    dispatch(update_user_status(user_statuses.NOT_COMPLETED))
  }

  return (
    <>
      <CardMedia
        className={classes.media}
        image={'/health-screening/static/multiple-covid.jpg'}
        title='Coronavirus'
      />
      <CardContent>
        <Typography variant='body1' gutterBottom className={classes.mainText}>
          <Box textAlign='center'>
            Do Your Part to help maintain a safe and healthy campus
          </Box>
        </Typography>
        <Typography variant='body1' gutterBottom className={classes.mainText}>
          <Box textAlign='center'>
            If you are planning on coming onto campus, please fill out this
            health-screening form beforehand.
          </Box>
        </Typography>
      </CardContent>
      <CardActions className={classes.bannerCardActions}>
        <Button
          color='secondary'
          variant='outlined'
          onClick={handle_close}
        >
          Fill Out Form
        </Button>
      </CardActions>
      <Snackbar
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
        open={open}
        autoHideDuration={6000}
        onClose={() => set_open(false)}
        message="You don't need to fill out this form if you're not coming to campus"
        action={
          <IconButton size="small" aria-label="close" color="inherit" onClick={() => set_open(false)}>
            <CloseIcon fontSize="small" />
          </IconButton>
        }
      />
    </>
  )
}

const Warning = (props) => {
  const classes = useStyles()
  return (
    <>
      <CardMedia className={classes.disallowedMedia} />
      <CardContent>
        <Typography variant='body1' gutterBottom>
          <Box textAlign='center'>
            Please do not come to the Oakland University Campus.
            <br />
            If you have any questions, contact the Graham Health Center at (248)
            370-2341.
            <br />
            Do Your Part to help maintain a safe and healthy campus: stay home.
          </Box>
        </Typography>
      </CardContent>
    </>
  )
}

export default BannerCard
