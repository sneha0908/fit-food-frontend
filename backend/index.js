const mongoose = require('mongoose');
const express = require('express');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 5000;

mongoose.connect('mongodb://127.0.0.1:27017/SIET2')
    .then(() => {
        console.log('Connected to SIET2 database');
    })
    .catch((err) => {
        console.error(err);
    });

const UserSchema = new mongoose.Schema({
    fname: { type: String, required: true },
    lname: { type: String, required: true },
    dob: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    phone: { type: String, required: true },
    date: { type: Date, default: Date.now }
});

const User = mongoose.model('student', UserSchema);

app.use(express.json());
app.use(cors());

app.get('/home', async (req, resp) => {
    try {
        const users = await User.find({}, 'name email date');
        resp.json(users);
    } catch (e) {
        console.error(e);
        resp.status(5000).send('Failed to retrieve user data');
    }
});

// Update the login route in your server
app.post('/login', async (req, resp) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ $and: [{ email }, { password }] });

        if (user) {
            // Successful login
            resp.json({ success: true });
        } else {
            // Failed login
            resp.json({ success: false, error: 'Invalid credentials' });
        }
    } catch (e) {
        console.error(e);
        resp.status(500).json({ success: false, error: 'Something went wrong during login.' });
    }
});



app.post('/register', async (req, resp) => {
    try {
        const user = new User(req.body);
        const result = await user.save();
        const userWithoutPassword = result.toObject();

        resp.send(userWithoutPassword);
    } catch (e) {
        console.error(e);
        resp.status(500).send('Something Went Wrong');
    }
});

app.listen(port, () => {
    console.log(`App is listening on port ${port}`);
});