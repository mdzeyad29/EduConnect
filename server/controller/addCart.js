const AddCart = require("../model/AddCart");

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


