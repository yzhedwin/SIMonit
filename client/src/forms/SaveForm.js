import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";

const SaveForm = (props) => {
  const keys = Object.keys(props?.saves);
  return (
    <>
      <FormControl sx={{m:1, minWidth: 150, backgroundColor: "white", borderRadius: 1 }}>
        <InputLabel id="select">[<b>Load Save</b>]</InputLabel>
        <Select
          labelId="select"
          id="select"
          value=''
          onChange={props.onChange}
          autoWidth
          label="Select Save"
          size="small"
        >
          {keys?.map((item) => {
            return (
              <MenuItem key={keys?.indexOf(item)} value={props.saves[item]}>
                {props.saves[item].name}
              </MenuItem>
            );
          })}
        </Select>
      </FormControl>
    </>
  );
};
export default SaveForm;
