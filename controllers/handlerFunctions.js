const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');
const APIFeatures = require('../utils/apiFeatures');
const Email = require('../utils/email');

// Get A document
exports.getOne = (Model, popOption) =>
  catchAsync(async (req, res, next) => {
    let query;
    if (req.body.user && req.user.role !== 'admin') {
      query = await Model.findOne({
        _id: req.params.id,
        user: req.body.user
      });
    } else {
      query = Model.findById(req.params.id);
    }
    if (popOption) query.populate(popOption);
    const doc = await query;
    if (!doc) {
      return next(new AppError('No doc found with that Id', 404));
    }
    res.status(200).json({
      status: 'success',
      data: {
        doc
      }
    });
  });

// Update a document
exports.updateOne = Model =>
  catchAsync(async (req, res, next) => {
    let doc;
    if (req.body.user && req.user.role !== 'admin') {
      doc = await Model.findOneAndUpdate(
        {
          _id: req.params.id,
          user: req.body.user
        },
        req.body,
        { new: true, runValidators: true }
      );
    } else {
      doc = await Model.findByIdAndUpdate(req.params.id, req.body, {
        new: true, // This new property true means, the function will return the updated doc rather than original
        runValidators: true
      });
    }

    if (!doc) {
      return next(new AppError('No doc found with that id'), 404);
    }

    if (doc.bookedOn) {
      const myOrdersUrl = `${req.protocol}://${req.hostname}:${process.env.PORT}/myAccount/orders`;
      await new Email(req.user, myOrdersUrl).sendOrderCancellation();
    }

    res.status(200).json({
      status: 'success',
      data: {
        doc
      }
    });
  });

// Delete a document
exports.deleteOne = Model =>
  catchAsync(async (req, res, next) => {
    let doc;

    if (req.body.user && req.user.role !== 'admin') {
      doc = await Model.findOneAndDelete({
        _id: req.params.id,
        user: req.body.user
      });
    } else {
      doc = await Model.findByIdAndDelete(req.params.id);
    }
    if (!doc) {
      return next(new AppError('No doc found with that id'), 404);
    }
    res.status(204).json({
      status: 'success'
    });
  });

// Get All Documents
exports.getAll = Model =>
  catchAsync(async (req, res, next) => {
    // It checks whether the URL contains the Id ,if yes,,than only get the reviews of particular product
    let filter = {};
    if (req.params.productId) {
      filter = { product: req.params.productId };
    } else if (req.body.user && req.user.role !== 'admin') {
      filter = { user: req.body.user };
    }

    const features = new APIFeatures(Model.find(filter), req.query)
      .filter()
      .sort()
      .limitFields()
      .paginate();

    const docs = await features.queryDB;

    res.status(200).json({
      status: 'success',
      results: docs.length,
      data: {
        docs
      }
    });
  });

// Create a Document
exports.createOne = Model =>
  catchAsync(async (req, res, next) => {
    console.log('In create');
    const doc = await Model.create(req.body);
    console.log(doc);

    if (doc.bookedOn) {
      const myOrdersUrl = `${req.protocol}://${req.hostname}:${process.env.PORT}/myAccount/orders`;
      console.log(req.user);
      await new Email(req.user, myOrdersUrl).sendOrderConfirmation();
      console.log('Fine');
    }
    res.status(201).json({
      status: 'success',
      data: {
        doc
      }
    });
  });
