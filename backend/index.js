// import / require section
const path = require("path");
const axios = require("axios");
const express = require("express");
const {
    createTable,
    insertData,
    selectAllData,
    selectRandomData,
    deleteData
} = require("./common/OperateDB");

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

// constants
const LINE_CHANNEL_SECRET = process.env.LINE_CHANNEL_SECRET || "hoge";
const LINE_CHANNEL_ACCESS_TOKEN = process.env.LINE_CHANNEL_ACCESS_TOKEN || "fuga";

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
    return signature == crypto.createHmac("sha256", LINE_CHANNEL_SECRET)
    .update(Buffer.from(JSON.stringify(body)))
    .digest("base64");
};

app.post("/line_webhook", async (req, res) => {
    var answer_str = "OK.";

    if(ValidateSignature(req.headers["x-line-signature"], req.body))
    {
        const recv_message = req.body.events[0].message.text;

        const split_lf_message = recv_message.split("\n");

        var url = "";
        var is_upload = false;
        var is_random_request = false;
        split_lf_message.forEach((element) =>
        {
            const match = element.match(/(https?:\/\/[\w\/:%#\$&\?\(\)~\.=\+\-]+)/);

            if(match)
            {
                url = match[0];
                is_upload = true;
            }

            if(element.includes("GETRandomLilyContents"))
            {
                is_random_request = true;
            }
        });

        if(is_upload)
        {
            console.log("recv message, and save.");

            await createTable();
            await insertData(url);
        }
        else if(is_random_request)
        {
            await replyRandomLilyContents(req.body.events[0].replyToken);
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

// GETRandomLilyContentsが投稿された時の処理
const replyRandomLilyContents = async (reply_token) => {
    if(!reply_token) return null;

    const reply_api = "https://api.line.me/v2/bot/message/reply"
    const headers = {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${LINE_CHANNEL_ACCESS_TOKEN}`
    };

    const lily = await selectRandomData();
    const body = {
        replyToken: reply_token,
        messages: [
            {
                type: "text",
                text: lily.url
            }
        ]
    };

    try
    {
        await axios.post(reply_api, body, { headers });
        console.log("recv message, and reply random lily contents.");
    }
    catch(err)
    {
        console.log("replyRandomLilyContents caused error : ", err.status);
    }
}

app.get("/api/get_lily_list", async (req, res) => {
    const lily_contents = await selectAllData();
    const lily_list = [];
    lily_contents.map((value) => {
        lily_list.push(
            {
                id: value.id,
                url: value.url,
                title: `Contents ${value.id}`
            }
        );
    });
    res.json(lily_list);
});

app.listen(port, (req, res)=>
{
    console.log("start listen");
});
