const swaggerAutogen = require('swagger-autogen')();


const doc = {
    info: {
      title: 'My API',
      description: 'Description'
    },
    host: 'localhost:3003'
  };
  
  const outputFile = './swagger-output.json';
  const routes = ['./server.js'];
  
  
  swaggerAutogen(outputFile, routes, doc);
  