
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
                <Grid item>
                    <Graph query='nodered/client/memory' graphType='band' device='device1'/>
                </Grid>
            </Grid>
        </div>

    );
}
export default InfluxDB;