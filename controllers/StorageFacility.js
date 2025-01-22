const StorageFacility = require("../models/StorageFacility");
const GeoLocation = require("../models/GeoLocation");
const StorageFacilityCapacities = require("../models/StorageCapacity");
const StorageFacilityGoods = require("../models/StorageFacilityGoodsType");
const { default: mongoose } = require("mongoose");
const jwt = require("jsonwebtoken");
const { uploadAzureFileInController } = require("../utils/FileUploading");

// Create a new Storage Facility
exports.createStorageFacility = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const {
      User,
      isOwner,
      Name,
      OpeningTime,
      ClosingTime,
      ContactDetails,
      GeoLocationData,
      StorageCapacities,
      SupportedGoods,
    } = req.body;

    if (
      !User ||
      !isOwner ||
      !Name ||
      !OpeningTime ||
      !ClosingTime ||
      !ContactDetails ||
      !GeoLocationData ||
      !StorageCapacities
    ) {
      await session.abortTransaction();
      session.endSession();
      return res.status(400).json({
        success: false,
        message: "All required fields must be provided.",
      });
    }

    let geoLocationId;
    const { Latitude, Longitude } = GeoLocationData;

    if (Latitude && Longitude) {
      // Check if a GeoLocation with the same Latitude and Longitude exists
      const existingGeoLocation = await GeoLocation.findOne({
        Latitude,
        Longitude,
      }).session(session);

      if (existingGeoLocation) {
        geoLocationId = existingGeoLocation._id;
      } else {
        // Create a new GeoLocation
        const newGeoLocation = new GeoLocation({
          ...GeoLocationData,
          CreatedOn: new Date(),
          UpdatedOn: new Date(),
          IsActive: false,
          IsDeleted: false,
        });
        const savedGeoLocation = await newGeoLocation.save({ session });
        geoLocationId = savedGeoLocation._id;
      }
    } else {
      await session.abortTransaction();
      session.endSession();
      return res.status(400).json({
        success: false,
        message: "Valid Latitude and Longitude are required.",
      });
    }

    // Create the StorageFacility
    const storageFacility = new StorageFacility({
      User,
      isOwner,
      Name,
      OpeningTime,
      ClosingTime,
      ContactDetails,
      GeoLocation: geoLocationId,
      CreatedOn: new Date(),
      UpdatedOn: new Date(),
      IsActive: true,
      IsDeleted: false,
    });

    await storageFacility.save({ session });

    // Create Storage Capacities for each item in the StorageCapacities array
    for (let capacityData of StorageCapacities) {
      const { StorageTypeId, StorageCapacity, CapacityUnit } = capacityData;

      // Create and save the StorageCapacity document
      const storageCapacity = new StorageFacilityCapacities({
        StorageTypeId,
        StorageFacilityId: storageFacility._id,
        StorageCapacity,
        CapacityUnit,
        CreatedOn: new Date(),
        UpdatedOn: new Date(),
        IsActive: false,
        IsDeleted: false,
      });

      await storageCapacity.save({ session });
    }

    if (SupportedGoods) {
      // Create Storage Facility Goods for each item in the SupportedGoods array
      for (let goodsId of SupportedGoods) {
        const storageFacilityGoods = new StorageFacilityGoods({
          StorageFacilityId: storageFacility._id,
          ColdStorageGoodsId: goodsId,
          CreatedOn: new Date(),
          UpdatedOn: new Date(),
          IsActive: true,
          IsDeleted: false,
        });

        await storageFacilityGoods.save({ session });
      }
    }

    await session.commitTransaction();
    session.endSession();

    res.status(201).json({
      success: true,
      message: "The storage facility has been added successfully.",
      data: storageFacility,
    });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    res.status(500).json({
      success: false,
      message: "An error occurred while creating the storage facility.",
      error: error.message,
    });
  }
};

