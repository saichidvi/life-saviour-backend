const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.json());
app.use(morgan('dev'));
app.use(cors());

// Routes
app.get('/', (req, res) => {
    res.send('Hello, world!');
});

// Example API route
app.get('/api/example', (req, res) => {
    res.json({ message: 'This is an example API endpoint' });
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
