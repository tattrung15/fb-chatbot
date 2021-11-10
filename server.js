var logger = require("morgan");
var http = require("http");
var bodyParser = require("body-parser");
var express = require("express");
var app = express();

app.use(logger("dev"));
app.use(express.json());
app.use(
  express.urlencoded({
    extended: false,
  })
);
var server = http.createServer(app);
var request = require("request");

app.get("/", (req, res) => {
  res.send("Home page. Server running okay.");
});

// Đây là đoạn code để tạo Webhook
app.get("/webhook", function (req, res) {
  if (req.query["hub.verify_token"] === "ma_xac_minh_cua_ban") {
    res.send(req.query["hub.challenge"]);
  }
  res.send("Error, wrong validation token");
});

// Xử lý khi có người nhắn tin cho bot
app.post("/webhook", function (req, res) {
  var entries = req.body.entry;
  for (var entry of entries) {
    var messaging = entry.messaging;
    for (var message of messaging) {
      var senderId = message.sender.id;
      if (message.message) {
        //If user send text
        if (message.message.text) {
          var text = message.message.text;
          console.log(text); // In tin nhắn người dùng
          console.log(senderId); // In id người dùng
          sendMessage(senderId, "Tui là bot đây: " + text);
          sendMessage(senderId, "How can I help you?");
        }
      }
    }
  }
  res.status(200).send("OK");
});

app.get("/api", (req, res) => {
  res.send("Hello world");
});

app.get("/api/:temp/:humid", function (req, res) {
  sendMessage(
    2546056792138320,
    "BOT: " + req.params.temp + " : " + req.params.humid
  );
  res.status(200).send("OK");
});

app.get("/api/:text", function (req, res) {
  sendMessage(2546056792138320, "BOT: " + req.params.text);
  res.status(200).send("OK");
});

// Gửi thông tin tới REST API để trả lời
function sendMessage(senderId, message) {
  request({
    url: "https://graph.facebook.com/v2.6/me/messages",
    qs: {
      access_token: "",
    },
    method: "POST",
    json: {
      recipient: {
        id: senderId,
      },
      message: {
        text: message,
      },
    },
  });
}

server.listen(process.env.PORT || 3000, function () {
  console.log("Chat bot server is listening");
});
