const express = require("express");
const recordRoutes = express.Router();
const dbo = require("../db/conn");
const ObjectId = require("mongodb").ObjectId;

// This section will help you get a list of all the  movies.
recordRoutes.route("/").get(async (req, res) => {
	let db_connect = await dbo.getDb();
	const ITEMS_PER_PAGE = 9;

	const page = req.query.page || 1;
	const skip = (page - 1) * ITEMS_PER_PAGE; // 1 * 20 = 20

	const count = await db_connect.collection("movies").countDocuments({});
	const pageCount = Math.ceil(count / ITEMS_PER_PAGE); // 400 items / 20 = 20

	db_connect
		.collection("movies")
		.find({})
		.sort({ _id: -1 })
		.limit(9)
		.skip(skip)
		.toArray(function (err, result) {
			if (err) throw err;
			res.json({ movies: result, pageCount: pageCount });
		});
});

// This section will help you get a single record by id
recordRoutes.route("/movie/:id").get(async (req, res) => {
	let db_connect = await dbo.getDb();

	let myquery = { _id: ObjectId(req.params.id) };
	db_connect.collection("movies").findOne(myquery, function (err, result) {
		if (err) throw err;
		res.json(result);
	});
});

// This section will help you create a new record.
recordRoutes.route("/add").post(async (req, response) => {
	let db_connect = await dbo.getDb();
	let myobj = {
		info: req.body.info,
		title: req.body.title,
		year: req.body.year,
		uid: req.body.uid,
	};
	db_connect.collection("movies").insertOne(myobj, function (err, res) {
		if (err) throw err;
		response.json(res);
	});
});

// This section will help you update a record by id.
recordRoutes.route("/update/:id").post(async (req, response) => {
	let db_connect = await dbo.getDb();
	let myquery = { _id: ObjectId(req.params.id) };
	let newvalues = {
		$set: {
			info: req.body.info,
			title: req.body.title,
			year: req.body.year,
		},
	};
	db_connect
		.collection("movies")
		.updateOne(myquery, newvalues, function (err, res) {
			if (err) throw err;
			console.log("1 document updated");
			response.json(res);
		});
});

// This section will help you delete a record
recordRoutes.route("/:id").delete(async (req, response) => {
	let db_connect = await dbo.getDb();
	let myquery = { _id: ObjectId(req.params.id) };
	db_connect.collection("movies").deleteOne(myquery, function (err, obj) {
		if (err) throw err;
		console.log("1 document deleted");
		response.json(obj);
	});
});
recordRoutes.route("/search").get(async (request, response) => {
	try {
		let db_connect = await dbo.getDb();

		let result = await db_connect
			.collection("movies")
			.aggregate([
				{
					$search: {
						index: "title",
						autocomplete: {
							query: `${request.query.query}`,
							path: "title",
							fuzzy: {
								maxEdits: 2,
								prefixLength: 3,
							},
						},
					},
				},
			])
			.toArray();
		response.send(result);
	} catch (e) {
		response.status(500).send({ message: e.message });
	}
});

recordRoutes.route("/user/:id").get(async (req, res) => {
	let db_connect = await dbo.getDb();

	let myquery = { uid: req.params.id };
	db_connect.collection("users").findOne(myquery, function (err, result) {
		if (err) throw err;
		res.json(result);
	});
});

recordRoutes.route("/user/add").post(async (req, response) => {
	let db_connect = await dbo.getDb();
	let myobj = {
		email: req.body.email,
		name: req.body.name,
		imageUrl: req.body.imageUrl,
		uid: req.body.uid,
		moviesList: [],
	};
	db_connect.collection("users").insertOne(myobj, function (err, res) {
		if (err) throw err;
		response.json(res);
	});
});
module.exports = recordRoutes;
