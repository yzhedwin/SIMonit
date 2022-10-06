import * as React from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import SaveAltIcon from "@mui/icons-material/SaveAlt";

export default function FormDialog(props) {
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleCancel = () => {
    setOpen(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault()
    console.log(e.target[0].value);
    props.onSave(e.target[0].value);
    setOpen(false);
  };

  return (
    <div>
      <Button variant="contained" color="primary" onClick={handleClickOpen}>
        <SaveAltIcon />
      </Button>
      <Dialog open={open} onClose={handleCancel}>
        <DialogTitle>Save</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Please enter a save name for the current layout
          </DialogContentText>
          <form id="saveform" onSubmit={handleSubmit}>
            <TextField
              autoFocus
              margin="dense"
              id="name"
              label="Save Name"
              type="name"
              fullWidth
              variant="standard"
            />
          </form>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancel}>Cancel</Button>
          <Button type="submit" form="saveform">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
