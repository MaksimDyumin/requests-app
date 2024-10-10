<template>
  <div ref="field_container" class="field-container">
    <label class="input-label-auth" :style="labelStyles">{{ labelText }}</label>
    <div class="input-container">
      <v-icon ref="icon_start_element" class="icon" :icon="iconNameStart"></v-icon>
      <input :value="value" @input="emitValue($event.target.value)" :placeholder="placeholder" v-if="type === 'tel'"
        v-mask="'+7 (###) ###-####'" id="telNum" type="text" :disabled="disabled" />
      <input :value="value" @input="emitValue($event.target.value)" :placeholder="placeholder" v-if="type === 'pass'"
        id="password" :type="showPassword ? 'text' : 'password'" :disabled="disabled" />
      <input :value="value" @input="emitValue($event.target.value)" :placeholder="placeholder" v-if="type === 'text'"
        id="text" type="text" :disabled="disabled" />
      <div v-if="type === 'pass'" @click="togglePasswordVisibility">
        <v-icon ref="icon_end_element" class="icon" :icon="'mdi:' + (showPassword ? 'eye' : 'eye-off')"></v-icon>
      </div>
      <v-icon v-else ref="icon_end_element" class="icon" :icon="iconNameEnd"></v-icon>
    </div>
  </div>

</template>

<script>
export default {
  name: 'InputDefault',
  props: {
    iconNameStart: String,
    iconNameEnd: String,
    labelText: String,
    type: String,
    value: String,
    placeholder: String,
    disabled: Boolean,
    labelStyles: Object,
  },
  data() {
    return {
      form: {
        telephone: '+7'
      },
      inputValue: '',
      showPassword: false
    }
  },
  methods: {
    emitValue(newVal) {
      this.$emit('input', newVal)
    },
    togglePasswordVisibility() {
      if (this.type === 'pass') {
        this.showPassword = !this.showPassword;
      }
    }
  },
  computed: {
    telephone() {
      return this.form.telephone
    },
  },
  watch: {
    telephone(newVal) {
      this.$emit('update:newVal', newVal)
    },
    inputValue(newVal) {
      this.$emit('update:newVal', newVal)
    }
  },
  mounted() {
    if (!this.labelText) {
      this.$refs.field_container.style.justifyContent = 'end'
    }
    if (!this.iconNameStart) {
      this.$refs.icon_start_element.$el.style.display = 'none'
    }
    if (!this.iconNameEnd) {
      this.$refs.icon_end_element.$el.style.display = 'none'
    }
  },
}
</script>

<style scoped lang="scss">
$underline-color: #CCCCCC;
$main-color: #50B053;

.field-container {
  height: 56px;
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  border-bottom: 1px solid $underline-color;

  .input-container {
    height: 37px;
    display: flex;
    align-items: center;

    .icon {
      width: 24px;
      height: 24px;
    }

    input {
      width: 100%;
      height: 37px;
      margin-top: auto;
      outline: none;
      border: none;
      padding: 2px 8px;
    }
  }

  .input-label-auth {
    font-size: 12px;
    line-height: 18px;
    color: $main-color;
    margin-left: 32px;
  }
}
</style>
