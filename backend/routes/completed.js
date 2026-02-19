const express = require('express');
const { PrismaClient } = require('@prisma/client');
const { authMiddleware, adminOnly } = require('../middleware/authMiddleware');

const router = express.Router();
const prisma = new PrismaClient();

// GET all completed drives
router.get('/', authMiddleware, async (req, res) => {
    try {
        const drives = await prisma.completedDrive.findMany({
            orderBy: { createdAt: 'desc' },
            include: { admin: { select: { name: true, email: true } } },
        });
        res.json(drives);
    } catch (err) {
        console.error('Get completed error:', err);
        res.status(500).json({ error: 'Failed to fetch completed drives' });
    }
});

// POST create completed drive (admin only)
router.post('/', authMiddleware, adminOnly, async (req, res) => {
    try {
        const {
            name, jd, finalListName, finalListUrl, selectedListName, selectedListUrl,
            selectedCount, spcMemberName, spcMemberPhone, spcMemberEmail,
        } = req.body;

        if (!name || !jd || !spcMemberName) {
            return res.status(400).json({ error: 'Name, JD, and SPC member name are required' });
        }

        const drive = await prisma.completedDrive.create({
            data: {
                name,
                jd,
                finalListName,
                finalListUrl,
                selectedListName,
                selectedListUrl,
                selectedCount: selectedCount || 0,
                spcMemberName,
                spcMemberPhone,
                spcMemberEmail,
                createdBy: req.user.id,
            },
        });

        await prisma.auditLog.create({
            data: {
                adminId: req.user.id,
                action: 'CREATE',
                tableName: 'completed_drives',
                recordId: drive.id,
                newData: drive,
            },
        });

        res.status(201).json(drive);
    } catch (err) {
        console.error('Create completed error:', err);
        res.status(500).json({ error: 'Failed to create completed drive' });
    }
});

// PUT update completed drive (admin only)
router.put('/:id', authMiddleware, adminOnly, async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const {
            name, jd, finalListName, finalListUrl, selectedListName, selectedListUrl,
            selectedCount, spcMemberName, spcMemberPhone, spcMemberEmail,
        } = req.body;

        const oldData = await prisma.completedDrive.findUnique({ where: { id } });
        if (!oldData) return res.status(404).json({ error: 'Drive not found' });

        const drive = await prisma.completedDrive.update({
            where: { id },
            data: {
                ...(name && { name }),
                ...(jd && { jd }),
                ...(finalListName !== undefined && { finalListName }),
                ...(finalListUrl !== undefined && { finalListUrl }),
                ...(selectedListName !== undefined && { selectedListName }),
                ...(selectedListUrl !== undefined && { selectedListUrl }),
                ...(selectedCount !== undefined && { selectedCount }),
                ...(spcMemberName && { spcMemberName }),
                ...(spcMemberPhone !== undefined && { spcMemberPhone }),
                ...(spcMemberEmail !== undefined && { spcMemberEmail }),
            },
        });

        await prisma.auditLog.create({
            data: {
                adminId: req.user.id,
                action: 'UPDATE',
                tableName: 'completed_drives',
                recordId: id,
                oldData,
                newData: drive,
            },
        });

        res.json(drive);
    } catch (err) {
        console.error('Update completed error:', err);
        res.status(500).json({ error: 'Failed to update completed drive' });
    }
});

// DELETE completed drive (admin only)
router.delete('/:id', authMiddleware, adminOnly, async (req, res) => {
    try {
        const id = parseInt(req.params.id);

        const oldData = await prisma.completedDrive.findUnique({ where: { id } });
        if (!oldData) return res.status(404).json({ error: 'Drive not found' });

        await prisma.completedDrive.delete({ where: { id } });

        await prisma.auditLog.create({
            data: {
                adminId: req.user.id,
                action: 'DELETE',
                tableName: 'completed_drives',
                recordId: id,
                oldData,
            },
        });

        res.json({ message: 'Drive deleted successfully' });
    } catch (err) {
        console.error('Delete completed error:', err);
        res.status(500).json({ error: 'Failed to delete completed drive' });
    }
});

module.exports = router;
