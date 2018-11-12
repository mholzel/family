import React, { Component } from 'react';
import DateRangeIcon from '@material-ui/icons/DateRange';
import AddIcon from '@material-ui/icons/Add';
import RemoveIcon from '@material-ui/icons/Remove';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import './Buttons.css'

import { withStyles } from '@material-ui/core/styles';

const styles = theme => ({
    button: {
        margin: theme.spacing.unit,
    },
});

class Buttons extends Component {

    render() {
        return (
            <div id="buttons" style={{ visibility: "visible" }}>
                <div>
                    <Button variant="fab" color="primary" onClick={this.props.toggleCalendar} style={{ display: "block" }} disabled={this.props.isLoading}>
                        {this.props.isLoading ? 
                        <CircularProgress color="secondary" /> :
                            <DateRangeIcon fontSize="large" />}
                    </Button>
                </div>
                <Button variant="fab" color="primary" onClick={this.props.zoomIn} style={{ display: "block" }}>
                    <AddIcon fontSize="large" />
                </Button>
                <Button variant="fab" color="primary" onClick={this.props.zoomOut} style={{ display: "block" }}>
                    <RemoveIcon fontSize="large" />
                </Button>
            </div >);
    }
}

export default withStyles(styles)(Buttons);
