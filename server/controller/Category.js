const Tags = require("../model/Category");
const Category = require("../model/Category")

// create Category handler
exports.Category = async(req,res)=>{
    try{
        // fetch data
        console.log("inside the category controller ");
        const {name,description}=req.body
        // validation
        if(!name||!description){
            return res.status(400).json({
                success:false,
                message:"All field to required to fullfill"
            })
        }
        // entry in database
        const tagsDetails = Tags.create({
            name:name,
            description:description
        })
        // console.log(tagsDetails);
        return res.status(200).json({
            success:true,
            message:"Tags Created Successfully"
        })
    }catch(error){
        console.log(error);
        return res.status(400).json({
          success:false,
           message:"Error In Created Tags"   
        })
    }
}
// get all Category showAllCategory
exports.showAllCategories = async (req, res) => {
	try {
        console.log("INSIDE SHOW ALL CATEGORIES");
		const allCategorys = await Category.find({});
		res.status(200).json({
			success: true,
			data: allCategorys,
		});
	} catch (error) {
		return res.status(500).json({
			success: false,
			message: error.message,
		});
	}
};
// categoryPageDetail
exports.ShowAllPageDetail = async(req,res)=>{
try{
    //get categoryId
    const {categoryId} = req.body;
    
    if (!categoryId) {
        return res.status(400).json({
            success: false,
            message: "Category ID is required"
        });
    }

    //get category details
    const selectedCategory = await Category.findById(categoryId).exec();
    
    //validation
    if(!selectedCategory) {
        return res.status(404).json({
            success: false,
            message: 'Category Not Found',
        });
    }

    // Get courses for this category (courses have category field that references Category)
    const Course = require("../model/Course");
    const categoryCourses = await Course.find({
        category: categoryId,
        status: "Published" // Only show published courses
    })
    .populate("Instructor")
    .populate("category")
    .exec();

    //get courses for different categories
    const differentCategories = await Category.find({
        _id: {$ne: categoryId},
    }).exec();

    //get top selling courses (you can implement this later)
    //HW - write it on your own

    //return response
    return res.status(200).json({
        success: true,
        data: {
            selectedCategory: {
                ...selectedCategory.toObject(),
                courses: categoryCourses
            },
            differentCategories,
        },
    });

}catch(err){
    console.log("ShowAllPageDetail error:", err);
    return res.status(500).json({
        success: false,
        message: err.message || "Failed to fetch category page details"
    })
}
}
