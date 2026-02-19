const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { PrismaClient } = require('@prisma/client');

const router = express.Router();
const prisma = new PrismaClient();

const isProduction = () => process.env.NODE_ENV === 'production';

function getCookieOptions() {
    return {
        httpOnly: true,
        secure: isProduction(),
        sameSite: isProduction() ? 'none' : 'lax',
        maxAge: 24 * 60 * 60 * 1000, // 24 hours
    };
}

// Admin Login — POST /api/auth/admin/login
router.post('/admin/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ error: 'Email and password are required' });
        }

        const admin = await prisma.spcAdmin.findUnique({ where: { email } });

        if (!admin || !admin.isActive) {
            return res.status(401).json({ error: 'Invalid email or password' });
        }

        const validPassword = await bcrypt.compare(password, admin.passwordHash);
        if (!validPassword) {
            return res.status(401).json({ error: 'Invalid email or password' });
        }

        const token = jwt.sign(
            { id: admin.id, email: admin.email, name: admin.name, role: 'admin' },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );

        res.cookie('token', token, getCookieOptions());

        res.json({
            message: 'Login successful',
            user: { id: admin.id, name: admin.name, email: admin.email, role: 'admin' },
            token,
        });
    } catch (err) {
        console.error('Admin login error:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Student Login — POST /api/auth/student/login
router.post('/student/login', async (req, res) => {
    try {
        const { name, branch, googleEmail } = req.body;

        if (!name || !branch) {
            return res.status(400).json({ error: 'Name and branch are required' });
        }

        // Log student session
        const session = await prisma.studentSession.create({
            data: {
                name,
                branch,
                googleEmail: googleEmail || `${name.toLowerCase().replace(/\s+/g, '.')}@student.jmi.ac.in`,
            },
        });

        const token = jwt.sign(
            { id: session.id, name: session.name, branch: session.branch, role: 'student' },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );

        res.cookie('token', token, getCookieOptions());

        res.json({
            message: 'Login successful',
            user: { id: session.id, name: session.name, branch: session.branch, role: 'student' },
            token,
        });
    } catch (err) {
        console.error('Student login error:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Get current user — GET /api/auth/me
router.get('/me', (req, res) => {
    let token = req.cookies?.token;
    if (!token) {
        const authHeader = req.headers.authorization;
        if (authHeader && authHeader.startsWith('Bearer ')) {
            token = authHeader.split(' ')[1];
        }
    }
    if (!token) return res.status(401).json({ error: 'Not authenticated' });

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        res.json({ user: decoded });
    } catch {
        res.status(401).json({ error: 'Invalid token' });
    }
});

// Logout — POST /api/auth/logout
router.post('/logout', (req, res) => {
    res.clearCookie('token', getCookieOptions());
    res.json({ message: 'Logged out successfully' });
});

module.exports = router;
