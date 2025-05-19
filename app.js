// requiring basic modules
const express = require('express');
const port = 8080;
const app = express();
const { Client } = require("@googlemaps/google-maps-services-js");
const client = new Client({});

const path = require('path');

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// This serves static files like images, css, js
app.use(express.static(path.join(__dirname, 'public')));

const locations = {
  "Shimla Bypass Rd": { lat: 30.354606800959786, lng: 77.81848932576095 },
  "Haridwar Bypass Rd": { lat: 30.288586668746056, lng: 78.02652342206235 },
  "Race Course Chowk": { lat: 30.31393375643659, lng: 78.04611859692426 },
  "Gandhi Rd": { lat: 30.316630336536146, lng: 78.03355816267643 },
  "Kaulagarh": { lat: 30.352222052702583, lng: 78.00936640304617 },
  "ONGC Chowk": { lat: 30.342926286399088, lng: 78.01638306144562 },
  "Rajpur Rd": { lat: 30.32485103616735, lng: 78.04199119507625 },
  "Oghal Bhatta Chowk (Subhash Nagar)": { lat: 30.276767328929317, lng: 78.0001531617464 },
  "Rishabh Raj Chowk": { lat: 30.274765977096916, lng: 77.99629078097607 },
  "Mobiawala Chowk": { lat: 30.269947740490377, lng: 77.98487530003261 },
  "Tilak Road near Chandarbani Chowk": { lat: 30.279287491700373, lng: 77.99174175473544 },
  "Vasant Vihar": { lat: 30.333360796145662, lng: 77.99865444157206 },
  "Tehseel Chowk": { lat: 30.32084183516202, lng: 78.04099170157579 },
  "Buddha Chowk Kirsali": { lat: 30.374123643070742, lng: 78.10030892576151 },
  "Sahastradhara Crossing": { lat: 30.324044333120135, lng: 78.06408762576001 },
  "Sahastradhara Crossing Raipur Road Opp Richi Rich": { lat: 30.324053521787672, lng: 78.0645012510327 },
  "Bhandari Bagh Tiraha": { lat: 30.31245980124913, lng: 78.02744984588891 },
  "Yamuna Colony Tiraha": { lat: 30.331979780623215, lng: 78.0282968533083 },
  "Prince Chowk": { lat: 30.315807450671045, lng: 78.0375233190675 },
  "Araghar Chowk": { lat: 30.309702234228354, lng: 78.04876329322747 },
  "Lal Pull": { lat: 30.307088985713342, lng: 78.01681312219382 },
  "Tehsil Chowk": { lat: 30.320443273140942, lng: 78.04132066056354 },
  "Maharana Pratap Chowk": { lat: 30.30826081111924, lng: 78.09937689692406 },
  "Nalapani Chowk": { lat: 30.331332297591523, lng: 78.06609787802127 },
  "IT Park Sahastradhara Road, Dehradun": { lat: 30.35643596444959, lng: 78.08540728158364 },
  "Library Chowk": { lat: 30.460012521186975, lng: 78.06443810857391 },
  "Chakrata Rd": { lat: 30.527815082316923, lng: 77.85244319898999 },
  "Bhaniyawala Chowk": { lat: 30.183086165281896, lng: 78.14179000061525 },
  "Sainik Colony Badowala I.C Road Durga Chowk Bhaniyawala": { lat: 30.1909693266224, lng: 78.15602785276494 },
  "Bindaal Tiraha": { lat: 30.32779469000984, lng: 78.0325193836405 },
  "Dehradun Sabji Mandi Tiraha": { lat: 30.304959275115248, lng: 78.01209253263833 },
  "Bhagwan Aadinath Tiraha": { lat: 30.31296225734268, lng: 78.03614215095556 },
  "Chuna Bhatta Rd": { lat: 30.352354823436286, lng: 78.00705290873084 },
  "Dehradun Saharanpur Chowk": { lat: 30.317576062671, lng: 78.0282760344218 },
  "Survey Chowk Dehradun": { lat: 30.33488710963276, lng: 78.05373214944647 },
  "Saharanpur Chowk": { lat: 30.317144329623098, lng: 78.02767904762446 },
  "Dhobi Chowk": { lat: 30.30411075156145, lng: 78.04459562428623 },
  "Rispana Bridge": { lat: 30.295527881086006, lng: 78.05637286456106 },
  "GMS Rd & Chakrata Rd": { lat: 30.33343809597169, lng: 78.01087166767428 },
  "Kishan Nagar Chowk": { lat: 30.33372979610455, lng: 78.02654021000245 },
  "Sahastradhara Road Danda Lakhond": { lat: 30.354308191094017, lng: 78.08234560323817 },
  "Jolly Grant Dehradun Airport Road": { lat: 30.189741969551154, lng: 78.19505428292727 },
  "Shyampur Bypass Road Rishikesh": { lat: 30.0654214011772, lng: 78.24283779063806 }
};



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
app.get('/map', async (req, res) => {
  try {
    const graph = {};
    const locationNames = Object.keys(locations);
    const allOrigins = locationNames.map(name => ({
      name,
      latlng: `${locations[name].lat},${locations[name].lng}`
    }));
    const allDestinations = allOrigins.map(loc => loc.latlng);

    const MAX_ELEMENTS = 100;
    const originBatchSize = 10;
    const destinationBatchSize = 10;

    async function fetchBatch(originsBatch, originStartIdx, destinationsBatch, destStartIdx) {
      const originLatLngs = originsBatch.map(o => o.latlng);

      try {
        const response = await client.distancematrix({
          params: {
            origins: originLatLngs,
            destinations: destinationsBatch,
            mode: 'driving',
            key: 'AIzaSyCef1jtv8k8NJ4eURMh8vnjC-eCEcV0zwk',
          }
        });

        const rows = response.data.rows;
        originsBatch.forEach((originObj, idx) => {
          const originName = originObj.name;
          if (!graph[originName]) graph[originName] = {};

          if (rows[idx]?.elements) {
            rows[idx].elements.forEach((element, j) => {
              const destName = locationNames[destStartIdx + j];
              const distance = element.distance?.value;

              if (
                element.status === "OK" &&
                originName !== destName &&
                distance <= 5000
              ) {
                graph[originName][destName] = distance;
                if (!graph[destName]) graph[destName] = {};
                graph[destName][originName] = distance;
              }
            });
          } else {
            console.warn(`No elements for origin: ${originName}`);
          }
        });

      } catch (error) {
        console.error('Error in batch:', error.response?.data || error.message);
      }
    }

    async function buildGraph() {
      for (let i = 0; i < allOrigins.length; i += originBatchSize) {
        const originsBatch = allOrigins.slice(i, i + originBatchSize);

        for (let j = 0; j < allDestinations.length; j += destinationBatchSize) {
          const destinationsBatch = allDestinations.slice(j, j + destinationBatchSize);

          await fetchBatch(originsBatch, i, destinationsBatch, j);
          await new Promise(res => setTimeout(res, 10)); // To prevent rate limit
        }
      }
    }

    await buildGraph();
    console.log("Graph being sent to client:", graph); // Add this line
    res.render('map', {
      graph: JSON.stringify(graph),
      locations
    });

  } catch (error) {
    console.error('Error building graph:', error.message || error);
    res.status(500).send('Error building graph');
  }
});