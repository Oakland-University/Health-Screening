import React, { useEffect, useState } from 'react'
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
import BannerCard from './components/BannerCard'
import { useMediaQuery, useTheme, Dialog } from '@material-ui/core'
import { useSelector, useDispatch } from 'react-redux'
import {
  fetch_past_submission,
  press_modal_button,
} from './actions/main-actions'

const useStyles = makeStyles((theme) => ({
  media: {
    paddingTop: '25%', // 16:9
    height: 0,
  },
  cardActionStyle: {
    display: 'flex',
    justifyContent: 'flex-end',
  },
}))

export default function App() {
  const classes = useStyles()
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(fetch_past_submission())
  }, [dispatch])

  const theme = useTheme()
  const full_screen = useMediaQuery(theme.breakpoints.down('sm'))

  const modal_page = useSelector((state) => state.modal_page)
  const user_status = useSelector((state) => state.user_status)

  const [modal_open, set_modal_open] = useState(false)

  const overflow_style = full_screen ? {overflowY: 'scroll'} : {}


  useEffect(() => {
    set_modal_open(
      user_status === 'not-completed' || modal_page === 'submitted'
    )
  }, [user_status, modal_page])

  return (
    <>
      <Dialog
        fullScreen={full_screen}
        open={modal_open}
        onClose={() => set_modal_open(false)}
      >
        <Card className={classes.root} style={overflow_style}>
          <CardHeader title='Health Screening' subheader='Oakland University' />
          <CardMedia
            className={classes.media}
            image={'/health-screening/static/multiple-covid.jpg'}
            title='Coronavirus'
          />
          <CardContent>
            {modal_page !== 'submitted' && (
              <Typography variant='body2' color='textSecondary' component='p'>
                Anyone intending on visiting campus is required to fill out this
                health screening form beforehand.
                <br />
                Please be aware that GHC will be notified of your response.
              </Typography>
            )}
            {modal_page === 'user-info' && <UserInfo />}
            {modal_page === 'health-screening' && (
              <HealthQuestions view={modal_page} />
            )}
            {modal_page === 'submitted' && <FinalPage />}
          </CardContent>
          <CardActions className={classes.cardActionStyle}>
              <Button
                color='secondary'
                variant='outlined'
                onClick={() => set_modal_open(false)}
              >
                Close
              </Button>
            {modal_page !== 'submitted' && (
              <Button
                color='secondary'
                variant='outlined'
                onClick={() => dispatch(press_modal_button())}
              >
                {modal_page === 'user-info' ? 'Next' : 'Submit'}
              </Button>
            )}
          </CardActions>
        </Card>
      </Dialog>
      <BannerCard type={user_status} set_modal_open={set_modal_open} />
    </>
  )
}
