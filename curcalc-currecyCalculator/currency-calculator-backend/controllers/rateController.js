
/* Responsible for handling user interaction with backend database, handles reading and writting to
json database, aka implementation of CRUD operations. */

const fs = require("fs");
const path = require("path");


const filePath = path.join(__dirname, "../data/rates.json");


// reads file, returns an array
function readRates() {
  try {
    const fileData = fs.readFileSync(filePath, "utf-8");
    return JSON.parse(fileData);
  } catch {
    return [];
  }
}

// writes updated rate data back to the file
function writeRates(rates) {
  fs.writeFileSync(filePath, JSON.stringify(rates, null, 2));
}


// GET: returns all stored exchange rates
exports.getRates = (req, res) => {
  const rates = readRates();
  res.json(rates);
};



// POST: stores a new exchange rate
exports.createRate = (req, res) => {
  const rates = readRates();

  const newRate = {
    // uses current date to make an id, randomized further with math.random to avoid potential id clashes
    id: Date.now() + Math.floor(Math.random() * 10000).toString(), 
    from: req.body.from,
    to: req.body.to,
    rate: req.body.rate
  };

  rates.push(newRate);
  writeRates(rates);

  res.status(201).json(newRate);
};

// PUT: updates an already stored rate
exports.updateRate = (req, res) => {
  const { id } = req.params;
  const rates = readRates();

  const index = rates.findIndex(rate => rate.id == id);

  if (index === -1) {
    return res.status(404).json({ message: "Rate not found." });
  }

  /* merges existing data with new data
  (... !== undefined): goal is to prevent accidentally inserting items with missing data into the database */
  const updatedRate = rates[index];

  if (req.body.from !== undefined) {
    updatedRate.from = req.body.from;
  }

  if (req.body.to !== undefined) {
    updatedRate.to = req.body.to;
  }

  if (req.body.rate !== undefined) {
    updatedRate.rate = req.body.rate;
  }

  rates[index] = updatedRate;
  writeRates(rates);

  // sends back to client
  res.json(rates[index]);
};



// DELETE: removes a stored rate
exports.deleteRate = (req, res) => {
  const { id: toBeDeletedID } = req.params;
  const rates = readRates();

  // check if rate even exists in the database
  const exists = rates.some(rate => rate.id == toBeDeletedID);

  if (!exists) {
    return res.status(404).json({ message: "Rate not found." });
  }

  
  const updatedRates = [];

  // loops through rates, stores into updatedRates the rates that do not have the ID of our target rate (toBeDeletedID)
  for (const rate of rates) {
    
    if (rate.id != toBeDeletedID) {
      updatedRates.push(rate);
    }
  }

  // save the updated list that does not include the deleted rate
  writeRates(updatedRates);
  res.json({ message: "Rate deleted successfully." });
};
