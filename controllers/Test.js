const Country = require("../models/Country"); // Adjust the path as necessary
const ColdStorageGoods = require("../models/GoodsType");
const Payment = require("../models/Payment");
const Roles = require("../models/Roles");
const State = require("../models/States"); // Adjust the path as necessary
const StorageType = require("../models/StorageType");

const countries = [
  {
    CountryName: "Afghanistan",
    ISOCode: "AF",
  },
  {
    CountryName: "Albania",
    ISOCode: "AL",
  },
  {
    CountryName: "Algeria",
    ISOCode: "DZ",
  },
  {
    CountryName: "Andorra",
    ISOCode: "AD",
  },
  {
    CountryName: "Angola",
    ISOCode: "AO",
  },
  {
    CountryName: "Antigua and Barbuda",
    ISOCode: "AG",
  },
  {
    CountryName: "Argentina",
    ISOCode: "AR",
  },
  {
    CountryName: "Armenia",
    ISOCode: "AM",
  },
  {
    CountryName: "Australia",
    ISOCode: "AU",
  },
  {
    CountryName: "Austria",
    ISOCode: "AT",
  },
  {
    CountryName: "Azerbaijan",
    ISOCode: "AZ",
  },
  {
    CountryName: "Bahamas",
    ISOCode: "BS",
  },
  {
    CountryName: "Bahrain",
    ISOCode: "BH",
  },
  {
    CountryName: "Bangladesh",
    ISOCode: "BD",
  },
  {
    CountryName: "Barbados",
    ISOCode: "BB",
  },
  {
    CountryName: "Belarus",
    ISOCode: "BY",
  },
  {
    CountryName: "Belgium",
    ISOCode: "BE",
  },
  {
    CountryName: "Belize",
    ISOCode: "BZ",
  },
  {
    CountryName: "Benin",
    ISOCode: "BJ",
  },
  {
    CountryName: "Bhutan",
    ISOCode: "BT",
  },
  {
    CountryName: "Bolivia",
    ISOCode: "BO",
  },
  {
    CountryName: "Bosnia and Herzegovina",
    ISOCode: "BA",
  },
  {
    CountryName: "Botswana",
    ISOCode: "BW",
  },
  {
    CountryName: "Brazil",
    ISOCode: "BR",
  },
  {
    CountryName: "Brunei",
    ISOCode: "BN",
  },
  {
    CountryName: "Bulgaria",
    ISOCode: "BG",
  },
  {
    CountryName: "Burkina Faso",
    ISOCode: "BF",
  },
  {
    CountryName: "Burundi",
    ISOCode: "BI",
  },
  {
    CountryName: "Cabo Verde",
    ISOCode: "CV",
  },
  {
    CountryName: "Cambodia",
    ISOCode: "KH",
  },
  {
    CountryName: "Cameroon",
    ISOCode: "CM",
  },
  {
    CountryName: "Canada",
    ISOCode: "CA",
  },
  {
    CountryName: "Central African Republic",
    ISOCode: "CF",
  },
  {
    CountryName: "Chad",
    ISOCode: "TD",
  },
  {
    CountryName: "Chile",
    ISOCode: "CL",
  },
  {
    CountryName: "China",
    ISOCode: "CN",
  },
  {
    CountryName: "Colombia",
    ISOCode: "CO",
  },
  {
    CountryName: "Comoros",
    ISOCode: "KM",
  },
  {
    CountryName: "Congo (Congo-Brazzaville)",
    ISOCode: "CG",
  },
  {
    CountryName: "Costa Rica",
    ISOCode: "CR",
  },
  {
    CountryName: "Croatia",
    ISOCode: "HR",
  },
  {
    CountryName: "Cuba",
    ISOCode: "CU",
  },
  {
    CountryName: "Cyprus",
    ISOCode: "CY",
  },
  {
    CountryName: "Czechia (Czech Republic)",
    ISOCode: "CZ",
  },
  {
    CountryName: "Denmark",
    ISOCode: "DK",
  },
  {
    CountryName: "Djibouti",
    ISOCode: "DJ",
  },
  {
    CountryName: "Dominica",
    ISOCode: "DM",
  },
  {
    CountryName: "Dominican Republic",
    ISOCode: "DO",
  },
  {
    CountryName: "Ecuador",
    ISOCode: "EC",
  },
  {
    CountryName: "Egypt",
    ISOCode: "EG",
  },
  {
    CountryName: "El Salvador",
    ISOCode: "SV",
  },
  {
    CountryName: "Equatorial Guinea",
    ISOCode: "GQ",
  },
  {
    CountryName: "Eritrea",
    ISOCode: "ER",
  },
  {
    CountryName: "Estonia",
    ISOCode: "EE",
  },
  {
    CountryName: "Eswatini (fmr. Swaziland)",
    ISOCode: "SZ",
  },
  {
    CountryName: "Ethiopia",
    ISOCode: "ET",
  },
  {
    CountryName: "Fiji",
    ISOCode: "FJ",
  },
  {
    CountryName: "Finland",
    ISOCode: "FI",
  },
  {
    CountryName: "France",
    ISOCode: "FR",
  },
  {
    CountryName: "Gabon",
    ISOCode: "GA",
  },
  {
    CountryName: "Gambia",
    ISOCode: "GM",
  },
  {
    CountryName: "Georgia",
    ISOCode: "GE",
  },
  {
    CountryName: "Germany",
    ISOCode: "DE",
  },
  {
    CountryName: "Ghana",
    ISOCode: "GH",
  },
  {
    CountryName: "Greece",
    ISOCode: "GR",
  },
  {
    CountryName: "Grenada",
    ISOCode: "GD",
  },
  {
    CountryName: "Guatemala",
    ISOCode: "GT",
  },
  {
    CountryName: "Guinea",
    ISOCode: "GN",
  },
  {
    CountryName: "Guinea-Bissau",
    ISOCode: "GW",
  },
  {
    CountryName: "Guyana",
    ISOCode: "GY",
  },
  {
    CountryName: "Haiti",
    ISOCode: "HT",
  },
  {
    CountryName: "Holy See",
    ISOCode: "VA",
  },
  {
    CountryName: "Honduras",
    ISOCode: "HN",
  },
  {
    CountryName: "Hungary",
    ISOCode: "HU",
  },
  {
    CountryName: "Iceland",
    ISOCode: "IS",
  },
  {
    CountryName: "India",
    ISOCode: "IN",
  },
  {
    CountryName: "Indonesia",
    ISOCode: "ID",
  },
  {
    CountryName: "Iran",
    ISOCode: "IR",
  },
  {
    CountryName: "Iraq",
    ISOCode: "IQ",
  },
  {
    CountryName: "Ireland",
    ISOCode: "IE",
  },
  {
    CountryName: "Israel",
    ISOCode: "IL",
  },
  {
    CountryName: "Italy",
    ISOCode: "IT",
  },
  {
    CountryName: "Jamaica",
    ISOCode: "JM",
  },
  {
    CountryName: "Japan",
    ISOCode: "JP",
  },
  {
    CountryName: "Jordan",
    ISOCode: "JO",
  },
  {
    CountryName: "Kazakhstan",
    ISOCode: "KZ",
  },
  {
    CountryName: "Kenya",
    ISOCode: "KE",
  },
  {
    CountryName: "Kiribati",
    ISOCode: "KI",
  },
  {
    CountryName: "Korea (North)",
    ISOCode: "KP",
  },
  {
    CountryName: "Korea (South)",
    ISOCode: "KR",
  },
  {
    CountryName: "Kuwait",
    ISOCode: "KW",
  },
  {
    CountryName: "Kyrgyzstan",
    ISOCode: "KG",
  },
  {
    CountryName: "Laos",
    ISOCode: "LA",
  },
  {
    CountryName: "Latvia",
    ISOCode: "LV",
  },
  {
    CountryName: "Lebanon",
    ISOCode: "LB",
  },
  {
    CountryName: "Lesotho",
    ISOCode: "LS",
  },
  {
    CountryName: "Liberia",
    ISOCode: "LR",
  },
  {
    CountryName: "Libya",
    ISOCode: "LY",
  },
  {
    CountryName: "Liechtenstein",
    ISOCode: "LI",
  },
  {
    CountryName: "Lithuania",
    ISOCode: "LT",
  },
  {
    CountryName: "Luxembourg",
    ISOCode: "LU",
  },
  {
    CountryName: "Madagascar",
    ISOCode: "MG",
  },
  {
    CountryName: "Malawi",
    ISOCode: "MW",
  },
  {
    CountryName: "Malaysia",
    ISOCode: "MY",
  },
  {
    CountryName: "Maldives",
    ISOCode: "MV",
  },
  {
    CountryName: "Mali",
    ISOCode: "ML",
  },
  {
    CountryName: "Malta",
    ISOCode: "MT",
  },
  {
    CountryName: "Marshall Islands",
    ISOCode: "MH",
  },
  {
    CountryName: "Mauritania",
    ISOCode: "MR",
  },
  {
    CountryName: "Mauritius",
    ISOCode: "MU",
  },
  {
    CountryName: "Mexico",
    ISOCode: "MX",
  },
  {
    CountryName: "Micronesia",
    ISOCode: "FM",
  },
  {
    CountryName: "Moldova",
    ISOCode: "MD",
  },
  {
    CountryName: "Monaco",
    ISOCode: "MC",
  },
  {
    CountryName: "Mongolia",
    ISOCode: "MN",
  },
  {
    CountryName: "Montenegro",
    ISOCode: "ME",
  },
  {
    CountryName: "Morocco",
    ISOCode: "MA",
  },
  {
    CountryName: "Mozambique",
    ISOCode: "MZ",
  },
  {
    CountryName: "Myanmar (formerly Burma)",
    ISOCode: "MM",
  },
  {
    CountryName: "Namibia",
    ISOCode: "NA",
  },
  {
    CountryName: "Nauru",
    ISOCode: "NR",
  },
  {
    CountryName: "Nepal",
    ISOCode: "NP",
  },
  {
    CountryName: "Netherlands",
    ISOCode: "NL",
  },
  {
    CountryName: "New Zealand",
    ISOCode: "NZ",
  },
  {
    CountryName: "Nicaragua",
    ISOCode: "NI",
  },
  {
    CountryName: "Niger",
    ISOCode: "NE",
  },
  {
    CountryName: "Nigeria",
    ISOCode: "NG",
  },
  {
    CountryName: "North Macedonia",
    ISOCode: "MK",
  },
  {
    CountryName: "Norway",
    ISOCode: "NO",
  },
  {
    CountryName: "Oman",
    ISOCode: "OM",
  },
  {
    CountryName: "Pakistan",
    ISOCode: "PK",
  },
  {
    CountryName: "Palau",
    ISOCode: "PW",
  },
  {
    CountryName: "Palestine State",
    ISOCode: "PS",
  },
  {
    CountryName: "Panama",
    ISOCode: "PA",
  },
  {
    CountryName: "Papua New Guinea",
    ISOCode: "PG",
  },
  {
    CountryName: "Paraguay",
    ISOCode: "PY",
  },
  {
    CountryName: "Peru",
    ISOCode: "PE",
  },
  {
    CountryName: "Philippines",
    ISOCode: "PH",
  },
  {
    CountryName: "Poland",
    ISOCode: "PL",
  },
  {
    CountryName: "Portugal",
    ISOCode: "PT",
  },
  {
    CountryName: "Qatar",
    ISOCode: "QA",
  },
  {
    CountryName: "Romania",
    ISOCode: "RO",
  },
  {
    CountryName: "Russia",
    ISOCode: "RU",
  },
  {
    CountryName: "Rwanda",
    ISOCode: "RW",
  },
  {
    CountryName: "Saint Kitts and Nevis",
    ISOCode: "KN",
  },
  {
    CountryName: "Saint Lucia",
    ISOCode: "LC",
  },
  {
    CountryName: "Saint Vincent and the Grenadines",
    ISOCode: "VC",
  },
  {
    CountryName: "Samoa",
    ISOCode: "WS",
  },
  {
    CountryName: "San Marino",
    ISOCode: "SM",
  },
  {
    CountryName: "Sao Tome and Principe",
    ISOCode: "ST",
  },
  {
    CountryName: "Saudi Arabia",
    ISOCode: "SA",
  },
  {
    CountryName: "Senegal",
    ISOCode: "SN",
  },
  {
    CountryName: "Serbia",
    ISOCode: "RS",
  },
  {
    CountryName: "Seychelles",
    ISOCode: "SC",
  },
  {
    CountryName: "Sierra Leone",
    ISOCode: "SL",
  },
  {
    CountryName: "Singapore",
    ISOCode: "SG",
  },
  {
    CountryName: "Slovakia",
    ISOCode: "SK",
  },
  {
    CountryName: "Slovenia",
    ISOCode: "SI",
  },
  {
    CountryName: "Solomon Islands",
    ISOCode: "SB",
  },
  {
    CountryName: "Somalia",
    ISOCode: "SO",
  },
  {
    CountryName: "South Africa",
    ISOCode: "ZA",
  },
  {
    CountryName: "South Sudan",
    ISOCode: "SS",
  },
  {
    CountryName: "Spain",
    ISOCode: "ES",
  },
  {
    CountryName: "Sri Lanka",
    ISOCode: "LK",
  },
  {
    CountryName: "Sudan",
    ISOCode: "SD",
  },
  {
    CountryName: "Suriname",
    ISOCode: "SR",
  },
  {
    CountryName: "Sweden",
    ISOCode: "SE",
  },
  {
    CountryName: "Switzerland",
    ISOCode: "CH",
  },
  {
    CountryName: "Syria",
    ISOCode: "SY",
  },
  {
    CountryName: "Tajikistan",
    ISOCode: "TJ",
  },
  {
    CountryName: "Tanzania",
    ISOCode: "TZ",
  },
  {
    CountryName: "Thailand",
    ISOCode: "TH",
  },
  {
    CountryName: "Timor-Leste",
    ISOCode: "TL",
  },
  {
    CountryName: "Togo",
    ISOCode: "TG",
  },
  {
    CountryName: "Tonga",
    ISOCode: "TO",
  },
  {
    CountryName: "Trinidad and Tobago",
    ISOCode: "TT",
  },
  {
    CountryName: "Tunisia",
    ISOCode: "TN",
  },
  {
    CountryName: "Turkey",
    ISOCode: "TR",
  },
  {
    CountryName: "Turkmenistan",
    ISOCode: "TM",
  },
  {
    CountryName: "Tuvalu",
    ISOCode: "TV",
  },
  {
    CountryName: "Uganda",
    ISOCode: "UG",
  },
  {
    CountryName: "Ukraine",
    ISOCode: "UA",
  },
  {
    CountryName: "United Arab Emirates",
    ISOCode: "AE",
  },
  {
    CountryName: "United Kingdom",
    ISOCode: "GB",
  },
  {
    CountryName: "United States of America",
    ISOCode: "US",
  },
  {
    CountryName: "Uruguay",
    ISOCode: "UY",
  },
  {
    CountryName: "Uzbekistan",
    ISOCode: "UZ",
  },
  {
    CountryName: "Vanuatu",
    ISOCode: "VU",
  },
  {
    CountryName: "Venezuela",
    ISOCode: "VE",
  },
  {
    CountryName: "Vietnam",
    ISOCode: "VN",
  },
  {
    CountryName: "Yemen",
    ISOCode: "YE",
  },
  {
    CountryName: "Zambia",
    ISOCode: "ZM",
  },
  {
    CountryName: "Zimbabwe",
    ISOCode: "ZW",
  },
];

