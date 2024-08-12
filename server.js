const express = require("express");
const cors = require('cors');
const app = express();
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger-output.json');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());


app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));


const api_redirect_path = require("./api/api");
const port = process.env.PORT || 3003;
const api_version = 1.0;



app.use('/api', api_redirect_path);
app.listen(port, async () => {
    console.log(`Fly Far Tech Product Management backend running port ${port}`);
});


