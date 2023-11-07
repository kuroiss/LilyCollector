var express = require('express');
var app = express();

var fs = require("fs");
const save_dir = "./LilyDB/";
const save_file = "DB.csv";

// validate signature
var crypto = require("crypto");
function ValidateSignature(signature, body)
{
    const LINE_CHANNEL_SECRET = process.env.LINE_CHANNEL_SECRET;

    return signature == crypto.createHmac("sha256", LINE_CHANNEL_SECRET)
    .update(Buffer.from(JSON.stringify(body)))
    .digest("base64");
}

app.use(express.json());
app.use(express.urlencoded({extended : true}));

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

var server = app.listen(process.env.WEBHOOK_PORT_NUMBER);