// Get all Storage Facilities
exports.getAllStorageFacilitiesWithFilter = async (req, res) => {
  try {
    const {
      capacityMin,
      capacityMax,
      storageType,
      supportedGoods,
      priceMin,
      priceMax,
    } = req.query;

    const filter = { IsDeleted: false };

    // Apply filters
    if (storageType) {
      const storageTypeIds = storageType.split(",");
      filter["StorageCapacities.StorageTypeId"] = { $in: storageTypeIds };
    }

    if (supportedGoods) {
      const supportedGoodsIds = supportedGoods.split(",");
      filter["SupportedGoods.ColdStorageGoodsId"] = { $in: supportedGoodsIds };
    }

    if (capacityMin || capacityMax) {
      const capacityFilter = {};
      if (capacityMin) capacityFilter.$gte = parseInt(capacityMin);
      if (capacityMax) capacityFilter.$lte = parseInt(capacityMax);
      filter["StorageCapacities.StorageCapacity"] = capacityFilter;
    }

    if (priceMin || priceMax) {
      const priceFilter = {};
      if (priceMin) priceFilter.$gte = parseInt(priceMin);
      if (priceMax) priceFilter.$lte = parseInt(priceMax);
      filter["StorageCapacities.Pricing"] = priceFilter;
    }

    const storageFacilities = await StorageFacility.find(filter)
      .populate({
        path: "GeoLocation", // Populate GeoLocationId
        populate: [
          {
            path: "State", // Populate the State field
            select: "StateName", // Specify the fields you want to retrieve
          },
          {
            path: "Country", // Populate the Country field
            select: "CountryName", // Specify the fields you want to retrieve
          },
        ],
      }) // Populate the GeoLocation details
      .populate("States") // Populate the State details
      .populate("Country"); // Populate the Country details

    // Return response if no storage facilities found
    if (!storageFacilities || storageFacilities.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No storage facilities were found.",
      });
    }

    // Convert facilities to plain objects and add capacities and supported goods
    const facilitiesWithDetails = await Promise.all(
      storageFacilities.map(async (facility) => {
        // Convert the facility to a plain object
        const facilityObject = facility.toObject();

        // Fetch the capacities for this storage facility using its _id and populate storage facility ID
        const capacities = await StorageFacilityCapacities.find({
          StorageFacilityId: facility._id,
          IsDeleted: false,
          ...(storageType && {
            StorageTypeId: { $in: storageType.split(",") },
          }),
          ...(capacityMin ||
            (capacityMax && {
              StorageCapacity: filter["StorageCapacities.StorageCapacity"],
            })),
          ...(priceMin ||
            (priceMax && { Pricing: filter["StorageCapacities.Pricing"] })),
        })
          .select(
            "StorageCapacity CapacityUnit Pricing PricingPerUnit StorageFacilityId"
          )
          .populate("StorageTypeId")
          .populate("StorageFacilityId");

        // Fetch the supported goods for this storage facility using its _id
        const supportedGoodsData = await StorageFacilityGoods.find({
          StorageFacilityId: facility._id,
          IsDeleted: false,
          ...(supportedGoods && {
            ColdStorageGoodsId: { $in: supportedGoods.split(",") },
          }),
        })
          .select("ColdStorageGoodsId")
          .populate("ColdStorageGoodsId");

        // Add the capacities and supported goods to the plain object
        facilityObject.StorageFacilityCapacities = capacities;
        facilityObject.SupportedGoods = supportedGoodsData;

        return facilityObject;
      })
    );

    res.status(200).json({
      success: true,
      data: facilitiesWithDetails,
      message: "Storage facilities have been fetched successfully.",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "An error occurred while fetching the storage facilities.",
      error: error.message,
    });
  }
};

// Get Storage Facility by ID
exports.getStorageFacilityById = async (req, res) => {
  try {
    if (!req.params.id) {
      return res.status(400).json({
        success: false,
        message: "The Storage Facility ID is required.",
      });
    }

    // Find the storage facility by ID and populate related fields
    const facilityobj = await StorageFacility.findById(req.params.id).populate({
      path: "GeoLocation",
      populate: [
        {
          path: "State",
          select: "StateName",
        },
        {
          path: "Country",
          select: "CountryName",
        },
      ],
    });

    if (!facilityobj) {
      return res.status(404).json({
        success: false,
        message: "The specified storage facility was not found.",
      });
    }

    if (facilityobj.IsDeleted) {
      return res.status(404).json({
        success: false,
        message: "The specified storage facility is not available.",
      });
    }

    // Find storage capacities associated with the facility and populate storage type
    const capacities = await StorageFacilityCapacities.find({
      StorageFacilityId: req.params.id,
      IsDeleted: false,
    }).populate("StorageTypeId");

    // Find supported goods associated with the facility and populate goods details
    const supportedGoods = await StorageFacilityGoods.find({
      StorageFacilityId: req.params.id,
      IsDeleted: false,
    })
      .select("ColdStorageGoods")
      .populate("ColdStorageGoodsId");

    // Convert the facility to a plain object
    const facility = facilityobj.toObject();

    // Add the capacities and supported goods to the plain object
    facility.StorageFacilityCapacities = capacities;
    facility.SupportedGoods = supportedGoods;

    res.status(200).json({
      success: true,
      data: { facility },
      message: "The storage facility has been fetched successfully.",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "An error occurred while fetching the storage facility.",
      error: error.message,
    });
  }
};

