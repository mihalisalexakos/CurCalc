const fs = require("fs");
const path = require("path");


const filePath = path.join(__dirname, "../data/rates.json");

exports.convert = (req, res) => {

  const { from, to, amount } = req.body;


  // reads/parses exchange rates from rates.json
  const ratesData = fs.readFileSync(filePath, "utf-8");
  const rates = JSON.parse(ratesData);


  // loops through data base and find a matching exchange rate
  let matchingRate = null;

  for (let i = 0; i < rates.length; i++) {
    const rate = rates[i];

    if (rate.from === from && rate.to === to) {
      matchingRate = rate;
      break; 
    }
  }

  // if no match is found, check for the reverse exchange
  if (!matchingRate) {

    const reverse = rates.find(r => r.from === to && r.to === from);

    if (reverse) {
      matchingRate = { rate: 1 / reverse.rate };

    } else {

      return res.status(404).json({ message: "Exchange rate not found." });
    }
    
  }

  // converts currency
  const result = amount * matchingRate.rate;

  // returns result back to the client
  res.json({ converted: result, rate: matchingRate.rate });
};