const states = [
  {
    StateName: "Andhra Pradesh",
    CountryID: "678617e83a5dafedcab314ec",
    RegionId: null,
  },
  {
    StateName: "Arunachal Pradesh",
    CountryID: "678617e83a5dafedcab314ec",
    RegionId: null,
  },
  {
    StateName: "Assam",
    CountryID: "678617e83a5dafedcab314ec",
    RegionId: null,
  },
  {
    StateName: "Bihar",
    CountryID: "678617e83a5dafedcab314ec",
    RegionId: null,
  },
  {
    StateName: "Chhattisgarh",
    CountryID: "678617e83a5dafedcab314ec",
    RegionId: null,
  },
  {
    StateName: "Goa",
    CountryID: "678617e83a5dafedcab314ec",
    RegionId: null,
  },
  {
    StateName: "Gujarat",
    CountryID: "678617e83a5dafedcab314ec",
    RegionId: null,
  },
  {
    StateName: "Haryana",
    CountryID: "678617e83a5dafedcab314ec",
    RegionId: null,
  },
  {
    StateName: "Himachal Pradesh",
    CountryID: "678617e83a5dafedcab314ec",
    RegionId: null,
  },
  {
    StateName: "Jharkhand",
    CountryID: "678617e83a5dafedcab314ec",
    RegionId: null,
  },
  {
    StateName: "Karnataka",
    CountryID: "678617e83a5dafedcab314ec",
    RegionId: null,
  },
  {
    StateName: "Kerala",
    CountryID: "678617e83a5dafedcab314ec",
    RegionId: null,
  },
  {
    StateName: "Madhya Pradesh",
    CountryID: "678617e83a5dafedcab314ec",
    RegionId: null,
  },
  {
    StateName: "Maharashtra",
    CountryID: "678617e83a5dafedcab314ec",
    RegionId: null,
  },
  {
    StateName: "Manipur",
    CountryID: "678617e83a5dafedcab314ec",
    RegionId: null,
  },
  {
    StateName: "Meghalaya",
    CountryID: "678617e83a5dafedcab314ec",
    RegionId: null,
  },
  {
    StateName: "Mizoram",
    CountryID: "678617e83a5dafedcab314ec",
    RegionId: null,
  },
  {
    StateName: "Nagaland",
    CountryID: "678617e83a5dafedcab314ec",
    RegionId: null,
  },
  {
    StateName: "Odisha",
    CountryID: "678617e83a5dafedcab314ec",
    RegionId: null,
  },
  {
    StateName: "Punjab",
    CountryID: "678617e83a5dafedcab314ec",
    RegionId: null,
  },
  {
    StateName: "Rajasthan",
    CountryID: "678617e83a5dafedcab314ec",
    RegionId: null,
  },
  {
    StateName: "Sikkim",
    CountryID: "678617e83a5dafedcab314ec",
    RegionId: null,
  },
  {
    StateName: "Tamil Nadu",
    CountryID: "678617e83a5dafedcab314ec",
    RegionId: null,
  },
  {
    StateName: "Telangana",
    CountryID: "678617e83a5dafedcab314ec",
    RegionId: null,
  },
  {
    StateName: "Tripura",
    CountryID: "678617e83a5dafedcab314ec",
    RegionId: null,
  },
  {
    StateName: "Uttar Pradesh",
    CountryID: "678617e83a5dafedcab314ec",
    RegionId: null,
  },
  {
    StateName: "Uttarakhand",
    CountryID: "678617e83a5dafedcab314ec",
    RegionId: null,
  },
  {
    StateName: "West Bengal",
    CountryID: "678617e83a5dafedcab314ec",
    RegionId: null,
  },
  {
    StateName: "Andaman and Nicobar Islands",
    CountryID: "678617e83a5dafedcab314ec",
    RegionId: null,
  },
  {
    StateName: "Chandigarh",
    CountryID: "678617e83a5dafedcab314ec",
    RegionId: null,
  },
  {
    StateName: "Dadra and Nagar Haveli and Daman and Diu",
    CountryID: "678617e83a5dafedcab314ec",
    RegionId: null,
  },
  {
    StateName: "Delhi",
    CountryID: "678617e83a5dafedcab314ec",
    RegionId: null,
  },
  {
    StateName: "Jammu and Kashmir",
    CountryID: "678617e83a5dafedcab314ec",
    RegionId: null,
  },
  {
    StateName: "Ladakh",
    CountryID: "678617e83a5dafedcab314ec",
    RegionId: null,
  },
  {
    StateName: "Lakshadweep",
    CountryID: "678617e83a5dafedcab314ec",
    RegionId: null,
  },
  {
    StateName: "Puducherry",
    CountryID: "678617e83a5dafedcab314ec",
    RegionId: null,
  },
];

