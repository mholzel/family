import React, { Component } from 'react';
import CancelIcon from '@material-ui/icons/Cancel';
import IconButton from '@material-ui/core/IconButton';
import InfiniteCalendar from 'react-infinite-calendar';
import 'react-infinite-calendar/styles.css';
import './Sidebar.css'

class Sidebar extends Component {

    render() {

        const blogStart = new Date(2015, 0, 1);
        const today = new Date();
        const todayPlus1Month = new Date();
        todayPlus1Month.setMonth(today.getMonth() + 1);
        const cancelButtonStyle = { position: "absolute", top: 0, right: 0, zIndex: 1 };
        return (
            <div id="sidebar" style={{ visibility: this.props.showSidebar ? "visible" : "hidden" }}>
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
                <div position="relative">
                    <IconButton style={cancelButtonStyle} size="large" onClick={this.props.onCancelSidebar} >
                        <CancelIcon fontSize="large" />
                    </IconButton>
                </div>
            </div>);
    }

    componentWillUnmount() {
        console.log("unmounting sidebar")
    }
}

export default Sidebar;