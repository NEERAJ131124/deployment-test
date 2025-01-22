const express = require("express");
const router = express.Router();
const {
  createStorageFacility,
  getAllStorageFacilities,
  getStorageFacilityById,
  updateStorageFacility,
  deleteStorageFacility,
  getStorageFacilitiesByUser,
  createStorageFacilityByToken,
  getAllStorageFacilitiesWithFilter,
} = require("../controllers/storageFacility");
const { auth } = require("../middlewares/Auth");
const upload = require("../middlewares/upload");

/**
 * @swagger
 * /storagefacility:
 *   post:
 *     summary: Create a new storage facility
 *     tags: [Storage Facility]
 *     description: Allows admin to create a new storage facility.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               User:
 *                 type: string
 *                 description: The user ID.
 *               isOwner:
 *                 type: boolean
 *                 description: Indicates if the user is the owner.
 *               Name:
 *                 type: string
 *                 description: The name of the storage facility.
 *               OpeningTime:
 *                 type: string
 *                 description: The opening time of the storage facility.
 *               ClosingTime:
 *                 type: string
 *                 description: The closing time of the storage facility.
 *               ContactDetails:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: Contact details of the storage facility.
 *               GeoLocationData:
 *                 type: object
 *                 description: Geo-location details of the storage facility.
 *                 properties:
 *                   Latitude:
 *                     type: number
 *                     description: Latitude of the storage facility.
 *                   Longitude:
 *                     type: number
 *                     description: Longitude of the storage facility.
 *                   StreetAddress:
 *                     type: string
 *                     description: Street address of the storage facility.
 *                   City:
 *                     type: string
 *                     description: City of the storage facility.
 *                   State:
 *                     type: string
 *                     description: State of the storage facility.
 *                   Country:
 *                     type: string
 *                     description: Country of the storage facility.
 *                   Pincode:
 *                     type: string
 *                     description: Pincode of the storage facility.
 *               StorageCapacities:
 *                 type: array
 *                 description: List of storage capacities for the facility.
 *                 items:
 *                   type: object
 *                   properties:
 *                     StorageTypeId:
 *                       type: string
 *                       description: The ID of the storage type.
 *                     StorageCapacity:
 *                       type: number
 *                       description: The capacity of the storage facility for the specified storage type.
 *                     CapacityUnit:
 *                       type: string
 *                       description: The unit of measurement for the storage capacity (e.g., liters, tons).
 *                     Pricing:
 *                       type: number
 *                       description: Pricing for each unit as per the storage capacity.
 *                     PricingPerUnit:
 *                       type: string
 *                       description: Per Unit for the storage capacity (e.g., liters, tons).
 *               SupportedGoods:
 *                 type: array
 *                 description: List of supported goods IDs for the facility.
 *                 items:
 *                   type: string
 *                   description: The ID of the supported goods.
 *     responses:
 *       201:
 *         description: Storage facility created successfully.
 *       400:
 *         description: Bad request, missing required fields or invalid data.
 *       500:
 *         description: Internal server error.
 */
router.post("/", createStorageFacility); // should be used only by admin

/**
 * @swagger
 * /storagefacility/add:
 *   post:
 *     summary: Create a new storage facility with capacities using a token
 *     tags: [Storage Facility]
 *     description: Allows authenticated users to create a storage facility by providing details like name, operating hours, contact details, geo-location, storage capacities, and supported goods.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               Name:
 *                 type: string
 *                 description: The name of the storage facility.
 *               OpeningTime:
 *                 type: string
 *                 description: Operating hours of the storage facility.
 *               ClosingTime:
 *                 type: string
 *                 description: Operating hours of the storage facility.
 *               ContactDetails:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: Contact details (e.g., phone numbers, emails) for the storage facility.
 *               GeoLocationData:
 *                 type: object
 *                 description: Geo-location details of the storage facility.
 *                 properties:
 *                   Latitude:
 *                     type: number
 *                     description: Latitude of the storage facility.
 *                   Longitude:
 *                     type: number
 *                     description: Longitude of the storage facility.
 *                   StreetAddress:
 *                     type: string
 *                     description: Street address of the storage facility.
 *                   City:
 *                     type: string
 *                     description: City of the storage facility.
 *                   State:
 *                     type: string
 *                     description: State of the storage facility.
 *                   Country:
 *                     type: string
 *                     description: Country of the storage facility.
 *                   Pincode:
 *                     type: string
 *                     description: Pincode of the storage facility.
 *               StorageCapacities:
 *                 type: array
 *                 description: List of storage capacities for the facility.
 *                 items:
 *                   type: object
 *                   properties:
 *                     StorageTypeId:
 *                       type: string
 *                       description: The ID of the storage type.
 *                     StorageCapacity:
 *                       type: number
 *                       description: The capacity of the storage facility for the specified storage type.
 *                     CapacityUnit:
 *                       type: string
 *                       description: The unit of measurement for the storage capacity (e.g., liters, tons).
 *               SupportedGoods:
 *                 type: array
 *                 description: List of supported goods IDs for the facility.
 *                 items:
 *                   type: string
 *                   description: The ID of the supported goods.
 *     responses:
 *       201:
 *         description: Storage facility created successfully.
 *       400:
 *         description: Bad request, missing required fields or invalid data.
 *       401:
 *         description: Unauthorized, token is missing or invalid.
 *       500:
 *         description: Internal server error.
 */
