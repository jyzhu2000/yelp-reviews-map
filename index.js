import express from "express";
import bodyParser from "body-parser";
import pg from "pg";
import cors from "cors";

const app = express();
const port = 4000;

const db = new pg.Client({
    user: "postgres",
    host: "localhost",
    database: "yelp",
    password: "RestaurantPantry",
    port: 5432,
});
db.connect();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors({
    origin: 'http://localhost:3000'
}));

// GET all reviews from db
app.get("/reviews", async (req, res) => {
    const result = await db.query("SELECT * FROM reviews ORDER BY id ASC");
    res.json(result.rows);
});

app.listen(port, () => {
    console.log(`API is running at http://localhost:${port}`);
});