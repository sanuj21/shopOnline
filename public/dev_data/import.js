const fs = require('fs');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const ProductCategory = require('../../models/productCategoryModel');
const ProductSubCategory = require('../../models/productSubCategoryModel');
const Product = require('../../models/productModel');
const User = require('../../models/userModel');
const Review = require('../../models/reviewModel');

dotenv.config({ path: './config.env' });

const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD
);

mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: true
  })
  .then(() => {
    console.log('DB Connection Successful!!');
  });

// Read the JSON file

const productCategories = JSON.parse(
  fs.readFileSync(`${__dirname}/productCategory.json`, 'utf-8')
);
const productSubCategories = JSON.parse(
  fs.readFileSync(`${__dirname}/productSubCategory.json`, 'utf-8')
);

const products = JSON.parse(
  fs.readFileSync(`${__dirname}/product.json`, 'utf-8')
);
const users = JSON.parse(fs.readFileSync(`${__dirname}/users.json`, 'utf-8'));
const reviews = JSON.parse(
  fs.readFileSync(`${__dirname}/reviews.json`, 'utf-8')
);

// Import data in DB

const importData = async () => {
  try {
    // await Product.create(products);
    await ProductCategory.create(productCategories);
    await ProductSubCategory.create(productSubCategories);
    // await User.create(users, { validateBeforeSave: false });
    // await Review.create(reviews);
    console.log('Data imported Successfully!');
  } catch (err) {
    console.log(err);
  }
};

// Delete Data from DB

const deleteData = async () => {
  try {
    await Product.deleteMany();
    await User.deleteMany();
    await Review.deleteMany();
    await ProductCategory.deleteMany();
    await ProductSubCategory.deleteMany();
    console.log('Data Deleted Successfully!');
  } catch (err) {
    console.log(err);
  }
};

if (process.argv[2] === '--import') {
  importData();
} else if (process.argv[2] === '--delete') {
  deleteData();
}
