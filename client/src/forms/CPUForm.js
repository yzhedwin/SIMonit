import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";

const CPUForm = (props) => {
  if (props.query === "cpu") {
    return (
      <span>
        <FormControl sx={{ m: 1, minWidth: 80 }}>
          <InputLabel id="select">CPU</InputLabel>
          <Select
            labelId="select"
            id="select"
            value={props.cpuID}
            onChange={props.onChange}
            autoWidth
            label="CPU"
          >
            <MenuItem value={"0"}>0</MenuItem>
            <MenuItem value={"1"}>1</MenuItem>
            <MenuItem value={"2"}>2</MenuItem>
            <MenuItem value={"3"}>3</MenuItem>
          </Select>
        </FormControl>
      </span>
    );
  } 
  return null;
};
export default CPUForm;
