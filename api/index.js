const express = require('express');
const { alerter } = require('../lib/utils');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;;

app.use(express.json()); // Pour interpréter les requêtes JSON

// Définir une route de base
app.get('/', (req, res) => {
    res.send("Bienvenue sur l'API Djowett!");
});

app.post('/api/alerte', async (req, res) => {
    //https://www.rdv-prefecture.interieur.gouv.fr/rdvpref/reservation/demarche/6860/formulaire/*
    const _body = req.body;
    console.log(_body)
    const reponse = await alerter(_body["link"])
    console.log(reponse)
    res.json(reponse);
});

// Démarrer le serveur
app.listen(PORT, () => {
    console.log(`Serveur démarré sur le port ${PORT}`);
});


// Exporter la fonction handler pour Vercel
module.exports = app;