class APIFeatures {

  constructor(query, queryString) {
    this.query = query;
    this.queryString = queryString;
  }

  filter () {
    // Excluding fields 
    const queryObj = {...this.queryString}
    const excludedFields = ['name', 'page', 'fields', 'limit', 'sort']
    excludedFields.forEach(el => delete queryObj[el])

    // Advance filtering | ?duration[gte]=5
    let queryStr =  JSON.stringify(queryObj) 
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`)

    this.query = this.query.find(JSON.parse(queryStr))

    return this;
  }

  sort () {
    // Sorting | ?sort=price,-duration
    if(this.queryString.sort) {
      const sortBy = this.queryString.sort.split(',').join(' ')
      this.query = this.query.sort(sortBy)
    }
    else {
      this.query = this.query.sort('-createAt')
    }

    return this;
  }

  limitFields () {
    // Limiting fields | ?fields=name,duration,price
    if(this.queryString.fields) {
      const fields = this.queryString.fields.split(',').join(' ')
      this.query = this.query.select(fields)
    }

    return this;
  }

  async pagination () {
    // Pagination | ?page=1&limit=5
    const page = this.queryString.page || 1 
    const limit = this.queryString.limit || 0 
    const skip = (page - 1)  * limit

    this.query = this.query.skip(skip).limit(limit)

    return this;
  }
}

module.exports = APIFeatures
