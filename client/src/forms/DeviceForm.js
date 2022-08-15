import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
/*
Get all devices and list in menuitem
*/

const DeviceForm = (props) => {
  const items = props.measurementList;
  return (
    <span>
      <FormControl sx={{ m: 1, minWidth: 80 }}>
        <InputLabel id="select">Device</InputLabel>
        <Select
          labelId="select"
          id="select"
          value={props.device}
          onChange={props.onChange}
          autoWidth
          size="small"
          label="Device"
        >
          {items.map((item) => {
            return <MenuItem key={items.indexOf(item)} value={item}>{item}</MenuItem>;
          })}
        </Select>
      </FormControl>
    </span>
  );
};
export default DeviceForm;
