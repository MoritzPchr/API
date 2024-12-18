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

// GET User by ID
app.get('/user/:id', (req, res) => {
    const userId = req.params.id;
    db.query('SELECT * FROM user WHERE UserID = ?', [userId], (err, results) => {
        if (err) {
            res.status(500).json({ error: err.message });
        } else if (results.length === 0) {
            res.status(404).json({ error: 'User nicht gefunden' });
        } else {
            res.json(results[0]);
        }
    });
});

// GET Client by ID
app.get('/client/:id', (req, res) => {
    const clientId = req.params.id;
    db.query('SELECT * FROM client WHERE ClientID = ?', [clientId], (err, results) => {
        if (err) {
            res.status(500).json({ error: err.message });
        } else if (results.length === 0) {
            res.status(404).json({ error: 'Client nicht gefunden' });
        } else {
            res.json(results[0]);
        }
    });
});

// POST User
app.post('/user', (req, res) => {
    const { Vorname, Nachname, Email, Passwort, Brokername } = req.body;
    const sql = 'INSERT INTO user (Vorname, Nachname, Email, Passwort, Brokername) VALUES (?, ?, ?, ?, ?)';
    db.query(sql, [Vorname, Nachname, Email, Passwort, Brokername], (err, results) => {
        if (err) {
            res.status(500).json({ error: err.message });
        } else {
            res.status(201).json({ message: 'User erstellt', UserID: results.insertId });
        }
    });
});

// POST Client
app.post('/client', (req, res) => {
    const { UserID } = req.body;
    const sql = 'INSERT INTO client (UserID) VALUES (?)';
    db.query(sql, [UserID], (err, results) => {
        if (err) {
            res.status(500).json({ error: err.message });
        } else {
            res.status(201).json({ message: 'Client erstellt', ClientID: results.insertId });
        }
    });
});

// PUT User
app.put('/user/:id', (req, res) => {
    const userId = req.params.id;
    const { Vorname, Nachname, Email, Passwort, Brokername } = req.body;
    const sql = 'UPDATE user SET Vorname = ?, Nachname = ?, Email = ?, Passwort = ?, Brokername = ? WHERE UserID = ?';
    db.query(sql, [Vorname, Nachname, Email, Passwort, Brokername, userId], (err, results) => {
        if (err) {
            res.status(500).json({ error: err.message });
        } else if (results.affectedRows === 0) {
            res.status(404).json({ error: 'User nicht gefunden' });
        } else {
            res.json({ message: 'User aktualisiert' });
        }
    });
});

// PUT Client
app.put('/client/:id', (req, res) => {
    const clientId = req.params.id;
    const { UserID } = req.body;
    const sql = 'UPDATE client SET UserID = ? WHERE ClientID = ?';
    db.query(sql, [UserID, clientId], (err, results) => {
        if (err) {
            res.status(500).json({ error: err.message });
        } else if (results.affectedRows === 0) {
            res.status(404).json({ error: 'Client nicht gefunden' });
        } else {
            res.json({ message: 'Client aktualisiert' });
        }
    });
});

// DELETE User
app.delete('/user/:id', (req, res) => {
    const userId = req.params.id;
    db.query('DELETE FROM user WHERE UserID = ?', [userId], (err, results) => {
        if (err) {
            res.status(500).json({ error: err.message });
        } else if (results.affectedRows === 0) {
            res.status(404).json({ error: 'User nicht gefunden' });
        } else {
            res.json({ message: 'User gelöscht' });
        }
    });
});

// DELETE Client
app.delete('/client/:id', (req, res) => {
    const clientId = req.params.id;
    db.query('DELETE FROM client WHERE ClientID = ?', [clientId], (err, results) => {
        if (err) {
            res.status(500).json({ error: err.message });
        } else if (results.affectedRows === 0) {
            res.status(404).json({ error: 'Client nicht gefunden' });
        } else {
            res.json({ message: 'Client gelöscht' });
        }
    });
});

// Server starten
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server läuft auf http://localhost:${PORT}`);
});
