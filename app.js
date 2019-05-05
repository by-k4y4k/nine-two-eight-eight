// ---------- 9288 CROSS MEDIA PRODUCTION | ASSESSMENT 3 - PROTOTYPE -----------
// ---------------- SEE GIT BLAME FOR AUTHORS AND CONTRIBUTIONS ----------------

// Express is what "drives" our app.
const express = require('express');
const app = express();
// Pug is our templating lang -- used for all our pages, dynamic or not.
const pug = require('pug');

// APP CONFIG ==================================================================

//  We have to tell Express we want to use Pug
app.set('view engine', 'pug');

// This means that relative srcs or hrefs should resolve to files in public/
app.use(express.static('./public/'));

// ROUTES ======================================================================

app.get('/', (req, res) => {
  // Notice we leave the extension off - Express knows to look for .pug files
  res.render('index');
});

// INDEX (HTTP GET) - Lists all clues
app.get('/clues/', (req, res) => {
  res.send(403);
});

// SHOW (HTTP GET) - Shows one clue
app.get('/clues/week-:num', (req, res) => {
  console.dir(req.params);
  console.log(`clues/${req.params.num}`);
  // res.render(`clues`);
  res.render(`clues/${req.params.num}`);
});

app.get('/scan', (req, res) => {
  res.render('scan');
});

// APP INIT ====================================================================

// And now for actually LAUNCHING the app on localhost
const PORT = process.env.PORT || 1234;
app.listen(PORT, process.env.IP, () => {
  // Prints a link you can click to the console (gotta save those keypresses)
  console.log(`Running on http://localhost:${PORT}`);
});