exports.bulkInsertColdStorageGoods = async (storageFacilityId) => {
  try {
    const goods = [
      {
        Category: "Food and Beverages",
        SubCategory: "Fresh Produce",
        Name: "Apples",
        Description: "Fresh apples stored to maintain crispness and flavor.",
        TemperatureRequirement: "2-4°C",
      },
      {
        Category: "Food and Beverages",
        SubCategory: "Fresh Produce",
        Name: "Bananas",
        Description:
          "Ripe bananas stored to prevent over-ripening and spoilage.",
        TemperatureRequirement: "13-15°C",
      },
      {
        Category: "Food and Beverages",
        SubCategory: "Frozen Foods",
        Name: "Beef",
        Description:
          "Frozen beef cuts stored to maintain quality and prevent spoilage.",
        TemperatureRequirement: "-18°C or lower",
      },
      {
        Category: "Pharmaceuticals and Medical Supplies",
        SubCategory: "Vaccines",
        Name: "Pfizer COVID-19 Vaccine",
        Description:
          "mRNA vaccines requiring ultra-low temperature storage for efficacy.",
        TemperatureRequirement: "-70°C",
      },
      {
        Category: "Chemicals and Industrial Products",
        SubCategory: "Temperature-sensitive Chemicals",
        Name: "Specialty Paints",
        Description:
          "Paints requiring cold storage to maintain consistency and prevent degradation.",
        TemperatureRequirement: "5-10°C",
      },
      {
        Category: "Flowers and Plants",
        SubCategory: "Fresh-cut Flowers",
        Name: "Roses",
        Description:
          "Fresh roses stored to extend vase life and maintain freshness.",
        TemperatureRequirement: "1-3°C",
      },
      {
        Category: "Cosmetics and Personal Care Products",
        SubCategory: "Beauty Products",
        Name: "Organic Skincare Products",
        Description:
          "Skincare products requiring temperature regulation to avoid degradation.",
        TemperatureRequirement: "15-25°C",
      },
      {
        Category: "Electronics",
        SubCategory: "Batteries",
        Name: "Lithium-ion Batteries",
        Description:
          "Batteries requiring controlled temperature storage to maintain performance and safety.",
        TemperatureRequirement: "20-25°C",
      },
      {
        Category: "Specialized Goods",
        SubCategory: "Artwork and Antiques",
        Name: "Oil Paintings",
        Description:
          "Art pieces requiring controlled temperature and humidity to avoid damage.",
        TemperatureRequirement: "18-20°C",
      },
    ];

    // Insert the documents into the ColdStorageGoods collection
    const result = await ColdStorageGoods.insertMany(goods);

    console.log("Bulk insert successful:", result);
  } catch (error) {
    console.error("Error during bulk insert:", error.message);
    throw error;
  }
};

