import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import CardContent from '@material-ui/core/CardContent'
import Typography from '@material-ui/core/Typography'
import Radio from '@material-ui/core/Radio'
import RadioGroup from '@material-ui/core/RadioGroup'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import FormControl from '@material-ui/core/FormControl'
import FormLabel from '@material-ui/core/FormLabel'

const useStyles = makeStyles((theme) => ({
  radioGroup: {
    disaply: 'flex',
    flexDirection: 'row',
  },
}))

export default function HealthQuestions() {
  const classes = useStyles()

  const [cough, set_cough] = React.useState(false)
  const [fever, set_fever] = React.useState(false)
  const [contact, set_contact] = React.useState(false)

  return (
    <>
      <CardContent>
        <Typography paragraph>
          Answer all of the following questions to the best of your knowledge:
        </Typography>

        <FormControl component='fieldset'>
          <FormLabel component='legend'>
            Do you have a cough (or change in a chronic cough) or shortness of
            breath?
          </FormLabel>
          <RadioGroup
            aria-label='cough'
            name='cough'
            value={cough}
            onChange={(event) => set_cough(event.target.value)}
            className={classes.radioGroup}
          >
            <FormControlLabel value='true' control={<Radio />} label='Yes' />
            <FormControlLabel value='false' control={<Radio />} label='No' />
          </RadioGroup>
          <FormLabel component='legend'>
            Do you have a fever of 100° F (37.8° C) or higher?
          </FormLabel>
          <RadioGroup
            aria-label='gender'
            name='gender1'
            value={fever}
            onChange={(event) => set_fever(event.target.value)}
            className={classes.radioGroup}
          >
            <FormControlLabel value='yesb' control={<Radio />} label='Yes' />
            <FormControlLabel value='no' control={<Radio />} label='No' />
          </RadioGroup>
          <FormLabel component='legend'>
            Have you had close contact with someone diagnosed with COVID-19
            within the past 14 days?
          </FormLabel>
          <RadioGroup
            aria-label='gender'
            name='gender1'
            value={contact}
            onChange={(event) => set_contact(event.target.value)}
            className={classes.radioGroup}
          >
            <FormControlLabel value='yesc' control={<Radio />} label='Yes' />
            <FormControlLabel value='not' control={<Radio />} label='No' />
          </RadioGroup>
        </FormControl>
      </CardContent>
    </>
  )
}
