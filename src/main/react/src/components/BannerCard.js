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
  const { type, text, show_link, link_url } = props

  const icon = determine_color(type)

  return (
    <Card className={classes.card}>
      <CardHeader
        avatar={icon}
        title='OU Health Screening'
        subheader='Submitted today at 11:20am'
      />
      <CardMedia
        className={classes.media}
        image={'./covid.png'}
        title='Coronavirus'
      />
      <CertificateContent />
    </Card>
  )
}

const CertificateContent = () => {
  return (
    <>
      <CardContent>
        <Typography variant='body1' gutterBottom>
          <Box textAlign='center'>
            This student is permitted on campus for the duration of:
          </Box>
        </Typography>
        <Typography variant='body1' style={{ fontSize: 34, padding: 16 }}>
          <Box textAlign='center'>
            {new Date().toDateString()}
          </Box>
        </Typography>
        <Typography variant='body1'>
          <Box textAlign='center'>
            Email <a href={`mailto:${EMAIL}`}>{EMAIL}</a> a copy of this certificate
          </Box>
        </Typography>
      </CardContent>
      <CardActions style={{ justifyContent: 'right' }}>
        <Button color='secondary' variant='outlined'>
          Send Email
        </Button>
        {false && <Button color='secondary' variant='outlined'>
          Fill Out Form
        </Button>}
      </CardActions>
    </>
  )
}

export default BannerCard
