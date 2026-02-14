// route for the add to cart page
const  express = require("express");
const router = express.Router();
const { addCart } = require("../controller/addCart");
router.post("/addCart", addCart);
module.exports = router;    





