<template>
  <div class="kt-grid kt-grid--ver kt-grid--root">
    <div
      :style="
        `background-image:url(${require('~/assets/media/error/bg5.jpg')})`
      "
      class="kt-grid__item kt-grid__item--fluid kt-grid kt-error-v2"
    >
      <div class="kt-error_container">
        <span class="kt-error_title2">
          <h1>Oops!</h1>
        </span>
        <span class="kt-error_desc">
          Có lỗi xảy ra, xin vui lòng thử lại sau..
        </span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Error500',
  props: {
    error: {
      type: Object,
      default: () => {}
    }
  },
  head() {
    return {
      title: 'Lỗi 500'
    }
  }
}
</script>
