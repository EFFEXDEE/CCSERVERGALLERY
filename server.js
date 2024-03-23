const express = require('express');
const multer = require('multer');
const path = require('path');

const app = express();
const port = 3000;

// Speicherort für die hochgeladenen Fotos
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/') // Das Verzeichnis 'uploads/' muss existieren
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname))
  }
});

// Konfiguration von Multer
const upload = multer({ storage: storage });

// POST-Endpunkt für das Hochladen von Fotos
app.post('/upload', upload.single('photo'), (req, res) => {
  if (!req.file) {
    return res.status(400).send('Es wurde keine Datei hochgeladen.');
  }

  // Hier kannst du weitere Logik hinzufügen, z.B. Datenbankoperationen usw.

  res.send('Foto erfolgreich hochgeladen: ' + req.file.filename);
});

// Server starten
app.listen(port, () => {
  console.log(`Server läuft auf http://localhost:${port}`);
});