router.post(
  "/add",
  auth,
  upload.uploadstoreimages,
  createStorageFacilityByToken
); // using token

/**
 * @swagger
 * /storagefacility:
 *   get:
 *     summary: Get all storage facilities
 *     tags: [Storage Facility]
 *     description: Retrieve all storage facilities, including their capacities and supported goods.
 *     responses:
 *       200:
 *         description: Storage facilities fetched successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                         description: The storage facility ID.
 *                       Name:
 *                         type: string
 *                         description: The name of the storage facility.
 *                       OpeningTime:
 *                         type: string
 *                         description: The opening time of the storage facility.
 *                       ClosingTime:
 *                         type: string
 *                         description: The closing time of the storage facility.
 *                       ContactDetails:
 *                         type: array
 *                         items:
 *                           type: string
 *                         description: Contact details of the storage facility.
 *                       GeoLocation:
 *                         type: object
 *                         properties:
 *                           Latitude:
 *                             type: number
 *                             description: Latitude of the storage facility.
 *                           Longitude:
 *                             type: number
 *                             description: Longitude of the storage facility.
 *                           StreetAddress:
 *                             type: string
 *                             description: Street address of the storage facility.
 *                           City:
 *                             type: string
 *                             description: City of the storage facility.
 *                           State:
 *                             type: string
 *                             description: State of the storage facility.
 *                           Country:
 *                             type: string
 *                             description: Country of the storage facility.
 *                           Pincode:
 *                             type: string
 *                             description: Pincode of the storage facility.
 *                       StorageFacilityCapacities:
 *                         type: array
 *                         items:
 *                           type: object
 *                           properties:
 *                             StorageTypeId:
 *                               type: string
 *                               description: The ID of the storage type.
 *                             StorageCapacity:
 *                               type: number
 *                               description: The capacity of the storage facility for the specified storage type.
 *                             CapacityUnit:
 *                               type: string
 *                               description: The unit of measurement for the storage capacity (e.g., liters, tons).
 *                             Pricing:
 *                               type: number
 *                               description: Pricing for the storage capacity.
 *                             PricingPerUnit:
 *                               type: number
 *                               description: Pricing per unit of the storage capacity.
 *                       SupportedGoods:
 *                         type: array
 *                         items:
 *                           type: object
 *                           properties:
 *                             ColdStorageGoodsId:
 *                               type: string
 *                               description: The ID of the supported goods.
 *       404:
 *         description: No storage facilities found.
 *       500:
 *         description: Internal server error.
 */
router.get("/", getAllStorageFacilities);

/**
 * @swagger
 * /storagefacility/get:
 *   get:
 *     summary: Get storage facility details by token
 *     tags: [Storage Facility]
 *     description: Retrieve the logged-in user's storage facility details using the provided authentication token, including capacities and supported goods.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User's storage facility details fetched successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                       description: The storage facility ID.
 *                     Name:
 *                       type: string
 *                       description: The name of the storage facility.
 *                     OpeningTime:
 *                       type: string
 *                       description: The opening time of the storage facility.
 *                     ClosingTime:
 *                       type: string
 *                       description: The closing time of the storage facility.
 *                     ContactDetails:
 *                       type: array
 *                       items:
 *                         type: string
 *                       description: Contact details of the storage facility.
 *                     GeoLocation:
 *                       type: object
 *                       properties:
 *                         Latitude:
 *                           type: number
 *                           description: Latitude of the storage facility.
 *                         Longitude:
 *                           type: number
 *                           description: Longitude of the storage facility.
 *                         StreetAddress:
 *                           type: string
 *                           description: Street address of the storage facility.
 *                         City:
 *                           type: string
 *                           description: City of the storage facility.
 *                         State:
 *                           type: string
 *                           description: State of the storage facility.
 *                         Country:
 *                           type: string
 *                           description: Country of the storage facility.
 *                         Pincode:
 *                           type: string
 *                           description: Pincode of the storage facility.
 *                     StorageFacilityCapacities:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           StorageTypeId:
 *                             type: string
 *                             description: The ID of the storage type.
 *                           StorageCapacity:
 *                             type: number
 *                             description: The capacity of the storage facility for the specified storage type.
 *                           CapacityUnit:
 *                             type: string
 *                             description: The unit of measurement for the storage capacity (e.g., liters, tons).
 *                           Pricing:
 *                             type: number
 *                             description: Pricing for the storage capacity.
 *                           PricingPerUnit:
 *                             type: number
 *                             description: Pricing per unit of the storage capacity.
 *                     SupportedGoods:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           ColdStorageGoodsId:
 *                             type: string
 *                             description: The ID of the supported goods.
 *       401:
 *         description: Unauthorized, token is missing or invalid.
 *       500:
 *         description: Internal server error.
 */
