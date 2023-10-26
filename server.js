const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const PORT = 3000;

// Middlewares
app.use(bodyParser.json());

// Endopoint Get
app.get('/', (req, res) => {
    res.send('Benvenuto al server!');
});

// Endpoint api/compile
app.post('/api/compile', (req, res) => {
    const { code, input, languageId } = req.body;

    // Qui puoi eseguire la compilazione e l'esecuzione del codice...
    // ... e restituire l'output come risposta.

    // Per ora, restituiamo un semplice messaggio come esempio:
    res.json({
        success: true,
        output: `Il tuo codice è: ${code}. Input fornito: ${input}. Linguaggio ID: ${languageId}`
    });
});

app.listen(PORT, () => {
    console.log(`Server in ascolto sulla porta ${PORT}...`);
});
