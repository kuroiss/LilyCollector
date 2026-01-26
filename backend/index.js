// import / require section
const http = require("http");
const path = require("path");
const fs = require("fs");
const express = require("express");
var app = express();

// const vers section
const port = process.env.PORT || 24345;

app.use(express.json());
app.use(express.urlencoded({extended : true}));


// ##### front page
const _build_dir_path = path.join(__dirname, "../frontend/build");
app.use(express.static(_build_dir_path));
app.get('*', (req, res) => {
    res.sendFile(path.join(_build_dir_path, "index.html"));
});


// ##### receive webhook event from LINE
var crypto = require("crypto");
function ValidateSignature(signature, body)
{
    const LINE_CHANNEL_SECRET = process.env.LINE_CHANNEL_SECRET || "hoge";

    return signature == crypto.createHmac("sha256", LINE_CHANNEL_SECRET)
    .update(Buffer.from(JSON.stringify(body)))
    .digest("base64");
}

function ValidateAndMakeDirectory(path)
{
    if(!fs.existsSync(path))
    {
        fs.mkdir(path, (err) =>
        {
            if(err) throw err;

            console.log("Made directory : " + path);
        });
    }
}

function ValidateAndMakeFile(path)
{
    if(!fs.existsSync(path))
    {
        fs.writeFile(path, "", (err) => 
        {
            if(err) throw err;
        });
    }
}

const save_dir = "./LilyDB/";
const save_file = "DB.csv";
const save_path = save_dir + save_file;
app.post("/line_webhook", function (req, res) {
    var answer_str = "OK.";

    if(ValidateSignature(req.headers["x-line-signature"], req.body))
    {
        const recv_message = req.body.events[0].message.text;

        const split_lf_message = recv_message.split("\n");

        var url = "";
        var is_upload = 0;
        split_lf_message.forEach((element) => 
        {
            if(element.indexOf("https://") == 0)
            {
                url = element;
                is_upload = 1;
            }
        });

        if(is_upload == 1)
        {
            console.log("recv message, and save.");

            ValidateAndMakeDirectory(save_dir);
            ValidateAndMakeFile(save_path);

            fs.appendFile(save_path, url + "\n", (err) =>
            {
                if(err) throw err;
                console.log("received message is written on " + save_dir + save_file);
            });
        }
        else
        {
            console.log("recv message, but not save.");
        }
    }
    else
    {
        answer_str = "Failed.";
    }
    res.end(answer_str);
});

// ##### define DB csv download IF
app.get("/DB_download", (req, res)=>
{
    res.download(save_path);
});

app.get("/get_lily_list", (req, res) => {
    
});


app.listen(port, (req, res)=>
{
    console.log("start listen");
});
