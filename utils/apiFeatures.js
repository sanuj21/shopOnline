class APIFeatures {
  constructor(queryDB, queryURL) {
    this.queryDB = queryDB;
    this.queryURL = queryURL;
  }

  // To filter string i.e. [ sort, page, fields, limit ]
  filter() {
    const queryObj = { ...this.queryURL };
    // We can't copy a object directly,, when we try to do so,, its reference is copied,, so we to trick here
    const excludedFields = ['sort', 'page', 'fields', 'limit'];
    excludedFields.forEach(el => {
      delete queryObj[el];
    });

    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace((/\b(gte|gt|lte|lt\b)/g, match => `$${match}`));
    this.queryDB = this.queryDB.find(JSON.parse(queryStr));

    return this;
  }

  // To sort on the basis of different fields
  sort() {
    if (this.queryURL.sort) {
      const sortby = this.queryURL.sort.split(',').join(' ');
      this.queryDB = this.queryDB.sort(sortby);
    }
    return this;
  }

  // To Limit the selection to some fields
  limitFields() {
    if (this.queryURL.fields) {
      const fields = this.queryURL.fields.split(',').join(' ');
      this.queryDB = this.queryDB.select(fields);
    }
    return this;
  }

  // To control the page
  paginate() {
    const page = this.queryURL.page * 1 || 1;
    const limit = this.queryURL.limit * 1 || 100;
    const skip = (page - 1) * limit;
    this.queryDB = this.queryDB.skip(skip).limit(limit);

    return this;
  }
}

module.exports = APIFeatures;
