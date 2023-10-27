const express = require("express");
const bodyParser = require("body-parser");
const { exec } = require("child_process");
const fs = require("fs");
const cors = require("cors");

const app = express();
const PORT = 3000;

const corsOptions = {
  origin: 'https://hacked23-24.web.app',
  methods: ["GET", "POST"],
  allowedHeaders: ["Content-Type", "ngrok-skip-browser-warning"],
};

app.use(bodyParser.json());
app.use(cors(corsOptions));

app.get("/", (req, res) => {
  res.send("Benvenuto al server!");
});

app.get("/api/compile", (req, res) => {
  res.send("Post me pls to get your C code compiled");
});

app.post("/api/compile", (req, res) => {
  const { code, input, languageId } = req.body;

  if (languageId !== 48) {
    return res.json({
      success: false,
      output: "Linguaggio non supportato",
    });
  }

  const fileName = `temp_code.c`;

  fs.writeFileSync(fileName, code);

  exec(`gcc ${fileName} -o ${fileName}.out`, (err) => {
    if (err) {
      return res.json({
        success: false,
        output: "Errore durante la compilazione: " + err.message,
      });
    }

    exec(`./${fileName}.out`, { timeout: 5000 }, (err, stdout, stderr) => {
      if (err) {
        return res.json({
          success: false,
          output: `Errore durante l'esecuzione: ` + stderr,
        });
      }
      res.json({
        success: true,
        output: stdout,
      });
    });
  });
});

app.listen(PORT, () => {
  console.log(`Server in ascolto sulla porta ${PORT}...`);
});

process.on('exit', () => {
  if (fs.existsSync('temp_code.c')) {
    fs.unlinkSync('temp_code.c');
  }
  if (fs.existsSync('temp_code.c.out')) {
    fs.unlinkSync('temp_code.c.out');
  }
});
