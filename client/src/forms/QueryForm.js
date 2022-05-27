import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";

const QueryForm = (props) => {
  return (
    <span>
      <FormControl sx={{ m: 1, minWidth: 80 }}>
        <InputLabel id="select">Query</InputLabel>
        <Select
          labelId="select"
          id="select"
          value={props.query}
          onChange={props.onChange}
          autoWidth
          label="Query"
        >
          <MenuItem value={"nodered/client/memory"}>Memory</MenuItem>
          <MenuItem value={"nodered/client/eth"}>ETH</MenuItem>
          <MenuItem value={"nodered/client/uptime"}>Uptime</MenuItem>
        </Select>
      </FormControl>
    </span>
  );
};
export default QueryForm;
