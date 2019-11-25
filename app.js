var express = require("express");
var mysql = require("mysql");
var bodyparser = require("body-parser");
var mysql = require("mysql");
var bodyparser = require("body-parser");
var app = express();
var urlencodedParser = bodyparser.urlencoded({ extended: false });

app.set("view engine", "ejs");
app.use("/assets", express.static(__dirname + "/assets"));

var connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "movie"
});
connection.connect(err => {
  if (err) throw err;
  console.log("connected");
});

app.get("/", (req, res) => res.render("index"));
app.get("/insert/actor", (req, res) => res.render("insertionActor"));
app.get("/insert/director", (req, res) => res.render("insertionDirector"));
app.get("/insert/movie", (req, res) => res.render("insertionMovie"));
app.get("/insert/cast", (req, res) => res.render("insertionCast"));
app.get("/insert/ratings", (req, res) => res.render("insertionRating"));
app.get("/delete", (req, res) => res.render("deletion/deleteMovie"));
app.get("/display", (req, res) => res.render("display/displayDetails"));
app.get("/update", (req, res) => res.render("update/updateDirector"));
app.get("/success", (req, res) => res.render("errorDetection/success"));
app.get("/failure", (req, res) => res.render("errorDetection/failure"));
app.get("/displayMovieDetails", (req, res) =>
  res.render("display/displayMovie")
);

app.post("/insert/actor", urlencodedParser, function(req, res) {
  var id = req.body.actor_id;
  var name = req.body.actor_name;
  var sex = req.body.actor_gender;
  var sql =
    "Insert into actor VALUES ('" + id + "','" + name + "','" + sex + "')";
  connection.query(sql, (err, result) => {
    try {
      if (err) throw err;
      console.log("i row inderted");
      res.redirect("/success");
    } catch (e) {
      res.redirect("/failure");
      console.log("error was thrown");
    }
  });
});

app.post("/insert/director", urlencodedParser, function(req, res) {
  var id = req.body.Dir_id;
  var name = req.body.Dir_name;
  var phone = req.body.Dir_Phone;
  var sql =
    "Insert into director VALUES ('" + id + "','" + name + "','" + phone + "')";
  connection.query(sql, function(err, result) {
    try {
      if (err) {
        throw err;
      }
      console.log("1 record inserted");
      res.redirect("/success");
    } catch (e) {
      res.redirect("/failure");
      console.log("error was thrown");
    }
  });
});

app.post("/insert/movie", urlencodedParser, function(req, res) {
  var mov_id = req.body.mov_id;
  var mov_title = req.body.mov_name;
  var mov_year = req.body.mov_year;
  var mov_lang = req.body.mov_lang;
  var dir_id = req.body.Dir_id;
  var sql =
    "Insert into movies VALUES ('" +
    mov_id +
    "','" +
    mov_title +
    "','" +
    mov_year +
    "','" +
    mov_lang +
    "','" +
    dir_id +
    "')";
  connection.query(sql, function(err, result) {
    try {
      if (err) throw err;
      console.log("1 record inserted");
      res.redirect("/success");
    } catch (e) {
      res.redirect("/failure");
      console.log("error was thrown");
    }
  });
});

app.post("/insert/cast", urlencodedParser, function(req, res) {
  var act_id = req.body.act_id;
  var mov_id = req.body.mov_id;
  var role = req.body.role;
  var sql =
    "Insert into movie_cast VALUES ('" +
    act_id +
    "','" +
    mov_id +
    "','" +
    role +
    "')";
  connection.query(sql, function(err, result) {
    try {
      if (err) throw err;
      console.log("1 record inserted");
      res.redirect("/success");
    } catch (e) {
      res.redirect("/failure");
      console.log("error was thrown");
    }
  });
});

app.post("/insert/ratings", urlencodedParser, function(req, res) {
  var mov_id = req.body.mov_id;
  var rev_stars = req.body.rating;
  var sql = "Insert into rating VALUES ('" + mov_id + "','" + rev_stars + "')";
  connection.query(sql, function(err, result) {
    try {
      if (err) throw err;
      console.log("1 record inserted");
      res.redirect("/success");
    } catch (e) {
      res.redirect("/failure");
      console.log("error was thrown");
    }
  });
});

