// import / require section
const http = require("http");
const path = require("path");
const fs = require("fs");
const express = require("express");

// const vers section
const port = 24345
const dir_public = "./page"
const dir_private = "./private"

const app = express();
app.use("/public", express.static(dir_public));
app.use("/private", express.static(dir_private));

// app.get("/", (req, res) =>
// {
//     res.status(200).send(req.params.id);
// });

// app.get("/user/:id", (req, res) =>
// {
//     res.status(200).send(req.params.id);
// });

// app.use("/static", express.static(path.join(__dirname, "public")));

// app.use( (err, req, res, next) =>
// {
//     res.status(500).send("internal server error");
// } );

app.listen(port, () => 
{
    console.log("start listening");
});

