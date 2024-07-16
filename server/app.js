require("dotenv").config();
const express = require('express');
const morgan = require('morgan');
const axios = require('axios');

const app = express();
//remember to put the .env file in the proper location or else it wont be read.
const apiKey = process.env.API_KEY; 

const cache = {};

app.use(morgan('dev'));

app.get('/', async (req, res) => {
  const { i, t, s } = req.query;
//reminder to use i, t, s.
  if (!i && !t && !s) {
    return res.status(400).send('No valid query parameters provided. Use ?i=, ?t=, or ?s=');
  }
//q required and optiona. for passing test reasons I used all 3
  const query = i ? `i=${i}` : t ? `t=${t}` : `s=${s}`;
  //url+api
  const url = `http://www.omdbapi.com/?${query}&apikey=${apiKey}`;

  console.log(`Requesting URL: ${url}`);

  if (cache[url]) {
    console.log('Returning cached data');
    return res.json(cache[url]);
  }

  try {
    const response = await axios.get(url);
    cache[url] = response.data; // Cache the result for future requests
    console.log('Fetching new data from OMDb API');
    res.json(response.data);
  } catch (error) {
    console.error(`Error fetching data from OMDb API: ${error.message}`);
    res.status(500).send('Error fetching data from OMDb API');
  }// this is the last step, if we got this far means something is wrong, walk back to each console.log and retrace your steps.
});



module.exports = app;
