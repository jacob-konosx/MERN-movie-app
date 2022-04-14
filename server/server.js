const express = require("express");
const app = express();
const BodyParser = require("body-parser");
const cors = require("cors");
require("dotenv").config({ path: "./confi.env" });
const port = process.env.PORT || 5000;
app.use(cors());
app.use(express.json());
app.use(require("./routes/record"));
app.use(BodyParser.json());
app.use(BodyParser.urlencoded({ extended: true }));
// get driver connection
const dbo = require("./db/conn");

app.listen(port, () => {
	// perform a database connection when server starts
	dbo.connectToServer(function (err) {
		if (err) console.error(err);
	});
	console.log(dbo.getDb());
	console.log(`Server is running on port: ${port}`);
});
