import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import CardContent from '@material-ui/core/CardContent'
import Divider from '@material-ui/core/Divider'
import Radio from '@material-ui/core/Radio'
import RadioGroup from '@material-ui/core/RadioGroup'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import FormControl from '@material-ui/core/FormControl'
import FormLabel from '@material-ui/core/FormLabel'
import DialogContent from '@material-ui/core/DialogContent'
import { useSelector, useDispatch } from 'react-redux'
import {
  update_face_covering,
  update_good_hygiene,
  update_distancing,
  update_pledge,
} from '../actions/main-actions'

const useStyles = makeStyles((theme) => ({
  radioGroup: {
    flexDirection: 'row',
  },
  phoneDivider: {
    marginBottom: 20,
  },
  phoneLabel: {
    marginTop: 20,
  },
}))

export default function Pledge(props) {
  const classes = useStyles()
  const dispatch = useDispatch()

  const {
    face_covering,
    good_hygiene,
    distancing,
    pledge_agreement,
  } = useSelector((state) => state)

  return (
    <>
      <DialogContent>
        <FormLabel className={classes.formLabel} component='legend'>
          As a member of the OU community, it is my responsibility to enhance
          the health and safety of our campus. I therefore pledge to abide by
          the OU guidelines to reduce the spread of the coronavirus and to take
          measures to protect myself; to protect others; and to protect my
          community.
        </FormLabel>
        <RadioGroup
          aria-label='pledge agreement'
          style={{ justifyContent: 'space-around' }}
          name='pledge'
          value={pledge_agreement}
          onChange={(event) =>
            dispatch(update_pledge(event.target.value === 'true'))
          }
          className={classes.radioGroup}
        >
          <FormControlLabel value={true} control={<Radio />} label='Agree' />
          <FormControlLabel
            value={false}
            control={<Radio />}
            label='Disagree'
          />
        </RadioGroup>
        <Divider className={classes.phoneDivider} />
        <FormControl component='fieldset'>
          <FormLabel className={classes.formLabel} component='legend'>
            Do you have a face-covering?
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
            Are you practicing good hygiene?
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
            Are you willing to practice physical distancing?
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
      </DialogContent>
    </>
  )
}
