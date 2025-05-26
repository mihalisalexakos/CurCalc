

<template>
  <input
    type="number"
    min="0"
    :value="modelValue"
    @input="handleInput"
  />
</template>

<script>
export default {
  name: "AmountInput",
  props: ["modelValue"],
  methods: {

    handleInput(event) {

      const value = parseFloat(event.target.value);
      //make sure that value given is not a negative number
      if (value >= 0 || event.target.value === "") {

        this.$emit("update:modelValue", value);
        
      } else {

        event.target.value = this.modelValue ?? 0;
      }
    }
  }
};
</script>
