<template>
  <el-button
    @click="translate(name)"
    :disabled="!text.vi && !text.en"
    type="primary"
    size="mini"
    class="mb-10"
    plain
  >
    <i class="fa fa-language mr-10" aria-hidden="true"></i>{{ label }}
  </el-button>
</template>

<script>
import { notifyTryAgain } from '~/utils/bootstrap-notify'
export default {
  props: {
    name: {
      type: String,
      default: null
    },
    label: {
      type: String,
      default: null
    },
    text: {
      type: Object,
      default: () => {}
    }
  },
  methods: {
    async translate(key) {
      try {
        const { data } = await this.$axios.post('/translate/get', {
          format: key === 'content' ? 'html' : 'text',
          target: this.text.vi ? 'en' : 'vi',
          q: this.text.vi ? this.text.vi : this.text.en
        })
        this.$emit('onSuccess', {
          key,
          value: {
            vi: this.text.vi ? this.text.vi : data.text,
            en: this.text.vi ? data.text : this.text.en
          }
        })
      } catch (e) {
        if (e.response) {
          if (status !== 422) {
            notifyTryAgain()
          }
        } else {
          notifyTryAgain()
        }
      }
    }
  }
}
</script>
