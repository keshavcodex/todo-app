const express = require("express");
const app = express();
const mongoose = require("mongoose");

app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));


mongoose.connect("mongodb://localhost:27017/todolistDB", { useNewUrlParser: true });

const itemSchema = {
    name: String
};
const Item = mongoose.model("Item", itemSchema);

const items1 = new Item({
    name: "Hit + to add new item"
});

const items2 = new Item({
    name: "⬅Hit this to delete an item"
});

const defaultItems = [items1, items2];



app.get("/", (req, res) => {
    let today = new Date();

    let options = {
        weekday: "long",
        day: "numeric", 
        month: "long"
    };
    let day = today.toLocaleDateString("en-UK", options);

    Item.find({}, (err, foundItems) => {
        if (foundItems.length === 0) {
            Item.insertMany(defaultItems, (err) => {
                if (err) {
                    console.log(err);
                } else {
                    console.log("Successfully saved items to database.")
                }
            });
            res.redirect("/");
        }else{
            res.render("list", { listTitle: day, newListItems: foundItems });
        }
    })

});

app.post("/", (req, res) => {
    const itemName = req.body.newItem;
    const item = new Item({
        name: itemName
    });
    item.save();
    res.redirect("/");
});

app.post("/delete", (req, res) => {
    const checkedItemId = req.body.checkbox;
    Item.findByIdAndRemove(checkedItemId, (err)=>{
        if(!err){
            console.log("Successfully deleted checked item");
        }
    });
    res.redirect("/");
});



app.listen(3000, () => {
    console.log("Listening on port 3000");
});
