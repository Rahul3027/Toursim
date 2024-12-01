const express = require('express');
const path = require('path');
const app = express();
const port = 3000;

// Serve static files from the current directory
app.use(express.static(path.join(__dirname, '../frontend')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/index.html'));
});

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Error in Fetching the Page');
});


app.use((req, res) => {
    res.status(404).send('Sorry, page not found!');
});

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});