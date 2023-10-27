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

// Middlewares
app.use(bodyParser.json());
app.use(cors(corsOptions)); 

// Endopoint Get
app.get("/", (req, res) => {
  res.send("Benvenuto al server!");
});

app.get("/api/compile", (req, res) => {
  res.send("Post me pls to get your C code compiled");
});

// Endpoint POST /api/compile
app.post("/api/compile", (req, res) => {
  const { code, input, languageId } = req.body;

  if (languageId !== 48) {
    return res.json({
      success: false,
      output: "Linguaggio non supportato",
    });
  }

  const uniqueFileName = `temp_${Date.now()}_${Math.random().toString(36).slice(2, 11)}.c`;

  fs.writeFileSync(uniqueFileName, code);

  try {
    exec(`gcc ${uniqueFileName} -o ${uniqueFileName}.out`, (err) => {
      if (err) {
        return res.json({
          success: false,
          output: "Errore durante la compilazione: " + err.message,
        });
      }

      exec(
        `./${uniqueFileName}.out`,
        { timeout: 5000 },
        (err, stdout, stderr) => {
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
        }
      );
    });
  } finally {
    fs.unlinkSync(uniqueFileName);
    if (fs.existsSync(`${uniqueFileName}.out`)) {
      fs.unlinkSync(`${uniqueFileName}.out`);
    }
  }
});

app.listen(PORT, () => {
  console.log(`Server in ascolto sulla porta ${PORT}...`);
});
