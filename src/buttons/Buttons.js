import React, { Component } from 'react';
import DateRangeIcon from '@material-ui/icons/DateRange';
import AddIcon from '@material-ui/icons/Add';
import RemoveIcon from '@material-ui/icons/Remove';
import SettingsIcon from '@material-ui/icons/Settings';
import Button from '@material-ui/core/Button';
import './Buttons.css'
import Slide from '@material-ui/core/Slide';

import { withStyles } from '@material-ui/core/styles';

const styles = theme => ({
    button: {
        margin: theme.spacing.unit,
    },
});

class Buttons extends Component {

    state = {
        expanded: false,
    };

    onToggleButtons = () => {
        this.setState(state => ({ expanded: !state.expanded }));
    }

    render() {
        return (
            <div id="buttons">
                <Slide in={this.state.expanded} direction="up">
                    <div style={this.props.style}>
                        <Button variant="fab" color="primary" onClick={this.props.toggleCalendar} style={{ display: "block" }} >
                            <DateRangeIcon fontSize="large" />
                        </Button>
                        <Button variant="fab" color="primary" onClick={this.props.zoomIn} style={{ display: "block" }}>
                            <AddIcon fontSize="large" />
                        </Button>
                        <Button variant="fab" color="primary" onClick={this.props.zoomOut} style={{ display: "block" }}>
                            <RemoveIcon fontSize="large" />
                        </Button>
                    </div>
                </Slide>
                <Button variant="fab" color="primary" onClick={this.onToggleButtons} style={{ display: "block" }}>
                    <SettingsIcon fontSize="large" />
                </Button>
            </div>);
    }
}

export default withStyles(styles)(Buttons);

