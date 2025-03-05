<template>
  <div class="carousel-box">
    <client-only>
      <swiper
        ref="swiperTop"
        :options="swiperOptionTop"
        class="swiper gallery-top"
      >
        <swiper-slide
          v-for="(item, index) in images"
          :key="index"
          class="slide"
        >
          <img :src="item" />
        </swiper-slide>
        <div slot="button-prev" class="swiper-button-prev"></div>
        <div slot="button-next" class="swiper-button-next"></div>
      </swiper>
      <!-- swiper2 Thumbs -->
      <swiper
        ref="swiperThumbs"
        :options="swiperOptionThumbs"
        class="swiper gallery-thumbs"
      >
        <swiper-slide
          v-for="(item, index) in images"
          :key="index"
          class="slide"
        >
          <div class="img-box">
            <img :src="item" />
          </div>
        </swiper-slide>
      </swiper>
    </client-only>
  </div>
</template>

<script>
export default {
  props: {
    images: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      swiperOptionTop: {
        loopedSlides: 5, // looped slides should be the same
        spaceBetween: 10,
        navigation: {
          nextEl: '.swiper-button-next',
          prevEl: '.swiper-button-prev'
        }
      },
      swiperOptionThumbs: {
        loopedSlides: 5, // looped slides should be the same
        spaceBetween: 10,
        centeredSlides: true,
        slidesPerView: 4,
        touchRatio: 0.2,
        slideToClickedSlide: true
      }
    }
  },
  mounted() {
    this.$nextTick(() => {
      const swiperTop = this.$refs.swiperTop.$swiper
      const swiperThumbs = this.$refs.swiperThumbs.$swiper
      swiperTop.controller.control = swiperThumbs
      swiperThumbs.controller.control = swiperTop
    })
  }
}
</script>
