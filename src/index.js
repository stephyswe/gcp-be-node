require("dotenv").config();
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const passport = require("passport");

//require("./strategies/one");
require("./strategies/discord");
require("./strategies/local");

// Routes
const groceriesRoute = require("./routes/groceries");
const marketsRoute = require("./routes/markets");
const authRoute = require("./routes/auth");

require("./database");

const app = express();
const PORT = process.env.APP_PORT || 5000;

app.use(express.static("public"));

app.use(
  cors({
    origin: [
      "http://localhost:4000",
      "https://node-docker-gcr-image-axvwqtiyiq-wl.a.run.app",
      "null",
    ],
    credentials: true,
    optionsSuccessStatus: 200,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cookieParser());
app.use(
  session({
    secret: "APODAJDSDASMCZXMZADASDASDPASDOASDSAK",
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl: process.env.DATABASE_URL,
    }),
  })
);

app.use((req, res, next) => {
  console.log(`${req.method}:${req.url}`);
  next();
});

app.use(passport.initialize());
app.use(passport.session());

app.use("/api/v1/groceries", groceriesRoute);
app.use("/api/v1/markets", marketsRoute);
app.use("/api/v1/auth", authRoute);

app.listen(PORT, () => console.log(`Running Express Server on Port ${PORT}!`));
