import React, { Component } from 'react';
import CancelIcon from '@material-ui/icons/Cancel';
import IconButton from '@material-ui/core/IconButton';
import InfiniteCalendar from 'react-infinite-calendar';
import 'react-infinite-calendar/styles.css';
import './Sidebar.css'
import Slide from '@material-ui/core/Slide';

class Sidebar extends Component {

    render() {

        const blogStart = new Date(2015, 0, 1);
        const today = new Date();
        const todayPlus1Month = new Date();
        todayPlus1Month.setMonth(today.getMonth() + 1);
        const cancelButtonStyle = { position: "absolute", top: 0, right: 0, zIndex: 1 };
        return (
            <Slide in={this.props.showSidebar} direction="right">
                <div id="sidebar" style={this.props.style}>
                    <div id="calendar">
                        <InfiniteCalendar
                            width={"100%"}
                            height={window.innerHeight}
                            bottom={0}
                            min={blogStart}
                            max={todayPlus1Month}
                            minDate={blogStart}
                            maxDate={today}
                            onSelect={this.props.onDateSelected}
                        />
                    </div>
                    <div id="cancelbutton">
                        <IconButton style={cancelButtonStyle} size="large" onClick={this.props.onCancelSidebar} >
                            <CancelIcon fontSize="large" />
                        </IconButton>
                    </div>
                </div>
            </Slide >
        );
    }

    componentWillUnmount() {
        console.log("unmounting sidebar")
    }
}

export default Sidebar;