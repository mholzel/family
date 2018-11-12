import React, { Component } from 'react';
import Hammer from 'hammerjs';
import './App.css';
import Sidebar from './sidebar/Sidebar'
import Zoom from './zoom/Zoom'

// TODO Pan is called too many times
// TODO infinite scrolling
// TODO Date picker
// TODO Non-uniform image sizes 

const months = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'];
const imageURL = 'http://codekafana.com/family/wp-content/uploads/';
const baseURL = true ? 'http://codekafana.com/react3/' : 'http://localhost/';
const size = '150x150';
const sizeEnding = size + '.jpg';

class App extends Component {

  state = {
    urls: [],
    scale: 25,
    showSidebar: true,
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

  onDateSelected = date => {
    this.setState({ showSidebar: false });
    const month = months[date.getUTCMonth()];
    const year = date.getUTCFullYear();
    const url = baseURL + 'files.php?m=' + month + '&y=' + year;
    console.log("fetching " + url);
    fetch(url)
      .then(data => {
        console.log("loaded " + url);
        return data.json();
      })
      .then(data => this.selectSize(data))
      .then(data => this.setState({ urls: data }));
  }

  onCancelSidebar = () => {
    this.setState({ showSidebar: false });
  }

  render() {
    const style = { width: this.state.scale.toString() + '%' };
    return (<div>
      <div className="grid" ref={elem => this.gridElement = elem} onTouchStart={this.onTouchStart} onTouchEnd={this.onTouchEnd}>
        {this.state.urls.map(entry => {
          const fullSizeUrl = imageURL + entry.slice(0, -1 - sizeEnding.length) + '.jpg'
          return (<div className="cell" key={fullSizeUrl} style={style}>
            <a href={fullSizeUrl}><img src={imageURL + entry} className="responsive-image" alt="" /></a>
          </div>)
        })
        }
      </div>
      <Sidebar onDateSelected={this.onDateSelected}
        onCancelSidebar={this.onCancelSidebar}
        showSidebar={this.state.showSidebar} />
      <Zoom zoomIn={this.zoomIn} zoomOut={this.zoomOut} />
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

  /* 
  TODO This doesn't seem to work on desktop devices, so we are 
  using the panleft and panright events, even though they seem 
  to be triggered multiple times. 
  */
  panend = event => {
    if (event.additionalEvent === "panright")
      this.setState({ showSidebar: true });
    else if (event.additionalEvent === "panleft")
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
    if (true) {
      this.hammer.on("panleft", this.panleft);
      this.hammer.on("panright", this.panright);
    } else {
      // See comment in panend function
      this.hammer.on("panend", this.panend);
    }
    this.hammer.on('pinchend', this.pinchend);
    this.onDateSelected(new Date());
  }

  componentWillUnmount() {
    console.log("unmounting app")
  }
}

export default App;