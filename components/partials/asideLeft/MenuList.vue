<template>
  <ul v-if="menuToDisplay.length > 0" class="kt-menu__nav">
    <!-- <business-chosen :item="businessMenu" /> -->
    <template v-for="(item, index) in menuToDisplay">
      <menu-section v-if="item.section" :key="index" :item="item" />
      <menu-item-separator v-if="item.separator" :key="index" />
      <menu-item v-if="item.title" :key="index" :item="item" />
    </template>
  </ul>
</template>

<script>
import { cloneDeep } from 'lodash'
import menuConfig from './MenuConfig'
import MenuSection from '~/components/partials/asideLeft/MenuSection'
import MenuItemSeparator from '~/components/partials/asideLeft/MenuItemSeparator'
import MenuItem from '~/components/partials/asideLeft/MenuItem'

export default {
  name: 'MenuList',
  components: { MenuItem, MenuItemSeparator, MenuSection },
  data() {
    return {
      menuConfig: cloneDeep(menuConfig),
      businessMenu: {
        bullet: 'dot',
        icon: 'flaticon2-cardiogram',
        submenu: [
          {
            page: '/referral-type',
            title: 'Loại referral'
          },
          {
            page: '/referral-type',
            title: 'Loại referral'
          }
        ],
        title: 'Business'
      }
    }
  },
  computed: {
    menuToDisplay() {
      return this.getDisplayMenus(this.menuConfig)
    }
  },
  methods: {
    getDisplayMenus(menus) {
      return menus.filter((item) => {
        if (item.submenu) {
          item.submenu = this.getDisplayMenus(item.submenu)
          return item.submenu.length > 0
        } else {
          return this.$canPermission(item.permission)
        }
      })
    }
  }
}
</script>
