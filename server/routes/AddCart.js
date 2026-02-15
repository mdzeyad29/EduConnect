// route for the add to cart page
const  express = require("express");
const router = express.Router();
const { addCart, getCart, removeCartItem } = require("../controller/addCart");
router.post("/addCart", addCart);
router.get("/getCart", getCart);
router.delete("/removeCartItem/:cartItemID", removeCartItem);
module.exports = router;    





