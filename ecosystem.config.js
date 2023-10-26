module.exports = {
  apps: [
    {
      name: "my-node-server",
      script: "./server.js",  // Percorso al tuo server Node.js
      watch: true,
      env: {
        "PORT": 3000,
        "NODE_ENV": "development"
      }
    },
    {
      name: "ngrok",
      script: "ngrok",  // Assicurati che ngrok sia nel tuo PATH o specifica il percorso completo
      args: "http 3000"  // Porta sulla quale il tuo server Node.js è in esecuzione
    }
  ]
};
