const express = require('express');
const multer = require('multer');
const fs = require('fs');
const cors = require('cors');

const app = express();
app.use(cors());
const port = 3000;

// Speicherort für die hochgeladenen Fotos
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/') // Das Verzeichnis 'uploads/' muss existieren
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now()+'.jpeg')
  }
});

// Konfiguration von Multer
const upload = multer({ storage: storage });

// POST-Endpunkt für das Hochladen von Fotos
app.post('/uploads', upload.single('photo'), (req, res) => {
  if (!req.file) {
    return res.status(400).send('Es wurde keine Datei hochgeladen.');
  }

  // Hier kannst du weitere Logik hinzufügen, z.B. Datenbankoperationen usw.

  res.send('Foto erfolgreich hochgeladen: ' + req.file.filename);
});

// GET-Endpunkt, um alle hochgeladenen Dateien zurückzugeben
// GET-Endpunkt, um alle hochgeladenen Dateien zurückzugeben
// GET-Endpunkt, um alle hochgeladenen Bilder zurückzugeben
app.get('/uploads', (req, res) => {
  fs.readdir('uploads/', (err, files) => {
    if (err) {
      return res.status(500).send('Ein Fehler ist aufgetreten.');
    }

    // Array, um Bilddaten zu speichern
    let imageData = [];

    // Schleife durch jede Datei im Verzeichnis
    files.forEach((file) => {
      const filePath = `uploads/${file}`;

      // Lesen der Bilddatei
      fs.readFile(filePath, (err, data) => {
        if (err) {
          console.error(`Fehler beim Lesen der Datei ${filePath}: ${err}`);
          return;
        }

        // Hinzufügen der Bilddaten zum imageData-Array
        imageData.push({
          filename: file,
          data: data.toString('base64') // Bilddaten als Base64 kodiert
        });

        // Wenn alle Bilder gelesen wurden, sende die Antwort
        if (imageData.length === files.length) {
          res.json(imageData);
        }
      });
    });
  });
});



// Server starten
app.listen(port, () => {
  console.log(`Server läuft auf http://localhost:${port}`);
});




