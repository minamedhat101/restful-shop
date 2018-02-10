const express = require('express');
const router = express.Router();

const Order = require('../models/order');
const Product = require('../models/product');

router.get('/', (req, res) => {
	Order.find().populate('product').exec()
		.then(result => {
			res.status(200).json(result);
		})
		.catch(err => {
			res.status(500).json({ error: err });
		});
});

router.post('/', (req, res) => {
	Product.findById(req.body.productId)
		.then(product => {
			if (!product) {
				return res.status(404).json({
					message: 'Product Not Found'
				});
			}
			const order = new Order({
				quantity: req.body.quantity,
				product: req.body.productId
			});
			return order.save();
		})
		.then(result => {
			console.log(result);
			res.status(201).json({
				message: 'Handling POST requests to /products',
				createdProduct: result
			});
		})
		.catch(err => {
			console.log(err);
			res.status(500).json({ error: err });
		});
});

router.get('/:orderId', (req, res) => {
	Order.findById(req.params.orderId).populate().exec()
		.then(result => {
			if (result) {
				res.status(200).json(result);
			} else {
				res.status(404).json({ message: 'No vaild entry found' });
			}
		})
		.catch(err => {
			console.log(err);
			res.status(500).json({ error: err });
		});
});

router.delete('/:orderId', (req, res) => {
	const id = req.params.productId;
	Order.remove({ _id: id }).exec()
		.then(result => {
			res.status(200).json(result);
		})
		.catch(err => {
			console.log(err);
			res.status(500).json({ error: err });
		});
});

module.exports = router;