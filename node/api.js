const axios = require("axios");

const options = {
  method: 'GET',
  url: 'https://quotes21.p.rapidapi.com/quote',
  headers: {
    'X-RapidAPI-Host': 'quotes21.p.rapidapi.com',
    'X-RapidAPI-Key': '2b7173fdfemshd22ba2942cb4797p10eb55jsnb696e0c8d2dd'
  }
};

axios.request(options).then(function (response) {
	console.log(response.data);
}).catch(function (error) {
	console.error(error);
});

