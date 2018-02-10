const mongoose = require('mongoose');
const bcrypt = require('bcrypt-nodejs');

const userSchema = mongoose.Schema({
	email: {
		type: String, required: true, unique: true,
		match: /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/
	},
	password: {
		type: String,
		required: true,
	}
});

userSchema.pre('save', function (next) {
	const user = this;
	if (!user.isModified('password')) return next();
	if (user.password) {
		bcrypt.genSalt(10, function (err, salt) {
			if (err) return next(err);
			bcrypt.hash(user.password, salt, null, function (err, hash) {
				if (err) return next(err);
				user.password = hash;
				next();
			});
		});
	}
});

module.exports.comparePassword = function (candidatePassword, hash, callback) {
	bcrypt.compare(candidatePassword, hash, (err, isMatch) => {
		if (err) console.log(err);
		callback(null, isMatch);
	});
};
module.exports = mongoose.model('User', userSchema);