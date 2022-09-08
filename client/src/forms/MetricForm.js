import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
/*
Get all devices and list in menuitem
*/

const MetricForm = (props) => {
  if (props.metricList.length > 1) {
    const items = props.metricList;
    return (
      <>
        <FormControl sx={{ m: 1, minWidth: 80 }}>
          <InputLabel id="select">Metric</InputLabel>
          <Select
            labelId="select"
            id="select"
            value={props.metric.name}
            onChange={props.onChange}
            autoWidth
            size="small"
            label="Metric"
          >
            {items.map((item) => {
              return (
                <MenuItem key={items.indexOf(item)} value={item.name}>
                  {item.name}
                </MenuItem>
              );
            })}
          </Select>
        </FormControl>
      </>
    );
  }
  return null;
};
export default MetricForm;
