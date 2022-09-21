import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
/*
Get all devices and list in menuitem
*/

const GatewayForm = (props) => {
  const items = props.gatewayList;
  return (
    <>
      <FormControl sx={{ m: 1, minWidth: 80 }}>
        <InputLabel id="select">Gateway</InputLabel>
        <Select
          labelId="select"
          id="select"
          value={props.gateway.edge_id}
          onChange={props.onChange}
          autoWidth
          size="small"
          label="Gateway"
        >
          {items.map((item) => {
            return (
              <MenuItem key={items.indexOf(item)} value={item.edge_id}>
                {item.edge_id}
              </MenuItem>
            );
          })}
        </Select>
      </FormControl>
    </>
  );
};
export default GatewayForm;
