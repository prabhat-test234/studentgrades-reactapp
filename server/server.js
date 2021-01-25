const express = require('express');
const path = require('path');
var proxy = require('express-http-proxy');
const app = express();

app.use(express.static(path.join(__dirname)));

const getContextPathMethod = (contextPath) => {
  return (req) => {
    var parts = req.url.split('?');
    var queryString = parts[1];
    const pathParams = (contextPath
        .match(/\{.+?\}/g)     // Use regex to get matches
      || []                  // Use empty array if there are no matches
    ).map(function (str) {    // Iterate matches
      return str.slice(1, -1) // Remove the braces
    });
    let updatedContext = contextPath;
    pathParams.forEach(param => {
      updatedContext = updatedContext.replace(`{${param}}`, req.params[param]);
    });
    return updatedContext + (queryString ? '?' + queryString : '');
  };
};

const getAuthHeaderMethod = () => {
  return (proxyReqOpts) => {
    proxyReqOpts.headers['Accept'] = 'application/json';
    proxyReqOpts.headers['Content-Type'] = 'application/json';
    proxyReqOpts.rejectUnauthorized = false;
    return proxyReqOpts;
  };
};



  app.use('/api/test/student/grade/', proxy('https://9hu0ztgsi6.execute-api.us-east-2.amazonaws.com', {
    proxyReqOptDecorator: getAuthHeaderMethod(),
    proxyReqPathResolver: getContextPathMethod(`/test/student/grade/`)
  }));
 
  app.listen(process.env.PORT || 5000);

