import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import CardContent from '@material-ui/core/CardContent'
import Typography from '@material-ui/core/Typography'
import Radio from '@material-ui/core/Radio'
import RadioGroup from '@material-ui/core/RadioGroup'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import FormControl from '@material-ui/core/FormControl'
import Collapse from '@material-ui/core/Collapse'
import FormLabel from '@material-ui/core/FormLabel'
import TextField from '@material-ui/core/TextField'
import Divider from '@material-ui/core/Divider'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import OpenInNew from '@material-ui/icons/OpenInNew'
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction'
import ListItemText from '@material-ui/core/ListItemText'
import IconButton from '@material-ui/core/IconButton'
import { useSelector, useDispatch } from 'react-redux'
import {
  update_exposure,
  update_phone,
  update_supervisor_email,
  update_student_employee,
  update_symptomatic,
} from '../actions/main-actions'
import { account_types } from '../utils/enums'

const useStyles = makeStyles((theme) => ({
  radioGroup: {
    flexDirection: 'row',
  },
  formLabel: {
    marginBottom: '0px !important',
    marginTop: '10px',
    border: 'none',
  },
  divider: {
    marginTop: 20,
  },
  phoneLabel: {
    marginTop: 20,
  },
  confirmationDiv: {
    display: 'flex',
    marginTop: '20px',
  },
  confirmationCheck: {
    padding: '0px',
    paddingRight: '10px',
  },
  formLabel2: {
    marginBottom: '0px !important',
    marginTop: 20,
    border: 'none',
  },
}))

export default function HealthQuestions(props) {
  const classes = useStyles()
  const dispatch = useDispatch()

  const {
    account_type,
    supervisor_email,
    supervisor_email_error,
    student_employee,
    exposed,
    phone,
    phone_error,
    symptomatic,
  } = useSelector((state) => state)

  return (
    <>
      <CardContent>
        <FormControl component='fieldset'>
          <FormLabel className={classes.formLabel} component='legend'>
            Are you experiencing any of the following symptoms related to COVID-19 or have you been
            diagnosed with COVID-19 in the past 10 days?
            <br />
            (sore throat, fever, new loss of taste or smell, congestion/runny nose, cough, headache,
            nausea/vomiting, diarrhea, fatigue, muscle/body aches, shortness of breath)
          </FormLabel>
          <RadioGroup
            aria-label='positive-test'
            name='positive-test'
            value={symptomatic}
            onChange={(event) => dispatch(update_symptomatic(event.target.value === 'true'))}
            className={classes.radioGroup}
          >
            <FormControlLabel value={true} control={<Radio />} label='Yes' />
            <FormControlLabel value={false} control={<Radio />} label='No' />
          </RadioGroup>
        </FormControl>

        <FormControl component='fieldset'>
          <FormLabel className={classes.formLabel} component='legend'>
            In the last 14 days, have you had close contact to a confirmed case of COVID-19?
          </FormLabel>
          <RadioGroup
            aria-label='exposure'
            name='exposure'
            value={exposed}
            onChange={(event) => dispatch(update_exposure(event.target.value === 'true'))}
            className={classes.radioGroup}
          >
            <FormControlLabel value={true} control={<Radio />} label='Yes' />
            <FormControlLabel value={false} control={<Radio />} label='No' />
          </RadioGroup>
        </FormControl>

        <Divider className={classes.divider} />

        <FormControl component='fieldset'>
          <Typography paragraph className={classes.phoneLabel} component='legend'>
            The Graham Health Center might want to get in contact with you. Please provide a phone
            number you can be reached at today. Please do not use your OU Office phone number.
          </Typography>
          <TextField
            required
            error={phone_error}
            id='outlined-required'
            label='Phone Number'
            variant='outlined'
            value={phone}
            onChange={(event) => dispatch(update_phone(event.target.value))}
          />
        </FormControl>
        {account_type === account_types.EMPLOYEE ? (
          <>
            <Typography paragraph className={classes.phoneLabel}>
              Please provide your supervisor's email in the field below.
            </Typography>
            <TextField
              fullWidth
              required
              label='Supervisor Email'
              variant='outlined'
              error={supervisor_email_error}
              value={supervisor_email}
              onChange={(event) => dispatch(update_supervisor_email(event.target.value))}
            />
          </>
        ) : (
          <>
            <FormLabel className={classes.formLabel2} component='legend'>
              {`Are you a${
                account_type === account_types.STUDENT ? ' student' : 'n'
              } employee of OU who is planning on working today, or a guest attending an OU special program?`}
            </FormLabel>
            <RadioGroup
              aria-label='Are you an employee?'
              name='student-employee'
              value={student_employee}
              onChange={(event) => dispatch(update_student_employee(event.target.value === 'true'))}
              className={classes.radioGroup}
            >
              <FormControlLabel value={true} control={<Radio />} label='Yes' />
              <FormControlLabel value={false} control={<Radio />} label='No' />
            </RadioGroup>
            <Collapse in={student_employee} unmountOnExit>
              <Typography paragraph className={classes.emailLabel}>
                Please provide your supervisor's or program sponsor's email in the field below.
              </Typography>
              <TextField
                fullWidth
                required={student_employee}
                label='Supervisor Email'
                variant='outlined'
                type='email'
                error={supervisor_email_error}
                value={supervisor_email}
                onChange={(event) => dispatch(update_supervisor_email(event.target.value))}
              />
            </Collapse>
          </>
        )}
        <Divider className={classes.divider} />
        {account_type !== 'guest' && (
          <>
            <List>
              <ListItem>
                <ListItemText
                  primary='If you have not already done so, please upload your COVID-19 vaccine record to the Graham Health Center Secure Patient Portal, click here to be routed to the log in page.
'
                />
                <ListItemSecondaryAction>
                  <IconButton
                    href='https://myhealth.oakland.edu/home.aspx'
                    aria-label='Upload Vaccination Card'
                    target='_blank'
                    rel='noopener noreferrer'
                  >
                    <OpenInNew />
                  </IconButton>
                </ListItemSecondaryAction>
              </ListItem>
            </List>
            <Divider className={classes.divider} />
          </>
        )}
      </CardContent>
    </>
  )
}
