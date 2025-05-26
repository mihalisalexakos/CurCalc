

<template>
    <div class="cc-wrapper">
        <div class="cc-container" :class="{ blurred: isEmptyRates }">
            <div class="left-icons">
                <CurrencySelect
                    v-model="fromCurrency"
                    :currencies="currencies"
                    @change="handleFromCurrencyChange"
                />

                <button class="swap"
                    @click="swap" 
                    :disabled="isEmptyRates" 
                    :style="{ transform: `rotate(${rotation}deg)`}">
                    <i class="fa-solid fa-repeat"></i>
                </button>

                <!-- only displays currencies that have a matching rate with the currency selected above -->
                <CurrencySelect
                    v-model="toCurrency"
                    :currencies="availableToCurrencies"
                />
            </div>

            <div class="right-fields">
                <AmountInput v-model="amount" />
                <button class="convert" 
                    @click="convert">
                    
                    Convert
                </button>
                <div class="results">
                    <div class="converted-amount">{{ result }}</div>
                    <ExchangeRateDisplay :rate="exchangeRate"/>
                </div>
            </div>
        </div>

        <!-- If there are no available rates, warning message pops up, CurrencyConverter ui becomes blurred and unclickable -->
        <p v-if="isEmptyRates" class="warning-msg">
            No exchange rates found. Log in and insert at least one to get started.
        </p>
    </div>
</template>

<script>

    import CurrencySelect from "./CurrencySelect.vue";
    import AmountInput from "./AmountInput.vue";
    import ExchangeRateDisplay from "./ExchangeRateDisplay.vue";
    import axios from "axios";



    export default {
        name: "CurrencyConverter",
        components: { CurrencySelect, AmountInput, ExchangeRateDisplay },
        data() {
            return {
                rates: [],
                currencies: [],
                availableToCurrencies: [],
                fromCurrency: "EUR",
                toCurrency: "USD",
                amount: 1,
                exchangeRate: 1.4275,
                result: null,
                rotation: 0
            };
        },    
        methods: {
            async fetchCurrencies() {
                try {
                    const res = await axios.get("http://localhost:5050/api/rates");
                    this.rates = res.data;

                    const codes = new Set();
                    this.rates.forEach(rate => {
                    codes.add(rate.from);
                    codes.add(rate.to);
                    });

                    this.currencies = Array.from(codes).map(code => ({ code }));
                    this.updateAvailableToCurrencies();
                } catch (error) {
                    console.error("Failed to fetch currencies: ", error);
                }
            },

            /* Not all currencies have rates for all other currencies
            handleFromCurrencyChange and updateAvailableToCurrencies make sure
            the user cannot select 2 currencies that do not have a rate for each other */
            
            handleFromCurrencyChange() {

                this.updateAvailableToCurrencies();

                if (!this.availableToCurrencies.some(c => c.code === this.toCurrency)) {
                    this.toCurrency = null;
                }
            },
            updateAvailableToCurrencies() {

                const related = new Set();

                this.rates.forEach(rate => {
                    if (rate.from === this.fromCurrency) related.add(rate.to);
                    if (rate.to === this.fromCurrency) related.add(rate.from);
                });

                this.availableToCurrencies = Array.from(related).map(code => ({ code }));
            },
            // swaps the 2 currencies selected
            swap() {

                this.rotation += 180;
                [this.fromCurrency, this.toCurrency] = [this.toCurrency, this.fromCurrency];
                this.handleFromCurrencyChange();

            },
            async convert() {
                // checking for invalid inputs
                if (!this.fromCurrency || !this.toCurrency) {
                    console.error("Please select both currencies.");
                    alert("2 currencies are needed to perform exchange calculations");
                    return;
                }

                if (!this.amount || this.amount <= 0) {
                    console.error("Invalid amount.");
                    alert("Invalid amount inserted. Must be greater than, or 0");
                    return;
                }

                // last try//catch just in case
                try {
                    const res = await axios.post("http://localhost:5050/api/convert", {
                    from: this.fromCurrency,
                    to: this.toCurrency,
                    amount: Number(this.amount)
                    });

                    this.exchangeRate = res.data.rate;
                    this.result = res.data.converted;
                } catch (error) {

                    console.error("Conversion failed:", error);
                    alert("Conversion failed. Please make sure a rate exists between the selected currencies.");
                }
            },
            async fetchExchangeRate(){

                if(!this.fromCurrency || !this.toCurrency){
                    this.exchangeRate = null;
                    return;
                }

                try{
                    const res = await axios.post("http://localhost:5050/api/convert", {
                        from: this.fromCurrency,
                        to: this.toCurrency,
                        amount: 1 // dummy amount to get the rate
                    });
                    this.exchangeRate = res.data.rate;
                } catch(error){
                    this.exchangeRate = null;
                    console.warn("Failed to fetch exchange rate:", error);
                }
            }
        },
        computed: {
            // if the database has no data stored(aka user deleted all rates in the editor), function returns true
            isEmptyRates() {
                return this.rates.length === 0;
            }
        },
        watch: {
            // everytime selected currencies are changed, call fetchExchangeRate()
            toCurrency() {
                this.fetchExchangeRate();
            },
            fromCurrency() {
                this.fetchExchangeRate();
            }
        },
        mounted() {
            this.fetchCurrencies();
        }
    };

   
