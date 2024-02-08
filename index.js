const fs = require("fs");
const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const temppath = path.join(__dirname,"/templates/views");
const app = express();
const ll = bodyParser.urlencoded({ extended: true});
const nodemailer = require("nodemailer");
app.use(ll);
const ques = fs.readFileSync("questions.json","utf-8");
const name = ["Plants", "Animals", "Aqua", "Food"];
app.use(express.static(path.join(__dirname,"/templates/views")));

app.set("view engine", "hbs");
app.set("views", temppath);

app.get("/", (req, res)=>{
    res.render("login");
});

app.post("/login1", (req, res) =>{
    let username = `${req.body.username1}`;
    let password = `${req.body.pass1}`;
    var dat = fs.readFileSync("data.json","utf-8");
    var a = JSON.parse(dat);
        var tt = false;
        for(let i=0; i<a.length; i++){
            if(a[i].username == username && a[i].password == password){
                tt = true;
                break;
            }
        }
        if(!tt){
            res.status(404)
            res.render("loginerr.hbs",{
                how: "get",
                goto: "/",
                value: "I Think You Have Mistaken in Your Login/Signup Page.\nTry Going Back to the Login Page...."
            });
        }else{
            res.render("Home",{
                name: username,
                user: username
            });
        }
    
});
app.post("/signup", (req, res) =>{
    var a = {};
    var a1 = {};
    var a2 = {};
    a.name = `${req.body.name2}`;
    a1.name = `${req.body.name2}`;
    a2.name = `${req.body.name2}`;
    a.username = `${req.body.user2}`;
    a1.username = `${req.body.user2}`;
    a2.username = `${req.body.user2}`;
    a.gender = `${req.body.gend}`;
    a1.gender = `${req.body.gend}`;
    a.profession = `${req.body.prof}`;
    a1.profession = `${req.body.prof}`;
    a.password = `${req.body.pass2}`;
    a.confirm = `${req.body.cpass}`;
    a2.plantattempts = 0;
    a2.plantanswer = [];
    a2.plantdate = [];
    a2.plantpts = [];
    a2.animalattempts = 0;
    a2.animalanswer = [];
    a2.animaldate = [];
    a2.animalpts = [];
    a2.aquaattempts = 0;
    a2.aquaanswer = [];
    a2.aquadate = [];
    a2.aquapts = [];
    a2.foodattempts = 0;
    a2.foodanswer = [];
    a2.fooddate = [];
    a2.foodpts = [];
    var dat = fs.readFileSync("data.json","utf-8");
    var dat2 = fs.readFileSync("profiles.json","utf-8");
    var dat3 = fs.readFileSync("quiz.json","utf-8");
    var aa = JSON.parse(dat);
    var aa1 = JSON.parse(dat2);
    var aa2 = JSON.parse(dat3);
    var tt = false;
        if(a.password != a.confirm){
            tt = true;
        }
        if(!tt && aa.length != 0){for(let i=0; i<aa.length; i++){
            if(a.username == aa[i].username){
                tt = true;
                break;
            }
        }};
        if(tt){
            res.status(404)
            res.render("loginerr.hbs",{
                how: "get",
                goto: "/",
                value: "I Think You Have Mistaken in Your Login/Signup Page.\nTry Going Back to the Login Page...."
            });
        }else{
            delete a.confirm;
            aa[aa.length] = a;
            aa1[aa1.length] = a1;
            aa2[aa2.length] = a2;
            dat = JSON.stringify(aa);
            dat1 = JSON.stringify(aa1);
            dat2 = JSON.stringify(aa2);
            fs.writeFileSync("data.json",`${dat}`);
            fs.writeFileSync("profiles.json",`${dat1}`);
            fs.writeFileSync("quiz.json",`${dat2}`);
            res.render("Home",{
                name: a.username,
                user: a.username
            });
        }
});
app.post("/home", (req, res) =>{
    var username = `${req.body.usernameinv}`;
    res.render("Home",{
        user: username
    });
});
app.post("/gmail", (req,res) =>{
    var username = `${req.body.usernameinv}`;
    var transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: `${req.body.email}`,
            pass: `${req.body.passw}`
        }
    });
    var mailOption = {
        from: `${req.body.email}`,
        to: `2020ume0229@iitjammu.ac.in`,
        subject: `${req.body.subject}`,
        text: `I am ${req.body.name}: \n ${req.body.message}`
    };
    transporter.sendMail(mailOption, function(err, info){
        if(err)
            {
                console.log(err);
                res.render("Home",{
                    message: "Due to some error message is not sent",
                    user: username
                });
            }
        else res.render("Home",{
            message: "Message sent",
            user: username
        });
    });
});
app.post("/dashboard", (req, res) =>{
    var username = `${req.body.users}`;
    var dat = fs.readFileSync("profiles.json","utf-8");
    var aa = JSON.parse(dat);
    var dat2 = fs.readFileSync("quiz.json","utf-8");
    var aa2 = JSON.parse(dat2);
    var l = 0;
    for(let i=0; i<aa.length; i++){
        if(aa[i].username == username){
            l = i;
            break;
        }
    }
    if(!aa[l].bio){
        aa[l].bio = "Welcome to my Page";
    }
    if(!aa[l].city){
        aa[l].city = "--";
    }
    if(!aa[l].state){
        aa[l].state = "--";
    }
    var avp = 0, avf=0, avq=0, avn=0;
    for(let i=0; i<aa2[l].aquaattempts; i++){
        avq += aa2[l].aquapts[i];
    }
    for(let i=0; i<aa2[l].plantattempts; i++){
        avp += aa2[l].plantpts[i];
    }
    for(let i=0; i<aa2[l].animalattempts; i++){
        avn += aa2[l].animalpts[i];
    }
    for(let i=0; i<aa2[l].foodattempts; i++){
        avf += aa2[l].foodpts[i];
    }
    avp /= aa2[l].plantattempts;
    avq /= aa2[l].aquaattempts;
    avn /= aa2[l].animalattempts;
    avf /= aa2[l].foodattempts;
    avp = avp.toFixed(1);
    avq = avq.toFixed(1);
    avn = avn.toFixed(1);
    avf = avf.toFixed(1);
    if(aa2[l].foodattempts == 0) avf = 0;
    if(aa2[l].plantattempts == 0) avp = 0;
    if(aa2[l].aquaattempts == 0) avq = 0;
    if(aa2[l].animalattempts == 0) avn = 0;

    var avpp = avp*20, avpq = avq*20, avpn = avn*20, avpf = avf*20;
    var width = avpf+"%,"+avpq+"%,"+avpn+"%,"+avpp+"%";
    dat = JSON.stringify(aa);
    fs.writeFileSync("profiles.json",`${dat}`);
    res.render("Dashboard",{
        name: aa[l].name,
        bio: aa[l].bio,
        widths: width,
        gender: aa[l].gender,
        profession: aa[l].profession,
        city: aa[l].city,
        state: aa[l].state,
        user: username,
        avp: avp,
        avq: avq,
        avf: avf,
        avn: avn,
        avpp: avpp,
        avpq: avpq,
        avpn: avpn,
        avpf: avpf
    })
});
app.post("/info-change1", (req, res) =>{
    var username = `${req.body.usernameinv}`;
    var dat = fs.readFileSync("profiles.json","utf-8");
    var aa = JSON.parse(dat);
    var dat1 = fs.readFileSync("data.json","utf-8");
    var aa1 = JSON.parse(dat1);
    var dat2 = fs.readFileSync("quiz.json","utf-8");
    var aa2 = JSON.parse(dat2);
    var l = 0;
    var l1 = 0;
    var l2 = 0;
    for(let i=0; i<aa.length; i++){
        if(aa[i].username == username){
            l = i;
            break;
        }
    }
    for(let i=0; i<aa1.length; i++){
        if(aa1[i].username == username){
            l1 = i;
            break;
        }
    }
    for(let i=0; i<aa2.length; i++){
        if(aa2[i].username == username){
            l2 = i;
            break;
        }
    }
    if(req.body.city){
        aa[l].city = `${req.body.city}`;
    }
    if(req.body.state){
        aa[l].state = `${req.body.state}`;
    }
    if(req.body.profession){
        aa[l].profession = `${req.body.profession}`;
        aa1[l1].profession = `${req.body.profession}`;
    }
    if(req.body.username){
        aa[l].username = `${req.body.username}`;
        aa1[l1].username = `${req.body.username}`;        
        aa2[l2].username = `${req.body.username}`;        
        username = aa[l].username;
    }
    dat = JSON.stringify(aa);
    dat2 = JSON.stringify(aa2);
    dat1 = JSON.stringify(aa1);
    fs.writeFileSync("profiles.json", `${dat}`);
    fs.writeFileSync("data.json", `${dat1}`);
    fs.writeFileSync("quiz.json", `${dat2}`);
    var avp = 0, avf=0, avq=0, avn=0;
    for(let i=0; i<aa2[l].aquaattempts; i++){
        avq += aa2[l].aquapts[i];
    }
    for(let i=0; i<aa2[l].plantattempts; i++){
        avp += aa2[l].plantpts[i];
    }
    for(let i=0; i<aa2[l].animalattempts; i++){
        avn += aa2[l].animalpts[i];
    }
    for(let i=0; i<aa2[l].foodattempts; i++){
        avf += aa2[l].foodpts[i];
    }
    avp /= aa2[l].plantattempts;
    avq /= aa2[l].aquaattempts;
    avn /= aa2[l].animalattempts;
    avf /= aa2[l].foodattempts;
    avp = avp.toFixed(1);
    avq = avq.toFixed(1);
    avn = avn.toFixed(1);
    avf = avf.toFixed(1);
    if(aa2[l].foodattempts == 0) avf = 0;
    if(aa2[l].plantattempts == 0) avp = 0;
    if(aa2[l].aquaattempts == 0) avq = 0;
    if(aa2[l].animalattempts == 0) avn = 0;

    var avpp = avp*20, avpq = avq*20, avpn = avn*20, avpf = avf*20;
    var width = avpf+"%,"+avpq+"%,"+avpn+"%,"+avpp+"%";
    res.render("Dashboard",{
        name: aa[l].name,
        bio: aa[l].bio,
        widths: width,
        gender: aa[l].gender,
        profession: aa[l].profession,
        city: aa[l].city,
        state: aa[l].state,
        user: username,
        avp: avp,
        avq: avq,
        avf: avf,
        avn: avn,
        avpp: avpp,
        avpq: avpq,
        avpn: avpn,
        avpf: avpf
    })
});
app.post("/info-change2", (req,res) =>{
    var username = `${req.body.users}`;
    var dat = fs.readFileSync("profiles.json","utf-8");
    var aa = JSON.parse(dat);
    var dat2 = fs.readFileSync("quiz.json","utf-8");
    var aa2 = JSON.parse(dat2);
    var dat1 = fs.readFileSync("data.json","utf-8");
    var aa1 = JSON.parse(dat1);
    var l = 0;
    var l1 = 0;
    for(let i=0; i<aa.length; i++){
        if(aa[i].username == username){
            l = i;
            break;
        }
    }
    for(let i=0; i<aa1.length; i++){
        if(aa1[i].username == username){
            l1 = i;
            break;
        }
    }
    if(req.body.name){
        aa[l].name = `${req.body.name}`;
        aa1[l1].name = `${req.body.name}`;
    }
    if(req.body.bio){
        aa[l].bio = `${req.body.bio}`;
    }
    dat = JSON.stringify(aa);
    dat1 = JSON.stringify(aa1);
    fs.writeFileSync("profiles.json", `${dat}`);
    fs.writeFileSync("data.json", `${dat1}`);
    var avp = 0, avf=0, avq=0, avn=0;
    for(let i=0; i<aa2[l].aquaattempts; i++){
        avq += aa2[l].aquapts[i];
    }
    for(let i=0; i<aa2[l].plantattempts; i++){
        avp += aa2[l].plantpts[i];
    }
    for(let i=0; i<aa2[l].animalattempts; i++){
        avn += aa2[l].animalpts[i];
    }
    for(let i=0; i<aa2[l].foodattempts; i++){
        avf += aa2[l].foodpts[i];
    }
    avp /= aa2[l].plantattempts;
    avq /= aa2[l].aquaattempts;
    avn /= aa2[l].animalattempts;
    avf /= aa2[l].foodattempts;
    avp = avp.toFixed(1);
    avq = avq.toFixed(1);
    avn = avn.toFixed(1);
    avf = avf.toFixed(1);
    if(aa2[l].foodattempts == 0) avf = 0;
    if(aa2[l].plantattempts == 0) avp = 0;
    if(aa2[l].aquaattempts == 0) avq = 0;
    if(aa2[l].animalattempts == 0) avn = 0;

    var avpp = avp*20, avpq = avq*20, avpn = avn*20, avpf = avf*20;
    var width = avpf+"%,"+avpq+"%,"+avpn+"%,"+avpp+"%";
    res.render("Dashboard",{
        name: aa[l].name,
        bio: aa[l].bio,
        widths: width,
        gender: aa[l].gender,
        profession: aa[l].profession,
        city: aa[l].city,
        state: aa[l].state,
        user: username,
        avp: avp,
        avq: avq,
        avf: avf,
        avn: avn,
        avpp: avpp,
        avpq: avpq,
        avpn: avpn,
        avpf: avpf
    })
});
app.post("/choose", (req,res) =>{
    var username = `${req.body.users}`;
    res.render("choose",{
        user: username
    });
});
app.post("/animals",(req,res)=>{
    var username = `${req.body.users}`;
    var dat = ques;
    var dat2 = fs.readFileSync("quiz.json","utf-8");
    var a = JSON.parse(dat);
    var a2 = JSON.parse(dat2);
    var ll = 0;
    for(let i=0; i<a2.length; i++){
        if(username == a2[i].username){
            ll = i;
            break;
        }
    }

    if(a2[ll].animalattempts < 5){
        a2[ll].animalattempts++;
        var date = new Date();
        var datt = date.getDate(); 
        var month = date.getMonth(); 
        month++;
        var year = date.getFullYear(); 
        if(datt < 10) date = "0"+datt;
        if(month < 10) month = "0"+month;
        date = `${datt}:${month}:${year}`;
        a2[ll].animaldate.push(date);
        dat2 = JSON.stringify(a2);
        fs.writeFileSync("quiz.json", dat2);
        res.render("Quiz",{
            name: "plant",
            quizno: 1,
            question1: a[1].ques1,
            question2: a[1].ques2,
            question3: a[1].ques3,
            question4: a[1].ques4,
            question5: a[1].ques5,
            op11: a[1].options1.op1,
            op12: a[1].options1.op2,
            op13: a[1].options1.op3,
            op14: a[1].options1.op4,
            op21: a[1].options2.op1,
            op22: a[1].options2.op2,
            op23: a[1].options2.op3,
            op24: a[1].options2.op4,
            op31: a[1].options3.op1,
            op32: a[1].options3.op2,
            op33: a[1].options3.op3,
            op34: a[1].options3.op4,
            op41: a[1].options4.op1,
            op42: a[1].options4.op2,
            op43: a[1].options4.op3,
            op44: a[1].options4.op4,
            op51: a[1].options5.op1,
            op52: a[1].options5.op2,
            op53: a[1].options5.op3,
            op54: a[1].options5.op4,
            user: username,
            back: "images/vinicius-gomes-VW76-Ow2E5U-unsplash.jpg"
        });
    }else{
        res.status(404)
        res.render("loginerr.hbs",{
            users: username,
            how: "post",
            goto: "/choose",
            value: "You cannot attempt any quiz more than 5 times..."
        });
    }
    
});
app.post("/aqua",(req,res)=>{
    var username = `${req.body.users}`;
    var dat = ques;
    var dat2 = fs.readFileSync("quiz.json","utf-8");
    var a = JSON.parse(dat);
    var a2 = JSON.parse(dat2);
    var ll = 0;
    for(let i=0; i<a2.length; i++){
        if(username == a2[i].username){
            ll = i;
            break;
        }
    }

    if(a2[ll].aquaattempts < 5){
        a2[ll].aquaattempts++;
        var date = new Date();
        var datt = date.getDate(); 
        var month = date.getMonth(); 
        month++;
        var year = date.getFullYear(); 
        if(datt < 10) date = "0"+datt;
        if(month < 10) month = "0"+month;
        date = `${datt}:${month}:${year}`;
        a2[ll].aquadate.push(date);
        dat2 = JSON.stringify(a2);
        fs.writeFileSync("quiz.json", dat2);
        res.render("Quiz",{
            name: "Aqua",
            quizno: 2,
            question1: a[2].ques1,
            question2: a[2].ques2,
            question3: a[2].ques3,
            question4: a[2].ques4,
            question5: a[2].ques5,
            op11: a[2].options1.op1,
            op12: a[2].options1.op2,
            op13: a[2].options1.op3,
            op14: a[2].options1.op4,
            op21: a[2].options2.op1,
            op22: a[2].options2.op2,
            op23: a[2].options2.op3,
            op24: a[2].options2.op4,
            op31: a[2].options3.op1,
            op32: a[2].options3.op2,
            op33: a[2].options3.op3,
            op34: a[2].options3.op4,
            op41: a[2].options4.op1,
            op42: a[2].options4.op2,
            op43: a[2].options4.op3,
            op44: a[2].options4.op4,
            op51: a[2].options5.op1,
            op52: a[2].options5.op2,
            op53: a[2].options5.op3,
            op54: a[2].options5.op4,
            user: username,
            back: "images/johnny-chen-bLEmFvSPLog-unsplash.jpg"
        });
    }else{
        res.status(404)
        res.render("loginerr.hbs",{
            users: username,
            how: "post",
            goto: "/choose",
            value: "You cannot attempt any quiz more than 5 times..."
        });
    }
    
});
app.post("/food",(req,res)=>{
    var username = `${req.body.users}`;
    var dat = ques;
    var dat2 = fs.readFileSync("quiz.json","utf-8");
    var a = JSON.parse(dat);
    var a2 = JSON.parse(dat2);
    var ll = 0;
    for(let i=0; i<a2.length; i++){
        if(username == a2[i].username){
            ll = i;
            break;
        }
    }

    if(a2[ll].foodattempts < 5){
        a2[ll].foodattempts++;
        var date = new Date();
        var datt = date.getDate(); 
        var month = date.getMonth(); 
        var year = date.getFullYear(); 
        month++;
        if(datt < 10) date = "0"+datt;
        if(month < 10) month = "0"+month;
        date = `${datt}:${month}:${year}`;
        a2[ll].fooddate.push(date);
        dat2 = JSON.stringify(a2);
        fs.writeFileSync("quiz.json", dat2);
        res.render("Quiz",{
            name: "plant",
            quizno: 3,
            question1: a[3].ques1,
            question2: a[3].ques2,
            question3: a[3].ques3,
            question4: a[3].ques4,
            question5: a[3].ques5,
            op11: a[3].options1.op1,
            op12: a[3].options1.op2,
            op13: a[3].options1.op3,
            op14: a[3].options1.op4,
            op21: a[3].options2.op1,
            op22: a[3].options2.op2,
            op23: a[3].options2.op3,
            op24: a[3].options2.op4,
            op31: a[3].options3.op1,
            op32: a[3].options3.op2,
            op33: a[3].options3.op3,
            op34: a[3].options3.op4,
            op41: a[3].options4.op1,
            op42: a[3].options4.op2,
            op43: a[3].options4.op3,
            op44: a[3].options4.op4,
            op51: a[3].options5.op1,
            op52: a[3].options5.op2,
            op53: a[3].options5.op3,
            op54: a[3].options5.op4,
            user: username,
            back: "images/lily-banse--YHSwy6uqvk-unsplash.jpg"
        });
    }else{
        res.status(404)
        res.render("loginerr.hbs",{
            users: username,
            how: "post",
            goto: "/choose",
            value: "You cannot attempt any quiz more than 5 times..."
        });
    }
    
});
app.post("/plants",(req,res)=>{
    var username = `${req.body.user}`;
    var dat = ques;
    var dat2 = fs.readFileSync("quiz.json","utf-8");
    var a = JSON.parse(dat);
    var a2 = JSON.parse(dat2);
    var ll = 0;
    for(let i=0; i<a2.length; i++){
        if(username == a2[i].username){
            ll = i;
            break;
        }
    }

    if(a2[ll].plantattempts < 5){
        a2[ll].plantattempts++;
        var date = new Date();
        var datt = date.getDate(); 
        var month = date.getMonth(); 
        var year = date.getFullYear(); 
        month++;
        if(datt < 10) date = "0"+datt;
        if(month < 10) month = "0"+month;
        date = `${datt}:${month}:${year}`;
        a2[ll].plantdate.push(date);
        dat2 = JSON.stringify(a2);
        fs.writeFileSync("quiz.json", dat2);
        res.render("Quiz",{
            name: "plant",
            quizno: 0,
            question1: a[0].ques1,
            question2: a[0].ques2,
            question3: a[0].ques3,
            question4: a[0].ques4,
            question5: a[0].ques5,
            op11: a[0].options1.op1,
            op12: a[0].options1.op2,
            op13: a[0].options1.op3,
            op14: a[0].options1.op4,
            op21: a[0].options2.op1,
            op22: a[0].options2.op2,
            op23: a[0].options2.op3,
            op24: a[0].options2.op4,
            op31: a[0].options3.op1,
            op32: a[0].options3.op2,
            op33: a[0].options3.op3,
            op34: a[0].options3.op4,
            op41: a[0].options4.op1,
            op42: a[0].options4.op2,
            op43: a[0].options4.op3,
            op44: a[0].options4.op4,
            op51: a[0].options5.op1,
            op52: a[0].options5.op2,
            op53: a[0].options5.op3,
            op54: a[0].options5.op4,
            user: username,
            back: "images/road-1072821_1920.jpg"
        });
    }else{
        res.status(404)
        res.render("loginerr.hbs",{
            users: username,
            how: "post",
            goto: "/choose",
            value: "You cannot attempt any quiz more than 5 times..."
        });
    }
    
});
app.post("/scores",(req,res)=>{
    var username = `${req.body.user}`;
    var quizno = `${req.body.quiz}`;
    var answers = "";
    var dat = ques;
    var a = JSON.parse(dat);
    if(req.body.answers) answers = `${req.body.answers}`;
    else answers = "nnnnn";
    if(answers.length < 5){
        var ap = 5 - answers.length;
        for(let i=0; i<ap; i++){
            answers += "n";
        }
    }
    var canswers = a[quizno].answers;
    var dat2 = fs.readFileSync("quiz.json","utf-8");
    var dat6 = fs.readFileSync("data.json","utf-8");
    var a6 = JSON.parse(dat6);
    var a2 = JSON.parse(dat2);
    var ll = 0, pts=0;
    for(let i=0; i<5; i++){
        if(answers[i] == canswers[i]) pts++;
    }
    var gen = "";
    for(let i=0; i<a6.length; i++){
        if(a6[i].username == username) gen = a6[i].gender;
    }
    for(let i=0; i<a2.length; i++){
        if(username == a2[i].username){
            ll = i;
            break;
        }
    }
    var points = "", attemp = 0, min=6, max= 0, dddate = '', av = 0;
    if(quizno == 0){
        attemp = a2[ll].plantattempts;
        a2[ll].plantpts[attemp-1] = pts;
        a2[ll].plantanswer[attemp-1] = answers;
        for(let i=0; i<attemp-1; i++){
            points += a2[ll].plantpts[i];
        }
        dddate += a2[ll].plantdate[0];
        for(let i=0; i<attemp; i++){
            if(a2[ll].plantpts[i] > max) max = a2[ll].plantpts[i];
            if(a2[ll].plantpts[i] < min) min = a2[ll].plantpts[i];
            av += a2[ll].plantpts[i];
            if(i > 0) dddate += ","+a2[ll].plantdate[i];
        }
    }
    else if(quizno == 1){
        attemp = a2[ll].animalattempts;
        a2[ll].animalpts[attemp-1] = pts;
        a2[ll].animalanswer[attemp-1] = answers;
         for(let i=0; i<attemp-1; i++){
            points += a2[ll].animalpts[i];
        }
        dddate += a2[ll].animaldate[0];
        for(let i=0; i<attemp; i++){
            if(a2[ll].animalpts[i] > max) max = a2[ll].animalpts[i];
            if(a2[ll].animalpts[i] < min) min = a2[ll].animalpts[i];
            av += a2[ll].animalpts[i];
            if(i > 0) dddate += ","+a2[ll].animaldate[i];
        }
    }
    else if(quizno == 2){
        attemp = a2[ll].aquaattempts;
        a2[ll].aquapts[attemp-1] = pts;
        a2[ll].aquaanswer[attemp-1] = answers;
         for(let i=0; i<attemp-1; i++){
            points += a2[ll].aquapts[i];
        }
        dddate += a2[ll].aquadate[0];
        for(let i=0; i<attemp; i++){
            if(a2[ll].aquapts[i] > max) max = a2[ll].aquapts[i];
            if(a2[ll].aquapts[i] < min) min = a2[ll].aquapts[i];
            av += a2[ll].aquapts[i];
            if(i > 0) dddate += ","+a2[ll].aquadate[i];
        }
    }
    else if(quizno == 3){
        attemp = a2[ll].foodattempts;
        a2[ll].foodpts[attemp-1] = pts;
        a2[ll].foodanswer[attemp-1] = answers;
         for(let i=0; i<attemp-1; i++){
            points += a2[ll].foodpts[i];
        }
        dddate += a2[ll].fooddate[0];
        for(let i=0; i<attemp; i++){
            if(a2[ll].foodpts[i] > max) max = a2[ll].foodpts[i];
            if(a2[ll].foodpts[i] < min) min = a2[ll].foodpts[i];
            av += a2[ll].foodpts[i];
            if(i > 0) dddate += ","+a2[ll].fooddate[i];
        }
    }
    av = av/attemp;
    av = av.toFixed(3);



    dat2 = JSON.stringify(a2);
    fs.writeFileSync("quiz.json",`${dat2}`);
    answers = answers+canswers;
    res.render("Scoreboard",{
        ans: answers,
        att: attemp,
        pts: points,
        gender: gen,
        quizno: quizno,
        user: username,
        quizname: name[quizno],
        name: a2[ll].name,
        attemptl: `${5-attemp}`,
        min: min,
        max: max,
        ave: av,
        date: dddate,
        option1: canswers[0],
        option2: canswers[1],
        option3: canswers[2],
        option4: canswers[3],
        option5: canswers[4],
        chosen1: answers[0],
        chosen2: answers[1],
        chosen3: answers[2],
        chosen4: answers[3],
        chosen5: answers[4],
        explained1: a[quizno].first,
        explained2: a[quizno].second,
        explained3: a[quizno].third,
        explained4: a[quizno].fourth,
        explained5: a[quizno].fifth
    });
});

app.listen(8081, ()=>{
    console.log("listening");
})
