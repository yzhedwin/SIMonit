import UploadIcon from '@mui/icons-material/Upload';
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import TextField from "@mui/material/TextField";
import Tooltip from "@mui/material/Tooltip";
import * as React from "react";

export default function FormDialog(props) {
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleCancel = () => {
    setOpen(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(e.target[0].value);
    props.onSave(e.target[0].value);
    setOpen(false);
  };

  return (
    <div>
      <Tooltip title="Save Current Layout">
        <Button variant="contained" color="primary" onClick={handleClickOpen}>
          <UploadIcon />
        </Button>
      </Tooltip>
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
