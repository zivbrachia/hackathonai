'use strict'

//let BotStorage = require("../lib/BotStorage/botStorage");
//let BotCharecter = require("../lib/BotBusiness/botCharecter");
var restify = require('restify');
var alexa   = require("alexa-app");

module.exports = function(app, admin) {
    //botStorage = new BotStorage.MemoryBotStorage();
    //BotCharecter = new BotCharecter.BotCharecter();
    var alexa_app = new alexa.app("sample");
	
	alexa_app.intent("test", {
    	//"slots": { "number": "AMAZON.NUMBER" },
    	//"utterances": ["say the number {-|number}"]
  	},
	function (request, response) {
		var number = request.slot("number");
		response.say("You asked for the number " /*+ number*/);
	});
	
	alexa_app.express({ expressApp: app, 
        endpoint: "/webhook_alexa",
        checkCert : false,
        debug: true
     });

    alexa_app.intent("Test", {
            //"slots": { "number": "AMAZON.NUMBER" },
            //"utterances": ["say the number {-|number}"]
        },
        function (request, response) {
            var number = request.slot("number");
            response.say("You asked for the number " /*+ number*/);
        });

    app.post('/webhook', [
        //botStorage.getuserData,
        setUserData,
        setUserProfile,
        translateUserProfile,
        //translateInput,
        buildMessages, 
        saveUserData, 
        sendMessages
    ]);

    function setUserData(req, res, next) {
        let ref = admin.database().ref();

        req.source = (req.body.originalRequest) && (req.body.originalRequest.source);
        if (req.source === undefined) {
            req.source = (req.body.result) && (req.body.result.source);
        }
        req.sender_id = (req.body.originalRequest) && (req.body.originalRequest.data) && (req.body.originalRequest.data.sender) && (req.body.originalRequest.data.sender.id);
        if (req.sender_id === undefined) {
            req.sender_id = req.body.sessionId;
        }

        ref.child('source').child(req.source).child('sender_id').child(req.sender_id).child('user_data').once("value", function(snapshot) {
            req.userData = snapshot.val() || {};
            next();
        }, function (errorObject) {
            console.log("The read 'userData' failed: " + errorObject.code);
            next();
        });
    }

    function setUserProfile(req, res, next) {
        if (!req.userData.userProfile) {
            get_profile_facebook(req.sender_id, (err, user_profile) => {
                req.userData.user_profile = user_profile;
                next();
            });
        }
    }

    function translateUserProfile(req, res, next) {
        //translate(req.userData.user_profile.first_name, 'he', (err, text_translated) => {
        translate(req.body.result.resolvedQuery, "he", "en", function(err, text_translated) {
            console.log(text_translated);
            next();
        });
        //translate(req.body.result.resolvedQuery, 'iw', 'en', (err, text_translated) => {
        //    console.log(text_translated); 
        //    next();
        //});
    }

    function saveUserData(req, res, next) {
        let ref = admin.database().ref();

        ref.child('source').child(req.source).child('sender_id').child(req.sender_id).child('user_data').set(req.userData || {});
        next();
    }

    function translateInput(req, res, next) {
        console.log('a');
        var client = restify.createJsonClient({
            url: 'https://translate.googleapis.com',
            version: '*'
        });

        client.get('/translate_a/single?client=gtx&sl=auto&tl=en&dt=t&q=' + encodeURI(req.body.result.resolvedQuery), function(err, request, response, obj) {
            console.log(JSON.parse(response.body));
            //return res.json(a);
        });
    }

    function find_context_facebook_location(context) {
        return (context.name === "facebook_location");
    }

    function find_context_hospital(context) {
        return (context.name === "hospital");
    }
    //////
    var hospitals = [
        { name: "Ichilov", lat: "32.0805838", long: "34.7897545" },
        { name: "Wolfson", lat: "32.0339589", long: "34.7588123" },
        { name: "Sheba", lat: "32.0477955", long: "34.8438634" },
        { name: "Kaplan", lat: "31.8729453", long: "34.8142255" }
    ]

    function getDistance(lat1, lon1, hospitals) {
        var hospitalsDistance = hospitals.slice();
        for (var i in hospitals) {
            hospitalsDistance[i].dist = getDistanceFromLatLonInKm(lat1, lon1, hospitalsDistance[i].lat, hospitalsDistance[i].long);
        }
        hospitalsDistance.sort(function (a, b) { return a.dist - b.dist });
        return hospitalsDistance;
    }

    function getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2) {
        var R = 6371; // Radius of the earth in km
        var dLat = deg2rad(lat2 - lat1);  // deg2rad below
        var dLon = deg2rad(lon2 - lon1);
        var a =
            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2)
            ;
        var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        var d = R * c; // Distance in km
        return d;
    }

    function deg2rad(deg) {
        return deg * (Math.PI / 180)
    }

    function getDistancePromise(lat, long, hospitals) {
        let query = new Promise(function (resolve, reject) {
            var dest = "";
            for (var i in hospitals) {
                hospitalsDistance[i].dist = getDistanceFromLatLonInKm(lat1, lon1, hospitalsDistance[i].lat, hospitalsDistance[i].long);
                dest = dest + "%7C" + hospitalsDistance[i].lat + "%2C" +hospitalsDistance[i].long;
            }
            let add = "https://maps.googleapis.com/maps/api/distancematrix/json?units=metric&origins=" + lat + "," +long +"&destinations="+ dest +"&key=AIzaSyCk88593o-pqPlzWx-L4XMa3_0ZN6OWBnI";
            resolve(InfoNumber);
        }, function (errorObject) {
            reject(errorObject)
        });
        return query;
    }
    //////
    function buildMessages(req, res, next) {
        var requestBody = req.body;
        console.log('hook request: ' + requestBody.result.resolvedQuery);
        try {
            var speech = 'empty speech';

            if (req.body) {
                if (requestBody.result) {
                    if ((requestBody.result.action === "location")) {
                        var locationContext = requestBody.result.contexts.find(find_context_facebook_location);
                        let messages = [];
                        let hosp = getDistance(locationContext.parameters.lat, locationContext.parameters.long, hospitals);
                        messages.push(buildMessage("The results are: 🏥"));
                        for (var i = 0; i < hosp.length; i++) {
                            messages.push(buildMessageCard('Average waiting time is '+((i + 3) * 20)+' min', hosp[i]["name"] + " distance: " + hosp[i]["dist"].toFixed(2) + " Km", '', [{"text": hosp[i]["name"], "postback": hosp[i]["name"]}]));
                        }
                        let callback = {};
                        callback.contextOut = [];
                        callback.contextOut.push(buildContextOutElement('hospital', { }, 2));
                        callback.messages = messages;
                        req.send_messages = callback;   //{messages: messages};
                        next();
                    }
                    if ((requestBody.result.action === "hospital")) {
                        //var hospitalContext = requestBody.result.contexts.find(find_context_hospital);
                        let date = new Date();
                        date.setMinutes(date.getMinutes() + 30);
                        let messages = [];
                        messages.push(buildMessage("If you can hold youself a moment, " + req.body.result.resolvedQuery + " Hospital is heavly crowded."));
                        messages.push(buildMessage("I can suggest you to wait until " + date.getHours() + ":" + date.getMinutes()  + "."));
                        messages.push(buildMessageQuickReplies("I got the feeling you'll save approximately 22 min.", ["👍", "👎"]));
                        req.send_messages = {messages: messages};
                        next();
                    }
                    if ((requestBody.result.action === "waitingTime")) {
                        let messages = requestBody.result.fulfillment.messages;
                        messages.unshift(buildMessage("Hi " + req.userData.user_profile.first_name +", I'm here to help you find the nearest ER with the shortest waiting list."));
                        req.send_messages = {messages: messages};
                        next();
                    }
                    else {
                        var requestBody = req.body;
                        req.send_messages = requestBody.result.fulfillment.messages;
                        next();
                    }
                }
            }
        } catch (err) {
            console.error("Can't process request", err);

            return res.status(400).json({
                status: {
                    code: 400,
                    errorType: err.message
                }
            });
        }
    }

    function buildContextOutElement(name, parameters, lifespan) {
        let contextOut = {};

        contextOut.name = name;
        contextOut.parameters = parameters;
        contextOut.lifespan = lifespan;

        return contextOut;
    }

    function buildMessage(speech) {
        let message = {};
        message.speech = speech;
        message.type = 0;
        return message;
    }

    function buildMessageQuickReplies(title, repliesArray) {
        if (typeof repliesArray !== 'undefined' && repliesArray.length > 0) {
            let message = {};
            message.title = title;
            message.replies = repliesArray;
            message.type = 2;
            return message;
        } else {
            return buildMessage(title);
        }
    }

    function buildMessageCard(title, subtitle, imageUrl, btnArr) {
        let message = {};
        message.title = title;
        message.subtitle = subtitle;
        message.imageUrl = imageUrl;
        message.buttons = [];
        for (var i = 0; i < btnArr.length; i++) {
            var btn = btnArr[i];
            message.buttons.push({"text": btn["text"], "postback": btn.postback});
        }
        message.type = 1;
        return message;
    }

    function buildMessageImage(imageUrl) {
        let message = {};
        message.imageUrl = imageUrl;
        message.type = 3;
        return message;
    }

    function sendMessages(req, res) {
        return res.json(req.send_messages);
    }

    function get_profile_facebook(sender_id, callback) {
        let client = restify.createJsonClient({
            url: 'https://graph.facebook.com',
            version: '*'
        });

        let access_token = 'EAALAASVDRpEBAEF3gN35ujGBb0OEAmJJnWghiFrOsDJszlngIeMkIYPsi8zG7ThhZCCmXmlZAThbdn4slSGPlZCyYsYai7LNKM4oW7k1SIep5wORTxUiE3RUxRr8h9dRVxFqAoNg1alKNJvb7zVonN83YMOpAYJ2PfW3p2syAZDZD';

        client.get('/v2.9/' + sender_id + '?fields=first_name,last_name,profile_pic,locale,timezone,gender,is_payment_enabled&access_token=' + access_token, function(err, request, response, obj) {
            let user_profile = JSON.parse(response.body);
            //req.userData.user_profile = user_profile;
            callback(err, user_profile);
        });
    }

    function translate(text, lang_from, lang_to, callback) {
        //https://translate.yandex.net/api/v1.5/tr.json/translate?key=trnsl.1.1.20170629T103833Z.3a2a4f28122da541.adbef77348dfb49b971abd3a534895df6d47b809&text=שלום&lang=he-en
        if (!text) {
            let err = '';
            callback(err, text);
        } else {
            let client = restify.createJsonClient({
                url: 'https://translate.yandex.net',   //'https://translate.googleapis.com',
                version: '*'
            });
            // lang : en / he
            //client.get('/translate_a/single?client=gtx&sl=' + lang_from + '&tl='+ lang_to +'&dt=t&q=' + encodeURI(text), function(err, request, response, obj) {
                //trnsl.1.1.20170629T103833Z.3a2a4f28122da541.adbef77348dfb49b971abd3a534895df6d47b809
            client.get('/api/v1.5/tr.json/translate?key=trnsl.1.1.20170629T103833Z.3a2a4f28122da541.adbef77348dfb49b971abd3a534895df6d47b809&text='+encodeURI(text)+'&lang='+ lang_from +'-' + lang_to, function(err, request, response, obj) {
                //let arr = JSON.parse(response.body);
                let text_translated = JSON.parse(response.body).text[0];    //arr[0][0][0];
                callback(err, text_translated);
            });

        }
    }
}
