<template>
  <!-- Custom dropdown for selecting the 2 currencies-->
  <div class="dropdown" v-outside="close" >
    <button class="dropdown-toggle" @click="toggle" v-html="selectedLabel">

    </button>
    <ul v-if="open" class="dropdown-menu" >
      <li
        v-for="currency in currencies"
        :key="currency.code"
        @click="select(currency)"
      >
        {{ currency.code }}
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  name: "CustomDropdown",
  props: {
    currencies: Array,
    modelValue: String
  },
  data() {
    return {
      open: false
    };
  },
    computed: {
        selectedLabel() {
            const found = this.currencies.find(c => c.code === this.modelValue);
            return found
            ? `${found.code}`
            : "Select Currency";
        }
    }
    ,
  methods: {
    toggle() {
      this.open = !this.open;
    },
    close() {
      this.open = false;
    },
    select(currency) {
      this.$emit("update:modelValue", currency.code);
      this.$emit("change", currency.code); 
      this.open = false;
    }
  },
  // clicking outside of the dropdown, closes the dropdown
  directives: {
    outside: {
      beforeMount(el, binding) {
        el.clickOutsideEvent = function (event) {
          if (!(el === event.target || el.contains(event.target))) {
            binding.value();
          }
        };
        document.addEventListener("click", el.clickOutsideEvent);
      },
      unmounted(el) {
        document.removeEventListener("click", el.clickOutsideEvent);
      }
    }
  }
};
</script>

<style scoped>
.dropdown {
    position: relative;
    display: inline-block;
    user-select: none;
}
.dropdown-toggle {
    padding: 8px 12px;
    font-size: 16px;
    cursor: pointer;
    background-color: var(--offwhite);
    border-radius: 10px;
}
.dropdown-menu {
    position: absolute;
    z-index: 10;
    background: var(--offwhite);
    border-radius: 10px;
    margin-top: 5px;
    list-style: none;

    width: fit-content;
    min-width: 80px;
    max-height: 200px;

    overflow-y: auto;

    padding: 0px;
    margin: 0px;
    
    display: flex;
    flex-direction: column;
    gap: 10px;
    overflow-x: hidden;

    font-size: 0.8em;
}
.dropdown-menu li {
    padding: 10px 20px;
    padding-left: 10px;
    width: 100%;
    color: var(--text);
    cursor: pointer;
    flex-wrap: wrap;
}
.dropdown-menu li:hover {
    background-color: var(--offwhiteHover);
}

</style>