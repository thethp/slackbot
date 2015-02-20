var config = require('./config.json');
var Slack = require('slack-node');
var WebSocket = require('ws');



var apiToken = config.apiKey;
var slack = new Slack(apiToken);

slack.api('rtm.start', function(err, response) {
    var ws = new WebSocket(response.url);
    ws.on('connect_error', function cb(data) {
	console.log('You fucked up: ',data,' - ',data.error);
    });

    ws.on('message', function cb(data) {
	var msg = JSON.parse(data);
	if(msg.type == 'message') {
	    var msgText = msg.text;
	    if(msgText.toLowerCase().indexOf("it's been") >= 0 || msgText.toLowerCase().indexOf("its been") >= 0) {
		console.log(msgText.toLowerCase().replace(/it's been|its been/g, ":musical_note: It's Been :musical_note:"));
		slack.api('chat.update', 
		{
		    token: apiToken, 
	            ts:msg.ts,
		    channel:msg.channel,
		    text:msgText.toLowerCase().replace(/it's been|its been/g, ":musical_note: It's Been :musical_note:"),
                },
			  function(err, res) {
			      console.log(err,res);}
		);
	    }
	}
    });
});