exports.addcountries = async function bulkInsertCountries() {
  try {
    if (!Array.isArray(countries)) {
      throw new Error("Input should be an array of country objects");
    }
    // Map the countries to the Country schema format
    const countryDocs = countries.map((country) => ({
      CountryName: country.CountryName,
      ISOCode: country.ISOCode,
      CreatedOn: new Date(),
      UpdatedOn: new Date(),
      IsActive: true,
      IsDeleted: false,
    }));

    // Insert the documents into the Country collection
    const result = await Country.insertMany(countryDocs);
  } catch (error) {
    console.error("Error during bulk insert:", error.message);
    throw error;
  }
};

exports.addStates = async function bulkInsertStates() {
  try {
    // Validate input
    if (!Array.isArray(states)) {
      throw new Error("Input should be an array of state objects");
    }

    // Map the states to the State schema format
    const stateDocs = states.map((state) => ({
      StateName: state.StateName,
      CountryID: state.CountryID,
      RegionId: state.RegionId || null, // Use null if RegionId is not provided
      CreatedOn: new Date(),
      UpdatedOn: new Date(),
      IsActive: true,
      IsDeleted: false,
    }));

    // Insert the documents into the State collection
    const result = await State.insertMany(stateDocs);
  } catch (error) {
    console.error("Error during bulk insert:", error.message);
    throw error;
  }
};

