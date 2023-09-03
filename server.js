const express= require("express");
const bodyParser = require("body-parser");
const request = require("request");
const https=require("https");

const app=express();

app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));

app.get("/",function(req,res){
  res.sendFile(__dirname+"/index.html");
});

app.post("/",function(req,res){
 var firstName=req.body.fName;
 var lastName=req.body.lName;
 var emailid= req.body.email;

 var data= {
   members: [{
     email_address: emailid,
     status: "subscribed",
     merge_fields: {
       FNAME:firstName,
       LNAME:lastName
     }
   }]
 };

 const jsonData =JSON.stringify(data);
const id=process.env.UNIQUE_ID;
 const url= "https://us9.api.mailchimp.com/3.0/lists/"+id;///////////////
 const key=process.env.API_KEY;
 const options={
   method:"POST",
   auth: "rupesh:"+key///////////////////change to original for local
 }
 const request = https.request(url,options,function(response){
   response.on("data",function(data){
     console.log(JSON.parse(data));
   })

    if (response.statusCode=200){
      res.sendFile(__dirname+"/success.html");
    }
    else{
      res.sendFile(__dirname+"/failure.html");
    }
 })

request.write(jsonData);
request.end();

});

app.post("/failure",function (req,res){
  res.redirect("/");
})


app.listen(process.env.PORT || 3000,function(){
  console.log("server is running on port 3000");
})


