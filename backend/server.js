const { MongoClient } = require("mongodb");
const express = require("express");
const session = require("express-session");
const path = require("path");

const app = express();

const url = "mongodb+srv://RudarO8:Rudar123@cluster0.0pudkpl.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

const client = new MongoClient(url);

async function connectToMongoDB() {
    await client.connect();
    console.log("Connected to MongoDB!");
}
connectToMongoDB();

const db = client.db("Tourism");
const collection = db.collection("Tourism_Users");

app.use(session({
    secret: "secret",
    resave: false,
    saveUninitialized: true
}));

// Middleware
app.use(express.urlencoded({ extended: false }));

// Serve static files from the frontend directory
app.use(express.static(path.join(__dirname, "../frontend")));

// Routes
// Home route (redirects to index.html)
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "../frontend/index.html"));
});

// Login page
app.get("/login", (req, res) => {
    res.sendFile(path.join(__dirname, "../frontend/login.html"));
});

// Signup page
app.get("/signup", (req, res) => {
    res.sendFile(path.join(__dirname, "../frontend/signup.html"));
});

// Login logic
app.post("/login", (req, res) => {
    const { username, password } = req.body;
    collection.findOne({ username, password })
        .then(user => {
            if (user) {
                req.session.user = user;
                res.redirect("/"); // Redirect to home page after login
            } else {
                res.send("Invalid username or password. Please try again or sign up.");
            }
        })
        .catch(err => {
            res.status(500).send("Error during login.");
        });
});

// Signup logic
app.post("/signup", async (req, res) => {
    const { username, password } = req.body;
    try {
        const existingUser = await collection.findOne({ username });
        if (existingUser) {
            res.send("Username already exists. Please choose another.");
        } else {
            await collection.insertOne({ username, password });
            res.redirect("/login"); // Redirect to login page after signup
        }
    } catch (err) {
        res.status(500).send("Error during signup.");
    }
});

// Logout route
app.get("/logout", (req, res) => {
    req.session.destroy(err => {
        if (err) {
            res.status(500).send("Error logging out.");
        } else {
            res.redirect("/");
        }
    });
});

// Start the server
app.listen(5000, () => {
    console.log("Server started on port 5000");
});