exports.addStoragetype = async function bulkInsertStorageTypes() {
  const storageTypes = [
    { Type: "Frozen (-18°C to -25°C)" },
    { Type: "Chilled (0°C to 10°C)" },
    { Type: "Ambient (above 10°C to 25°C)" },
  ];

  try {
    for (const storageType of storageTypes) {
      const existingType = await StorageType.findOne({
        Type: storageType.Type,
      });

      if (!existingType) {
        const newStorageType = new StorageType(storageType);
        await newStorageType.save();
        console.log(`Storage Type '${storageType.Type}' added successfully.`);
      } else {
        console.log(`Storage Type '${storageType.Type}' already exists.`);
      }
    }
    console.log("Storage Type seeding completed.");
  } catch (error) {
    console.error("Error seeding storage types:", error);
  }
};

exports.addPayment = async () => {
  const seedData = {
    Amount: 1000,
    Type: "Storage Facility",
    IsDeleted: false,
    IsActive: true,
    CreatedOn: new Date(),
    UpdatedOn: new Date(),
  };

  try {
    // Check if the payment entry already exists
    const existingPayment = await Payment.findOne({ Type: seedData.Type });

    if (!existingPayment) {
      // Create new payment entry
      const newPayment = new Payment(seedData);
      await newPayment.save();
      console.log("Payment entry created successfully:", newPayment);
    } else {
      console.log(`Payment entry '${seedData.Type}' already exists.`);
    }
  } catch (error) {
    console.error("Error seeding payment entry:", error.message);
  }
};

