<template lang="pug">
.mdc-radio(:class="cssClasses")
  input.mdc-radio__native-control(ref="input", v-model="model", v-bind="$attrs", type="radio", :value="value", :disabled="disabled")
  .mdc-radio__background
    .mdc-radio__outer-circle
    .mdc-radio__inner-circle
</template>

<script>
import { MDCRadioFoundation } from '@material/radio';
import { Ripple } from '../ripple';

const rippleAdapter = {
  isSurfaceActive() {
    return false;
  },
  registerInteractionHandler(type, handler) {
    this.$refs.input.addEventListener(type, handler);
  },
  deregisterInteractionHandler(type, handler) {
    this.$refs.input.removeEventListener(type, handler)
  }
};

export default {
  name: 'MDCRadio',
  mixins: [ Ripple(rippleAdapter, { unbounded: true }) ],
  inheritAttrs: false,
  model: {
    prop: 'checked',
    event: 'change',
  },

  props: {
    disabled: Boolean,
    checked: [Boolean, String],
    value: {
      type: String,
      required: true
    }
  },
  computed: {
    model: {
      get() {
        return this.checked;
      },
      set(value) {
        this.$emit('change', value);
      }
    }
  },
  mounted() {
    const { $el } = this;

    this.foundation = new MDCRadioFoundation({
      addClass: className => $el.classList.add(className),
      removeClass: className => $el.classList.remove(className),
      getNativeControl: () => this.$refs.input
    });
    this.foundation.init();
  },
  beforeDestroy() {
    this.foundation.destroy();
  }
};
</script>