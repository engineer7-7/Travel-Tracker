// import modules-libraries
import express from "express";
import bodyParser from "body-parser";
import pg from "pg";

// create an instance of express and initialize the port
const app = express();
const port = 5000;

// create an empty array to store the records from the countries table
let countries = [];

// create an empty array to store the country-codes
let codes = [];

// connect to the db
const db = new pg.Client({
        user: "postgres",
        password: "olympiakos-7",
        host: "localhost",
        port: 5432,
        database: "world"

    }
);
db.connect();

// get all the records from the visited_countries table
db.query("SELECT country_code,country_name FROM countries", (err, result) => {
    if (err) {
        console.log("Error executing query", err.stack);
    } else {
        countries = result.rows;
        // console.log(countries);
    }
    db.end();
})


app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

// create get-route to display the main HTML page
app.get("/", async (req, res) => {
    //Write your code here.
    res.render("index.ejs", {total: null, countries: null});
});

// create post-route to enter new country
app.post('/add', (req, res) => {
    const name = req.body.country;
    let filteredCountries = countries.filter(country => country.country_name === name);
    if (filteredCountries.length === 0) {
        res.status(400).send("Could not find country");
    } else {
        for (let i = 0; i < filteredCountries.length; i++) {
            codes.push(filteredCountries[i].country_code);
        }
        console.log(codes);
        res.render("index.ejs", {total: codes.length, countries: codes});
    }
});

// run the app
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
