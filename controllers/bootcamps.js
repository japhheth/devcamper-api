const BootcampModel = require("../models/Bootcamp");
const asyncHandler = require("../middleware/async");

// @desc Get all bootcamps
// @route GET /api/v1/bootcamps
// @access Public

exports.getBootcamps = asyncHandler(async (req, res, next) => {
  const bootcamps = await BootcampModel.find();
  res.status(200).json({
    status: true,
    data: bootcamps,
    count: bootcamps.length,
    message: "Fetched all bootcamps",
  });
});

// @desc Create bootcamp
// @route POST /api/v1/bootcamps
// @access Public

exports.createBootcamp = asyncHandler(async (req, res, next) => {
  const bootcamp = await BootcampModel.create(req.body);

  res.status(201).json({
    success: true,
    data: bootcamp,
    message: "Bootcamp created successfully",
  });
});

// @desc Get single bootcamps
// @route GET /api/v1/bootcamps/:id
// @access Public

exports.getBootcamp = asyncHandler(async (req, res, next) => {
  const bootcamp = await BootcampModel.findById(req.params.id);

  res.status(200).json({
    success: true,
    data: bootcamp,
    message: "Bootcamp fetched successfully",
  });
});

// @desc update bootcamp
// @route PUT /api/v1/bootcamps/:id
// @access Public

exports.updateBootcamp = asyncHandler(async (req, res, next) => {
  const updatedBootcamp = await BootcampModel.findByIdAndUpdate(
    req.params.id,
    req.body,
    {
      new: true,
      runValidators: true,
    }
  );

  res.status(200).json({
    success: true,
    data: updatedBootcamp,
    message: "Bootcamp updated successfully",
  });
});

// @desc delete bootcamp
// @route DELETE /api/v1/bootcamps/:id
// @access Public

exports.deleteBootcamp = asyncHandler(async (req, res, next) => {
  const deletedBootcamp = await BootcampModel.findByIdAndDelete(req.params.id);

  if (deletedBootcamp === null) {
    return res.status(400).json({ success: false, message: "ID not found" });
  }

  res.status(200).json({
    success: true,
    data: {},
    message: "Bootcamp successfully deleted",
  });
});
