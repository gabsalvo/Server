const express = require('express');
const bodyParser = require('body-parser');
const { exec } = require('child_process');
const fs = require('fs');
const cors = require('cors');

const app = express();
const PORT = 3000;

const corsOptions = {
    //origin: 'https://hacked23-24.web.app',
    origin: true,
    methods: ['POST'],
    allowedHeaders: ['Content-Type']
};

// Abilita CORS per tutte le altre rotte (se necessario)
app.use(cors());

// Middlewares
app.use(bodyParser.json());

// Endopoint Get
app.get('/', (req, res) => {
    res.send('Benvenuto al server!');
});

app.get('/api/compile', (req, res) => {
    res.send('Post me pls to get your C code compiled');
});

// Endpoint api/compile con corsOptions
app.post('/api/compile', cors(corsOptions), (req, res) => {
    const { code, input, languageId } = req.body;

    if (languageId !== 48) {
        return res.json({
            success: false,
            output: 'Linguaggio non supportato'
        });
    }

    fs.writeFileSync('temp.c', code);

    exec('gcc temp.c -o temp.out', (err) => {
        if (err) {
            return res.json({
                success: false,
                output: 'Errore durante la compilazione: ' + err.message
            });
        }

        exec('./temp.out', { timeout: 5000 }, (err, stdout, stderr) => {
            if (err) {
                return res.json({
                    success: false,
                    output: `Errore durante l'esecuzione: ` + stderr
                });
            }
            res.json({
                success: true,
                output: stdout
            });
        });
    });
});

app.listen(PORT, () => {
    console.log(`Server in ascolto sulla porta ${PORT}...`);
});
