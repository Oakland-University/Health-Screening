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
import Divider from '@material-ui/core/Divider';

const useStyles = makeStyles(theme => ({
  radioGroup: {
    flexDirection: 'row'
  },
  formLabel: {
    marginBottom: '0px !important',
    border: 'none'
  },
  phoneDivider: {
    marginTop: 20
  },
  phoneLabel: {
    marginTop: 20
  }
}))


/*global PHONE*/
/*global ACCOUNT_TYPE*/

export default function HealthQuestions(props) {
  const classes = useStyles()

  const has_phone = (!ACCOUNT_TYPE || (!!PHONE && PHONE !== '[]'))

  const {
    cough,
    fever,
    exposure,
  } = props.questions

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
            onChange={event =>
              props.set_questions({
                ...props.questions,
                cough: event.target.value === 'true'
              })
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
            onChange={event =>
              props.set_questions({
                ...props.questions,
                fever: event.target.value === 'true'
              })
            }
            className={classes.radioGroup}
          >
            <FormControlLabel value={true} control={<Radio />} label='Yes' />
            <FormControlLabel value={false} control={<Radio />} label='No' />
          </RadioGroup>
          <FormLabel className={classes.formLabel} component='legend'>
            Have you had close contact with someone diagnosed with COVID-19
            within the past 14 days?
          </FormLabel>
          <RadioGroup
            aria-label='exposure'
            name='exposure'
            value={exposure}
            onChange={event =>
              props.set_questions({
                ...props.questions,
                exposure: event.target.value === 'true'
              })
            }
            className={classes.radioGroup}
          >
            <FormControlLabel value={true} control={<Radio />} label='Yes' />
            <FormControlLabel value={false} control={<Radio />} label='No' />
          </RadioGroup>
          {!has_phone &&
           <>
             <Divider className={classes.phoneDivider}/>
             <Typography paragraph className={classes.phoneLabel}>
              It looks like we don't have your phone number on file. Please fill it out below.
            </Typography>
            <TextField
              required
              error={props.user_info.phone_error}
              id='outlined-required'
              label='Phone Number'
              variant='outlined'
              value={props.user_info.phone}
              onChange={event =>
                props.set_user_info({
                  ...props.user_info,
                  phone: event.target.value
                })
              }
            />
           </>
          }
        </FormControl>
      </CardContent>
    </>
  )
}
