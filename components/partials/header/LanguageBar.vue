<template>
  <b-dropdown
    ref="dropdown"
    class="kt-header__topbar-item kt-header__topbar-item--langs"
    no-caret
    right
    menu-class="dropdown-menu-fit dropdown-menu-right dropdown-menu-anim dropdown-menu-top-unround"
  >
    <template v-slot:button-content>
      <div class="d-flex">
        <timezone-picker />
        <div
          class="kt-header__topbar-wrapper ml-20"
          data-toggle="dropdown"
          data-offset="10px,0px"
        >
          <span class="kt-header__topbar-icon">
            <img :src="languageImg" class="" alt="" />
          </span>
        </div>
      </div>
    </template>

    <template v-slot:default>
      <div class="kt-nav">
        <li
          :class="{ 'kt-nav__item--active': $i18n.locale === 'vi' }"
          class="kt-nav__item"
        >
          <div @click="onSwitch('vi')" class="kt-nav__link">
            <span class="kt-nav__link-icon"
              ><img src="~/assets/media/flags/vi.svg" alt=""
            /></span>
            <span class="kt-nav__link-text">Tiếng Việt</span>
          </div>
        </li>
        <li
          :class="{ 'kt-nav__item--active': $i18n.locale === 'en' }"
          class="kt-nav__item"
        >
          <div @click="onSwitch('en')" class="kt-nav__link">
            <span class="kt-nav__link-icon"
              ><img src="~/assets/media/flags/en.svg" alt=""
            /></span>
            <span class="kt-nav__link-text">English</span>
          </div>
        </li>
      </div>
    </template>
  </b-dropdown>
</template>

<script>
import TimezonePicker from '~/components/base/TimezonePicker'
const viFlag = require('~/assets/media/flags/vi.svg')
const enFlag = require('~/assets/media/flags/en.svg')
export default {
  name: 'LanguageBar',
  components: { TimezonePicker },
  data() {
    return {
      scrollOptions: { wheelSpeed: 2, wheelPropagation: false },
      viFlag,
      enFlag
    }
  },
  computed: {
    languageImg() {
      if (this.$i18n.locale === 'vi') {
        return viFlag
      }

      return enFlag
    }
  },

  methods: {
    onSwitch(lang) {
      // this.$router.push(this.switchLocalePath(lang))
      this.$refs.dropdown.hide()
      this.$i18n.locale = lang
      window.location.replace(this.switchLocalePath(lang))
      // this.$nextTick(() => {
      //   window.location.reload(true)
      // })
    }
  }
}
</script>
