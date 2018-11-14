import React, { Component } from 'react';
import Hammer from 'hammerjs';
import './App.css';
import Sidebar from './sidebar/Sidebar'
import Buttons from './buttons/Buttons'
import Lightbox from 'react-image-lightbox';
import 'react-image-lightbox/style.css'; // This only needs to be imported once in your app
import VisibilitySensor from 'react-visibility-sensor';

// Infinite scrolling
// Display image dates and other data 
// Smoother pinching
// Loading indicator needs some styling
// Non-uniform image sizes 
// Settings button which collapses the others
// Search button

const imageBuffer = 100;
const maxCols = 10;
const months = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'];
const imageURL = 'http://codekafana.com/family/wp-content/uploads/';
const baseURL = true ? 'http://codekafana.com/gallery/' : 'http://localhost/';
const size = '150x150';
const sizeEnding = size + '.jpg';
function urlGenerator(shortUrl) {
  return {
    smallUrl: imageURL + shortUrl,
    fullsizeUrl: imageURL + shortUrl.slice(0, -1 - sizeEnding.length) + '.jpg'
  };
}

class App extends Component {

  state = {
    urls: [],
    cols: 4,
    showSidebar: false,
    lightboxIndex: -1,
    isLoading: false,
    loading: null,
    loaded: null,
    loadUntil: null,
  };

  onDateSelected = (date, append) => {

    /* TODO Here we should probably insert something into the state signalling which date is being loaded. 
    */

    // If requesting to load a date that is the same as the one being loaded 
    if (this.state.loading && this.state.loading.getUTCMonth() === date.getUTCMonth() && this.state.loading.getUTCFullYear() === date.getUTCFullYear()) {
      return;
    }

    this.setState({ showSidebar: false, isLoading: true, loading: date });
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
      .then(data => this.setState(state => {
        if (append) {
          const newUrls = state.urls.slice();
          newUrls.push(...data);
          return { urls: newUrls, isLoading: false, loaded: date }
        } else {
          return { urls: data, isLoading: false, loaded: date };
        }
      }));
  }

  loadMore = isVisible => {
    console.log("trigger is visible: " + isVisible)
    if (isVisible) {
      const monthToLoad = this.state.loaded;
      monthToLoad.setUTCMonth(this.state.loaded.getUTCMonth() - 1);
      this.onDateSelected(monthToLoad, true);
    }
  }

  componentDidMount() {
    this.hammer = Hammer(this.gridElement);
    this.hammer.on('pinchend', this.pinchend);
    this.onDateSelected(new Date(), false);
  }

  image = (entry, index) => {
    return <img src={entry.smallUrl} className="responsive-image" alt="" onClick={() => this.imageSelected(index)} />;
  }

  render() {
    const urls = this.state.urls;
    const lightboxIndex = this.state.lightboxIndex;
    const style = { width: (100.0 / this.state.cols) + '%' };
    const loadmoreIndex = Math.max(0, urls.length - imageBuffer);
    console.log("loadmoreIndex " + loadmoreIndex)
    return (
      <div>
        <div className="grid" ref={elem => this.gridElement = elem} onTouchStart={this.onTouchStart} onTouchEnd={this.onTouchEnd}>
          {urls.map((entry, index) => {
            return (
              <div className="cell" key={entry.fullsizeUrl} style={style}>
                {(index === loadmoreIndex) ? <VisibilitySensor onChange={this.loadMore}>{this.image(entry, index)}</VisibilitySensor> : this.image(entry, index)}
              </div>
            )
          })
          }
        </div>
        <Sidebar onDateSelected={date => this.onDateSelected(date, false)}
          onCancelSidebar={this.onCancelSidebar}
          showSidebar={this.state.showSidebar} />
        <Buttons zoomIn={this.zoomIn} zoomOut={this.zoomOut} toggleCalendar={this.toggleCalendar} isLoading={this.state.isLoading} />
        {
          (lightboxIndex >= 0) &&
          <Lightbox
            mainSrc={urls[lightboxIndex].fullsizeUrl}
            nextSrc={urls[(lightboxIndex + 1) % urls.length].fullsizeUrl}
            prevSrc={urls[(lightboxIndex + urls.length - 1) % urls.length].fullsizeUrl}
            onCloseRequest={() => this.setState({ lightboxIndex: -1 })}
            onMovePrevRequest={() =>
              this.setState({
                lightboxIndex: (lightboxIndex + urls.length - 1) % urls.length,
              })
            }
            onMoveNextRequest={() =>
              this.setState({
                lightboxIndex: (lightboxIndex + 1) % urls.length,
              })
            }
          />
        }
      </div>);
  }

  /* We need these touch event handlers to enabled pinch detecting ONLY when there 
  is more than one touch event. If we don't enable these, then Hammerjs will block scrolling. */
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

  onCancelSidebar = () => {
    this.setState({ showSidebar: false });
  }

  toggleCalendar = () => {
    this.setState(state => ({ showSidebar: !state.showSidebar }));
  }

  imageSelected = index => {
    this.setState({ lightboxIndex: index });
  }

  selectSize = urls => {
    return urls.reduce(function (correctSizeUrls, url) {
      if (url.endsWith(sizeEnding)) {
        correctSizeUrls.push(urlGenerator(url));
      }
      return correctSizeUrls;
    }, []);
  };

  zoomIn = () => {
    this.setState(state => ({ cols: state.cols > 1 ? state.cols - 1 : state.cols }));
  }

  zoomOut = () => {
    this.setState(state => ({ cols: state.cols < maxCols ? state.cols + 1 : state.cols }));
  }

  pinchend = event => {
    if (event.scale > 1.25)
      this.zoomIn();
    else if (event.scale < .75)
      this.zoomOut();
  }

}

export default App;