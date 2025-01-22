const express = require("express");
const cors = require("cors");
const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");
const bodyparser = require("body-parser");
require("dotenv").config();
require("./dbConfig/db")();

const app = express();
app.use(bodyparser.urlencoded({ extended: true }));
app.use(bodyparser.json());
app.use(express.static("public"));
app.use(cors());
// const allowedOrigins = [
//   "https://bookmycoldstore.com",
//   "https://www.bookmycoldstore.com",
//   "http://localhost:3000",
//   "http://localhost:3001",
// ];
// app.use(
//   cors({
//     origin: (origin, callback) => {
//       if (!origin || allowedOrigins.includes(origin)) {
//         callback(null, true);
//       } else {
//         callback(new Error("Not allowed by CORS"));
//       }
//     },
//     credentials: true,
//   })
// );
// Custom Origin Middleware
// app.use((req, res, next) => {
//   const origin = req.headers.origin;

//   // If the Origin is undefined, block the request (e.g., Thunder Client/Postman)
//   if (!origin) {
//     return res
//       .status(403)
//       .json({ message: "Access denied. Missing Origin header." });
//   }

//   // Check if the origin is in the allowed list
//   if (!allowedOrigins.includes(origin)) {
//     return res
//       .status(403)
//       .json({ message: "Access denied. Unauthorized origin." });
//   }

//   next();
// });
// Swagger Options
const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "API Documentation",
      version: "1.0.0",
      description: "API documentation for the Express application",
    },
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
    servers: [
      {
        url: "http://localhost:8888", // Base URL
      },
    ],
  },
  apis: ["./routes/*.js"], // Path to API route files
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use("/uploads", express.static("uploads"));

// Routes
app.use("/user", require("./routes/User"));
app.use("/roles", require("./routes/Roles"));
app.use("/states", require("./routes/States"));
app.use("/coupon", require("./routes/Coupon"));
app.use("/login", require("./routes/UserLogs"));
app.use("/contact", require("./routes/Contact"));
app.use("/regions", require("./routes/Regions"));
app.use("/country", require("./routes/Country"));
app.use("/location", require("./routes/Cordinates"));
app.use("/paynenttype", require("./routes/Payment"));
app.use("/payment", require("./routes/FacilityStoragePayment.js"));
// app.use("/validate", require("./middlewares/Validate"));
app.use("/storagetype", require("./routes/StorageType"));
app.use("/goodstypes", require("./routes/GoodsType"));
app.use("/storagefacility", require("./routes/StorageFacility"));
app.use("/storagecapacity", require("./routes/StorageCapacity"));
app.use("/storagetransactions", require("./routes/StorageTransactions"));
// app.get("/GetAzureMapsToken", (req, res) => {
//   GetAzureMapsToken(req, res);
// });

// Start server
const PORT = process.env.PORT || 8888;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
