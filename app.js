// requiring basic modules
const express = require('express');
const port = 8080;
const app = express();
const dijkstra = require('./utility/dijkstra.js');
const googleMapsClient = require('@google/maps').createClient({
  key: 'AIzaSyBEZA6PUdw8jk8-u0kVyhGIsh1F3LSSkT4'
});

const locations = [
  "Clock Tower, Dehradun, Uttarakhand",
  "ISBT (Inter-State Bus Terminal) Dehradun, Dehradun, Uttarakhand",
  "Rajpur Road, Dehradun, Uttarakhand",
  "Pacific Mall, Dehradun, Uttarakhand",
  "Clement Town, Dehradun, Uttarakhand"
];

app.get('/calculate-distances', (req, res) => {
  const start = req.query.start;
  const end = req.query.end;

  if (!start || !end) {
    return res.status(400).json({ error: "Start and end locations must be provided." });
  }

  googleMapsClient.distanceMatrix({
    origins: locations,
    destinations: locations,
    mode: 'driving',
  }, (err, response) => {
    if (!err) {
      const distances = response.json.rows;
      const graph = {};

      // Construct the graph from the Distance Matrix API response
      distances.forEach((row, i) => {
        const origin = locations[i];
        graph[origin] = {};

        row.elements.forEach((element, j) => {
          const destination = locations[j];
          if (element.status === "OK") {
            graph[origin][destination] = element.distance.value; // Distance in meters
          }
        });
      });

      console.log("Graph constructed for Dijkstra's algorithm:", JSON.stringify(graph, null, 2));

      // Apply Dijkstra algorithm
      const { distances: dist, paths } = dijkstra(graph, start);

      console.log("Dijkstra output - distances:", dist);
      console.log("Dijkstra output - paths:", paths);

      const pathToEnd = paths[end] || [];

      // Return the shortest path and distances as JSON
      res.json({ start, end, distances: dist, pathToEnd });
    } else {
      console.error('Error fetching distance data:', err);
      res.status(500).json({ error: "Error fetching distance data." });
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
