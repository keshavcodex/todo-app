import mongoose from "mongoose";
import express from "express";
import dotenv from "dotenv";

const app = express();
dotenv.config();
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));

const mongourl = process.env.MONGO_URL;
mongoose.connect(mongourl, { useNewUrlParser: true });

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
    if(itemName != ''){
        const item = new Item({
            name: itemName
        });
        item.save();
    }
    res.redirect("/");
});

app.post("/delete", (req, res) => {
    const checkedItemId = req.body.checkbox;
    Item.findByIdAndRemove(checkedItemId, (err)=>{
        if(!err){
        }
    });
    res.redirect("/");
});



app.listen(process.env.PORT || 3000, () => {
    console.log("Listening on port 3000");
});

// export default app;