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
import FinalPage from './components/FinalPage'
import { submit_form } from './api/api'

/*global PICTURE_URL*/
/*global PHONE*/
/*global ACCOUNT_TYPE*/

const useStyles = makeStyles(theme => ({
  media: {
    paddingTop: '25%', // 16:9
    height: 0
  },
  cardActionStyle: {
    display: 'flex',
    justifyContent: 'flex-end'
  }
}))

export default function App() {
  const classes = useStyles()

  const [view, set_view] = React.useState(!ACCOUNT_TYPE ? 'guest' : 'screening-form')

  const [user_info, set_user_info] = React.useState({
    name: '',
    name_error: false,
    email: '',
    email_error: false,
    phone: '',
    phone_error: false
  })

  const [questions, set_questions] = React.useState({
    cough: null,
    fever: null,
    exposure: null
  })

  const handle_click = () => {
    if (view === 'guest') {
      if (user_info.name && user_info.email && user_info.phone) {
        set_view('screening-form')
      } else {
        set_user_info({
          ...user_info,
          name_error: !user_info.name,
          email_error: !user_info.email,
          phone_error: !user_info.phone
        })
      }
    } else if (view === 'screening-form') {
      const { cough, fever, exposure } = questions

      if (cough === null || fever === null || exposure === null || ((!PHONE || PHONE === '[]') && !user_info.phone)) {
        if (!user_info.phone) {
          set_user_info({...user_info, phone_error: true})
        }
        return
      }
      submit_form(user_info, questions)
      set_view('submitted')
    } else {
      console.error('Unkown view selected')
    }
  }

  return (
    <Card className={classes.root}>
      <CardHeader
        title='Health Screening'
        subheader='Oakland University'
      />
      <CardMedia
        className={classes.media}
        image={'/health-screening/static/covid.jpg'}
        title='Coronavirus'
      />
      <CardContent>
        {view !== 'submitted' && (
          <Typography variant='body2' color='textSecondary' component='p'>
            Anyone intending on visiting campus is required to fill out this
            health screening form beforehand.
            <br/>
            Please be aware that GHC will be notified of your response.
          </Typography>
        )}
        {view === 'guest' && (
          <UserInfo user_info={user_info} set_user_info={set_user_info} />
        )}
        {view === 'screening-form' && (
          <HealthQuestions
            questions={questions}
            set_questions={set_questions}
            user_info={user_info}
            set_user_info={set_user_info}
            view={view}
          />
        )}
        {view === 'submitted' && <FinalPage questions={questions}/>}
      </CardContent>
      <CardActions className={classes.cardActionStyle}>
        {view !== 'submitted' && (
          <Button color='secondary' variant='outlined' onClick={handle_click}>
            {view === 'guest' ? 'Next' : 'Submit'}
          </Button>
        )}
      </CardActions>
    </Card>
  )
}