exports.updateStorageFacility = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    // Parse incoming request body
    const parsedData = {
      ...req.body,
      GeoLocationData: req.body.GeoLocationData
        ? JSON.parse(req.body.GeoLocationData)
        : null,
      StorageCapacities: req.body.StorageCapacities
        ? JSON.parse(req.body.StorageCapacities)
        : [],
      SupportedGoods: req.body.SupportedGoods
        ? JSON.parse(req.body.SupportedGoods)
        : [],
    };

    const {
      _id,
      Name,
      Description,
      OpeningTime,
      ClosingTime,
      ContactDetails,
      GeoLocationData,
      StorageCapacities,
      SupportedGoods,
    } = parsedData;
    if (!_id) _id = req.params.id;
    // Validation Checks
    if (!_id) {
      return res.status(400).json({
        success: false,
        message: "Storage facility ID (_id) is required.",
      });
    }

    if (
      !Name ||
      !GeoLocationData ||
      !GeoLocationData.Latitude ||
      !GeoLocationData.Longitude
    ) {
      return res.status(400).json({
        success: false,
        message: "Name, Latitude, and Longitude are required.",
      });
    }

    if (!Array.isArray(StorageCapacities) || StorageCapacities.length === 0) {
      return res.status(400).json({
        success: false,
        message: "At least one storage capacity must be provided.",
      });
    }

    if (!Array.isArray(SupportedGoods)) {
      return res.status(400).json({
        success: false,
        message: "SupportedGoods should be an array.",
      });
    }
    console.log("updating facility");
    // Fetch existing facility
    const existingFacility = await StorageFacility.findById(_id).session(
      session
    );
    if (!existingFacility) {
      await session.abortTransaction();
      session.endSession();
      return res.status(404).json({
        success: false,
        message: "The specified storage facility was not found.",
      });
    }

    // Handle Thumbnail Upload
    let Thumbnail = existingFacility.Thumbnail;
    if (req.files && req.files.Thumbnail && req.files.Thumbnail[0]) {
      const thumbnailFile = req.files.Thumbnail[0];
      Thumbnail = await uploadAzureFileInController(thumbnailFile, "Thumbnail");
    }

    // Handle Image Uploads
    const Images = [];
    if (req.files) {
      for (let i = 1; i < 10; i++) {
        const imageFile = req.files[`Images${i}`]?.[0];
        if (imageFile) {
          const imageUrl = await uploadAzureFileInController(
            imageFile,
            "images"
          );
          Images.push(imageUrl);
        }
      }
    }
    let geoLocationId;
    // Update GeoLocation
    if (GeoLocationData) {
      const {
        Latitude,
        Longitude,
        StreetAddress,
        District,
        City,
        Pincode,
        Country,
        State,
      } = GeoLocationData;
      console.log("geolocations data:-------", GeoLocationData);

      geoLocationId = await GeoLocation.findByIdAndUpdate(
        existingFacility.GeoLocation,
        {
          Latitude: Latitude || existingFacility.GeoLocation.Latitude,
          Longitude: Longitude || existingFacility.GeoLocation.Longitude,
          StreetAddress,
          District,
          City,
          Pincode,
          Country: Country?._id || existingFacility.GeoLocation.Country,
          State: State || existingFacility.GeoLocation.State,
          UpdatedOn: new Date(),
        },
        { new: true, session }
      );
    }
    // Update Storage Facility
    const updatedFacility = await StorageFacility.findByIdAndUpdate(
      _id,
      {
        Name,
        Description,
        OpeningTime,
        ClosingTime,
        ContactDetails: Array.isArray(ContactDetails)
          ? ContactDetails
          : ContactDetails.split(","),
        GeoLocation: geoLocationId,
        Thumbnail,
        Images: Images.length > 0 ? Images : existingFacility.Images,
        UpdatedOn: new Date(),
        Images,
      },
      { new: true, session }
    );

    // Update Storage Capacities
    await StorageFacilityCapacities.deleteMany({
      StorageFacilityId: _id,
    }).session(session);

    for (const capacityData of StorageCapacities) {
      const {
        StorageTypeId,
        StorageCapacity,
        CapacityUnit,
        Pricing,
        PricingPerUnit,
      } = capacityData;
      if (!StorageTypeId || !StorageCapacity || !CapacityUnit) {
        await session.abortTransaction();
        session.endSession();
        return res.status(400).json({
          success: false,
          message:
            "StorageTypeId, StorageCapacity, and CapacityUnit are required for each capacity.",
        });
      }

      const storageCapacity = new StorageFacilityCapacities({
        StorageTypeId,
        StorageFacilityId: _id,
        StorageCapacity,
        CapacityUnit,
        Pricing,
        PricingPerUnit,
        CreatedOn: new Date(),
        UpdatedOn: new Date(),
        IsActive: false,
        IsDeleted: false,
      });

      await storageCapacity.save({ session });
    }

    // Update SupportedGoods
    await StorageFacilityGoods.deleteMany({ StorageFacilityId: _id }).session(
      session
    );

    for (const goodsId of SupportedGoods) {
      if (!goodsId) {
        await session.abortTransaction();
        session.endSession();
        return res.status(400).json({
          success: false,
          message: "Each SupportedGoods item must be a valid ID.",
        });
      }

      const storageFacilityGoods = new StorageFacilityGoods({
        StorageFacilityId: _id,
        ColdStorageGoodsId: goodsId,
        CreatedOn: new Date(),
        UpdatedOn: new Date(),
        IsActive: true,
        IsDeleted: false,
      });

      await storageFacilityGoods.save({ session });
    }
    // await session.abortTransaction();
    await session.commitTransaction();
    session.endSession();

    res.status(200).json({
      success: true,
      message: "The storage facility has been updated successfully.",
      data: updatedFacility,
    });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();

    console.error("Error updating storage facility:", error.message);
    res.status(500).json({
      success: false,
      message:
        "An internal server error occurred while updating the storage facility.",
      error: error.message,
    });
  }
};

