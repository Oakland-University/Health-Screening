import React, { useEffect, useState } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import DialogActions from '@material-ui/core/DialogActions'
import Button from '@material-ui/core/Button'
import Typography from '@material-ui/core/Typography'
import ComingToCampus from './components/ComingToCampus'
import HealthQuestions from './components/HealthQuestions'
import UserInfo from './components/UserInfo'
import FinalPage from './components/FinalPage'
import Pledge from './components/Pledge'
import BannerCard from './components/BannerCard'
import {
  useMediaQuery,
  useTheme,
  Dialog,
  DialogTitle,
  DialogContent,
} from '@material-ui/core'
import { useSelector, useDispatch } from 'react-redux'
import {
  fetch_past_submission,
  press_modal_button,
  close_modal,
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
  const full_screen = useMediaQuery(theme.breakpoints.down('xs'))

  const modal_page = useSelector((state) => state.modal_page)
  const user_status = useSelector((state) => state.user_status)

  const [modal_open, set_modal_open] = useState(false)

  useEffect(() => {
    set_modal_open(
      user_status === 'not-completed' || modal_page === 'submitted'
    )
  }, [user_status, modal_page])

  const title =
    modal_page === 'pledge' ? 'Coronavirus Honor Pledge' : 'OU Health Screening'

  const handle_close = () => {
    set_modal_open(false)
    dispatch(close_modal())
  }

  return (
    <>
      <Dialog
        fullScreen={full_screen}
        open={modal_open}
        scroll='paper'
        onClose={handle_close}
      >
        <DialogTitle>{title}</DialogTitle>
        <DialogContent>
          {modal_page !== 'submitted' && modal_page !== 'pledge' && (
            <Typography variant='body2' color='textSecondary' component='p'>
              Anyone intending on visiting campus is required to fill out this
              health screening form beforehand.
              <br />
              Please be aware that GHC will be notified of your response.
            </Typography>
          )}
          {modal_page === 'pledge' && <Pledge />}
          {modal_page === 'campus-check' && <ComingToCampus />}
          {modal_page === 'user-info' && <UserInfo />}
          {modal_page === 'health-screening' && (
            <HealthQuestions view={modal_page} />
          )}
          {modal_page === 'submitted' && <FinalPage />}
        </DialogContent>
        <DialogActions className={classes.cardActionStyle}>
          <Button color='secondary' onClick={() => set_modal_open(false)}>
            Close
          </Button>
          {modal_page !== 'submitted' && (
            <Button
              color='secondary'
              onClick={() => dispatch(press_modal_button())}
            >
              {modal_page === 'health-screening' ? 'Submit' : 'Next'}
            </Button>
          )}
        </DialogActions>
      </Dialog>
      <BannerCard type={user_status} set_modal_open={set_modal_open} />
    </>
  )
}