app.post("/displayMovieDetails", urlencodedParser, function(req, res) {
  var movieName = req.body.movie;
  var sql =
    "SELECT mov_title,mov_year,mov_lang,dir_name,act_name,rev_stars FROM movies as m,actor as a,director as d,movie_cast as c,rating as r WHERE m.mov_title='" +
    movieName +
    "' AND d.dir_id=m.dir_id AND m.mov_id=c.mov_id AND m.mov_id=r.mov_id AND c.act_id=a.act_id";
  connection.query(sql, function(err, result, fields) {
    try {
      if (err) throw err;
      var title = result[0].mov_title;
      var year = result[0].mov_year;
      var lang = result[0].mov_lang;
      var director = result[0].dir_name;
      var artist = result[0].act_name;
      var review = result[0].rev_stars;
      res.render("display/displayMovie", {
        title: title,
        year: year,
        lang: lang,
        director: director,
        artist: artist,
        review: review
      });
    } catch (e) {
      res.redirect("/failure");
      console.log("error was thrown");
    }
  });
});
// the display info post methos
app.post("/display1", urlencodedParser, function(req, res) {
  var name = req.body.name;
  sql =
    "SELECT a.act_id,act_gender,mov_title FROM actor as a, movies as m, movie_cast as c where a.act_name='" +
    name +
    "' and a.act_id=c.act_id and c.mov_id=m.mov_id";
  connection.query(sql, function(err, result, fields) {
    try {
      if (err) throw err;
      var id = result[0].act_id;
      var gender = result[0].act_gender;
      gender = gender === "m" ? "male" : "female";
      var data = [];
      for (var i = 0; i < result.length; i++) {
        data[i] = result[i].mov_title;
      }
      res.render("display/displayActorinfo", {
        name: name,
        gender: gender,
        data: data,
        id: id
      });
    } catch (e) {
      res.redirect("/failure");
      console.log("error was thrown");
    }
  });
});

app.post("/display2", urlencodedParser, function(req, res) {
  var name = req.body.name;
  var sql =
    "SELECT d.dir_id ,dir_phone,mov_title FROM director as d, movies as m where d.dir_name='" +
    name +
    "' and d.dir_id=m.dir_id";
  connection.query(sql, function(err, result) {
    try {
      if (err) throw err;
      var id = result[0].dir_id;
      var phone = result[0].dir_phone;
      var data = [];
      for (var i = 0; i < result.length; i++) {
        data[i] = result[i].mov_title;
      }
      res.render("display/displayDireInfo", {
        name: name,
        id: id,
        phone: phone,
        data: data
      });
    } catch (e) {
      res.redirect("/failure");
      console.log("error was thrown");
    }
  });
});

app.post("/delete", urlencodedParser, function(req, res) {
  var movie = req.body.title;
  var sql = "delete from movies where mov_title='" + movie + "'";
  connection.query(sql, function(err, result) {
    try {
      if (err) throw err;
      console.log("hey deletion was successful");
      res.redirect("/delete");
    } catch (e) {
      res.redirect("/failure");
      console.log("the movie was already deleted");
    }
  });
});

app.post("/update1", urlencodedParser, function(req, res) {
  var name = req.body.name;
  var phone = req.body.phone;
  sql =
    "update director SET dir_phone='" +
    phone +
    "' WHERE dir_name='" +
    name +
    "'";
  connection.query(sql, function(err, result) {
    try {
      if (err) throw err;
      res.redirect("/update");
      console.log("data successfully updated");
    } catch (e) {
      res.redirect("/failure");
      console.log("error was thrown");
    }
  });
});

app.post("/update2", urlencodedParser, function(req, res) {
  var title = req.body.title;
  var lang = req.body.lang;
  sql =
    "update movies set mov_lang='" + lang + "' where mov_title='" + title + "'";
  connection.query(sql, function(err, result, fields) {
    if (err) throw err;
    console.log("data was updated successfully");
    res.redirect("/update");
  });
});

app.listen(3333, () => console.log("listens to port 3333"));
