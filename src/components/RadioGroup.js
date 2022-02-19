import * as React from 'react';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';

export default function ControlledRadioButtonsGroup(props) {
  const [value, setValue] = React.useState('BFS');

  const handleChange = (event) => {
    setValue(event.target.value);
    props.callbackValue(event.target.value);
  };

  return (
      <>
    <FormControl>
      <FormLabel >Selecione o Algoritmo</FormLabel>
      <RadioGroup
        row
        name="algorithm-radio-group"
        value={value}
        onChange={handleChange}
      >
        <FormControlLabel value="BFS" control={<Radio />} label="BFS" />
        <FormControlLabel value="Djikstra" control={<Radio />} label="Djikstra" />
      </RadioGroup>
    </FormControl>
    </>
  );
}