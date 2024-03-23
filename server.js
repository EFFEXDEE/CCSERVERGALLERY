const express = require('express');
const multer = require('multer');
const fs = require('fs');
const cors = require('cors');

const app = express();
app.use(cors());
const port = 3000;

// Speicherort für hochgeladenen Fotos
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/') // Das Verzeichnis 'uploads/' muss existieren
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now()+'.jpeg')
  }
});

const upload = multer({ storage: storage });

//Hochladen von Fotos
app.post('/uploads', upload.single('photo'), (req, res) => {
  if (!req.file) {
    return res.status(400).send('Es wurde keine Datei hochgeladen.');
  }

  res.send('Foto erfolgreich hochgeladen: ' + req.file.filename);
});


app.get('/uploads', (req, res) => {
  fs.readdir('uploads/', (err, files) => {
    if (err) {
      return res.status(500).send('Ein Fehler ist aufgetreten.');
    }

    //Bilddaten speichern
    let imageData = [];

    files.forEach((file) => {
      const filePath = `uploads/${file}`;

      // Lesen der Bilddatei
      fs.readFile(filePath, (err, data) => {
        if (err) {
          console.error(`Fehler beim Lesen der Datei ${filePath}: ${err}`);
          return;
        }

        // Hinzufügen der Bilddaten zum Array
        imageData.push({
          filename: file,
          data: data.toString('base64') // Bilddaten als Base64 kodiert
        });

        // Wenn alles gelesen, sende Antwort
        if (imageData.length === files.length) {
          res.json(imageData);
        }
      });
    });
  });
});

app.delete('/uploads/:filename', (req, res) => {
  const filename = req.params.filename;
  const filePath = `uploads/${filename}`;

  fs.unlink(filePath, (err) => {
    if (err) {
      console.error(`Fehler beim Löschen der Datei ${filePath}: ${err}`);
      return res.status(500).send('Ein Fehler ist aufgetreten.');
    }

    res.send(`Foto ${filename} erfolgreich gelöscht.`);
  });
});




// Server starten
app.listen(port, () => {
  console.log(`Server läuft auf http://localhost:${port}`);
});




