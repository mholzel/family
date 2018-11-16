import React, { Component } from 'react';
import Hammer from 'hammerjs';
import './App.css';
import Sidebar from './sidebar/Sidebar'
import Buttons from './buttons/Buttons'
import Lightbox from 'react-image-lightbox';
import 'react-image-lightbox/style.css'; // This only needs to be imported once in your app
import VisibilitySensor from 'react-visibility-sensor';

// files.php only needs to send the files without the 150x150 ending. We should assume the others exist and 
// Update calendar to follow date of images on screen 
// When zooming out, check if last element is visible. If so, load more 
// Allow calendar selection while loading. 
// Display image dates and other data 
// Smoother pinching
// Non-uniform image sizes 
// Search button
// Really old searches may crash since the urls returned may be empty 
// Need to stop recursion on inception date
const imageBuffer = 200;
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

    isLoading = false;
    lastQueriedDate = null;
    elementsToLoad = 0;
    lastVisibleElement = null;
    zoomChanged = false;

    state = {
        urls: [],
        cols: 4,
        showSidebar: false,
        lightboxIndex: -1,
        isLoading: this.isLoading
    };

    componentDidMount() {
        this.hammer = Hammer(this.gridElement);
        this.hammer.on('pinchend', this.pinchend);
        this.load(new Date());
    }

    componentDidUpdate() {
        const elem = document.querySelector(`[data-key="${this.lastVisibleElement}"]`);
        if (this.zoomChanged && elem != null) {
            elem.scrollIntoView();
            this.zoomChanged = false;
        }
    }

    load = (date = this.lastQueriedDate, scenario = 1) => {

        /* 
        This function is called to load more photos. 
        There are 3 scenarios when this happens:

        1. The user selects a date from the calendar. 
        In this case, the old photos are replaced by the new ones.

        2. Scenario 1 does not yield enough photos.
        In this case, this function is called again with an older date. 

        3. The user has scrolled toward the bottom of the screen, 
        and we now need to load more photos. 

        As soon as this function is called, the state is changed to 
        isLoading, the containing the calendar is collapsed, 
        and the button to open the calendar is disabled. This
        means that no new instances of Scenario 1 should occur 
        while there is an outstanding request. 

        Scenario 2 only ever occurs synchronously, because whether 
        or not enough images has loaded is determined based on how many 
        images loaded last time. 

        Scenario 3 is the tricky part since one of those calls can occur 
        while there is still an outstanding request. We want to make sure
        that we don't ignore that call, so in that case, we simply reset the 
        number of elementsToLoad. 
        */

        /* If you are in scenario 1 or 3, reset the number of elements to load. */
        if (scenario === 1 || scenario === 3) {

            this.elementsToLoad = imageBuffer;

            /* If images are currently being loaded, do nothing. 
            Once they are loaded, we will detect if we loaded enough. */
            if (this.isLoading) {
                return;
            }
        }

        /* TODO If scenario 2 or 3, decrease the date */
        this.lastQueriedDate = new Date(date.getTime());
        if (scenario === 2 || scenario === 3) {
            this.lastQueriedDate.setUTCMonth(this.lastQueriedDate.getUTCMonth() - 1);
        }
        this.isLoading = true;
        this.setState({ showSidebar: false, isLoading: true });
        const month = months[this.lastQueriedDate.getUTCMonth()];
        const year = this.lastQueriedDate.getUTCFullYear();
        const url = baseURL + 'files.php?m=' + month + '&y=' + year;
        console.log("fetching url: " + url);
        fetch(url)
            .then(response => {
                console.log("loaded " + url);
                return response.json();
            })
            .then(json => this.selectSize(json))
            .then(urls => this.onUrlsLoaded(urls, scenario));
    }

    onUrlsLoaded = (urls, scenario) => {
        /* We have the new urls. Now either append or replace. */
        if (scenario === 2 || scenario === 3) {
            this.setState(state => {
                const newUrls = state.urls.slice();
                newUrls.push(...urls);
                return { urls: newUrls }
            });
        } else {
            this.setState({ urls: urls, });
        }

        /* Next, we need to check whether we loaded enough elements.
        If we did, then we are done loading. Otherwise, we need to load more. */
        const loadMore = this.state.elementsToLoad > urls.length;
        this.elementsToLoad = Math.max(0, this.elementsToLoad - urls.length);
        if (loadMore) {
            this.loadMore(2);
        } else {
            this.isLoading = false;
            this.setState({ isLoading: false })
        }
    }

    loadMore = (scenario = 3, key = null, visible = true) => {
        if (key != null && visible) {
            this.lastVisibleElement = key;
        }
        this.load(this.lastQueriedDate, scenario);
    }

    image = (entry, index) => {
        // TODO Use fullsize url as fallback, as suggested in this Stackoverflow
        // return 
        //     (<object data="http://stackoverflow.com/does-not-exist.png" type="image/png">
        //         <img src="https://appharbor.com/assets/images/stackoverflow-logo.png" alt="example">
        //   </object>)
        return <img src={entry.smallUrl} className="responsive-image" alt="" onClick={() => this.imageSelected(index)} />;
    }

    render() {
        const urls = this.state.urls;
        const lightboxIndex = this.state.lightboxIndex;
        const style = { width: (100.0 / this.state.cols) + '%' };
        const loadMoreIndex = Math.max(0, urls.length - imageBuffer);
        console.log("render")
        return (
            <div>
                <div className="grid" ref={elem => this.gridElement = elem} onTouchStart={this.onTouchStart} onTouchEnd={this.onTouchEnd}>
                    {urls.map((entry, index) => {
                        return (
                            <div className="cell" key={entry.fullsizeUrl} data-key={entry.fullsizeUrl} style={style}>
                                {(index >= loadMoreIndex && index % 10 === 0) ? <VisibilitySensor onChange={(visible) => this.loadMore(3, entry.fullsizeUrl, visible)}>{this.image(entry, index)}</VisibilitySensor> : this.image(entry, index)}
                            </div>
                        )
                    })
                    }
                </div>
                <Sidebar onDateSelected={date => this.load(date)}
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
        this.zoomChanged = true;
        this.setState(state => ({ cols: state.cols > 1 ? state.cols - 1 : state.cols }));
    }

    zoomOut = () => {
        this.zoomChanged = true;
        this.setState(state => ({ cols: state.cols < maxCols ? state.cols + 1 : state.cols }));
    }

    initialPinchScale = 0;

    pinchstart = event => {
        // TODO
        this.initialPinchScale = 0;
    }

    pinch = event => {
        // TODO
    }

    pinchend = event => {
        if (event.scale > 1.25)
            this.zoomIn();
        else if (event.scale < .75)
            this.zoomOut();
    }

}

export default App;