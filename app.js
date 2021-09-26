const express = require("express");
const app = express();

app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));

let items = ["Hit + to add new item", "⬅click on checkbox"];

app.get("/", (req, res)=>{
    let today = new Date();

    let options = {
        weekday: "long",
        day: "numeric", 
        month: "long"
    };
    let day = today.toLocaleDateString("en-UK", options);

    res.render("list", {listTitle: day, newListItems: items});
});

app.post("/", (req, res)=>{
    var item = req.body.newItem;
    if(item != ''){
        items.push(item);
    }
    res.redirect("/");
});



app.listen(3000, ()=>{
    console.log("Listening on port 3000");
});
