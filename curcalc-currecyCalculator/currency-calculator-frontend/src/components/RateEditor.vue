<template>
  <div class="rate-editor">
    <div class="table-wrapper">
        <table>
            <thead>
                <tr>
                <th>From</th>
                <th>To</th>
                <th>Rate</th>
                <th>Actions</th>
                </tr>
            </thead>
            <tbody>
                <!-- inserting a new rate -->
                <tr>
                    <td><input v-model="newRate.from" /></td>
                    <td><input v-model="newRate.to" /></td>
                    <td>
                        <input
                            v-model.number="newRate.rate"
                            type="number"
                            step="any"
                            min="0"
                        />
                    </td>
                <td><button class="save-btn" @click="insertRate">Insert</button></td>
                </tr>
                 <!-- displaying json rates-->
                <tr v-for="(rate, index) in rates" :key="rate.id">
                    <td>{{ rate.from }}</td>
                    <td>{{ rate.to }}</td>
                    <td>
                        <input
                            v-if="editingIndex === index"
                            v-model.number="editedRate"
                            type="number"
                            step="any"
                            min="0"
                        />
                        <span v-else>{{ rate.rate }}</span>
                    </td>

                    <!-- column containing delete/edit/save buttons-->
                    <td>
                        <button v-if="editingIndex === index" @click="saveEdit(rate)">Save</button>
                        <button v-else @click="startEdit(index, rate.rate)">Edit</button>
                        <button @click="deleteRate(rate)">Delete</button>
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
    name: "RateEditor",
        data() {
            return {
            rates: [],
            editingIndex: null,
            editedRate: null,
            newRate: { from: "", to: "", rate: null }
            };
        },
    methods: {
        getAuthHeader() {
            // editing, deleting and inserting rates requires the user having logged in
            const token = sessionStorage.getItem("token");
            return {
                headers: { Authorization: `Bearer ${token}` }
            };
        },
        // fetches rate values from backend
        async fetchRates() {
            try{

                const res = await axios.get("http://localhost:5050/api/rates");
                this.rates = res.data;

            } catch(error){

                console.log("Failed to fetch rates: ", error);
            }

        },

        startEdit(index, rate) {
            this.editingIndex = index;
            this.editedRate = rate;
        },

        // sends user made changes to backend
        async saveEdit(rate) {
            try{

                // makes sure rate is > 0
                if (this.editedRate <= 0) return;

                const updated = { ...rate, rate: this.editedRate };
                await axios.put(
                    `http://localhost:5050/api/rates/${rate.id}`, 
                    updated,
                    this.getAuthHeader()
                );

                // update reverse rate
                // for example if user changed EUR -> USD to 2
                // rate for USD -> EUR will be set to 1/2
                const reverse = this.rates.find(
                        r => r.from === rate.to && r.to === rate.from
                );
                if (reverse) {
                        await axios.put(
                            `http://localhost:5050/api/rates/${reverse.id}`, 
                            {
                                // changes the rate to be the reverse of the editedRate, limits denimal to 6 digits
                                ...reverse,
                                rate: parseFloat((1 / this.editedRate).toFixed(6))
                            },
                            this.getAuthHeader()
                        );
                }

                this.editingIndex = null;
                this.editedRate = null;

                console.log("Successfully edited a rate");

                this.$emit("ratesChanged");
                await this.fetchRates();

            } catch(error){
                console.log("Failed to edit rate: ", error);
            }

        },

        // deletes a row selected by the user from the backend
        async deleteRate(rate) {
            try{
                await axios.delete(
                    `http://localhost:5050/api/rates/${rate.id}`,
                    this.getAuthHeader()
                );

                // Also try deleting reverse
                const reverse = this.rates.find(
                    r => r.from === rate.to && r.to === rate.from
                );
                if (reverse) {

                    await axios.delete(
                        `http://localhost:5050/api/rates/${reverse.id}`,
                        this.getAuthHeader()
                
                    );
                }

                console.log("Successfully deleted a rate");

                this.$emit("ratesChanged");
                await this.fetchRates();

            }catch(error){
                console.log("Failed to delete element: ", error);
            }
        },

        // sends the backend a new row made by the user
        async insertRate() {
            try{
                if (
                    !this.newRate.from ||
                    !this.newRate.to ||
                    !this.newRate.rate ||
                    this.newRate.rate <= 0 || // double check that value given is not negative
                    this.newRate.from === this.newRate.to // check that from and to currencies are not the same
                ) return;

                const newRate = { ...this.newRate, rate: parseFloat(this.newRate.rate) };
                await axios.post(
                    "http://localhost:5050/api/rates", 
                    newRate,
                    this.getAuthHeader()
                );

                await axios.post(
                    "http://localhost:5050/api/rates", 
                    {
                    from: newRate.to,
                    to: newRate.from,
                    rate: parseFloat((1 / newRate.rate).toFixed(6))
                    },
                    this.getAuthHeader() 
                
                );

                console.log("Successfully inserted a new rate");
                this.newRate = { from: "", to: "", rate: null };

                this.$emit("ratesChanged");
                await this.fetchRates();
            
            }catch(error){
                console.log("Failed to insert rate: ", error);
            }
        }
    },
    mounted() {
        this.fetchRates();
    }
};
</script>

<style scoped>

    table {
        width: 100%;
        max-width: 1000px;
        box-sizing: border-box;
        border-spacing: 0; 
        margin-top: 1rem;
        border-radius: 10px;
        overflow: hidden; 
        table-layout: auto;
        border-spacing: 0;

        
    }

    .table-wrapper {
        margin-top: 20px;
        border-radius: 10px;
        max-height: 500px;
        width: 100%;
        max-width: 1000px;
        overflow-y: auto;
        overflow-x: hidden;
        display: block;
    }

    th, td {
        padding: 6px 10px;
        max-width: 150px;
        text-overflow: ellipsis;
        overflow: hidden;
        white-space: nowrap;
    }

    td span {
        display: inline-block;
        max-width: 100%;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    }

    tr:nth-child(even) {
        background-color: var(--offwhite);
    }

    tr:nth-child(odd) {
        background-color: white;
    }

    tr{
        width: fit-content;
    }


    th {
        background-color: var(--offwhite);
        text-align: left;
        font-weight: 500;
    }

    td button{
        background-color: transparent;
    }

    table input{
        background-color: white;
        border: 2px solid var(--offwhite);
        width: 100%;
        width: 150px;
        box-sizing: border-box;
    }

    table input:focus{
        border: 2px solid var(--accent);
    }

    .save-btn{
        width: 100%;
    }

    td:last-child {
        min-width: 150px;
        white-space: nowrap;
        display: flex;
        justify-content: space-between;
        gap: 10px;
    }

    @media (max-width: 800px) {

        .table-wrapper{
            max-width: 90vw;
            overflow-x: auto;
        }
    }

</style>
