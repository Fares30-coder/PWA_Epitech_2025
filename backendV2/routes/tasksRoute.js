const express = require('express');
const { db } = require('../firebaseSetup');
const authMiddleware = require('../middlewares/authMiddleware');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');

router.post('/:boardId/:columnId', authMiddleware, async (req, res) => {
    const { title } = req.body;
    const { boardId, columnId } = req.params;

    try {
        const ref = db.ref(`columns/${boardId}/${columnId}/tasks`).push();
        const task = { id: ref.key, title };
        await ref.set(task);
        res.json(task);
    } catch (error) {
        console.error('Erreur ajout tâche:', error);
        res.status(500).json({ error: 'Erreur ajout tâche' });
    }
});

router.put('/:boardId/:columnId/:taskId', authMiddleware, async (req, res) => {
    const { title, description } = req.body;
    await db.ref(`columns/${req.params.boardId}/${req.params.columnId}/tasks/${req.params.taskId}`).update({ title, description });
    res.json({ id: req.params.taskId, title, description });
});

router.delete('/:boardId/:columnId/:taskId', authMiddleware, async (req, res) => {
    await db.ref(`columns/${req.params.boardId}/${req.params.columnId}/tasks/${req.params.taskId}`).remove();
    res.json({ success: true });
});

module.exports = router;
