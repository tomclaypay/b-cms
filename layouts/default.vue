<template>
  <div>
    <header-mobile />
    <div v-if="asideOn" @click="hideAside" class="kt-aside-overlay" />
    <div class="kt-grid kt-grid--hor kt-grid--root">
      <div
        class="kt-grid__item kt-grid__item--fluid kt-grid kt-grid--ver kt-page"
      >
        <button
          id="kt_aside_close_btn"
          @click="hideAside"
          :class="asideOn ? 'kt-aside-close__show' : ''"
          class="kt-aside-close"
        >
          <i class="la la-close"></i>
        </button>
        <aside-left />

        <div
          id="kt_wrapper"
          class="kt-grid__item kt-grid__item--fluid kt-grid kt-grid--hor kt-wrapper"
        >
          <main-header />

          <div
            id="kt_content"
            class="kt-content  kt-grid__item kt-grid__item--fluid kt-grid kt-grid--hor"
          >
            <div
              class="kt-container kt-container--fluid kt-grid__item kt-grid__item--fluid"
            >
              <nuxt />
            </div>
          </div>
        </div>
      </div>
    </div>
    <scroll-top />
    <!-- <ul class="kt-sticky-toolbar" style="margin-top: 30px;">
      <li
        class="kt-sticky-toolbar__item kt-sticky-toolbar__item--warning"
        data-toggle="kt-tooltip"
        title="Hướng dẫn"
        data-placement="left"
        data-original-title="Hướng dẫn"
      >
        <nuxt-link to="/" title="Trang chủ">
          <i class="flaticon2-open-text-book"></i>
        </nuxt-link>
      </li>
    </ul> -->
  </div>
</template>
<script>
import { mapState, mapMutations } from 'vuex'
import HeaderMobile from '~/components/partials/HeaderMobile'
import ScrollTop from '~/components/partials/ScrollTop'
import AsideLeft from '~/components/partials/asideLeft/AsideLeft'
import MainHeader from '~/components/partials/header/MainHeader'

export default {
  components: { MainHeader, AsideLeft, ScrollTop, HeaderMobile },
  middleware: 'auth',
  computed: {
    ...mapState({
      asideMinimize: (state) => state.layoutConfig.aside.minimize,
      asideOn: (state) => state.layoutConfig.aside.on
    })
  },

  head() {
    return {
      bodyAttrs: {
        spellcheck: 'false',
        class: `kt-quick-panel--right kt-demo-panel--right kt-offcanvas-panel--right kt-header--fixed kt-header-mobile--fixed kt-aside--enabled kt-aside--fixed kt-header-base-light kt-header-menu-light kt-brand-dark kt-aside-dark ${this
          .asideMinimize && 'kt-aside--minimize'}`
        // 'kt-quick-panel--right kt-demo-panel--right kt-offcanvas-panel--right kt-header--fixed kt-header-mobile--fixed kt-aside--enabled kt-aside--fixed kt-header-base-light kt-header-menu-light kt-brand-dark kt-aside-dark kt-aside--minimize'
      }
    }
  },
  methods: {
    ...mapMutations({
      setAsideOn: 'layoutConfig/setAsideOn'
    }),
    hideAside() {
      this.setAsideOn(false)
    }
  }
}
</script>

<style lang="scss">
.kt-aside-close {
  &__show {
    left: 250px;
  }

  &__show {
    left: 250px;
  }
}
</style>
