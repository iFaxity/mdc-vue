<template lang="pug">
.mdc-app.mdc-typography(:class="cssClasses")
  slot(:name="navSlot")

  .mdc-app__content(:class="contentCssClasses")
    slot(:name="contentSlot")
    slot
</template>

<script>
export default {
  name: 'MDCApp',
  props: {
    flip: Boolean, // flips the drawer & toolbar slot
    drawerHideMobile: Boolean,
    alignStart: Boolean
  },
  computed: {
    navSlot() {
      return this.flip ? 'drawer' : 'nav';
    },
    contentSlot() {
      return this.flip ? 'nav' : 'drawer';
    },
    cssClasses() {
      return {
        'mdc-app--flipped': this.flip,
        'mdc-app--align-start': this.alignStart,
        'mdc-app--drawer-hide-mobile': this.drawerHideMobile
      };
    },
    contentCssClasses() {
      return this.alignStart && 'mdc-app__content--align-start';
    }
  },
  methods: {}
};
</script>