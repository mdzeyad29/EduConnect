const AddCart = require("../model/AddCart");

//post request for add to cart page

exports.addCart = async (req, res) => {
  try {
    const { courseID, userID } = req.body;
    const addCart = new AddCart({
      courseID,
      userID,
    });
    await addCart.save();

     // populate user & course details
    const populatedCart = await AddCart.findById(addCart._id)
      .populate("userID")     // full user object
      .populate("courseID");  // full course object

    res.status(200).json(
      { 
        success: true,
        message: "Course added to cart successfully" ,
        addCart: populatedCart

      });
  } catch (error) {
    console.error("Error adding course to cart:", error);
    res.status(500).json({ message: "Failed to add course to cart" });
  }
}

// get request for get cart page 
exports.getCart = async (req, res) => {
  try {
    const { userID } = req.query;
    console.log("USER ID RECEIVED:", userID);

    const cartItems = await AddCart.find({ userID })
      .populate("courseID")
      .populate("userID");

    res.status(200).json({
      success: true,
      cartItems,
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to retrieve cart items" });
  }
};


//delete request for delete cart item

exports.removeCartItem = async (req, res) => {
  try {
    const { cartItemID } = req.params;
    console.log("CART ITEM ID RECEIVED:", cartItemID);

    const deletedCartItem = await AddCart.findByIdAndDelete(cartItemID);

    if (!deletedCartItem) {
      return res.status(404).json({ message: "Cart item not found" });
    }

    res.status(200).json({
      success: true,
      message: "Cart item removed successfully",
    });
  }catch (error) {
    res.status(500).json({ message: "Failed to remove cart item" });
  } 
}