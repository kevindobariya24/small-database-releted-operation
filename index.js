const mysql = require('mysql2');
const express=require('express');
const app=express();
var methodOverride = require('method-override');
app.use(methodOverride("_method"));
app.use(express.urlencoded({extended:true}));
const path=require('path');
let port = 5000;
 
const { faker } = require('@faker-js/faker');
const { query } = require('express');
const { count } = require('console');

app.set( 'view engine' , 'ejs' );
app.set('views', path.join(__dirname, '/views'));
app.use(express.urlencoded({extended:true}));

let user=()=>{
    return[
    faker.string.uuid(),
    faker.internet.userName(),
    faker.internet.email(),
    faker.internet.password()
    ];
}

const con = mysql.createConnection({
    host: "localhost",
    database: "mydb",
    user: "root",
    password: "7799"
  });
  
app.listen(port,()=>{
  console.log("server start");
});

app.get("/",(req,resp)=>{
  let q=`select * from user `;  
  try{
  con.query(q,(err,res,field)=>{
     
     resp.render("index.ejs",{res});
    
  });}catch(err)
  {
     resp.send(err);
  }; 
});

app.get("/user/:id/edit",(req,resp)=>{
  let {id}=req.params;

  let q=`select * from user where id="${id}"`;
  
  try{
  con.query(q,(err,res,field)=>{

    let user=res[0];
     resp.render("edit.ejs",{user});
  });}catch(err)
  {
     resp.send(err);
  }; 
});

app.patch("/user/edit/:id",(req,resp)=>{
 let {user:userName,userpassword:userPassword}=req.body;
 let {id}=req.params;
 let q=`select * from user where id="${id}"`;

 try{
  con.query(q,(err,res,field)=>{

    let user=res[0];
    if(userPassword!=user.password)
      { 
        resp.send("password is rong!!");
        
      }else
        {
          let q2=`UPDATE user SET username="${userName}" WHERE id = "${id}"`;
          try{
            con.query(q2,(err,res,field)=>{
          
             console.log(res);
               resp.redirect("/");
            });}catch(err)
            {
               resp.send(err);
            }; 
          }
  });}catch(err)
  {
     resp.send(err);
  }; 
});

app.get("/newuser",(req,resp)=>{
 
 let newid=user();
 let id=newid[0]
 resp.render("new.ejs",{id});
});

app.post("/user/add/:id",(req,resp)=>{
  let {username,email,password}=req.body;
  let {id}=req.params;
  
  let q=`insert into user value ("${id}","${username}","${email}","${password}")`;
  try{
  con.query(q,(err,res,field)=>{
    if(err) throw(err);
    
     resp.redirect("/");
  });}catch(err)
  {
     resp.send(err);
  }; 
});

app.get("/user/:id/delete",(req,resp)=>{
  let {id}=req.params;

  let q=`select * from user where id="${id}"`;
  
  try{
  con.query(q,(err,res,field)=>{

    let user=res[0];
     resp.render("del.ejs",{user});
  });}catch(err)
  {
     resp.send(err);
  }; 
});

app.delete("/user/:id/delete",(req,resp)=>{
  let {userpassword}=req.body;
  let {id}=req.params;
  
  let q=`select * from user where id="${id}"`;

  try{
   con.query(q,(err,res,field)=>{
 
     let user=res[0];
     if(userpassword!=user.password)
       { 
         resp.send("password is rong!!");
         
       }else
         {
           let q2=`delete from user WHERE id = "${id}"`;
           try{
             con.query(q2,(err,res,field)=>{
           
              console.log(res);
                resp.redirect("/");
             });}catch(err)
             {
                resp.send(err);
             }; 
           }
   });}catch(err)
   {
      resp.send(err);
   }; 
});

app.get("/All_user",(req,resp)=>{
  let q=`select count(*) from user`;
  
  try{
  con.query(q,(err,res,field)=>{
    let count=res[0]["count(*)"];
    resp.send (`You Have ${count} Users`);
     });}catch(err)
  {
     resp.send(err);
  };
});