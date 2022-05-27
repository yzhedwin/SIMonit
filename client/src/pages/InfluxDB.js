
import { Grid } from '@mui/material';
import { Graph } from '../component/Graph';

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
                    <Graph query='nodered/client/memory'/>
                </Grid>
            </Grid>
        </div>

    );
}
export default InfluxDB;