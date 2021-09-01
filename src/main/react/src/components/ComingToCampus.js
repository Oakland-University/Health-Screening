import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import CardContent from '@material-ui/core/CardContent'
import Radio from '@material-ui/core/Radio'
import RadioGroup from '@material-ui/core/RadioGroup'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import FormControl from '@material-ui/core/FormControl'
import FormLabel from '@material-ui/core/FormLabel'
import { useSelector, useDispatch } from 'react-redux'
import { update_coming_to_campus } from '../actions/main-actions'

const useStyles = makeStyles((theme) => ({
  radioGroup: {
    flexDirection: 'row',
  },
  formLabel: {
    marginBottom: '0px !important',
    border: 'none',
    paddingTop: '30px',
  },
}))

export default function ComingToCampus(props) {
  const classes = useStyles()
  const dispatch = useDispatch()

  const { coming_to_campus } = useSelector((state) => state)

  return (
    <>
      <CardContent>
        <FormControl component='fieldset'>
          <FormLabel className={classes.formLabel} component='legend'>
            Are you planning to be on campus or at a clinical site today, or are you a resident
            student (currently living in on-campus housing)?
          </FormLabel>
          <RadioGroup
            aria-label='campus-visit'
            name='campus-visit'
            value={coming_to_campus}
            onChange={(event) => dispatch(update_coming_to_campus(event.target.value === 'true'))}
            className={classes.radioGroup}
          >
            <FormControlLabel value={true} control={<Radio />} label='Yes' />
            <FormControlLabel value={false} control={<Radio />} label='No' />
          </RadioGroup>
        </FormControl>
      </CardContent>
    </>
  )
}
