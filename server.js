const express = require('express');
const bodyParser = require('body-parser');
const { exec } = require('child_process');
const fs = require('fs');


const app = express();
const PORT = 3000;

// Middlewares
app.use(bodyParser.json());

// Endopoint Get
app.get('/', (req, res) => {
    res.send('Benvenuto al server!');
});

app.get('/api/compile', (req, res) => {
    res.send('Post me pls to get your C code compiled');
});

// Endpoint api/compile
app.post('/api/compile', (req, res) => {
    const { code, input, languageId } = req.body;

    if (languageId !== '48') { // Assicurati di utilizzare l'ID corretto per il linguaggio C
        return res.json({
            success: false,
            output: 'Linguaggio non supportato'
        });
    }

    // Scrivi il codice in un file temporaneo
    fs.writeFileSync('temp.c', code);

    // Compila il codice
    exec('gcc temp.c -o temp.out', (err) => {
        if (err) {
            return res.json({
                success: false,
                output: 'Errore durante la compilazione: ' + err.message
            });
        }

        // Esegui il codice compilato
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
