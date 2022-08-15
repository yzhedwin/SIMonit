import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";

const DrivesForm = (props) => {
  if (props.query === "drive") {
    const items = props.driveList;
    return (
      <span>
        <FormControl sx={{ m: 1, minWidth: 80 }}>
          <InputLabel id="select">Drive</InputLabel>
          <Select
            labelId="select"
            id="select"
            value={props.drive}
            onChange={props.onChange}
            autoWidth
            size="small"
            label="Drive"
          >
          {items.map((item) => {
            return <MenuItem value={item}>{item}</MenuItem>;
          })}
          </Select>
        </FormControl>
      </span>
    );
  } 
  return null;
};
export default DrivesForm;
