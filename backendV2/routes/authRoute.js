const express = require('express');
const router = express.Router();
const admin = require('../firebaseSetup.js');

router.post('/register', async (req, res) => {
    const { email, password, name } = req.body;
  
    if (!email || !password) {
      return res.status(400).json({ error: 'Email et mot de passe requis.' });
    }
  
    try {
      const user = await admin.auth().createUser({
        email,
        password,
        displayName: name,
      });
  
      res.status(201).json({
        message: 'Utilisateur créé avec succès.',
        uid: user.uid,
        email: user.email,
      });
    } catch (error) {
      console.error('Erreur création utilisateur:', error);
      res.status(500).json({ error: error.message });
    }
});

module.exports = router;