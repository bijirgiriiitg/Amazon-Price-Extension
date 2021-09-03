const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const user = require("./routes/user");
const product = require("./routes/product");

const cors = require('cors');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 8000;

const dbURI = 'mongodb+srv://register:iitbijir4@bijirgiribasumatary.rcazv.mongodb.net/node-tuts?retryWrites=true&w=majority';
mongoose.connect(dbURI, {useNewUrlParser: true,useUnifiedTopology: true})
	.then(()=> console.log('Database is Connected'))
	.catch(err=>{
		console.log(err);
	})

app.get('/',(req,res) =>{
	res.send('Hello World!');
})
app.use(morgan('dev'));
app.use(bodyParser.json({limit: '200mb', extended: true}));
app.use(bodyParser.urlencoded({limit: '200mb', extended: true}));

app.use(cors({ origin: "*"}));

app.use("/user", user);
app.use("/product", product);


app.listen(port, ()=>{
	console.log(`Server is running on port ${port}`)
})
