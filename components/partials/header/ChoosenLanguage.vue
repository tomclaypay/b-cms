<template>
  <div>
    <a @click.prevent.stop="$i18n.setLocale('vi')" href="#">VN</a>
    <a @click.prevent.stop="$i18n.setLocale('en')" href="#">EN</a>
  </div>
</template>

<script>
export default {
  name: 'ChoosenLanguage'
}
</script>
