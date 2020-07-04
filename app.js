const path = require('path');
const express = require('express');
const mongoSantize = require('express-mongo-sanitize');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const xss = require('xss-clean');
const cookieParser = require('cookie-parser');
const compression = require('compression');
const cors = require('cors');

const productCategoryRouter = require('./routes/productCategoryRoutes');
const productSubCategoryRouter = require('./routes/productSubCategoryRoutes');
const productRouter = require('./routes/productRoutes');
const userRouter = require('./routes/userRoutes');
const reviewRouter = require('./routes/reviewRoutes');
const viewRouter = require('./routes/viewRoutes');

const globalErrorHandler = require('./controllers/errorController');

const app = express(); // Creates the server automatically

// Set the veiw engine

app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

// For serving static files
app.use(express.static(path.join(__dirname, '/public')));

// Setting essential headers using helmet
app.use(helmet());

// To limit the request, this prevents the bruteforce attack
app.use(
  '/api',
  rateLimit({
    max: 100,
    windowMs: 1000 * 60 * 60,
    message: 'Too many attempts!! Please try again after one hour'
  })
);

// Body Parser,reading data from body to req.body
app.use(express.json());

// For sanitizing the data,, which helps to avoid attackers
app.use(mongoSantize());

// To allow the use of cookieParser
app.use(cookieParser());

// Data sanitization agains xss
app.use(xss());

app.use(compression());

// To enable cross origin requests
app.use(cors()); // This will only work for simple request get and post,,

// For delete and patch we need use this
app.options('*', cors());

app.use('/', viewRouter);
app.use('/api/v1/productCategories', productCategoryRouter);
app.use('/api/v1/productSubCategories', productSubCategoryRouter);
app.use('/api/v1/products', productRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/reviews', reviewRouter);

app.use(globalErrorHandler);

module.exports = app;
