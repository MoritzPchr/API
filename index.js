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

// Endpunkte:
//GET all Clients
app.get('/clients', (req, res) => {
    db.query('SELECT * FROM client', (err, results) => {
        if (err) {
            res.status(500).json({ error: err.message });
        } else {
            res.json(results);
        }
    });
});

//GET all Users
app.get('/users', (req, res) => {
    db.query('SELECT * FROM user', (err, results) => {
        if (err) {
            res.status(500).json({ error: err.message });
        } else {
            res.json(results);
        }
    });
});

//GET all Feinstaubwerte
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
app.post('/user', async (req, res) => {
    const { Vorname, Nachname, Email, Passwort, Brokername } = req.body;

    try {
        // Prüfen, ob die E-Mail bereits registriert ist
        const [emailCheck] = await db.promise().query('SELECT * FROM user WHERE Email = ?', [Email]);
        if (emailCheck.length > 0) {
            return res.status(409).json({ message: 'E-Mail bereits registriert' });
        }

        // Passwort hashen
        const hashedPassword = await bcrypt.hash(Passwort, 10);

        // Benutzer einfügen
        const [result] = await db.promise().query(
            'INSERT INTO user (Vorname, Nachname, Email, Passwort, Brokername) VALUES (?, ?, ?, ?, ?)',
            [Vorname, Nachname, Email, hashedPassword, Brokername]
        );

        res.status(201).json({ message: 'Benutzer erstellt', UserID: result.insertId });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// POST Client
app.post('/client', (req, res) => {
    const { UserID, Ort } = req.body;

    // Überprüfen, ob der Benutzer existiert
    const checkUserSql = 'SELECT UserID FROM user WHERE UserID = ?';
    db.query(checkUserSql, [UserID], (userErr, userResults) => {
        if (userErr) {
            return res.status(500).json({ error: userErr.message }); // Fehlerbehandlung
        }
        if (userResults.length === 0) {
            return res.status(404).json({ error: 'Benutzer nicht gefunden' }); // UserID existiert nicht
        }

        // Wenn der Benutzer existiert, füge den neuen Client ein
        const insertSql = 'INSERT INTO client (UserID, Ort) VALUES (?, ?)';
        db.query(insertSql, [UserID, Ort], (insertErr, insertResults) => {
            if (insertErr) {
                res.status(500).json({ error: insertErr.message }); // Fehlerbehandlung
            } else {
                res.status(201).json({ message: 'Client erstellt', ClientID: insertResults.insertId }); // Erfolgreiches Einfügen
            }
        });
    });
});



// PUT User
app.put('/user/:id', async (req, res) => {
    const userId = req.params.id;
    const { Vorname, Nachname, Email, Passwort, Brokername } = req.body;

    try {
        // Prüfen, ob die E-Mail bereits von einem anderen Benutzer genutzt wird
        if (Email) {
            const [emailCheck] = await db.promise().query(
                'SELECT * FROM user WHERE Email = ? AND UserID != ?',
                [Email, userId]
            );
            if (emailCheck.length > 0) {
                return res.status(409).json({ message: 'E-Mail bereits registriert' });
            }
        }

        // Passwort hashen, falls vorhanden
        let hashedPassword = null;
        if (Passwort) {
            hashedPassword = await bcrypt.hash(Passwort, 10);
        }

        // Benutzer aktualisieren
        const updateQuery = `
            UPDATE user 
            SET Vorname = ?, Nachname = ?, Email = ?, ${Passwort ? 'Passwort = ?,' : ''} Brokername = ? 
            WHERE UserID = ?
        `;

        const params = [
            Vorname,
            Nachname,
            Email,
            ...(Passwort ? [hashedPassword] : []),
            Brokername,
            userId,
        ];

        const [result] = await db.promise().query(updateQuery, params);

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Benutzer nicht gefunden' });
        }

        res.json({ message: 'Benutzer aktualisiert' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// PUT Client
app.put('/client/:id', (req, res) => {
    const clientId = req.params.id;
    const { UserID, Ort } = req.body;

    // Überprüfen, ob der Benutzer existiert
    const checkUserSql = 'SELECT UserID FROM user WHERE UserID = ?';
    db.query(checkUserSql, [UserID], (userErr, userResults) => {
        if (userErr) {
            return res.status(500).json({ error: userErr.message }); // Fehlerbehandlung
        }
        if (userResults.length === 0) {
            return res.status(404).json({ error: 'Benutzer nicht gefunden' }); // UserID existiert nicht
        }

        // Wenn der Benutzer existiert, aktualisiere den Client
        const updateSql = 'UPDATE client SET UserID = ?, Ort = ? WHERE ClientID = ?';
        db.query(updateSql, [UserID, Ort, clientId], (updateErr, updateResults) => {
            if (updateErr) {
                res.status(500).json({ error: updateErr.message }); // Fehlerbehandlung
            } else if (updateResults.affectedRows === 0) {
                res.status(404).json({ error: 'Client nicht gefunden' }); // Kein Eintrag mit der ID gefunden
            } else {
                res.json({ message: 'Client erfolgreich aktualisiert' }); // Erfolgreiches Update
            }
        });
    });
});

//DELETE USER
app.delete('/user/:id', (req, res) => {
    const userId = req.params.id;

    // Prüfe, ob noch Clients für den User existieren
    const checkClients = 'SELECT COUNT(*) AS clientCount FROM client WHERE UserID = ?';

    db.query(checkClients, [userId], (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }

        const clientCount = results[0].clientCount;

        if (clientCount > 0) {
            return res.status(400).json({
                error: 'User kann nicht gelöscht werden, solange noch Clients mit ihm verknüpft sind',
            });
        }

        // Lösche den User, da keine Clients mehr verknüpft sind
        db.query('DELETE FROM user WHERE UserID = ?', [userId], (deleteErr, deleteResults) => {
            if (deleteErr) {
                res.status(500).json({ error: deleteErr.message });
            } else if (deleteResults.affectedRows === 0) {
                res.status(404).json({ error: 'User nicht gefunden' });
            } else {
                res.json({ message: 'User gelöscht' });
            }
        });
    });
});


//DELETE CLIENT
app.delete('/client/:id', (req, res) => {
    const clientId = req.params.id;

    // Lösche den Client, Feinstaubwerte werden automatisch gelöscht (ON DELETE CASCADE)
    db.query('DELETE FROM client WHERE ClientID = ?', [clientId], (err, results) => {
        if (err) {
            res.status(500).json({ error: err.message });
        } else if (results.affectedRows === 0) {
            res.status(404).json({ error: 'Client nicht gefunden' });
        } else {
            res.json({ message: 'Client und zugehörige Feinstaubwerte gelöscht' });
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

    // SQL-Abfrage, um den Benutzer anhand der E-Mail zu finden
    const sql = 'SELECT UserID, Vorname, Nachname, Email, Passwort FROM user WHERE Email = ?';

    db.query(sql, [Email], (err, results) => {
        if (err) {
            return res.status(500).json({ error: 'Interner Serverfehler' });
        }

        // Prüfen, ob der Benutzer existiert
        if (results.length === 0) {
            return res.status(401).json({ error: 'Ungültige Anmeldedaten' });
        }

        const user = results[0];

        // Passwort prüfen
        bcrypt.compare(Passwort, user.Passwort, (err, isMatch) => {
            if (err) {
                return res.status(500).json({ error: 'Interner Serverfehler' });
            }

            if (!isMatch) {
                return res.status(401).json({ error: 'Ungültige Anmeldedaten' });
            }

            // Erfolgreiche Anmeldung
            res.json({
                message: 'Login erfolgreich',
            });
        });
    });
});




//Lokalen Server starten
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server läuft auf http://localhost:${PORT}`);
});
