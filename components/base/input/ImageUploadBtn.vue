<template>
  <b-button variant="primary" class="file-btn">
    <div v-if="loading">
      <b-spinner small></b-spinner>
      uploading...
    </div>
    <template v-else>
      Ảnh nền
      <input
        @change="upload"
        type="file"
        name="avatar"
        accept="image/png"/></template
  ></b-button>
</template>

<script>
import { notify } from '~/utils/bootstrap-notify'

export default {
  name: 'ImageUploadBtn',
  data() {
    return {
      loading: false
    }
  },
  methods: {
    upload(event) {
      const file = event.target.files[0]
      const isIMG = ['image/jpeg', 'image/png', 'image/jpg'].includes(file.type)
      const isLt5M = file.size / 1024 / 1024 < 5

      if (!isIMG) {
        notify('Thông báo', 'Ảnh phải có định dạng jpeg,png,jpg!')
      }
      if (!isLt5M) {
        notify('Thông báo', 'Ảnh phải có kích thước nhỏ hơn 5MB!')
      }

      const img = new Image()

      img.src = window.URL.createObjectURL(file)

      img.onload = () => {
        const width = img.naturalWidth
        const height = img.naturalHeight

        window.URL.revokeObjectURL(img.src)

        if (width === 1440 && height === 1080) {
          this.uploadToserver(file)
        } else {
          this.uploadToserver(file)
          notify('Thông báo', 'Ảnh phải có kích thước 1440x1080!')
        }
      }
    },
    async uploadToserver(file) {
      try {
        this.loading = true
        const formData = new FormData()
        formData.append('image', file)
        const { data } = await this.$axios.post(
          '/media/upload-single-image',
          formData,
          {
            headers: {
              'Content-Type': 'multipart/form-data'
            }
          }
        )
        this.$emit('uploadSuccess', data.filePath)
      } catch (e) {}
      this.loading = false
    }
  }
}
</script>
