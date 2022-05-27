import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';


const DeviceForm = (props) => {
  return (
    <span>
      <FormControl sx={{ m: 1, minWidth: 80 }}>
        <InputLabel id="device">Device</InputLabel>
        <Select
          labelId="device"
          id="device"
          value={props.device}
          onChange={props.onChange}
          autoWidth
          label="Device"
        >
          <MenuItem value={"device1"}>Device 1</MenuItem>
          <MenuItem value={"device2"}>Device 2</MenuItem>
          <MenuItem value={"device3"}>Device 3</MenuItem>
        </Select>
      </FormControl>
    </span>
  )
}
export default DeviceForm
