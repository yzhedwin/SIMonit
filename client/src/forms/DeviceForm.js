import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
/*
Get all devices and list in menuitem
*/

const DeviceForm = (props) => {
  const items = props?.deviceList;
  return (
    <>
      <FormControl sx={{ m: 1, }}>
        <InputLabel id="select">Device</InputLabel>
        <Select
          labelId="select"
          id="select"
          value={props.device?.name || props.device}
          onChange={props.onChange}
          autoWidth
          size="small"
          label="Device"
        >
          {items?.map((item) => {
            return (
              <MenuItem key={items?.indexOf(item)} value={item?.name}>
                {item?.name}
              </MenuItem>
            );
          })}
        </Select>
      </FormControl>
    </>
  );
};
export default DeviceForm;
