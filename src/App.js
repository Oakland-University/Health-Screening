import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import Card from '@material-ui/core/Card'
import CardHeader from '@material-ui/core/CardHeader'
import CardMedia from '@material-ui/core/CardMedia'
import CardContent from '@material-ui/core/CardContent'
import CardActions from '@material-ui/core/CardActions'
import Button from '@material-ui/core/Button'
import Typography from '@material-ui/core/Typography'
import HealthQuestions from './components/HealthQuestions'
import UserInfo from './components/UserInfo'

const useStyles = makeStyles((theme) => ({
  root: {
    maxWidth: 750,
  },
  media: {
    paddingTop: '25%', // 16:9
    height: 0,
  },
  cardActionStyle: {
    display: 'flex',
    justifyContent: 'flex-end'
  }
}))

export default function App() {
  const classes = useStyles()

  const [view, set_view] = React.useState('guest')

  const [user_info, set_user_info] = React.useState({
    name: '',
    name_error: false,
    email: '',
    email_error: false,
    phone: '',
    phone_error: false,
  })

  const [questions, set_questions] = React.useState({
    cough: false,
    fever: false,
    exposure: false,
  })

  const handle_click = () => {
    if (view === 'guest') {
      if (user_info.name && user_info.email && user_info.phone) {
        set_view('student')
      } else {
        set_user_info({
          ...user_info,
          name_error: !user_info.name,
          email_error: !user_info.email,
          phone_error: !user_info.phone,
        })
      }
    } else {
      //TODO: Error handling if neither view is chosen
      console.error('Unkown view selected')
    }
  }

  return (
    <Card className={classes.root}>
      <CardHeader
        title='Student Health Screening'
        subheader='Oakland University'
      />
      <CardMedia
        className={classes.media}
        image='./covid.jpg'
        title='Coronavirus'
      />
      <CardContent>
        <Typography variant='body2' color='textSecondary' component='p'>
          Anyone intending to visit campus is required to fill out this simple
          health screening beforehand.
        </Typography>
        {view === 'guest' ? (
          <UserInfo user_info={user_info} set_user_info={set_user_info} />
        ) : (
          <HealthQuestions
            questions={questions}
            set_questions={set_questions}
          />
        )}
      </CardContent>
    <CardActions className={classes.cardActionStyle}>
        <Button color='secondary' variant='outlined' onClick={handle_click}>
          {view === 'guest' ? 'Next' : 'Submit'}
        </Button>
      </CardActions>
    </Card>
  )
}
