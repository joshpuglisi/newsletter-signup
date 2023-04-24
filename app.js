const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const https = require("https");

const app = express();

app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));

//load the html
app.get("/", function(req,res){
    res.sendFile(__dirname + "/signup.html");
})

//post data to server
app.post("/", function(req,res){
    const name1 = req.body.firstName;
    const name2 = req.body.lastName;
    const email = req.body.email;

    const data = {
        members: [
            {
                email_address: email,
                status: "subscribed",
                merge_fields: {
                    FNAME: name1,
                    LNAME: name2
                }
            }
        ]
    }

    const urlChimp = "https://us8.api.mailchimp.com/3.0/lists/d7436e41ee"

    const jsonData = JSON.stringify(data);

    const option = {
        method: "POST",
        auth: "joshua28:6650088194b1ee54cbb889f746a661bb-us8"
    }

    //make a request to the MailChimp Server using the credentials above
    const request = https.request(urlChimp, option, function(response){
        console.log(response.statusCode);
        if(response.statusCode === 200){
            res.sendFile(__dirname + "/success.html"); //if success, load the success.html
        } else {
            res.sendFile(__dirname + "/failure.html"); //if fail, load the failure.html
        }
        /*response.on("data", function(data){
            console.log(JSON.parse(data)); //to show the data in JSON format
        })*/
    })

    request.write(jsonData); //sending the jsonData to mailChimp server
    request.end();
})

//reroute
app.post("/failure", function(req,res){
    res.redirect("/");
})

app.post("/success", function(req,res){
    res.redirect("/");
})

app.listen(process.env.PORT || 3000, function(){
    console.log("Server is running.");
})

//apikey: 6650088194b1ee54cbb889f746a661bb-us8
//list ID or Audience ID: d7436e41ee