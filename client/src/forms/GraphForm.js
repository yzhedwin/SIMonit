import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";

const GraphForm = (props) => {
  return (
    <span>
      <FormControl sx={{ m: 1, minWidth: 80 }}>
        <InputLabel id="select">Graph Type</InputLabel>
        <Select
          labelId="select"
          id="select"
          value={props.graphType}
          onChange={props.onChange}
          autoWidth
          label="Graph Type"
          size="small"
        >
          <MenuItem value={"band"}>Band</MenuItem>
          <MenuItem value={"line"}>Line</MenuItem>
          <MenuItem value={"single stat"}>Single Stat</MenuItem>
          <MenuItem value={"bar"}>Histogram</MenuItem>
        </Select>
      </FormControl>
    </span>
  );
};
export default GraphForm;
