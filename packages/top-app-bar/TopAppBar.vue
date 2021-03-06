<template lang="pug">
header.mdc-top-app-bar(:class="cssClasses")
  .mdc-top-app-bar__row
    mdc-top-app-bar-section(align-start)
      a.material-icons.mdc-top-app-bar__navigation-icon(v-if="navIcon", ref="navIcon", href="#") {{ navIcon }}
      span.mdc-top-app-bar__title(v-if="title") {{ title }}

    mdc-top-app-bar-section(v-if="hasSlot", align-end)
      slot
</template>

<script>
import { MDCTopAppBarFoundation, MDCFixedTopAppBarFoundation, MDCShortTopAppBarFoundation } from '@material/top-app-bar';
import Section from './TopAppBarSection.vue';

const FIXED_ADJUST_CLASSES = [
  'fixed-adjust',
  'dense-fixed-adjust',
  'short-fixed-adjust',
  'prominent-fixed-adjust',
  'dense-prominent-fixed-adjust',
];

export default {
  name: 'MDCTopAppBar',
  components: { MdcTopAppBarSection: Section },
  props: {
    short: Boolean,
    shortCollapsed: Boolean,
    fixed: Boolean,
    prominent: Boolean,
    title: String,
    navIcon: {
      type: String,
      default: 'menu'
    },
  },

  computed: {
    cssClasses() {
      // Don't allow options when the bar is of the type short
      if(this.short) {
        return {
          'mdc-top-app-bar--short': this.short,
          'mdc-top-app-bar--short-collapsed': this.shortCollapsed,
        };
      }

      return {
        'mdc-top-app-bar--dense': this.dense,
        'mdc-top-app-bar--fixed': this.fixed,
        'mdc-top-app-bar--prominent': this.prominent,
      };
    },
    hasSlot() {
      return !!this.$slots.default;
    }
  },

  mounted() {
    const { $el } = this;

    const adapter = {
      hasClass: className => $el.classList.contains(className),
      addClass: className => $el.classList.add(className),
      removeClass: className => $el.classList.remove(className),
      setStyle: (prop, value) => $el.style.setProperty(prop, value),
      getTopAppBarHeight: () => $el.clientHeight,
      registerNavigationIconInteractionHandler: (type, handler) => {
        const { navIcon } = this.$refs;
        navIcon && navIcon.addEventListener(type, handler);
      },
      deregisterNavigationIconInteractionHandler: (type, handler) => {
        const { navIcon } = this.$refs;
        navIcon && navIcon.removeEventListener(type, handler);
      },
      notifyNavigationIconClicked: () => this.$emit('nav'),
      registerScrollHandler: handler => window.addEventListener('scroll', handler),
      deregisterScrollHandler: handler => window.removeEventListener('scroll', handler),
      registerResizeHandler: handler => window.addEventListener('resize', handler),
      deregisterResizeHandler: handler => window.removeEventListener('resize', handler),
      getViewportScrollY: () => window.pageYOffset,
      
      // Check if this works with 'preserveWhitespace' to true
      getTotalActionItems: () => this.$slots.default.filter(n => !!n.tag).length,
    };

    // Create foundation instance
    if (this.short) {
      this.foundation = new MDCShortTopAppBarFoundation(adapter);
    } else if (this.fixed) {
      this.foundation = new MDCFixedTopAppBarFoundation(adapter);
    } else {
      this.foundation = new MDCTopAppBarFoundation(adapter);
    }

    this.$_addAdjustClass();
    this.foundation.init();
  },
  beforeDestroy() {
    if(this.$_fixedAdjust) {
      this.$_fixedAdjust.classList.remove(this.$_fixedAdjustClass);
    }
    this.foundation.destroy();
  },
  methods: {
    $_addAdjustClass() {
      // Add fixed adjust class
      if(!this.$el.nextElementSibling) return;

      let adjustClassIndex = 0;
      if(this.short) {
        adjustClassIndex = 2;
      } else if(this.dense) {
        adjustClassIndex = this.prominent ? 4 : 1;
      } else if(this.prominent) {
        adjustClassIndex = 3
      }
      
      this.$_fixedAdjustClass = 'mdc-top-app-bar--' + FIXED_ADJUST_CLASSES[adjustClassIndex];
      this.$_fixedAdjust = this.$el.nextElementSibling;
      this.$_fixedAdjust.classList.add(this.$_fixedAdjustClass);
    }
  }
};
</script>