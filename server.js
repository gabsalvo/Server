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

  const fileName = `temp_code`;

  fs.writeFileSync(`${fileName}.c`, code);

  try {
    exec(`gcc ${fileName}.c -o ${fileName}.out`, (err) => {
      if (err) {
        return res.json({
          success: false,
          output: "Errore durante la compilazione: " + err.message,
        });
      }

      exec(
        `./${fileName}.out`,
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
    fs.unlinkSync(`${fileName}.c`);
    if (fs.existsSync(`${fileName}.out`)) {
      fs.unlinkSync(`${fileName}.out`);
    }
  }
});

app.listen(PORT, () => {
  console.log(`Server in ascolto sulla porta ${PORT}...`);
});
