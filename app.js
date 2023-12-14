const config = require("config");
const express = require("express");
const session = require("express-session");
const mongodbStore = require("connect-mongodb-session")(session);
const bodyParser = require('body-parser');
const connectMongoose = require("./config/db");
const Controller = require("./controllers/Controller");
const MONGOOSE_DB_URI = config.get("MONGOOSE_DB_URI");
const SERVER_PORT = config.get("SERVER_PORT");
// middleware
const auth = require("./middleware/auth");
const admin = require("./middleware/admin");

const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
// connect database
connectMongoose();
const store = new mongodbStore({
  uri: MONGOOSE_DB_URI,
  collection: "sessions",
});
/*disable etag.*/
app.disable("etag");
/*set view engine.*/
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: false }));
/*session middleware.*/
app.use(
  session({
    secret: "secret",
    resave: false,
    saveUninitialized: false,
    store: store,
  })
);
// router
app.get("/", Controller.landing_page);
app.get("/register", Controller.register_get);
app.post("/register", Controller.register_post);
app.get("/login", Controller.login_get);
app.post("/login", Controller.login_post);
app.post("/books", admin, Controller.store_book);
app.get("/books/:id", auth, Controller.view_book);
app.post("/books/update/:id", admin, Controller.update_book);
app.post("/books/delete/:id", admin, Controller.delete_book);
app.get("/dashboard", auth, Controller.dashboard_get);
/* Logout */
app.get("/logout", Controller.logout_get);
/* start server. */
app.listen(SERVER_PORT, () => {
  console.log(`Server is start at url: http://localhost:${SERVER_PORT}`);
});