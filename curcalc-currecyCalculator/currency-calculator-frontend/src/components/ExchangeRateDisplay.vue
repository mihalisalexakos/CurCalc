

<template>
  <!-- shows the exchange rate between the 2 currencies -->
  <div class="rate" v-if="rate !== null">
    Rate: {{ rate }}
  </div>
</template>

<script>
export default {
  name: "ExchangeRateDisplay",
  props: {
    rate: Number
  }
};
</script>

    
<style>
    .rate{
        font-size: 0.7em;
        padding-right: 5px;
        background-color:  var(--offwhite);
        color: var(--shhtext);
        border-radius: 10px;
    }

</style>