// Delete Storage Facility (soft delete)
exports.deleteStorageFacility = async (req, res) => {
  try {
    const { id } = req.params;

    const facility = await StorageFacility.findById(id);
    if (!facility || facility.IsDeleted) {
      return res.status(404).json({
        success: false,
        message: "The specified storage facility was not found.",
      });
    }

    // Soft delete the storage facility
    facility.IsDeleted = true;
    facility.UpdatedOn = new Date();
    await facility.save();

    // Soft delete related Storage Facility Capacities
    await StorageFacilityCapacities.updateMany(
      { StorageFacilityId: id, IsDeleted: false },
      { $set: { IsDeleted: true, UpdatedOn: new Date() } }
    );

    // Soft delete related Storage Facility Goods
    await StorageFacilityGoods.updateMany(
      { StorageFacilityId: id, IsDeleted: false },
      { $set: { IsDeleted: true, UpdatedOn: new Date() } }
    );

    res.status(200).json({
      success: true,
      message: "The storage facility has been deleted successfully.",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error deleting storage facility.",
      error: error.message,
    });
  }
};

exports.getStorageFacilitiesByUser = async (req, res) => {
  const { user } = req.body; // userId from req.body.user

  if (!user) {
    return res.status(400).json({
      success: false,
      message: "The User ID is required.",
    });
  }

  try {
    // Fetch the storage facilities for the given user and ensure they are not deleted
    const storageFacilities = await StorageFacility.find({
      User: user,
      IsDeleted: false,
    })
      .populate({
        path: "GeoLocation", // Populate GeoLocationId
        populate: [
          {
            path: "State", // Populate the State field
            select: "StateName", // Specify the fields you want to retrieve
          },
          {
            path: "Country", // Populate the Country field
            select: "CountryName", // Specify the fields you want to retrieve
          },
        ],
      })
      .populate("States") // Populate the State details
      .populate("Country"); // Populate the Country details

    // Return response if no storage facilities found
    if (!storageFacilities || storageFacilities.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No storage facilities were found.",
      });
    }

    // Convert facilities to plain objects and add capacities and supported goods
    const facilitiesWithDetails = await Promise.all(
      storageFacilities.map(async (facility) => {
        // Convert the facility to a plain object
        const facilityObject = facility.toObject();

        // Fetch the capacities for this storage facility using its _id
        const capacities = await StorageFacilityCapacities.find({
          StorageFacilityId: facility._id,
          IsDeleted: false,
        })
          .select("StorageCapacity CapacityUnit Pricing PricingPerUnit") // Select only the required fields
          .populate("StorageTypeId"); // Populate the StorageTypeId field

        // Fetch the supported goods for this storage facility using its _id
        const supportedGoods = await StorageFacilityGoods.find({
          StorageFacilityId: facility._id,
          IsDeleted: false,
        })
          .select("ColdStorageGoodsId") // Select only the required fields
          .populate("ColdStorageGoodsId"); // Populate the ColdStorageGoodsId field

        // Add the capacities and supported goods to the plain object
        facilityObject.StorageFacilityCapacities = capacities;
        facilityObject.SupportedGoods = supportedGoods;

        return facilityObject;
      })
    );

    // Return the storage facilities data with their capacities and supported goods
    res.status(200).json({ success: true, data: facilitiesWithDetails });
  } catch (error) {
    console.error("Error fetching storage facilities:", error.message);
    res.status(500).json({
      success: false,
      message: "An internal server error occurred.",
      error: error.message,
    });
  }
};

