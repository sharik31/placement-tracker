const express = require('express');
const { PrismaClient } = require('@prisma/client');
const { authMiddleware, adminOnly } = require('../middleware/authMiddleware');

const router = express.Router();
const prisma = new PrismaClient();

// GET all upcoming companies (public, needs auth)
router.get('/', authMiddleware, async (req, res) => {
    try {
        const companies = await prisma.upcomingCompany.findMany({
            orderBy: { tentativeDate: 'asc' },
            include: { admin: { select: { name: true, email: true } } },
        });
        res.json(companies);
    } catch (err) {
        console.error('Get upcoming error:', err);
        res.status(500).json({ error: 'Failed to fetch upcoming companies' });
    }
});

// POST create upcoming company (admin only)
router.post('/', authMiddleware, adminOnly, async (req, res) => {
    try {
        const { name, tentativeDate, info, attachmentName, attachmentUrl } = req.body;

        if (!name || !tentativeDate) {
            return res.status(400).json({ error: 'Name and tentative date are required' });
        }

        const company = await prisma.upcomingCompany.create({
            data: {
                name,
                tentativeDate: new Date(tentativeDate),
                info,
                attachmentName,
                attachmentUrl,
                createdBy: req.user.id,
            },
        });

        // Audit log
        await prisma.auditLog.create({
            data: {
                adminId: req.user.id,
                action: 'CREATE',
                tableName: 'upcoming_companies',
                recordId: company.id,
                newData: company,
            },
        });

        res.status(201).json(company);
    } catch (err) {
        console.error('Create upcoming error:', err);
        res.status(500).json({ error: 'Failed to create upcoming company' });
    }
});

// PUT update upcoming company (admin only)
router.put('/:id', authMiddleware, adminOnly, async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const { name, tentativeDate, info, attachmentName, attachmentUrl } = req.body;

        const oldData = await prisma.upcomingCompany.findUnique({ where: { id } });
        if (!oldData) return res.status(404).json({ error: 'Company not found' });

        const company = await prisma.upcomingCompany.update({
            where: { id },
            data: {
                ...(name && { name }),
                ...(tentativeDate && { tentativeDate: new Date(tentativeDate) }),
                ...(info !== undefined && { info }),
                ...(attachmentName !== undefined && { attachmentName }),
                ...(attachmentUrl !== undefined && { attachmentUrl }),
            },
        });

        await prisma.auditLog.create({
            data: {
                adminId: req.user.id,
                action: 'UPDATE',
                tableName: 'upcoming_companies',
                recordId: id,
                oldData,
                newData: company,
            },
        });

        res.json(company);
    } catch (err) {
        console.error('Update upcoming error:', err);
        res.status(500).json({ error: 'Failed to update upcoming company' });
    }
});

// DELETE upcoming company (admin only)
router.delete('/:id', authMiddleware, adminOnly, async (req, res) => {
    try {
        const id = parseInt(req.params.id);

        const oldData = await prisma.upcomingCompany.findUnique({ where: { id } });
        if (!oldData) return res.status(404).json({ error: 'Company not found' });

        await prisma.upcomingCompany.delete({ where: { id } });

        await prisma.auditLog.create({
            data: {
                adminId: req.user.id,
                action: 'DELETE',
                tableName: 'upcoming_companies',
                recordId: id,
                oldData,
            },
        });

        res.json({ message: 'Company deleted successfully' });
    } catch (err) {
        console.error('Delete upcoming error:', err);
        res.status(500).json({ error: 'Failed to delete upcoming company' });
    }
});

module.exports = router;
