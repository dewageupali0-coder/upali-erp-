const express = require('express');
const path = require('path');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config({ path: path.join(__dirname, '.env') });

const { pool, initDB } = require('./db');

const app = express();
const PORT = process.env.PORT || 3002;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname)));

// JWT Auth Middleware
function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) return res.status(401).json({ error: 'Access denied. Please login.' });

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) return res.status(403).json({ error: 'Invalid or expired token.' });
        req.user = user;
        next();
    });
}

// ===== AUTH ROUTES =====

// Register
app.post('/api/register', async (req, res) => {
    const { firstName, lastName, email, phone, password, destinationCountry, jobType, plan } = req.body;

    if (!firstName || !lastName || !email || !password) {
        return res.status(400).json({ error: 'First name, last name, email, and password are required.' });
    }

    if (password.length < 6) {
        return res.status(400).json({ error: 'Password must be at least 6 characters.' });
    }

    try {
        // Check if user exists
        const existing = await pool.query('SELECT id FROM users WHERE email = $1', [email]);
        if (existing.rows.length > 0) {
            return res.status(409).json({ error: 'An account with this email already exists.' });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(password, salt);

        // Insert user
        const result = await pool.query(
            `INSERT INTO users (first_name, last_name, email, phone, password_hash, destination_country, job_type, plan)
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING id, first_name, last_name, email, destination_country, job_type, plan, status, created_at`,
            [firstName, lastName, email, phone || null, passwordHash, destinationCountry || null, jobType || 'blue-collar', plan || null]
        );

        const user = result.rows[0];
        const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, { expiresIn: '7d' });

        res.status(201).json({
            message: 'Registration successful! Welcome to Upali Immigration Services.',
            token,
            user: {
                id: user.id,
                firstName: user.first_name,
                lastName: user.last_name,
                email: user.email,
                destinationCountry: user.destination_country,
                jobType: user.job_type,
                plan: user.plan,
                status: user.status,
                createdAt: user.created_at
            }
        });
    } catch (err) {
        console.error('Registration error:', err);
        res.status(500).json({ error: 'Server error. Please try again.' });
    }
});

// Login
app.post('/api/login', async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ error: 'Email and password are required.' });
    }

    try {
        const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
        if (result.rows.length === 0) {
            return res.status(401).json({ error: 'Invalid email or password.' });
        }

        const user = result.rows[0];
        const validPassword = await bcrypt.compare(password, user.password_hash);
        if (!validPassword) {
            return res.status(401).json({ error: 'Invalid email or password.' });
        }

        const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, { expiresIn: '7d' });

        res.json({
            message: 'Login successful!',
            token,
            user: {
                id: user.id,
                firstName: user.first_name,
                lastName: user.last_name,
                email: user.email,
                phone: user.phone,
                destinationCountry: user.destination_country,
                jobType: user.job_type,
                plan: user.plan,
                status: user.status,
                createdAt: user.created_at
            }
        });
    } catch (err) {
        console.error('Login error:', err);
        res.status(500).json({ error: 'Server error. Please try again.' });
    }
});

// Get Profile
app.get('/api/profile', authenticateToken, async (req, res) => {
    try {
        const result = await pool.query(
            'SELECT id, first_name, last_name, email, phone, destination_country, job_type, plan, status, created_at FROM users WHERE id = $1',
            [req.user.id]
        );
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'User not found.' });
        }

        const user = result.rows[0];
        res.json({
            user: {
                id: user.id,
                firstName: user.first_name,
                lastName: user.last_name,
                email: user.email,
                phone: user.phone,
                destinationCountry: user.destination_country,
                jobType: user.job_type,
                plan: user.plan,
                status: user.status,
                createdAt: user.created_at
            }
        });
    } catch (err) {
        console.error('Profile error:', err);
        res.status(500).json({ error: 'Server error.' });
    }
});

// Update Profile
app.put('/api/profile', authenticateToken, async (req, res) => {
    const { firstName, lastName, phone, destinationCountry, jobType, plan } = req.body;

    try {
        const result = await pool.query(
            `UPDATE users SET first_name = COALESCE($1, first_name), last_name = COALESCE($2, last_name),
             phone = COALESCE($3, phone), destination_country = COALESCE($4, destination_country),
             job_type = COALESCE($5, job_type), plan = COALESCE($6, plan), updated_at = CURRENT_TIMESTAMP
             WHERE id = $7 RETURNING id, first_name, last_name, email, phone, destination_country, job_type, plan, status`,
            [firstName, lastName, phone, destinationCountry, jobType, plan, req.user.id]
        );

        const user = result.rows[0];
        res.json({
            message: 'Profile updated successfully.',
            user: {
                id: user.id,
                firstName: user.first_name,
                lastName: user.last_name,
                email: user.email,
                phone: user.phone,
                destinationCountry: user.destination_country,
                jobType: user.job_type,
                plan: user.plan,
                status: user.status
            }
        });
    } catch (err) {
        console.error('Update error:', err);
        res.status(500).json({ error: 'Server error.' });
    }
});

// Submit Contact Form (authenticated or not)
app.post('/api/contact', async (req, res) => {
    const { firstName, lastName, email, phone, destination, plan, message } = req.body;

    if (!firstName || !lastName || !email) {
        return res.status(400).json({ error: 'Name and email are required.' });
    }

    try {
        // Check if user is logged in
        let userId = null;
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1];
        if (token) {
            try {
                const decoded = jwt.verify(token, process.env.JWT_SECRET);
                userId = decoded.id;
            } catch (e) { /* not logged in, that's fine */ }
        }

        await pool.query(
            `INSERT INTO contact_submissions (user_id, first_name, last_name, email, phone, destination, plan, message)
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
            [userId, firstName, lastName, email, phone || null, destination || null, plan || null, message || null]
        );

        res.status(201).json({ message: 'Your inquiry has been submitted successfully! We will contact you within 2 hours.' });
    } catch (err) {
        console.error('Contact error:', err);
        res.status(500).json({ error: 'Server error. Please try again.' });
    }
});

// Serve index.html for all other routes
app.get('/{*path}', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Start server
async function start() {
    try {
        await initDB();
        app.listen(PORT, () => {
            console.log(`Upali Immigration Services server running at http://localhost:${PORT}/`);
        });
    } catch (err) {
        console.error('Failed to start server:', err.message);
        console.log('Starting server without database (frontend only)...');
        app.listen(PORT, () => {
            console.log(`Server running at http://localhost:${PORT}/ (no database)`);
        });
    }
}

start();
