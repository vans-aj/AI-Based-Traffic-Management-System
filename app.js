// requiring basic modules
const express = require('express');
const port = 8080;
const app = express();

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
app.get('/dashboard', (req, res) => {
    res.render('dashboard');
}
);
app.get('/map', (req, res) => {
    res.render('map');
}
);

