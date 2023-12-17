const express = require("express");
const bodyParser = require("body-parser");
const { exec } = require("child_process");
const fs = require("fs");
const cors = require("cors");

const app = express();
const PORT = 3000;

const corsOptions = {
  origin: true,
  methods: ["GET", "POST"],
  allowedHeaders: ["Content-Type", "ngrok-skip-browser-warning"],
};

app.use(bodyParser.json());
app.use(cors(corsOptions));

app.get("/", (req, res) => {
  res.send("Benvenuto al server di compilazione!");
});

app.get("/api/compile", (req, res) => {
  res.send("Invia una richiesta POST con il tuo codice C per compilarlo.");
});

app.post("/api/compile", (req, res) => {
  const { code, input, languageId } = req.body;

  if (languageId !== 48) {
    return res.status(400).json({
      success: false,
      output: "Linguaggio non supportato. Attualmente supportiamo solo C.",
    });
  }

  
  if (!code || typeof code !== 'string') {
    return res.status(400).json({
      success: false,
      output: "Nessun codice fornito o il formato del codice non è valido.",
    });
  }

  compileCCode(code, (error, stdout, stderr) => {
    if (error) {
      return res.status(500).json({
        success: false,
        output: `Errore durante l'esecuzione: ${stderr || error.message}`,
      });
    }
    res.json({
      success: true,
      output: stdout,
    });
  });
});

function compileCCode(code, callback) {
  const uniqueFileName = `temp_${Date.now()}_${Math.random().toString(36).slice(2, 11)}.c`;
  fs.writeFileSync(uniqueFileName, code);

  exec(`gcc ${uniqueFileName} -o ${uniqueFileName}.out`, (compileErr) => {
    if (compileErr) {
      cleanupFiles(uniqueFileName);
      return callback(compileErr);
    }

    exec(`./${uniqueFileName}.out`, { timeout: 5000 }, (execErr, stdout, stderr) => {
      cleanupFiles(uniqueFileName);
      callback(execErr, stdout, stderr);
    });
  });
}

function cleanupFiles(filename) {
  try {
    if (fs.existsSync(filename)) {
      fs.unlinkSync(filename);
    }
    const outFile = `${filename}.out`;
    if (fs.existsSync(outFile)) {
      fs.unlinkSync(outFile);
    }
  } catch (error) {
    console.error('Errore durante la pulizia dei file:', error);
  }
}

app.listen(PORT, () => {
  console.log(`Server di compilazione in ascolto sulla porta ${PORT}`);
});
