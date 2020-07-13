import React from 'react'

import Card from '@material-ui/core/Card'
import CheckCircle from '@material-ui/icons/CheckCircle'
import ErrorIcon from '@material-ui/icons/Error'
import InfoIcon from '@material-ui/icons/Info'
import WarningIcon from '@material-ui/icons/Warning'
import { makeStyles } from '@material-ui/styles'
import {
  Box,
  CardHeader,
  CardMedia,
  CardContent,
  CardActions,
  Typography,
  Button,
} from '@material-ui/core'
import { useSelector, useDispatch } from 'react-redux'
import {send_certificate_email} from '../api/api'


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
    fontSize: '1rem'
  }
}))

const determine_color = (type) => {
  const fontSize = 32
  let color = '#FFCA28'

  switch (type.toLowerCase()) {
    case 'not-completed':
      return <WarningIcon style={{ color, fontSize }} />
    case 'allowed':
      color = '#388E3C'
      return <CheckCircle style={{ color, fontSize }} />
    case 'disallowed':
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
      {type === 'not-completed' && (
        <Prompt set_modal_open={props.set_modal_open} />
      )}
      {type === 'allowed' && <Certificate action={banner_action} />}
      {type === 'disallowed' && <Warning />}
    </Card>
  )
}

const Certificate = (props) => {
  const classes = useStyles()
  const {name, email, phone} = useSelector(state => state)
  const display_name = name || email
  return (
    <>
      <CardMedia className={classes.certificateMedia} />
      <CardContent>
        <Typography variant='body1' gutterBottom>
          <Box textAlign='center'>
            Thank you for doing your part to keep the campus healthy!
            <br />
            This is a certificate for {display_name} to be on campus for the duration of
          </Box>
        </Typography>
        <Typography variant='body1' style={{ fontSize: 34, padding: 16 }}>
          <Box textAlign='center'>{new Date().toDateString()}</Box>
        </Typography>
        <Typography variant='body1'>
          <Box textAlign='center'>
            Email <a href={`mailto:${email}`}>{email}</a> a copy of this
            certificate
          </Box>
        </Typography>
      </CardContent>
      <CardActions style={{ justifyContent: 'right' }}>
        <Button
          color='secondary'
          variant='outlined'
          onClick={() => send_certificate_email(name, email, phone)}
        >
          Send Email
        </Button>
      </CardActions>
    </>
  )
}

const Prompt = (props) => {
  const classes = useStyles()
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
            If you are planning on coming onto campus, please
            fill out this health-screening form beforehand.
          </Box>
        </Typography>
      </CardContent>
      <CardActions style={{ justifyContent: 'right' }}>
        <Button
          color='secondary'
          variant='outlined'
          onClick={() => props.set_modal_open(true)}
        >
          Fill Out Form
        </Button>
      </CardActions>
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
            <br/>
            If you have any questions, contact the Graham Health Center at (248) 370-2341.
            <br/>
            Do Your Part to help maintain a safe and health campus: stay home.
          </Box>
        </Typography>
      </CardContent>
    </>
  )
}

export default BannerCard
