const express = require('express');
const bodyParser = require('body-parser');
const clientsRoute = require('./routes/clients');
const usersRoute = require('./routes/users');
const feinstaubRoute = require('./routes/feinstaubwerte');

const app = express();

app.use(bodyParser.json());
app.use('/clients', clientsRoute);
app.use('/users', usersRoute);
app.use('/feinstaubwerte', feinstaubRoute);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server läuft auf http://localhost:${PORT}`);
});
