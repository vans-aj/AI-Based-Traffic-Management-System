// requiring basic modules
const express = require('express');
const port = 8080;
const app = express();
const dijkstra = require('./utility/dijkstra.js');
const googleMapsClient = require('@google/maps').createClient({
<<<<<<< HEAD
  key: '#'
=======
  key: 'AIzaSyBEZA6PUdw8jk8-u0kVyhGIsh1F3LSSkT4'
>>>>>>> dd31673 (80% done)
});

const locations = [
    "Clock Tower",
    "ISBT (Inter-State Bus Terminal) Dehradun",
    "Rajpur Road",
    "Pacific Mall",
    "Clement Town"
];

app.get('/calculate-distances', (req, res) => {
  const start = req.query.start;
  const end = req.query.end;

  if (!start || !end) {
    return res.status(400).send("Start and end locations must be provided.");
  }

  googleMapsClient.distanceMatrix({
    origins: locations,
    destinations: locations,
    mode: 'driving',
    departure_time: 'now',
  }, (err, response) => {
    if (!err) {
      const distances = response.json.rows;
      const graph = {};

      distances.forEach((row, i) => {
        const origin = locations[i];
        graph[origin] = {};

        row.elements.forEach((element, j) => {
          const destination = locations[j];
          graph[origin][destination] = element.distance.value; // distance in meters
        });
      });

      const { distances: dist, paths } = dijkstra(graph, start);
      const pathToEnd = paths[end] || [];
      res.render('calculate-distances', { start, end, distances: dist, pathToEnd });
    } else {
      console.log('Error fetching distance data:', err);
      res.status(500).send("Error fetching distance data.");
    }
  });
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
}
);
app.set('view engine', 'ejs');
// for home route
app.get('/', (req, res) => {
    res.render('home');
}
);
app.get('/map', (req, res) => {
    const { start, end } = req.query;
    res.render('map', { start, end });
}
);
