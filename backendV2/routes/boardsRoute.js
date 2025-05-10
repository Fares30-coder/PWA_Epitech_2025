const express = require('express');
const { admin, db } = require('../firebaseSetup');
const authMiddleware = require('../middlewares/authMiddleware');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');

router.post('/', authMiddleware, async (req, res) => {
    const { name } = req.body;
    const userId = req.user.uid;

    if (!name) {
        return res.status(400).json({ error: 'Le nom du board est requis.' });
    }

    try {
        const boardId = uuidv4();
        const code = Math.random().toString(36).substring(2, 8).toUpperCase();

        const boardData = {
            id: boardId,
            name,
            owner: userId,
            code,
            members: [userId],
            createdAt: Date.now()
        };

        await db.ref(`boards/${boardId}`).set(boardData);

        res.status(201).json(boardData);
    } catch (error) {
        console.error('Erreur création board:', error);
        res.status(500).json({ error: 'Erreur lors de la création du board.' });
    }
});

router.post('/join', authMiddleware, async (req, res) => {
    const { code } = req.body;
    const userId = req.user.uid;

    if (!code) {
        return res.status(400).json({ error: 'Le code est requis.' });
    }

    try {
        const snapshot = await db.ref('boards').orderByChild('code').equalTo(code).once('value');
        if (!snapshot.exists()) {
            return res.status(404).json({ error: 'Aucun board trouvé avec ce code.' });
        }

        let boardId = null;
        let boardData = null;

        snapshot.forEach(child => {
            boardId = child.key;
            boardData = child.val();
        });

        if (!boardData.members.includes(userId)) {
            boardData.members.push(userId);
            await db.ref(`boards/${boardId}`).update({ members: boardData.members });
        }

        res.json({
            message: 'Board rejoint avec succès.',
            boardId,
            name: boardData.name
        });
    } catch (error) {
        console.error('Erreur rejoindre board:', error);
        res.status(500).json({ error: 'Erreur lors de la tentative de rejoindre le board.' });
    }
});

module.exports = router;
