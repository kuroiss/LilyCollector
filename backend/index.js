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

app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

// ##### front page
const _build_dir_path = path.join(__dirname, "../frontend/build");
app.use(express.static(_build_dir_path));
app.get('/', (req, res) => {
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

// データ取得、データ提供
const URL_LIST = [
    "https://x.com/shiki_820/status/2014732338283086127?s=20",
    "https://x.com/suzuo_all/status/2014955312202318278?s=12",
    "https://x.com/anime_kimishinu/status/2014669469373870206?s=53",
    "https://www.youtube.com/watch?si=q3e_HY1LMOks7O8f&v=OUeO0rIjZKo&feature=youtu.be",
    "https://x.com/elhongo14/status/2013032820717801824?s=46",
    "https://x.com/zenma_trang/status/2013457533705580578?s=46",
    "https://t.co/3DP0BXoPzj",
    "https://t.co/eGZF4rzrdz",
    "https://x.com/basane158/status/2013386488017203676?s=12",
    "https://x.com/gkmas_official/status/2013159495548191123?s=12",
]

const URL_DATA = Array.from({length: URL_LIST.length}, (_, i) => ({
    id: i + 1,
    url: URL_LIST[i],
    title: `Contents ${i + 1}`,
}));

app.get("/api/get_lily_list", (req, res) => {
    console.log("URL_DATA : ", URL_DATA);
    res.json(URL_DATA);
});

app.listen(port, (req, res)=>
{
    console.log("start listen");
});