</script>


<style scoped>

    .left-icons, .right-fields{
        display: flex;
        flex-direction: column;
        gap: 10px;
        align-items: center;
        justify-content: center;
        width: 100%;
    }


    .swap i{
        transform: rotate(90deg);
    }

    .swap {
        border-radius: 50%;
        padding: 10px;
        width: 40px;
        height: 40px;
        transition: 0.2s;
    }


    .convert{
        display: flex;
        align-content: center;
        justify-content: center;
        background-color: var(--accent);
        color: var(--white);
        width: 100%;
    }
    .convert:hover{
        border: 2px solid var(--logoColor);
        background-color: var(--accent);
        color: var(--white);
    }

    .results{
        display: grid;
        grid-template-columns: 1fr auto;
        grid-template-rows: 1fr;
        width: 100%;
        width: 100%;
        align-items: center;
        height: 40px;
        justify-content: space-between;
        background-color: var(--offwhite);
        border-radius: 10px;
    }

    .converted-amount{
        font-size: 1em;
        padding: 10px;
        background-color:  var(--offwhite);
        color: var(--accent);
        border-radius: 10px;
        width: 100%;
        box-sizing: border-box;
    }

    .right-fields input{
        width: 100%;
        box-sizing: border-box;
    }

    .warning-msg {
        position: absolute;
        color: var(--alert);
        font-size: 0.9rem;
        margin-top: 20px;
        background-color: var(--offwhite);
        padding: 10px;
        border-radius: 10px;
        border: 2px solid var(--alert);
    }

    .cc-wrapper {
        position: relative;
        display: flex;
        justify-content: center;
        align-items: center;
    }

    .cc-container {
        display: grid;
        grid-template-columns: auto auto;
        gap: 20px;
        max-width: 600px;
        transition: filter 0.3s ease;
    }

    .cc-container.blurred {
        filter: blur(3px);
        pointer-events: none; 
    }

    .warning-msg {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        max-width: 90%;
        margin: 0px;

        color: var(--alert);
        font-size: 0.9rem;

        background-color: var(--white);
        padding: 15px 20px;

        border-radius: 10px;
        border: 2px solid var(--alert);

        z-index: 10;
        text-align: center;

        
        box-shadow: 0 0 10px rgba(0,0,0,0.1);
    }


    @media (max-width: 800px){
        
        .cc-container{
            display: grid;
            grid-template-columns: auto;
            grid-template-rows: auto auto;
            gap: 20px;
        }

        .left-icons{
            flex-direction: row;
        }

        .swap i{
            transform: rotate(0deg);
        }
    }

    

</style>