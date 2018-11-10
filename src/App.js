import React, { Component } from 'react';
import Hammer from 'hammerjs';
import './App.css';
import InfiniteCalendar from 'react-infinite-calendar';
import 'react-infinite-calendar/styles.css'; // Make sure to import the default stylesheet

// TODO infinite scrolling
// TODO Pinch behavior
// TODO Date picker
// TODO Non-uniform image sizes 

const date = new Date();
const months = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'];
const month = months[date.getUTCMonth()];
const year = date.getUTCFullYear();
const imageURL = 'http://codekafana.com/family/wp-content/uploads/';
const baseURL = true ? 'http://codekafana.com/react3/' : 'http://localhost/';
const url = baseURL + 'files.php?m=' + month + '&y=' + year;
const size = '150x150';
const sizeEnding = size + '.jpg';
const today = new Date();
const blogStart = new Date(2015, 0, 1);

class Sidebar extends React.Component {

  // TODO onDateSelected
  render() {
    console.log("Rendering sidebar");
    return (<div id="sidebar">
      <InfiniteCalendar
        width={"100%"}
        minDate={blogStart}
        maxDate={today}
        onSelect={this.onDateSelected} />
    </div>);
  }
}

class App extends Component {

  state = {
    urls: [],
    scale: 25,
    showSidebar: false
  };

  onTouchStart = event => {
    if (event.touches.length >= 2) {
      this.hammer.get("pinch").set({ enable: true });
    }
  }

  onTouchEnd = event => {
    if (event.touches.length < 2) {
      this.hammer.get("pinch").set({ enable: false });
    }
  }

  render() {
    const style = { width: this.state.scale.toString() + '%' };
    console.log("Width: " + style.width);
    return (<div>
      <div className="grid" ref={elem => this.gridElement = elem} onTouchStart={this.onTouchStart} onTouchEnd={this.onTouchEnd}>
        {this.state.urls.map(entry => {
          const fullSizeUrl = imageURL + entry.slice(0, -1 - sizeEnding.length) + '.jpg'
          return (<div className="cell" key={fullSizeUrl} style={style}>
            <a href={fullSizeUrl}><img src={imageURL + entry} className="responsive-image" /></a>
          </div>)
        })
        }
      </div>
      {this.state.showSidebar ? <Sidebar /> : null}
    </div>);
  }

  selectSize = urls => {
    return urls.reduce(function (correctSizeUrls, url) {
      if (url.endsWith(sizeEnding)) {
        correctSizeUrls.push(url);
      }
      return correctSizeUrls;
    }, []);
  };

  swiperight = event => {
    console.log("swiperight");
    this.setState({ showSidebar: true });
  }

  swipeleft = event => {
    console.log("swipeleft");
    this.setState({ showSidebar: false });
  }

  panright = event => {
    console.log("panright");
    this.setState({ showSidebar: true });
  }

  panleft = event => {
    console.log("panleft");
    this.setState({ showSidebar: false });
  }

  zoomIn = () => {
    this.setState(state => ({ scale: state.scale < 100 ? state.scale * 2 : state.scale }));
  }

  zoomOut = () => {
    this.setState(state => ({ scale: state.scale > 6.26 ? state.scale / 2 : state.scale }));
  }

  pinchend = event => {
    if (event.scale > 1.25)
      this.zoomIn();
    else if (event.scale < .75)
      this.zoomOut();
  }

  componentDidMount() {
    this.hammer = Hammer(this.gridElement);
    this.hammer.on("pinchend", this.pinchend);
    this.hammer.on('swipeleft', this.swipeleft);
    this.hammer.on('swiperight', this.swiperight);
    this.hammer.on('panleft', this.panleft);
    this.hammer.on('panright', this.panright);
    fetch(url)
      .then(data => data.json())
      .then(data => this.selectSize(data))
      .then(data => this.setState({ urls: data }));
  }
}

export default App;
