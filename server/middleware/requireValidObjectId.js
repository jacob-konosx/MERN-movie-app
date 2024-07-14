import mongoose from "mongoose";

const requireValidObjectId = async (req, res, next) => {
	const objectId = req.params.id;
	const userId = req.userId;

	if (objectId && !mongoose.Types.ObjectId.isValid(objectId)) {
		return res.status(404).send(`Not a valid object Id: ${objectId}`);
	}
	if (userId && !mongoose.Types.ObjectId.isValid(userId)) {
		return res.status(404).send(`Not a valid user Id: ${userId}`);
	}

	next();
};

export default requireValidObjectId;
