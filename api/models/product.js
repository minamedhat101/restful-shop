const mongoose = require('mongoose');

const productSchema = mongoose.Schema({
	name: { type: String },
	price: { type: Number  },
	productImage: { type: String }
});

module.exports = mongoose.model('Product', productSchema);