router.get("/get", auth, getStorageFacilitiesByUser); // using token

router.get("/filter", getAllStorageFacilitiesWithFilter);

/**
 * @swagger
 * /storagefacility/{id}:
 *   get:
 *     summary: Get a storage facility by ID
 *     tags: [Storage Facility]
 *     description: Retrieve a specific storage facility by its ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the storage facility.
 *     responses:
 *       200:
 *         description: Storage facility fetched successfully.
 *       400:
 *         description: Storage facility ID is required.
 *       404:
 *         description: Storage facility not found.
 *       500:
 *         description: Internal server error.
 */
router.get("/:id", getStorageFacilityById);

/**
 * @swagger
 * /storagefacility/{id}:
 *   put:
 *     summary: Update a storage facility
 *     tags: [Storage Facility]
 *     description: Update the details of a specific storage facility by its ID, including capacities and supported goods.
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the storage facility.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               _id:
 *                 type: string
 *                 description: The storage facility ID.
 *               Name:
 *                 type: string
 *                 description: The name of the storage facility.
 *               OpeningTime:
 *                 type: string
 *                 description: The opening time of the storage facility.
 *               ClosingTime:
 *                 type: string
 *                 description: The closing time of the storage facility.
 *               ContactDetails:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: Contact details of the storage facility.
 *               GeoLocationData:
 *                 type: object
 *                 description: Geo-location details of the storage facility.
 *                 properties:
 *                   Latitude:
 *                     type: number
 *                     description: Latitude of the storage facility.
 *                   Longitude:
 *                     type: number
 *                     description: Longitude of the storage facility.
 *                   StreetAddress:
 *                     type: string
 *                     description: Street address of the storage facility.
 *                   City:
 *                     type: string
 *                     description: City of the storage facility.
 *                   State:
 *                     type: string
 *                     description: State of the storage facility.
 *                   Country:
 *                     type: string
 *                     description: Country of the storage facility.
 *                   Pincode:
 *                     type: string
 *                     description: Pincode of the storage facility.
 *               StorageCapacities:
 *                 type: array
 *                 description: List of storage capacities for the facility.
 *                 items:
 *                   type: object
 *                   properties:
 *                     StorageTypeId:
 *                       type: string
 *                       description: The ID of the storage type.
 *                     StorageCapacity:
 *                       type: number
 *                       description: The capacity of the storage facility for the specified storage type.
 *                     CapacityUnit:
 *                       type: string
 *                       description: The unit of measurement for the storage capacity (e.g., liters, tons).
 *               SupportedGoods:
 *                 type: array
 *                 description: List of supported goods IDs for the facility.
 *                 items:
 *                   type: string
 *                   description: The ID of the supported goods.
 *     responses:
 *       200:
 *         description: Storage facility updated successfully.
 *       400:
 *         description: Bad request, missing required fields or invalid data.
 *       404:
 *         description: Storage facility not found.
 *       500:
 *         description: Internal server error.
 */
router.put("/:id", upload.uploadstoreimages, updateStorageFacility);

/**
 * @swagger
 * /storagefacility/{id}:
 *   delete:
 *     summary: Delete a storage facility
 *     tags: [Storage Facility]
 *     description: Soft delete a specific storage facility by its ID, and also delete related capacities and supported goods.
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the storage facility.
 *     responses:
 *       200:
 *         description: Storage facility and related entries deleted successfully.
 *       404:
 *         description: Storage facility not found.
 *       500:
 *         description: Internal server error.
 */
router.delete("/:id", deleteStorageFacility);

module.exports = router;