exports.createStorageFacilityByToken = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    // Parse Token
    const token =
      req.headers.authorization && req.headers.authorization.split(" ")[1];
    if (!token) {
      return res.status(401).json({ msg: "Authorization token is required." });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded) {
      return res.status(401).json({ msg: "Token is invalid or expired." });
    }

    const user = decoded.userId;

    // Parse incoming request body
    const parsedData = {
      ...req.body,
      GeoLocationData: req.body.GeoLocationData
        ? JSON.parse(req.body.GeoLocationData)
        : null,
      StorageCapacities: req.body.StorageCapacities
        ? JSON.parse(req.body.StorageCapacities)
        : [],
      SupportedGoods: req.body.SupportedGoods
        ? JSON.parse(req.body.SupportedGoods)
        : [],
    };

    const {
      Name,
      Description,
      OpeningTime,
      ClosingTime,
      ContactDetails,
      GeoLocationData,
      StorageCapacities,
      SupportedGoods,
    } = parsedData;
    // Validation Checks
    if (
      !Name ||
      !GeoLocationData ||
      !GeoLocationData.Latitude ||
      !GeoLocationData.Longitude
    ) {
      return res.status(400).json({
        success: false,
        message: "Name, Latitude, and Longitude are required.",
      });
    }

    if (!Array.isArray(StorageCapacities) || StorageCapacities.length === 0) {
      return res.status(400).json({
        success: false,
        message: "At least one storage capacity must be provided.",
      });
    }

    if (!Array.isArray(SupportedGoods)) {
      return res.status(400).json({
        success: false,
        message: "SupportedGoods should be an array.",
      });
    }

    // Check if storage facility with the same name already exists
    const existingFacility = await StorageFacility.findOne({ Name }).session(
      session
    );
    if (existingFacility) {
      return res.status(400).json({
        success: false,
        message: "A storage facility with the same name already exists.",
      });
    }

    // Handle Thumbnail Upload
    let Thumbnail =
      "https://coldstorageblobs.blob.core.windows.net/cold-storage-blob/BMCLogoLight.webp";
    if (req.files && req.files.Thumbnail && req.files.Thumbnail[0]) {
      const thumbnailFile = req.files.Thumbnail[0];
      Thumbnail = await uploadAzureFileInController(thumbnailFile, "Thumbnail");
    }
    // Handle Image Uploads
    const Images = [];
    if (req.files) {
      for (let i = 1; i < 10; i++) {
        const imageFile = req.files[`Images${i}`]?.[0];
        if (imageFile) {
          const imageUrl = await uploadAzureFileInController(
            imageFile,
            "images"
          );
          Images.push(imageUrl);
        }
      }
    }
    // Handle GeoLocation
    let geoLocationId;

    const newGeoLocation = new GeoLocation({
      ...GeoLocationData,
      CreatedOn: new Date(),
      UpdatedOn: new Date(),
      IsActive: false,
      IsDeleted: false,
    });

    const savedGeoLocation = await newGeoLocation.save({ session });
    geoLocationId = savedGeoLocation._id;

    // Create the StorageFacility
    const newStorageFacility = new StorageFacility({
      User: user,
      Name,
      Description,
      OpeningTime,
      ClosingTime,
      ContactDetails: Array.isArray(ContactDetails)
        ? ContactDetails
        : ContactDetails.split(","),
      GeoLocation: geoLocationId,
      Thumbnail,
      Images,
      CreatedOn: new Date(),
      UpdatedOn: new Date(),
      IsActive: false,
      IsDeleted: false,
    });

    await newStorageFacility.save({ session });

    // Create Storage Capacities
    for (const capacityData of StorageCapacities) {
      const {
        StorageTypeId,
        StorageCapacity,
        CapacityUnit,
        Pricing,
        PricingPerUnit,
      } = capacityData;

      if (!StorageTypeId || !StorageCapacity || !CapacityUnit) {
        await session.abortTransaction();
        session.endSession();
        return res.status(400).json({
          success: false,
          message:
            "StorageTypeId, StorageCapacity, and CapacityUnit are required for each capacity.",
        });
      }

      const storageCapacity = new StorageFacilityCapacities({
        StorageTypeId,
        StorageFacilityId: newStorageFacility._id,
        StorageCapacity,
        CapacityUnit,
        Pricing,
        PricingPerUnit,
        CreatedOn: new Date(),
        UpdatedOn: new Date(),
        IsActive: false,
        IsDeleted: false,
      });

      await storageCapacity.save({ session });
    }

    // Create SupportedGoods
    for (const goodsId of SupportedGoods) {
      if (!goodsId) {
        await session.abortTransaction();
        session.endSession();
        return res.status(400).json({
          success: false,
          message: "Each SupportedGoods item must be a valid ID.",
        });
      }

      const storageFacilityGoods = new StorageFacilityGoods({
        StorageFacilityId: newStorageFacility._id,
        ColdStorageGoodsId: goodsId,
        CreatedOn: new Date(),
        UpdatedOn: new Date(),
        IsActive: true,
        IsDeleted: false,
      });

      await storageFacilityGoods.save({ session });
    }

    // await session.abortTransaction();
    await session.commitTransaction();
    session.endSession();

    res.status(201).json({
      success: true,
      message: "The storage facility has been added successfully.",
      data: newStorageFacility,
    });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    // delete all the images from azure storage
    for (const imageUrl of Images) {
      await deleteAzureFile(imageUrl);
    }
    console.error("Error creating storage facility:", error.message);
    res.status(500).json({
      success: false,
      message:
        "An internal server error occurred while creating the storage facility.",
      error: error.message,
    });
  }
};

