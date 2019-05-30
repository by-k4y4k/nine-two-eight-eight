# Nine Two Eight Eight

[![Greenkeeper badge](https://badges.greenkeeper.io/by-k4y4k/nine-two-eight-eight.svg)](https://greenkeeper.io/)

## is the unit code for this assessment

9288 is a small prototype of a browser-based game in which a player scans QR codes from a poster to reveal clues to solve a mystery.

Criterion for this assessment depends not on the actual quality of the application, only that it can successfully accompany the pitch.

Auto deploying to Heroku [on every commit](https://nine-two-eight-eight.herokuapp.com/).

### Get Started

0. Install Node and Yarn
1.  `yarn start` (port 3000)

### Dir Structure

```
docs/
  routes.md [1]

public/ [2]
  (...)

routes/ [3]
  index.js

src/ [4]
  js/
    (...)
  scss/
    (...)

views/ [5]
  clues/ [5.1]
    index.pug [5.1.1]
  partials/ [5.2]
    head.pug
    (...)

gulpfile.js [6]
app.js [7]

```

[1] Documentation of the routes

[2] Files that have to be accessible from anywhere are generated into here (images, CSS, JS, etc...)

[3] Logic that tells the server what page to show when

[4] Source CSS / JS / images

- JavaScript is written in ES6+ and then Babel-ed.
- CSS is written as Sass and imports [Bulma](https://bulma.io).

[5] Template files that Express uses to generate pages.

[5.1] Templeates for the individual clues

[5.2] Pug partials that can be `include`d.

[6] Gulp handles processing of CSS / JS / images. This tells it how to.

[7] This is how we set up and run our server.