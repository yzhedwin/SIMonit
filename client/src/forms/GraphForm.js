import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import { GraphType } from "../constants";

const GraphForm = (props) => {
  return (
    <>
      <FormControl sx={{ m: 1 }}>
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
          <MenuItem value={GraphType.BAND}>Band</MenuItem>
          <MenuItem value={GraphType.LINE}>Line</MenuItem>
          <MenuItem value={GraphType["SINGLE STAT"]}>Single Stat</MenuItem>
          <MenuItem value={GraphType.BAR}>Histogram</MenuItem>
        </Select>
      </FormControl>
    </>
  );
};
export default GraphForm;
