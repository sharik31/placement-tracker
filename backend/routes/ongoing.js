const express = require('express');
const { PrismaClient } = require('@prisma/client');
const { authMiddleware, adminOnly } = require('../middleware/authMiddleware');

const router = express.Router();
const prisma = new PrismaClient();

// GET all ongoing drives
router.get('/', authMiddleware, async (req, res) => {
    try {
        const drives = await prisma.ongoingDrive.findMany({
            orderBy: { createdAt: 'desc' },
            include: { admin: { select: { name: true, email: true } } },
        });
        res.json(drives);
    } catch (err) {
        console.error('Get ongoing error:', err);
        res.status(500).json({ error: 'Failed to fetch ongoing drives' });
    }
});

// POST create ongoing drive (admin only)
router.post('/', authMiddleware, adminOnly, async (req, res) => {
    try {
        const { name, jd, status, currentRound, roundNumber, totalRounds, gformLink, gformDeadline } = req.body;

        if (!name || !jd || !status) {
            return res.status(400).json({ error: 'Name, JD, and status are required' });
        }

        if (!['gform', 'round'].includes(status)) {
            return res.status(400).json({ error: 'Status must be "gform" or "round"' });
        }

        const drive = await prisma.ongoingDrive.create({
            data: {
                name,
                jd,
                status,
                currentRound,
                roundNumber: roundNumber || 0,
                totalRounds: totalRounds || 0,
                gformLink,
                gformDeadline: gformDeadline ? new Date(gformDeadline) : null,
                createdBy: req.user.id,
            },
        });

        await prisma.auditLog.create({
            data: {
                adminId: req.user.id,
                action: 'CREATE',
                tableName: 'ongoing_drives',
                recordId: drive.id,
                newData: drive,
            },
        });

        res.status(201).json(drive);
    } catch (err) {
        console.error('Create ongoing error:', err);
        res.status(500).json({ error: 'Failed to create ongoing drive' });
    }
});

// PUT update ongoing drive (admin only)
router.put('/:id', authMiddleware, adminOnly, async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const { name, jd, status, currentRound, roundNumber, totalRounds, gformLink, gformDeadline } = req.body;

        const oldData = await prisma.ongoingDrive.findUnique({ where: { id } });
        if (!oldData) return res.status(404).json({ error: 'Drive not found' });

        const drive = await prisma.ongoingDrive.update({
            where: { id },
            data: {
                ...(name && { name }),
                ...(jd && { jd }),
                ...(status && { status }),
                ...(currentRound !== undefined && { currentRound }),
                ...(roundNumber !== undefined && { roundNumber }),
                ...(totalRounds !== undefined && { totalRounds }),
                ...(gformLink !== undefined && { gformLink }),
                ...(gformDeadline !== undefined && { gformDeadline: gformDeadline ? new Date(gformDeadline) : null }),
            },
        });

        await prisma.auditLog.create({
            data: {
                adminId: req.user.id,
                action: 'UPDATE',
                tableName: 'ongoing_drives',
                recordId: id,
                oldData,
                newData: drive,
            },
        });

        res.json(drive);
    } catch (err) {
        console.error('Update ongoing error:', err);
        res.status(500).json({ error: 'Failed to update ongoing drive' });
    }
});

// DELETE ongoing drive (admin only)
router.delete('/:id', authMiddleware, adminOnly, async (req, res) => {
    try {
        const id = parseInt(req.params.id);

        const oldData = await prisma.ongoingDrive.findUnique({ where: { id } });
        if (!oldData) return res.status(404).json({ error: 'Drive not found' });

        await prisma.ongoingDrive.delete({ where: { id } });

        await prisma.auditLog.create({
            data: {
                adminId: req.user.id,
                action: 'DELETE',
                tableName: 'ongoing_drives',
                recordId: id,
                oldData,
            },
        });

        res.json({ message: 'Drive deleted successfully' });
    } catch (err) {
        console.error('Delete ongoing error:', err);
        res.status(500).json({ error: 'Failed to delete ongoing drive' });
    }
});

module.exports = router;