exports.getAllStorageFacilities = async (req, res) => {
  try {
    const storageFacilities = await StorageFacility.find({
      IsDeleted: false,
    })
      .populate({
        path: "GeoLocation", // Populate GeoLocationId
        populate: [
          {
            path: "State", // Populate the State field
            select: "StateName", // Specify the fields you want to retrieve
          },
          {
            path: "Country", // Populate the Country field
            select: "CountryName", // Specify the fields you want to retrieve
          },
        ],
      }) // Populate the GeoLocation details
      .populate("States") // Populate the State details
      .populate("Country"); // Populate the Country details

    // Return response if no storage facilities found
    if (!storageFacilities || storageFacilities.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No storage facilities were found.",
      });
    }

    // Convert facilities to plain objects and add capacities and supported goods
    const facilitiesWithDetails = await Promise.all(
      storageFacilities.map(async (facility) => {
        // Convert the facility to a plain object
        const facilityObject = facility.toObject();

        // Fetch the capacities for this storage facility using its _id
        const capacities = await StorageFacilityCapacities.find({
          StorageFacilityId: facility._id,
          IsDeleted: false,
        })
          .select("StorageCapacity CapacityUnit Pricing PricingPerUnit") // Select only the required fields
          .populate("StorageTypeId"); // Populate the StorageTypeId field

        // Fetch the supported goods for this storage facility using its _id
        const supportedGoods = await StorageFacilityGoods.find({
          StorageFacilityId: facility._id,
          IsDeleted: false,
        })
          .select("ColdStorageGoodsId") // Select only the required fields
          .populate("ColdStorageGoodsId"); // Populate the ColdStorageGoodsId field

        // Add the capacities and supported goods to the plain object
        facilityObject.StorageFacilityCapacities = capacities;
        facilityObject.SupportedGoods = supportedGoods;

        return facilityObject;
      })
    );

    res.status(200).json({
      success: true,
      data: facilitiesWithDetails,
      message: "The storage facilities have been fetched successfully.",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "An error occurred while fetching the storage facilities.",
      error: error.message,
    });
  }
};
