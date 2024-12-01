const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const config = require('./config'); // Importiere die Konfiguration

// App initialisieren
const app = express();
app.use(bodyParser.json());

// Datenbankverbindung
const db = mysql.createConnection(config.db); // Nutze config.db für die Verbindung

db.connect((err) => {
    if (err) {
        console.error('Fehler beim Verbinden mit der Datenbank:', err.message);
    } else {
        console.log('Mit der Datenbank verbunden!');
    }
});

// Endpunkte
app.get('/clients', (req, res) => {
    db.query('SELECT * FROM client', (err, results) => {
        if (err) {
            res.status(500).json({ error: err.message });
        } else {
            res.json(results);
        }
    });
});

app.get('/users', (req, res) => {
    db.query('SELECT * FROM user', (err, results) => {
        if (err) {
            res.status(500).json({ error: err.message });
        } else {
            res.json(results);
        }
    });
});

app.get('/feinstaubwerte', (req, res) => {
    db.query('SELECT * FROM feinstaubwert', (err, results) => {
        if (err) {
            res.status(500).json({ error: err.message });
        } else {
            res.json(results);
        }
    });
});

// Server starten
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server läuft auf http://localhost:${PORT}`);
});
