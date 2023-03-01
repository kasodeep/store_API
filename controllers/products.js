const Product = require("../models/product");

/**
 * This function is the most basic to query any database where fixed parameters are used.
 */
const getAllProductsStatic = async (req, res) => {
  const products = await Product.find({
    featured: true,
    price: { $gt: 30 },
  }).sort("price");

  res.status(200).json({ products, nbHits: products.length });
};

/**
 * This function is dynamic and the databse is quered based on the query entered by the user.
 */
const getAllProducts = async (req, res) => {
  const { featured, company, name, sort, fields, numericFilters } = req.query;
  const queryObject = {};

  if (featured) {
    queryObject.featured = featured === "true" ? true : false;
  }
  if (company) {
    queryObject.company = company;
  }
  if (name) {
    // i means case-Insensitive
    queryObject.name = { $regex: name, $options: "i" };
  }

  if (numericFilters) {
    const operatorMap = {
      ">": "$gt",
      ">=": "$gte",
      "<": "$lt",
      "<=": "$lte",
      "=": "$eq",
    };

    const regEx = /\b(<|>|>=|=|<|<=)\b/g;
    const options = ["price", "rating"];

    let filters = numericFilters.replace(
      regEx,
      (match) => `-${operatorMap[match]}-`
    );

    filters = filters.split(",").forEach((item) => {
      const [field, operator, value] = item.split("-");
      if (options.includes(field)) {
        queryObject[field] = { [operator]: Number(value) };
      }
    });
  }

  if (queryObject) {
    let result = Product.find(queryObject);

    // Sorting
    if (sort) {
      const sortList = sort.split(",").join(" ");
      result = result.sort(sortList);
    } else {
      result = result.sort("createdAt");
    }

    // Selecting
    if (fields) {
      const fieldList = fields.split(",").join(" ");
      result = result.select(fieldList);
    }

    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 5;
    const skip = (page - 1) * limit;
    result = result.skip(skip).limit(limit);

    const products = await result;
    res.status(200).json({ products, nbHits: products.length });
  }
};

module.exports = { getAllProducts, getAllProductsStatic };

// We can use This
// In V6 the Query that is not matched is ignored
// const products = await Product.find(req.query)