exports.addCoupen = async () => {
  const seedData = {
    Code: "SUMMER2023",
    Discount: 10,
    IsDeleted: false,
    IsActive: true,
    CreatedOn: new Date(),
    UpdatedOn: new Date(),
  };

  try {
    // Check if the coupen entry already exists
    const existingCoupen = await Coupen.findOne({ Code: seedData.Code });

    if (!existingCoupen) {
      // Create new coupen entry
      const newCoupen = new Coupen(seedData);
      await newCoupen.save();
      console.log("Coupen entry created successfully:", newCoupen);
    } else {
      console.log(`Coupen entry '${seedData.Code}' already exists.`);
    }
  } catch (error) {
    console.error("Error seeding coupen entry:", error.message);
  }
};

// Function to insert roles
exports.addRoles = async function insertRoles() {
  const roles = [
    {
      RoleName: "Global Admin",
      Description: "Global administrator with full access",
    },
    { RoleName: "Admin", Description: "Administrator with elevated access" },
    { RoleName: "User", Description: "Regular user with standard permissions" },
    { RoleName: "Owner", Description: "Owner of the entity or resource" },
    {
      RoleName: "Manager",
      Description: "Manager with limited administrative access",
    },
  ];

  try {
    for (const role of roles) {
      // Check if the role already exists
      const existingRole = await Roles.findOne({ RoleName: role.RoleName });
      if (!existingRole) {
        await Roles.create(role);
        console.log(`Role '${role.RoleName}' added successfully.`);
      } else {
        console.log(`Role '${role.RoleName}' already exists.`);
      }
    }
  } catch (error) {
    console.error("Error inserting roles:", error);
  }
};
