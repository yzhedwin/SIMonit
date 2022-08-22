import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";

const CPUForm = (props) => {
  if (props.query === "cpu") {
    const items = props.cpuList;
    return (
      <>
        <FormControl sx={{ m: 1, minWidth: 80 }}>
          <InputLabel id="select">CPU</InputLabel>
          <Select
            labelId="select"
            id="select"
            value={props.cpuID}
            onChange={props.onChange}
            autoWidth
            size="small"
            label="CPU"
          >
          {items.map((item) => {
            return <MenuItem key={items.indexOf(item)} value={item}>{item}</MenuItem>;
          })}
          </Select>
        </FormControl>
      </>
    );
  } 
  return null;
};
export default CPUForm;
