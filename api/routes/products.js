const express = require('express');
const multer = require('multer');

const Product = require('../models/product');

const router = express.Router();

const storage = multer.diskStorage({
	destination: function (req, file, cb) {
		cb(null, 'uploads/');
	},
	filename: function (req, file, cb) {
		cb(null, new Date().toISOString() + file.originalname);
	}
});

const fileFilter = (req, file, cb) => {
	if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
		cb(null, true);
	} else {
		cb(null, false);
	}
};

const upload = multer({
	storage: storage,
	fileFilter: fileFilter
});


router.get('/', (req, res) => {
	Product.find().exec()
		.then(result => {
			res.status(200).json(result);
		}).catch(err => {
			res.status(500).json({ error: err });
			throw new Error(err);
		});
});

router.post('/', upload.single('productImage'), (req, res) => {
	const product = new Product({
		name: req.body.name,
		price: req.body.price,
		productImage: req.file.path
	});

	product.save()
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

router.get('/:productId', (req, res) => {
	const id = req.params.productId;
	Product.findById(id).exec()
		.then(result => {
			console.log(result);
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

router.patch('/:productId', (req, res) => {
	const id = req.params.productId;
	/*
  const name = req.body.newName;
  const price = req.body.newPrice;
  */
	const updateOps = {};
	for (const ops of req.body) {
		updateOps[ops.propName] = ops.value;
	}

	Product.update({ _id: id }, { $set: updateOps }).exec()
		.then(result => {
			res.status(200).json(result);
		})
		.catch(err => {
			console.log(err);
			res.status(500).json({ error: err });
		});
});

router.delete('/:productId', (req, res) => {
	const id = req.params.productId;
	Product.remove({ _id: id }).exec()
		.then(result => {
			res.status(200).json(result);
		})
		.catch(err => {
			console.log(err);
			res.status(500).json({ error: err });
		});
});

module.exports = router;