const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const config = require('./config'); // Importiere die Konfiguration
const bcrypt = require('bcrypt'); // Für Passwort-Hashing

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
    const { UserID, Ort } = req.body; // UserID und Ort werden vom Client übergeben
    const sql = 'INSERT INTO client (UserID, Ort) VALUES (?, ?)';
    
    db.query(sql, [UserID, Ort], (err, results) => {
        if (err) {
            res.status(500).json({ error: err.message }); // Fehlerbehandlung
        } else {
            res.status(201).json({ message: 'Client erstellt', ClientID: results.insertId }); // Erfolgreiches Einfügen
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
    const { UserID, Ort } = req.body; // UserID und Ort werden jetzt vom Client gesendet

    // SQL-Abfrage, die sowohl UserID als auch Ort aktualisiert
    const sql = 'UPDATE client SET UserID = ?, Ort = ? WHERE ClientID = ?';
    db.query(sql, [UserID, Ort, clientId], (err, results) => {
        if (err) {
            res.status(500).json({ error: err.message }); // Fehlerbehandlung
        } else if (results.affectedRows === 0) {
            res.status(404).json({ error: 'Client nicht gefunden' }); // Kein Eintrag mit der ID gefunden
        } else {
            res.json({ message: 'Client aktualisiert' }); // Erfolgreiches Update
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


// Feinstaubdaten nach ClientID filtern
app.get('/feinstaubwerte/client/:ClientID', (req, res) => {
    const { ClientID } = req.params;

    // Überprüfen, ob die ClientID eine gültige Zahl ist
    if (isNaN(ClientID)) {
        return res.status(400).json({ error: 'Ungültige ClientID.' });
    }

    // SQL-Abfrage
    db.query(
        'SELECT * FROM feinstaubwert WHERE ClientID = ? ORDER BY Zeitstempel DESC',
        [ClientID],
        (err, results) => {
            if (err) {
                return res.status(500).json({ error: err.message });
            }

            // Überprüfen, ob Daten gefunden wurden
            if (results.length === 0) {
                return res.status(404).json({ error: 'Keine Feinstaubwerte für die angegebene ClientID gefunden.' });
            }

            res.json(results);
        }
    );
});

// GET Feinstaubdaten nach Ort
app.get('/feinstaub/ort/:ort', (req, res) => {
    const ort = req.params.ort; // Ort aus den URL-Parametern
    const sql = `
        SELECT f.WertID, f.PM1.0, f.PM2.5, f.PM10, f.Zeitstempel, c.Ort 
        FROM feinstaubwert AS f
        INNER JOIN client AS c ON f.ClientID = c.ClientID
        WHERE c.Ort = ?
    `;

    db.query(sql, [ort], (err, results) => {
        if (err) {
            res.status(500).json({ error: err.message }); // Fehlerbehandlung
        } else if (results.length === 0) {
            res.status(404).json({ message: 'Keine Feinstaubdaten für diesen Ort gefunden' }); // Kein Ergebnis
        } else {
            res.json(results); // Ergebnisse zurückgeben
        }
    });
});

// POST Registrierung
app.post('/register', (req, res) => {
    const { Vorname, Nachname, Email, Passwort, Brokername } = req.body;

    // Prüfen, ob alle Felder vorhanden sind
    if (!Vorname || !Nachname || !Email || !Passwort || !Brokername) {
        return res.status(400).json({ message: 'Bitte alle Felder ausfüllen' });
    }

    // Prüfen, ob die E-Mail schon registriert ist
    const checkEmailSql = 'SELECT * FROM user WHERE Email = ?';
    db.query(checkEmailSql, [Email], (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        if (results.length > 0) {
            return res.status(409).json({ message: 'E-Mail bereits registriert' });
        }

        // Passwort hashen
        bcrypt.hash(Passwort, 10, (err, hashedPassword) => {
            if (err) {
                return res.status(500).json({ error: err.message });
            }

            // Benutzer in die Datenbank einfügen
            const insertSql = `
                INSERT INTO user (Vorname, Nachname, Email, Passwort, Brokername) 
                VALUES (?, ?, ?, ?, ?)
            `;
            db.query(insertSql, [Vorname, Nachname, Email, hashedPassword, Brokername], (err, results) => {
                if (err) {
                    return res.status(500).json({ error: err.message });
                }
                res.status(201).json({ message: 'Benutzer registriert', UserID: results.insertId });
            });
        });
    });
});


// POST Login
app.post('/login', (req, res) => {
    const { Email, Passwort } = req.body;

    // SQL-Abfrage zur Überprüfung von Email und Passwort
    const sql = 'SELECT UserID, Vorname, Nachname, Email FROM user WHERE Email = ? AND Passwort = ?';

    db.query(sql, [Email, Passwort], (err, results) => {
        if (err) {
            res.status(500).json({ error: 'Interner Serverfehler' });
        } else if (results.length === 0) {
            res.status(401).json({ error: 'Ungültige Anmeldedaten' });
        } else {
            const user = results[0]; // Benutzerinformationen aus der Datenbank
            res.json({
                message: 'Login erfolgreich',
            });
        }
    });
});



// Server starten
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server läuft auf http://localhost:${PORT}`);
});
