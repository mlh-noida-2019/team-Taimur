var express = require('express');
var app = express();
var request = require("request");
var fs = require('fs');
app.set("view engine", "ejs");
app.use(express.static("public"));
var d3Force = require("d3-force");
app.listen(process.env.PORT || 3000, process.env.IP, function() {
  console.log("Server is running");
});

app.get("/",function(req,res){
	res.render('index');
})
app.get("/ref",function(req,res){
	res.render('ref');
})
app.get('/fill-me',function(req,res){
    res.redirect("https://goo.gl/forms/04qab4EGWwQJNcJx1");
})
app.get('/getJson',function(req,res){
	let rawData = fs.readFileSync('data/data.json');
	res.status(200).send(JSON.parse(rawData));
})
app.get('/getGformJson',function(req,res){
	var url="https://script.google.com/macros/s/AKfycbxOLElujQcy1-ZUer1KgEvK16gkTLUqYftApjNCM_IRTL3HSuDk/exec?id=16amx-OpDCNpqMwjsXCN-qJtlOsXJv6x8OeCLdWOACMA&sheet=Form Responses 1";
	request(url,function(err,response,body){
    if(!err && response.statusCode==200){
    	var data=JSON.parse(body);
    	data=data['Form Responses 1'];
    	var responses={"nodes":[],"links":[],};
    	var types=[];
    	for(var i=0;i<data.length;i++){
    		/*responses.nodes.push({'name':data[i]['Name'],'type':2,'data':{'size':10,'seat_number':data[i]['Seated_at?'],'contact':data[i]['Contact_Detail(email/phone/both)'],'org':data[i]['College/Organization']}});
    		responses.links.push({'source':data[i]['Name'],'target':data[i]['Expert_at?'],'value':2});
    		responses.links.push({'source':data[i]['Name'],'target':data[i]['Want_to_learn?'],'value':1});*/
    		if(types.indexOf(data[i]['Expert_at?'])==-1)
    			types.push(data[i]['Expert_at?']);
    		if(types.indexOf(data[i]['Want_to_learn?'])==-1)
    			types.push(data[i]['Want_to_learn?']);
    	}
    	for(var i=0;i<types.length;i++){
    		responses.nodes.push({'name':types[i],'type':'1','data':{'size':25}});
    	}
    	for(var i=0;i<data.length;i++){
    		responses.nodes.push({'name':data[i]['Name'],'type':2,'data':{'size':10,'seat_number':data[i]['Seated_at?'],'contact':data[i]['Contact_Detail(email/phone/both)'],'org':data[i]['College/Organization'],'link':data[i]['Profile(fb/git)']}});
    		responses.links.push({'source':types.length+i,'target':types.indexOf(data[i]['Expert_at?']),'value':2});
    		responses.links.push({'source':types.length+i,'target':types.indexOf(data[i]['Want_to_learn?']),'value':1});
    		/*if(types.indexOf(data[i]['Expert_at?'])==-1)
    			types.push(data[i]['Expert_at?']);
    		if(types.indexOf(data[i]['Want_to_learn?'])==-1)
    			types.push(data[i]['Want_to_learn?']);*/
    	}    	
    	console.log(responses);
    	res.status(200).send((responses));
    	
    }
  });
});
