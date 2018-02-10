const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const bodyParser = require('body-parser');
const passport = require('passport');
const mongoose = require('mongoose');

const app = express();

const config = require('./config/database');

//mongoose.connect('mongodb://localhost:27017/restshop');

mongoose.connect(config.database, err => {
	if (err) return console.log(err);
	console.log('Connected to DB');
});
app.use(cors());
app.use(morgan('dev'));
app.use('/uploads', express.static('uploads'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(passport.initialize());

require('./config/passport')(passport);

const productsRoute = require('./api/routes/products');
const ordersRoute = require('./api/routes/orders');
const usersRoute = require('./api/routes/users');

app.use('/products', productsRoute);
app.use('/orders', ordersRoute);
app.use('/users', usersRoute);


app.use((req, res, next) => {
	const error = Error('Not found!');
	error.status = 404;
	next(error);
});

app.use((error, req, res) => {
	res.status(error.status || 500);
	res.json({
		error: {
			message: error.message,
			status: error.status
		}
	});
});

module.exports = app;