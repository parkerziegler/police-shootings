# d3-react-map
[![Build Status](https://travis-ci.org/parkerziegler/d3-react-map.svg?branch=master)](https://travis-ci.org/parkerziegler/d3-react-map)
[![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square)](https://github.com/prettier/prettier)
[![Coverage Status](https://coveralls.io/repos/github/parkerziegler/d3-react-map/badge.svg?branch=master)](https://coveralls.io/github/parkerziegler/d3-react-map?branch=master)

### Demo
Check out the app live [here](https://parkerziegler.github.io/d3-react-map/). This app is currently undergoing rapid development changes, some of them breaking. The app deployed to the demo is (**mostly**) functional, but if you catch an error please open an issue.

### Context
This repo is an attempt to expand upon a [previous project](https://parkerziegler.github.io/d3-policeshootings-map/) of mine exploring police involved shootings in the United States. The previous iteration of this project was built using vanilla JavaScript and [D3](https://github.com/d3/d3). While I think it accomplished some things well, it is not designed with responsive principles in mind, employs no framework to manage the application, and suffers from some inelegant design. It was a while ago, I've learned a lot.

This revamped project is built using [React](https://facebook.github.io/react/), [Redux](http://redux.js.org/), [redux-saga](https://redux-saga.js.org/), and [Sass](http://sass-lang.com/). It employs mobile-first design, working well across desktop, tablet, and mobile devices. It handles data elegantly, keeping application state in Redux and moving asynchoronous tasks and route-based data changes to sagas. Components are designed with reusability and extensibility in mind. Finally, the project - as it's name might imply - serves to demonstrate how D3 and React can play nicely together. As a developer who specializes in React and builds geospatial apps for a living, this is my dream. Read more about my thoughts on working with D3 and React [here](https://parkerziegler.com/senior-research-programming-for-gis/2017/7/6/mapping-in-react-and-d3).

### Running the App
```javascript
npm install | yarn install
npm run start | yarn run start
```

### Building the App
```javascript
npm run build | yarn run build
```

### Config
The app pulls in data on load from several APIs, including the U.S. Census Bureau. To get census data,
you'll need to obtain a Census API key of your own. Once obtained, store your key in a file called `config.js` in the root of `src`. The file should look something like this:
```javascript
export const CENSUS_API_KEY = '<Your actual key goes here!>';
```

### Caveats
This app is still in the works and is undergoing constant change. If you like what you see, please star! If you think I'm seriously missing the mark, please issue a PR or open an issue. Or better yet, get in touch on my [website](https://parkerziegler.com/portfolio/).