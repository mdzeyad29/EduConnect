const mongoose = require("mongoose");
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
    
    console.log("ShowAllPageDetail - Received categoryId:", categoryId);
    
    if (!categoryId) {
        return res.status(400).json({
            success: false,
            message: "Category ID is required"
        });
    }

    // Convert categoryId to ObjectId if it's a string
    let categoryObjectId;
    try {
        categoryObjectId = mongoose.Types.ObjectId.isValid(categoryId) 
            ? new mongoose.Types.ObjectId(categoryId) 
            : categoryId;
    } catch (error) {
        return res.status(400).json({
            success: false,
            message: "Invalid category ID format"
        });
    }

    //get category details
    const selectedCategory = await Category.findById(categoryObjectId).exec();
    
    console.log("Selected category:", selectedCategory ? selectedCategory.name : "Not found");
    
    //validation
    if(!selectedCategory) {
        return res.status(404).json({
            success: false,
            message: 'Category Not Found',
        });
    }

    // Get courses for this category (courses have category field that references Category)
    const course = require("../model/Course");
    
    // Query courses - use ObjectId for proper matching
    const categoryCourses = await course.find({
        category: categoryObjectId,
        status: "Published" // Only show published courses
    })
    .populate("Instructor")
    .populate("category")
    .exec();
    
    console.log(`Found ${categoryCourses.length} published courses for category ${selectedCategory.name} (ID: ${categoryObjectId})`);
    
    // Debug: Check if there are any courses with this category (including drafts)
    const allCoursesWithCategory = await course.countDocuments({
        category: categoryObjectId
    });
    
    console.log(`Total courses (including drafts) with this category: ${allCoursesWithCategory}`);
    
    // Debug: Check total published courses
    const totalPublished = await course.countDocuments({ status: "Published" });
    console.log(`Total published courses in database: ${totalPublished}`);
    
    // Debug: Check courses with any category
    const coursesWithAnyCategory = await course.countDocuments({ category: { $exists: true, $ne: null } });
    console.log(`Total courses with any category assigned: ${coursesWithAnyCategory}`);

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
