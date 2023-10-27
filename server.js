const express = require("express");
const bodyParser = require("body-parser");
const { exec } = require("child_process");
const fs = require("fs");
const cors = require("cors");

const app = express();
const PORT = 3000;

const corsOptions = {
  //origin: 'https://hacked23-24.web.app',
  origin: true,
  methods: ["POST"],
  allowedHeaders: ["Content-Type"],
};

// Abilita CORS per tutte le altre rotte (se necessario)
app.use(cors());

// Middlewares
app.use(bodyParser.json());

// Endopoint Get
app.get("/", (req, res) => {
  res.send("Benvenuto al server!");
});

app.get("/api/compile", (req, res) => {
  res.send("Post me pls to get your C code compiled");
});

// Endpoint POST /api/compile
app.post("/api/compile", cors(corsOptions), (req, res) => {
  const { code, input, languageId } = req.body;

  if (languageId !== 48) {
    return res.json({
      success: false,
      output: "Linguaggio non supportato",
    });
  }

  const uniqueFileName = `temp_${Date.now()}_${Math.random()
    .toString(36)
    .from(2, 9)}.c`;

  fs.writeFileSync(uniqueFileName, code);

  exec(`gcc ${uniqueFileName} -o ${uniqueFileName}.out`, (err) => {
    if (err) {
      fs.unlinkSync(uniqueFileName);

      return res.json({
        success: false,
        output: "Errore durante la compilazione: " + err.message,
      });
    }

    exec(
      `./${uniqueFileName}.out`,
      { timeout: 5000 },
      (err, stdout, stderr) => {
        fs.unlinkSync(uniqueFileName);
        fs.unlinkSync(`${uniqueFileName}.out`);

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
});

app.listen(PORT, () => {
  console.log(`Server in ascolto sulla porta ${PORT}...`);
});
