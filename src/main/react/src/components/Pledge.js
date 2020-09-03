import React from 'react'
import Collapse from '@material-ui/core/Collapse'
import DialogContent from '@material-ui/core/DialogContent'
import DialogContentText from '@material-ui/core/DialogContentText'
import Divider from '@material-ui/core/Divider'
import FormControl from '@material-ui/core/FormControl'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import FormLabel from '@material-ui/core/FormLabel'
import Radio from '@material-ui/core/Radio'
import RadioGroup from '@material-ui/core/RadioGroup'
import TextField from '@material-ui/core/TextField'
import Typography from '@material-ui/core/Typography'
import { makeStyles } from '@material-ui/core/styles'
import { useSelector, useDispatch } from 'react-redux'
import {
  update_face_covering,
  update_good_hygiene,
  update_distancing,
  update_supervisor_email,
  update_student_employee
} from '../actions/main-actions'
import {account_types} from '../utils/enums'

const useStyles = makeStyles((theme) => ({
  radioGroup: {
    flexDirection: 'row',
  },
  phoneDivider: {
    marginBottom: 20,
  },
  formLabel: {
    marginBottom: '0px !important',
    border: 'none',
  },
  phoneLabel: {
    marginTop: 20,
  },
  emailDivider: {
    marginTop: 10
  },
  emailLabel: {
    marginTop: 10,
    marginBottom: 13
  },
  formLabel2: {
    marginBottom: '0px !important',
    marginTop: 20,
    border: 'none'
  },
}))

export default function Pledge(props) {
  const classes = useStyles()
  const dispatch = useDispatch()

  const {
    face_covering,
    good_hygiene,
    distancing,
    account_type,
    supervisor_email,
    supervisor_email_error,
    student_employee, } = useSelector((state) => state)

  return (
    <>
      <DialogContent>
        <DialogContentText>
          As a member of the OU community, it is my responsibility to enhance
          the health and safety of our campus. I therefore pledge to abide by
          the OU guidelines to reduce the spread of the Coronavirus and to take
          measures to protect myself; to protect others; and to protect my
          community.
        </DialogContentText>
        <Divider className={classes.phoneDivider} />
        <FormControl component='fieldset'>
          <FormLabel className={classes.formLabel} component='legend'>
            I will wear my face-covering as per OU guidelines?
          </FormLabel>
          <RadioGroup
            aria-label='face-covering'
            name='face_covering'
            value={face_covering}
            onChange={(event) =>
              dispatch(update_face_covering(event.target.value === 'true'))
            }
            className={classes.radioGroup}
          >
            <FormControlLabel value={true} control={<Radio />} label='Yes' />
            <FormControlLabel value={false} control={<Radio />} label='No' />
          </RadioGroup>
          <FormLabel className={classes.formLabel} component='legend'>
            I will practice good hygiene as per OU guidelines?
          </FormLabel>
          <RadioGroup
            aria-label='good hygiene'
            name='good_hygiene'
            value={good_hygiene}
            onChange={(event) =>
              dispatch(update_good_hygiene(event.target.value === 'true'))
            }
            className={classes.radioGroup}
          >
            <FormControlLabel value={true} control={<Radio />} label='Yes' />
            <FormControlLabel value={false} control={<Radio />} label='No' />
          </RadioGroup>
          <FormLabel className={classes.formLabel} component='legend'>
            I will practice safe physical distancing as per OU guidelines?
          </FormLabel>
          <RadioGroup
            aria-label='physical distancing'
            name='distancing'
            value={distancing}
            onChange={(event) =>
              dispatch(update_distancing(event.target.value === 'true'))
            }
            className={classes.radioGroup}
          >
            <FormControlLabel value={true} control={<Radio />} label='Yes' />
            <FormControlLabel value={false} control={<Radio />} label='No' />
          </RadioGroup>
        </FormControl>
        
        {(face_covering === false ||
          good_hygiene === false ||
          distancing === false) && (
            <>
            <Divider className={classes.phoneDivider} />
            <DialogContentText>
              NOTE: If you answer 'no' to any of the above questions, you won't be
              allowed on campus for the day
            </DialogContentText>
            </>
          )}
          <Divider className={classes.emailDivider} />
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
                {`Are you a${account_type === account_types.STUDENT ? ' student' : 'n'} employee of OU who is planning on working today?`}
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
                  type='email'
                  error={supervisor_email_error}
                  value={supervisor_email}
                  onChange={(event) => dispatch(update_supervisor_email(event.target.value))}
                />
              </Collapse>
            </>
          )}
      </DialogContent>
    </>
  )
}
