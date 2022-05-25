
import { Grid } from '@mui/material';
import { PlotSelector } from '../component/PlotSelector';

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
                <Grid item xs={1} sm={1}>
                    <PlotSelector />
                </Grid>
            </Grid>
        </div>

    );
}
export default InfluxDB;