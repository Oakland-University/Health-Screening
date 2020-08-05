import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import CardContent from '@material-ui/core/CardContent'
import Typography from '@material-ui/core/Typography'
import Radio from '@material-ui/core/Radio'
import RadioGroup from '@material-ui/core/RadioGroup'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import FormControl from '@material-ui/core/FormControl'
import FormLabel from '@material-ui/core/FormLabel'
import TextField from '@material-ui/core/TextField'
import Divider from '@material-ui/core/Divider'
import Collapse from '@material-ui/core/Collapse'
import { useSelector, useDispatch } from 'react-redux'
import {
  update_cough,
  update_exposure,
  update_fever,
  update_phone,
  update_supervisor_email,
  update_student_employee
} from '../actions/main-actions'

const useStyles = makeStyles((theme) => ({
  radioGroup: {
    flexDirection: 'row',
  },
  formLabel: {
    marginBottom: '0px !important',
    border: 'none',
  },
  phoneDivider: {
    marginTop: 20,
  },
  phoneLabel: {
    marginTop: 20,
  },
  formLabel2: {
    marginBottom: '0px !important',
    marginTop: 20,
    border: 'none'
  },
  emailDivider: {
    marginTop: 25
  },
  emailLabel: {
    marginTop: 10,
    marginBottom: 13
  }
}))

export default function HealthQuestions(props) {
  const classes = useStyles()
  const dispatch = useDispatch()

  const { 
    cough, 
    fever, 
    exposure, 
    phone, 
    phone_error, 
    supervisor_email,
    supervisor_email_error,
    student_employee,
    account_type
  } = useSelector((state) => state)

  return (
    <>
      <CardContent>
        <Typography paragraph>
          Answer all of the following questions to the best of your knowledge:
        </Typography>

        <FormControl component='fieldset'>
          <FormLabel className={classes.formLabel} component='legend'>
            Do you have a cough (or change in a chronic cough) or shortness of
            breath?
          </FormLabel>
          <RadioGroup
            aria-label='cough'
            name='cough'
            value={cough}
            onChange={(event) =>
              dispatch(update_cough(event.target.value === 'true'))
            }
            className={classes.radioGroup}
          >
            <FormControlLabel value={true} control={<Radio />} label='Yes' />
            <FormControlLabel value={false} control={<Radio />} label='No' />
          </RadioGroup>
          <FormLabel className={classes.formLabel} component='legend'>
            Do you have a fever of 100° F (37.8° C) or higher?
          </FormLabel>
          <RadioGroup
            aria-label='fever'
            name='fever'
            value={fever}
            onChange={(event) =>
              dispatch(update_fever(event.target.value === 'true'))
            }
            className={classes.radioGroup}
          >
            <FormControlLabel value={true} control={<Radio />} label='Yes' />
            <FormControlLabel value={false} control={<Radio />} label='No' />
          </RadioGroup>
          <FormLabel className={classes.formLabel} component='legend'>
            Have you had known close contact (within 6 feet for 15 minutes) with
            someone diagnosed with COVID-19 in the past 14 days?
          </FormLabel>
          <RadioGroup
            aria-label='exposure'
            name='exposure'
            value={exposure}
            onChange={(event) =>
              dispatch(update_exposure(event.target.value === 'true'))
            }
            className={classes.radioGroup}
          >
            <FormControlLabel value={true} control={<Radio />} label='Yes' />
            <FormControlLabel value={false} control={<Radio />} label='No' />
          </RadioGroup>
          <Divider className={classes.phoneDivider} />
          <Typography paragraph className={classes.phoneLabel}>
            The Graham Health Center might want to get in contact with you.
            Please fill out a good phone number to reach you.
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
          <Divider className={classes.emailDivider} />
          {account_type === 'staff' || account_type === 'faculty' ? (
            <>
              <Typography paragraph className={classes.phoneLabel}>
                Please provide your supervisor's email in the field below.
              </Typography>
              <TextField
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
                Are you a student employee of Oakland University?
              </FormLabel>
              <RadioGroup
                aria-label='student-employee'
                name='student-employee'
                value={student_employee}
                onChange={(event) =>
                  dispatch(update_student_employee(event.target.value === 'true'))
                }
                className={classes.radioGroup}
              >
                <FormControlLabel value={true} control={<Radio />} label='Yes' />
                <FormControlLabel value={false} control={<Radio />} label='No' />
              </RadioGroup>
              <Collapse in={student_employee} unmountOnExit>
                <Typography paragraph className={classes.emailLabel}>
                  Please provide your supervisor's email in the field below.
                </Typography>
                <TextField
                  fullWidth
                  required={student_employee}
                  label='Supervisor Email'
                  variant='outlined'
                  error={supervisor_email_error}
                  value={supervisor_email}
                  onChange={(event) => dispatch(update_supervisor_email(event.target.value))}
                />
              </Collapse>
            </>
          )}
        </FormControl>
      </CardContent>
    </>
  )
}
