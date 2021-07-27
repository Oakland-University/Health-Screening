import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import CardContent from '@material-ui/core/CardContent'
import Typography from '@material-ui/core/Typography'
import Radio from '@material-ui/core/Radio'
import Checkbox from '@material-ui/core/Checkbox'
import RadioGroup from '@material-ui/core/RadioGroup'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import FormControl from '@material-ui/core/FormControl'
import Collapse from '@material-ui/core/Collapse'
import FormLabel from '@material-ui/core/FormLabel'
import TextField from '@material-ui/core/TextField'
import Divider from '@material-ui/core/Divider'
import { useSelector, useDispatch } from 'react-redux'
import {
  update_congestion,
  update_cough,
  update_diarrhea,
  update_exposure,
  update_fever,
  update_headache,
  update_loss_of_taste_or_smell,
  update_muscle_ache,
  update_nausea,
  update_phone,
  update_short_of_breath,
  update_sore_throat,
  update_confirmation,
  update_fully_vaccinated,
  update_tested_positive,
  update_supervisor_email,
  update_student_employee,
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
    coughing,
    feverish,
    exposed,
    phone,
    phone_error,
    short_of_breath,
    congested,
    diarrhea,
    headache,
    loss_of_taste_or_smell,
    muscle_ache,
    nauseous,
    sore_throat,
    confirmation,
    tested_positive,
    fully_vaccinated,
  } = useSelector((state) => state)

  return (
    <>
      <CardContent>
        <Typography paragraph>In the past 48 hours have you had any of these symptoms:</Typography>
        <FormControl component='fieldset'>
          <FormLabel className={classes.formLabel} component='legend'>
            Fever (100.4 or higher) or feeling feverish or chills
          </FormLabel>
          <RadioGroup
            aria-label='fever'
            name='fever'
            value={feverish}
            onChange={(event) => dispatch(update_fever(event.target.value === 'true'))}
            className={classes.radioGroup}
          >
            <FormControlLabel value={true} control={<Radio />} label='Yes' />
            <FormControlLabel value={false} control={<Radio />} label='No' />
          </RadioGroup>

          <FormLabel className={classes.formLabel} component='legend'>
            Uncontrolled cough that you cannot attribute to another health condition (example:
            allergies, asthma)
          </FormLabel>
          <RadioGroup
            aria-label='cough'
            name='cough'
            value={coughing}
            onChange={(event) => dispatch(update_cough(event.target.value === 'true'))}
            className={classes.radioGroup}
          >
            <FormControlLabel value={true} control={<Radio />} label='Yes' />
            <FormControlLabel value={false} control={<Radio />} label='No' />
          </RadioGroup>

          <FormLabel className={classes.formLabel} component='legend'>
            Shortness of breath you cannot attribute to another health condition (example: asthma)
          </FormLabel>
          <RadioGroup
            aria-label='shortness of breath'
            name='short_of_breath'
            value={short_of_breath}
            onChange={(event) => dispatch(update_short_of_breath(event.target.value === 'true'))}
            className={classes.radioGroup}
          >
            <FormControlLabel value={true} control={<Radio />} label='Yes' />
            <FormControlLabel value={false} control={<Radio />} label='No' />
          </RadioGroup>

          <FormLabel className={classes.formLabel} component='legend'>
            Sore throat you cannot attribute to another health condition (example: allergies)
          </FormLabel>
          <RadioGroup
            aria-label='sore throat'
            name='sore_throat'
            value={sore_throat}
            onChange={(event) => dispatch(update_sore_throat(event.target.value === 'true'))}
            className={classes.radioGroup}
          >
            <FormControlLabel value={true} control={<Radio />} label='Yes' />
            <FormControlLabel value={false} control={<Radio />} label='No' />
          </RadioGroup>

          <FormLabel className={classes.formLabel} component='legend'>
            Nasal congestion or runny nose you cannot attribute to another health condition
            (example: allergies)
          </FormLabel>
          <RadioGroup
            aria-label='nasal congestion'
            name='congestion'
            value={congested}
            onChange={(event) => dispatch(update_congestion(event.target.value === 'true'))}
            className={classes.radioGroup}
          >
            <FormControlLabel value={true} control={<Radio />} label='Yes' />
            <FormControlLabel value={false} control={<Radio />} label='No' />
          </RadioGroup>

          <FormLabel className={classes.formLabel} component='legend'>
            Muscle aches you cannot attribute to another health condition (example: injury,
            exercise)
          </FormLabel>
          <RadioGroup
            aria-label='muscle aches'
            name='muscle_ache'
            value={muscle_ache}
            onChange={(event) => dispatch(update_muscle_ache(event.target.value === 'true'))}
            className={classes.radioGroup}
          >
            <FormControlLabel value={true} control={<Radio />} label='Yes' />
            <FormControlLabel value={false} control={<Radio />} label='No' />
          </RadioGroup>

          <FormLabel className={classes.formLabel} component='legend'>
            Loss of taste or smell that is new and you cannot attribute to another health condition
          </FormLabel>
          <RadioGroup
            aria-label='loss of taste or smell'
            name='loss_of_taste_or_smell'
            value={loss_of_taste_or_smell}
            onChange={(event) =>
              dispatch(update_loss_of_taste_or_smell(event.target.value === 'true'))
            }
            className={classes.radioGroup}
          >
            <FormControlLabel value={true} control={<Radio />} label='Yes' />
            <FormControlLabel value={false} control={<Radio />} label='No' />
          </RadioGroup>

          <FormLabel className={classes.formLabel} component='legend'>
            Headache that you cannot attribute to another health condition
          </FormLabel>
          <RadioGroup
            aria-label='headache'
            name='headache'
            value={headache}
            onChange={(event) => dispatch(update_headache(event.target.value === 'true'))}
            className={classes.radioGroup}
          >
            <FormControlLabel value={true} control={<Radio />} label='Yes' />
            <FormControlLabel value={false} control={<Radio />} label='No' />
          </RadioGroup>

          <FormLabel className={classes.formLabel} component='legend'>
            Diarrhea you cannot attribute to another health condition (example: IBS)
          </FormLabel>
          <RadioGroup
            aria-label='diarrhea'
            name='diarrhea'
            value={diarrhea}
            onChange={(event) => dispatch(update_diarrhea(event.target.value === 'true'))}
            className={classes.radioGroup}
          >
            <FormControlLabel value={true} control={<Radio />} label='Yes' />
            <FormControlLabel value={false} control={<Radio />} label='No' />
          </RadioGroup>

          <FormLabel className={classes.formLabel} component='legend'>
            Nausea or vomiting that you cannot attribute to another health condition (example:
            pregnancy)
          </FormLabel>
          <RadioGroup
            aria-label='nausea or vomiting'
            name='nausea'
            value={nauseous}
            onChange={(event) => dispatch(update_nausea(event.target.value === 'true'))}
            className={classes.radioGroup}
          >
            <FormControlLabel value={true} control={<Radio />} label='Yes' />
            <FormControlLabel value={false} control={<Radio />} label='No' />
          </RadioGroup>

          <Divider className={classes.divider} />

          <Typography paragraph className={classes.phoneLabel}>
            Answer the following to the best of your knowledge:
          </Typography>

          <FormLabel className={classes.formLabel} component='legend'>
            Have you tested positive for COVID-19 in the past 10 days? (Only a viral test, not a
            blood antibody test)
          </FormLabel>
          <RadioGroup
            aria-label='positive-test'
            name='positive-test'
            value={tested_positive}
            onChange={(event) => dispatch(update_tested_positive(event.target.value === 'true'))}
            className={classes.radioGroup}
          >
            <FormControlLabel value={true} control={<Radio />} label='Yes' />
            <FormControlLabel value={false} control={<Radio />} label='No' />
          </RadioGroup>

          <Divider className={classes.divider} />

          <FormLabel className={classes.formLabel} component='legend'>
            Have you had known, unprotected exposure (for healthcare workers) or close contact
            (within 6 feet for 15 minutes or longer) with someone diagnosed with COVID-19 in the
            past 14 days?
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
          <Collapse in={exposed} unmountOnExit>
            <FormLabel className={classes.formLabel} component='legend'>
              Vaccination Status:
            </FormLabel>
            <RadioGroup
              aria-label='vaccination status'
              name='vaccination status'
              value={fully_vaccinated}
              onChange={(event) => dispatch(update_fully_vaccinated(event.target.value === 'true'))}
              className={classes.radioGroup}
            >
              <FormControlLabel
                value={true}
                control={<Radio />}
                label='I am fully vaccinated and my final dose was over 14 days ago'
              />
              <FormControlLabel
                value={false}
                control={<Radio />}
                label='I have not completed a COVID vaccine series, or it has been less than 14 days since my final dose'
              />
            </RadioGroup>
          </Collapse>
          <Divider className={classes.divider} />
          <div className={classes.confirmationDiv}>
            <Checkbox
              className={classes.confirmationCheck}
              checked={confirmation}
              onChange={(event) => dispatch(update_confirmation(event.target.checked))}
              inputProps={{ 'aria-label': 'primary checkbox' }}
            />
            <FormLabel className={classes.formLabel} component='legend'>
              By checking this box, you confirm that your responses are accurate to the best of your
              knowledge
            </FormLabel>
          </div>

          <Divider className={classes.divider} />

          <Typography paragraph className={classes.phoneLabel}>
            The Graham Health Center might want to get in contact with you. Please fill out a good
            phone number to reach you.
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
          <Divider className={classes.divider} />
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
                } employee of OU who is planning on working today?`}
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
        </FormControl>
      </CardContent>
    </>
  )
}
