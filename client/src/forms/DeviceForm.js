import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import { DEFAULT_DEVICE } from "../constants";
/*
Get all devices and list in menuitem
*/

const DeviceForm = (props) => {
  const items = props.measurementList;
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
          size="small"
          label="Device"
        >
          {items.map((item) => {
            return <MenuItem value={item}>{item}</MenuItem>;
          })}
        </Select>
      </FormControl>
    </span>
  );
};
export default DeviceForm;
