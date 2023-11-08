// import / require section
const http = require("http");
const path = require("path");
const fs = require("fs");
const express = require("express");
var app = express();

// const vers section
const port = process.env.PORT || 24345;
const dir_public = "./page";
const dir_private = "./private";
const save_dir = "/LilyDB/";
const save_file = "DB.csv";

app.use("/public", express.static(dir_public));
app.use("/private", express.static(dir_private));

app.use(express.json());
app.use(express.urlencoded({extended : true}));

// ##### receive webhook event from LINE
var crypto = require("crypto");
function ValidateSignature(signature, body)
{
    const LINE_CHANNEL_SECRET = process.env.LINE_CHANNEL_SECRET;

    return signature == crypto.createHmac("sha256", LINE_CHANNEL_SECRET)
    .update(Buffer.from(JSON.stringify(body)))
    .digest("base64");
}

app.post('/line_webhook', function (req, res) {
    var answer_str = "OK.";

    if(ValidateSignature(req.headers["x-line-signature"], req.body))
    {
        const recv_message = req.body.events[0].message.text;

        const split_lf_message = recv_message.split("\n");
        
        var url = "";
        var is_upload = 0;
        var count = 0;
        split_lf_message.forEach((element) => 
        {
            if(element.indexOf("http") == 0)
            {
                url = element;
            }
    
            if(element.includes("upload"))
            {
                is_upload = 1;
            }
    
            count++;
        });
    
        if(is_upload == 1)
        {
            console.log("recv message, and save.");
            fs.appendFile(save_dir + save_file, url + "\n", (err) =>
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
    res.download("." + save_dir + save_file);
});


app.listen(port);
