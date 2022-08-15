import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";

const GatewayForm = (props) => {
  return (
    <span>
      <FormControl sx={{ m: 1, minWidth: 80 }}>
        <InputLabel id="select">Metric</InputLabel>
        <Select
          labelId="select"
          id="select"
          value={props.gateway}
          onChange={props.onChange}
          autoWidth
          label="Metric"
          size="small"
        >
        </Select>
      </FormControl>
    </span>
  );
};
export default GatewayForm;
