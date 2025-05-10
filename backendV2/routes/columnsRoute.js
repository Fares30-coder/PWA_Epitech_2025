const express = require('express');
const { db } = require('../firebaseSetup');
const authMiddleware = require('../middlewares/authMiddleware');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');

router.get('/:boardId', authMiddleware, async (req, res) => {
    const snapshot = await db.ref(`columns/${req.params.boardId}`).once('value');
    res.json(snapshot.val() || {});
});

router.post('/:boardId', authMiddleware, async (req, res) => {
    const { name } = req.body;
    const columnId = uuidv4();
    await db.ref(`columns/${req.params.boardId}/${columnId}`).set({ id: columnId, name, tasks: [] });
    res.status(201).json({ id: columnId, name, tasks: [] });
});

router.put('/:boardId/:columnId', authMiddleware, async (req, res) => {
    const { name } = req.body;
    await db.ref(`columns/${req.params.boardId}/${req.params.columnId}`).update({ name });
    res.json({ id: req.params.columnId, name });
});

router.delete('/:boardId/:columnId', authMiddleware, async (req, res) => {
    await db.ref(`columns/${req.params.boardId}/${req.params.columnId}`).remove();
    res.json({ success: true });
});

module.exports = router;
