const BootcampModel = require("../models/Bootcamp");
const asyncHandler = require("../middleware/async");
const geocoder = require("../utils/geocoder");

// @desc Get all bootcamps
// @route GET /api/v1/bootcamps
// @access Public

exports.getBootcamps = asyncHandler(async (req, res, next) => {
  let query;

  let requestRequery = { ...req.query };

  let filteredField = ["select", "sortBy", "page", "limit"];

  filteredField.forEach((field) => delete requestRequery[field]);

  // Stringify the request query params
  let queryString = JSON.stringify(requestRequery);

  //Add the $ sign to the query if it matches mongoose query options lt|lte|gt|gte|in
  queryString = queryString.replace(
    /\b(gt|gte|lt|lte|in)\b/g,
    (match) => `$${match}`
  );

  query = BootcampModel.find(JSON.parse(queryString));

  //Select a few defined
  if (req.query.select) {
    let selectedFields = req.query.select.split(",").join(" ");
    query = query.select(selectedFields);
  }

  // Sort
  if (req.query.sortBy) {
    let orderBy = req.query.sortBy.split(",").join(" ");
    query = query.sort(orderBy);
  } else {
    query = query.sort("-createdAt");
  }

  // Pagination
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 10;
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;
  const total = await BootcampModel.countDocuments();
  const pagination = {};

  query = query.skip(startIndex).limit(limit);

  const bootcamps = await query;

  if (endIndex < total) {
    pagination.next = {
      page: page + 1,
      limit,
    };
  }

  if (startIndex > 0) {
    pagination.prev = {
      page: page - 1,
      limit,
    };
  }

  res.status(200).json({
    pagination,
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

// @desc Get bootcamp within a radius
// @route GET /api/v1/bootcamps/radius/:zipcode/:distance
// @access Public

exports.getBootcampsInRadius = asyncHandler(async (req, res, next) => {
  const { zipcode, distance } = req.params;

  const location = await geocoder.geocode(zipcode);
  const latitude = location[0].latitude;
  const longitude = location[0].longitude;

  // Calculate radius using radians
  // Radius of earth 3,963 miles / 6,378 kilometres

  const radius = distance / 3963;

  const bootcamps = await BootcampModel.find({
    location: {
      $geoWithin: { $centerSphere: [[longitude, latitude], radius] },
    },
  });

  res.status(200).json({
    status: true,
    count: bootcamps.length,
    data: bootcamps,
  });
});
