exports.setUserIds = (req, res, next) => {
  if (!req.body.user) req.body.user = req.user.id;
  next();
};

exports.setProductUserIds = (req, res, next) => {
  // As we are passing the userIds and productIds in the URL, and if it exist there than copy that to body obj
  if (!req.body.product) req.body.product = req.params.productId;
  if (!req.body.user) req.body.user = req.user.id;
  next();
};
