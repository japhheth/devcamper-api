const CourseModel = require("../models/Course");
const asyncHandler = require("../middleware/async");

// @desc Get all courses
// @route GET /api/v1/courses
// @route GET /api/v1/bootcamps/:bootcampId/courses
// @access Public

exports.getCourses = asyncHandler(async (req, res, next) => {
  let query;
  const { bootcampId } = req.params;

  if (bootcampId) {
    query = CourseModel.find({ bootcamp: bootcampId });
  } else {
    query = CourseModel.find();
  }

  const courses = await query;

  res.status(200).json({
    sucess: true,
    count: courses.length,
    data: courses,
  });
});
