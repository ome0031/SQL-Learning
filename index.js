 const { faker } = require('@faker-js/faker');
 const mysql = require("mysql2");
 const express = require("express");
 const app = express();
 const path = require("path");
 const methodOverride = require("method-override");

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "/views"));

app.use(methodOverride("_method"));
app.use(express.urlencoded({extended:true}));


 const connection = mysql.createConnection({
     host: 'localhost',
     user: 'root',
     database: 'delta_app',
     password: 'ritesh@29'
   });

   let getRandomUser = () => {
    return [
       faker.string.uuid(),
       faker.internet.userName(),
       faker.internet.email(),
       faker.internet.password(),
    ];
  }

//Home Route
  app.get("/", (req, res) => {
    let q = `SELECT count(*) FROM user`;
   try{
     connection.query(q, (err , result) => {
         if(err) throw err;
         let count = result[0]["count(*)"];
         res.render("home.ejs", {count});
         });
   } catch (err) {
     console.log(err);
     res.send("Some error in DB");
   }
  });

//Show Route
  app.get("/user", (req, res) => {
   let q = `SELECT * FROM user`;
   try{
    connection.query(q, (err , users) => {
        if(err) throw err;
        res.render("show.ejs", {users});
        });
  } catch (err) {
    console.log(err);
    res.send("Some error in DB");
  }
  })

  //Create Route
  app.get("/user/new", (req, res) => {
    res.render("new.ejs");
  })

  app.post("/user", (req, res) => {
    const {id, username, email, password} = req.body;

    let q = "INSERT INTO user (id, username, email, password) VALUES (?, ?, ?, ?)";
    let data = [id, username, email, password];

    try {
      connection.query(q, data, (err, result) => {
        if(err) throw err
        console.log(result)
      })
    } catch (err) {
      console.log(err);
      console.log("Some err in db");
    }
    res.redirect("/user");
  })

  //Edit Route
  app.get("/user/:id/edit", (req, res) => {
    let {id} = req.params;
    let q = `SELECT * FROM user WHERE id = '${id}'`;
    try{
      connection.query(q, (err , result) => {
          if(err) throw err;
          let user = result[0];
          res.render("edit.ejs", { user });
          });
      } catch (err) {
        console.log(err);
        res.send("Some error in DB");
      }
  })

  //Update Route
  app.patch("/user/:id", (req, res) => {
    let {id} = req.params;
    let {password: formPass, username: newUSername} = req.body;
    let q = `SELECT * FROM user WHERE id = '${id}'`;
    try{
      connection.query(q, (err , result) => {
          if(err) throw err;
          let user = result[0];
          if(formPass != user.password){
            res.send("Wrong Password");
          } else {
            let q2 = `UPDATE user SET username='${newUSername}' WHERE id='${id}'`;
            connection.query(q2, (err, res) => {
              if(err) throw err;
              res.send(res);
            })
          }
          });
    } catch (err) {
      console.log(err);
      res.send("Some error in DB");
    }
  })


  app.listen("8080", () => {
    console.log("server live on port 8080");
  });


 
   
  //  try{
  //    connection.query(q, [data], (err , result) => {
  //        if(err) throw err;
  //        console.log(result);
  //        });
  //  } catch (err) {
  //    console.log(err);
  //  }

  //   connection.end();


