require('dotenv').config();
const express = require('express'); 
const app = express();
const cors = require("cors");
const connection = require("./database");
const userRoutes = require('./routers/users')
const authRoutes = require("./auth")

// database connection 
connection();
// middlewares
app.use(express.json())
app.use(cors());

// routes
app.use("/api/users", userRoutes);
app.use("/api/auth", authRoutes);

const port = process.env.PORT || 8000;
app.listen(port, () => console.log(`Listening on port ${port}`))

