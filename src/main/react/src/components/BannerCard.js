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

/*global EMAIL*/
/*global NAME*/

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
  const name = NAME ? NAME.replace('[', '').replace(']', '') : EMAIL
  return (
    <>
      <CardMedia className={classes.certificateMedia} />
      <CardContent>
        <Typography variant='body1' gutterBottom>
          <Box textAlign='center'>
            Thank you for doing your part to keep the campus healthy!
            <br />
            This is a certificate for {name} to be on campus for the duration of
          </Box>
        </Typography>
        <Typography variant='body1' style={{ fontSize: 34, padding: 16 }}>
          <Box textAlign='center'>{new Date().toDateString()}</Box>
        </Typography>
        <Typography variant='body1'>
          <Box textAlign='center'>
            Email <a href={`mailto:${EMAIL}`}>{EMAIL}</a> a copy of this
            certificate
          </Box>
        </Typography>
      </CardContent>
      <CardActions style={{ justifyContent: 'right' }}>
        <Button
          color='secondary'
          variant='outlined'
          onClick={() => console.log('send email')}
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
        image={'./covid.png'}
        title='Coronavirus'
      />
      <CardContent>
        <Typography variant='body1' gutterBottom>
          <Box textAlign='center'>
            Anyone intending on visiting campus is required to fill out the OU
            Health Screening Form beforehand.
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
            Based on your answers to the health screening form, we ask that you
            stay off campus
          </Box>
        </Typography>
      </CardContent>
    </>
  )
}

export default BannerCard
