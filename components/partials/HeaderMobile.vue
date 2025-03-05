<template>
  <div id="kt_header_mobile" class="kt-header-mobile  kt-header-mobile--fixed ">
    <div class="kt-header-mobile__logo">
      <nuxt-link to="/">
        <img alt="Logo" src="~/assets/media/logos/logo-4.png" />
      </nuxt-link>
    </div>
    <div class="kt-header-mobile__toolbar">
      <button
        id="kt_aside_mobile_toggler"
        @click="toggleAside"
        class="kt-header-mobile__toggler kt-header-mobile__toggler--left"
      >
        <span></span>
      </button>
    </div>
  </div>
</template>

<script>
import { mapMutations } from 'vuex'
export default {
  name: 'HeaderMobile',
  methods: {
    ...mapMutations({
      setAsideOn: 'layoutConfig/setAsideOn'
    }),
    toggleAside() {
      this.setAsideOn(true)
    }
  }
}
</script>
