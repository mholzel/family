import React, { Component } from 'react';
import './App.css';
import Sidebar from './sidebar/Sidebar'
import Buttons from './buttons/Buttons'

// Loading indicator
// Maintain state when selecting images.
// Infinite scrolling
// Non-uniform image sizes 

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

  toggleCalendar = () => {
    this.setState(state => ({ showSidebar: !state.showSidebar }));
  }

  render() {
    const style = { width: this.state.scale.toString() + '%' };
    return (<div>
      <div className="grid">
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
      <Buttons zoomIn={this.zoomIn} zoomOut={this.zoomOut} toggleCalendar={this.toggleCalendar} />
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

  zoomIn = () => {
    this.setState(state => ({ scale: state.scale < 100 ? state.scale * 2 : state.scale }));
  }

  zoomOut = () => {
    this.setState(state => ({ scale: state.scale > 6.26 ? state.scale / 2 : state.scale }));
  }

  componentDidMount() {
    this.onDateSelected(new Date());
  }
}

export default App;