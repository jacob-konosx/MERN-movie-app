const express = require("express");

// recordRoutes is an instance of the express router.
// We use it to define our routes.
// The router will be added as a middleware and will take control of requests starting with path /record.
const recordRoutes = express.Router();

// This will help us connect to the database
const dbo = require("../db/conn");

// This help convert the id from string to ObjectId for the _id.
const ObjectId = require("mongodb").ObjectId;

// This section will help you get a list of all the  movies.
recordRoutes.route("/").get(async function (req, res) {
	let db_connect = dbo.getDb();
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
recordRoutes.route("/movie/:id").get(function (req, res) {
	let db_connect = dbo.getDb();
	let myquery = { _id: ObjectId(req.params.id) };
	db_connect.collection("movies").findOne(myquery, function (err, result) {
		if (err) throw err;
		res.json(result);
	});
});

// This section will help you create a new record.
recordRoutes.route("/add").post(function (req, response) {
	let db_connect = dbo.getDb();
	let myobj = {
		info: req.body.info,
		title: req.body.title,
		year: req.body.year,
	};
	db_connect.collection("movies").insertOne(myobj, function (err, res) {
		if (err) throw err;
		response.json(res);
	});
});

// This section will help you update a record by id.
recordRoutes.route("/update/:id").post((req, response) => {
	let db_connect = dbo.getDb();
	let myquery = { _id: ObjectId(req.params.id) };
	let newvalues = {
		$set: {
			info: req.body.info,
			title: req.body.title,
			year: req.body.year,
		},
	};
	db_connect
		.collection(" movies")
		.updateOne(myquery, newvalues, function (err, res) {
			if (err) throw err;
			console.log("1 document updated");
			response.json(res);
		});
});

// This section will help you delete a record
recordRoutes.route("/:id").delete((req, response) => {
	let db_connect = dbo.getDb();
	let myquery = { _id: ObjectId(req.params.id) };
	db_connect.collection("movies").deleteOne(myquery, function (err, obj) {
		if (err) throw err;
		console.log("1 document deleted");
		response.json(obj);
	});
});

module.exports = recordRoutes;
