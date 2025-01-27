const express = require('express');
const bcrypt = require('bcryptjs');
const { Client } = require('pg');

const app = express();

// Set the port to use from the environment variable or default to 3000
const port = process.env.PORT || 5000; // Change 5000 to any port number you prefer

// Middleware to parse JSON request bodies
app.use(express.json());

// PostgreSQL connection
const client = new Client({
  connectionString: 'postgresql://jecrc_owner:Md5Dix4jfrEg@ep-plain-boat-a86yhz6z.eastus2.azure.neon.tech/jecrc?sslmode=require',
});

client.connect()
  .then(() => console.log('Connected to PostgreSQL'))
  .catch(err => console.error('Connection error', err.stack));

// Login endpoint
app.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const result = await client.query('SELECT * FROM signup WHERE email = $1', [email]);

    if (result.rows.length === 0) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const user = result.rows[0];
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    res.status(200).json({ message: 'Login successful' });
  } catch (err) {
    console.error('Error executing query', err.stack);
    res.status(500).json({ message: 'Server error' });
  }
});

// Start the server on the specified port
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
