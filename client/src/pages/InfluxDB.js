import { Band } from "../plotters/Band";
import { Grid } from '@mui/material';

// TODO: add menu options to choose from different examples
export const InfluxDB = () => {
    return (
        <div style={{
            width: '90%',
            padding: '10px'
        }}>
            <Grid
                container
                direction="row"
                spacing={3}
            >
                <Grid item xs={10} sm={10}>
                    <Band />
                </Grid>
            </Grid>
        </div>

    );
}
export default InfluxDB;