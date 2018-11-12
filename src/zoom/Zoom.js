import React, { Component } from 'react';
import AddIcon from '@material-ui/icons/Add';
import RemoveIcon from '@material-ui/icons/Remove';
import Button from '@material-ui/core/Button';
import './Zoom.css'

import { withStyles } from '@material-ui/core/styles';

const styles = theme => ({
    button: {
        margin: theme.spacing.unit,
    },
});

class Zoom extends Component {

    render() {
        return (
            <div id="zoombuttons" style={{ visibility: "visible" }}>
                <Button variant="fab" color="primary" onClick={this.props.zoomIn}>
                    <AddIcon fontSize="large" />
                </Button>
                <br />
                <Button variant="fab" color="primary" onClick={this.props.zoomOut}>
                    <RemoveIcon fontSize="large" />
                </Button>
                <br />
            </div>);
    }
}

export default withStyles(styles)(Zoom);
