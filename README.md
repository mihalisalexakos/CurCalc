<h1>CurCalc</h1>
Exchange rate calculator :) Frontend made with vue.js, backend made with nodejs. Features a secure login system, and the ability to alter database data to your liking with an easy to use frontend menu, that handles potential user errors and misuse.


<h2>Setting up</h2>

  Fontend uses Vue3 with Vue CLI and Axios
  To run:
  npm install
  npm run serve
  
  Backend uses Node.js and Express
  To run:
  npm install
  node app.js

  Backend runs on port 5050
  Frontend runs on port 8080

<h2>Logging in:</h2>
  Username: username
  Password: password


<h1>Back-end</h1>
  <h3>Controllers:</h3>
    authController.js
    Receives log in data from client, accepts/declines log in attempt
    convertController.js
    Finds requested rate in database, performs currency exchange calculation,
    returns exchange rate between the 2 currencies and the result.
    If the user tries to convert currencies that do not have a rate, convertController
    will look for the reversed rate. For example, if the database only has EUR -> USD,
    and the user wants to calculate USD -> EUR, the EUR -> USD rate will be reversed
    and then used instead to perform the calculation. Meaning that besides only 15
    rates existing by default in the rates.json file, the user has access to 30 exchange
    rates.
    rateController.js
    Used to fetch and edit data from the database (CRUD operations)
  <h3>Data:</h3>
    rates.json
    Json file containing rates, acts as database
  <h3>Middleware:</h3>
    authMiddleware.js
    Checks token from client, compares it with the token from .env
    Routes
    Organize routes and import modules (auth.js, convert.js, rates.js).
  <h3>app.js</h3>
    Main backend entry point, starts server.
    
<h1>Front-end</h1>
  <h2>Components:</h2>
    <h3>AmountInput.vue</h3>
      Monetary value inserted by user, meant to be converted into another currency.
    <h3>CurrencySelect.vue</h3>
      Custom dropdown for selecting a currency. Once the user has selected a
      currency in one of the dropdowns, the other dropdown only displays currencies
      that have exchange rates for the selected one, thus preventing potential user
      frustration and errors.
    <h3>ExchangeRateDisplay.vue</h3>
      Displays the exchange rate between the two selected currencies, updates every
      time the user selects a new currency from CurrencySelect.
    <h3>CurrencyConverter.vue</h3>
      Combines and styles all components above.
      Fetches data from backend and updates values for components above(Available
      currencies, exchange rate etc)
      Prevents potential user input errors:
      - Inserting invalid numbers (0 <) or characters as monetary value,
      - Attempting invalid conversions for currencies that do not have exchange
      rates for each other
      - Trying to convert with some elements being null
      - Trying to convert when there are no exchange rates stored in the database
    <h3>LoginForm.vue</h3>
      Handles client-side login logic.
      For this assignment I used sessionStorage to temporarily store and share the
      authentication key across components. In a production-grade app I would use
      HTTP-only cookies for a more secure login system that eliminates XSS exposure.
    <h3>RateEditor.vue</h3>
      Displays database content as a table, allows user to edit / delete rows and add
      new ones.
      Only visible when the user has logged in.
      Equipped to handle user input errors.
