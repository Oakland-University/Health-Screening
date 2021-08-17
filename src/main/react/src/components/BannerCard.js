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
import MoreVertIcon from '@material-ui/icons/MoreVert'
import IconButton from '@material-ui/core/IconButton'
import Snackbar from '@material-ui/core/Snackbar'
import Typography from '@material-ui/core/Typography'
import WarningIcon from '@material-ui/icons/Warning'
import OpenInNew from '@material-ui/icons/OpenInNew'
import Menu from '@material-ui/core/Menu'
import MenuItem from '@material-ui/core/MenuItem'
import { makeStyles } from '@material-ui/styles'
import { useSelector, useDispatch } from 'react-redux'
import { send_certificate_email } from '../api/api'
import { update_user_status } from '../actions/main-actions'
import { user_statuses } from '../utils/enums'

const useStyles = makeStyles((_theme) => ({
  avatar: {
    minWidth: 32,
  },
  card: {
    marginTop: 10,
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

const get_header_icon = (type) => {
  const fontSize = 32

  switch (type.toLowerCase()) {
    case user_statuses.NOT_COMPLETED:
    case user_statuses.NOT_COMING:
    case user_statuses.DISMISSED:
    case user_statuses.LOADING:
      return <WarningIcon style={{ color: '#FFCA28', fontSize }} />
    case user_statuses.ALLOWED:
      return <CheckCircle style={{ color: '#388E3C', fontSize }} />
    case user_statuses.DISALLOWED:
      return <ErrorIcon style={{ color: '#D32F2F', fontSize }} />
    default:
      console.error('Unknown banner type: ' + type)
      return <WarningIcon style={{ color: '#FFCA28', fontSize }} />
  }
}

const BannerCard = (props) => {
  const classes = useStyles()
  const dispatch = useDispatch()
  const { type, submission_time, banner_action } = props

  const open_form = () => {
    props.set_modal_open(true)
    dispatch(update_user_status(user_statuses.NOT_COMPLETED))
  }

  return (
    <Card className={classes.card}>
      <CardHeader
        avatar={get_header_icon(type)}
        title='OU Health Screening'
        subheader={submission_time && `Submitted at ${submission_time.toLocaleTimeString()}`}
      />
      {(type === user_statuses.NOT_COMPLETED ||
        type === user_statuses.NOT_COMING ||
        type === user_statuses.DISMISSED ||
        type === user_statuses.LOADING) && <Prompt open_form={open_form} />}
      {type === user_statuses.ALLOWED && (
        <Certificate action={banner_action} open_form={open_form} />
      )}
      {type === user_statuses.DISALLOWED && <Warning open_form={open_form} />}
    </Card>
  )
}

const Certificate = (props) => {
  const classes = useStyles()
  const { account_type, name, email, phone } = useSelector((state) => state)
  const [open, set_open] = useState(false)
  const [email_error, set_email_error] = useState(false)
  const [email_sent, set_email_sent] = useState(false)
  const [anchorEl, setAnchorEl] = useState(null)

  const open_menu = (event) => {
    setAnchorEl(event.currentTarget)
  }

  const close_menu = () => {
    setAnchorEl(null)
  }

  const handle_click = () => {
    send_certificate_email(name, email, phone).then((response) => {
      const error = !response

      set_email_error(error)

      if (!error) {
        set_email_sent(true)
      }

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
            This is a certificate for {name || email} to be on campus for the duration of
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
        <Button color='secondary' variant='outlined' onClick={props.open_form}>
          Re-take Screening
        </Button>
        {account_type !== 'guest' ? (
          <>
            <Button
              color='secondary'
              variant='outlined'
              endIcon={<OpenInNew />}
              href='https://myhealth.oakland.edu/home.aspx'
              aria-label='Upload Vaccination Card'
              target='_blank'
              rel='noopener noreferrer'
            >
              GHC Patient Portal - Enter COVID-19 Vaccine Info
            </Button>
            <IconButton onClick={open_menu}>
              <MoreVertIcon />
            </IconButton>
            <Menu anchorEl={anchorEl} keepMounted open={Boolean(anchorEl)} onClose={close_menu}>
              <MenuItem onClick={handle_click} disabled={email_sent}>
                Send Email
              </MenuItem>
            </Menu>
          </>
        ) : (
          <Button color='secondary' variant='outlined' disabled={email_sent} onClick={handle_click}>
            Send Email
          </Button>
        )}
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
          <IconButton
            size='small'
            aria-label='close'
            color='inherit'
            onClick={() => set_open(false)}
          >
            <CloseIcon fontSize='small' />
          </IconButton>
        }
      />
    </>
  )
}

const Prompt = (props) => {
  const classes = useStyles()
  const { account_type, user_status } = useSelector((state) => state)
  const [open, set_open] = useState(false)

  useEffect(() => {
    if (user_status === user_statuses.NOT_COMING) {
      set_open(true)
    }
  }, [user_status])

  return (
    <>
      <CardMedia
        className={classes.media}
        image={'/health-screening/static/multiple-covid.jpg'}
        title='Coronavirus'
      />
      <CardContent>
        <Typography variant='body1' gutterBottom className={classes.mainText}>
          <Box textAlign='center'>Do Your Part to help maintain a safe and healthy campus</Box>
        </Typography>
        <Typography variant='body1' gutterBottom className={classes.mainText}>
          <Box textAlign='center'>
            If you are planning on coming onto campus, please fill out this health-screening form
            beforehand.
          </Box>
        </Typography>
      </CardContent>
      <CardActions className={classes.bannerCardActions}>
        <Button color='secondary' variant='outlined' onClick={props.open_form}>
          Fill Out Form
        </Button>
        {account_type !== 'guest' && (
          <Button
            color='secondary'
            variant='outlined'
            href='https://myhealth.oakland.edu/home.aspx'
            aria-label='Upload Vaccination Card'
            target='_blank'
            rel='noopener noreferrer'
            endIcon={<OpenInNew />}
          >
            GHC Patient Portal - Enter COVID-19 Vaccine Info
          </Button>
        )}
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
          <IconButton
            size='small'
            aria-label='close'
            color='inherit'
            onClick={() => set_open(false)}
          >
            <CloseIcon fontSize='small' />
          </IconButton>
        }
      />
    </>
  )
}

const Warning = (props) => {
  const classes = useStyles()
  const { account_type } = useSelector((state) => state)
  return (
    <>
      <CardMedia className={classes.disallowedMedia} />
      <CardContent>
        <Typography variant='body1' gutterBottom>
          <Box textAlign='center'>
            Please do not come to the Oakland University Campus.
            <br />
            If you have any questions, contact the Graham Health Center at (248) 370-2341.
            <br />
            Do Your Part to help maintain a safe and healthy campus: stay home.
          </Box>
        </Typography>
      </CardContent>
      <CardActions className={classes.bannerCardActions}>
        <Button color='secondary' variant='outlined' onClick={props.open_form}>
          Re-take Screening
        </Button>
        {account_type !== 'guest' && (
          <Button
            color='secondary'
            variant='outlined'
            href='https://myhealth.oakland.edu/home.aspx'
            endIcon={<OpenInNew />}
            aria-label='Upload Vaccination Card'
            target='_blank'
            rel='noopener noreferrer'
          >
            GHC Patient Portal - Enter COVID-19 Vaccine Info
          </Button>
        )}
      </CardActions>
    </>
  )
}

export default BannerCard
