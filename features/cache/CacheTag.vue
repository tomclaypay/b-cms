<template>
  <validation-observer ref="observer" class="kt-form">
    <b-form @submit.prevent="validateAppVersionForm">
      <b-row>
        <b-col cols="10"
          ><b-text-input-with-validation
            v-model="form.value"
            :required="true"
            :error="vForm.errors.get('value')"
            label-cols="2"
            label="Tag"
            placeholder="Tag"
            rules="required"
            name="value"
        /></b-col>
        <b-col
          ><b-button type="submit" variant="primary" :disabled="loading"
            ><b-spinner v-show="loading" small class="mr-2"></b-spinner
            >Xóa</b-button
          ></b-col
        >
      </b-row>
    </b-form>
  </validation-observer>
</template>

<script>
import Form from 'vform'
import { ValidationObserver } from 'vee-validate'
import { notifyTryAgain, notifyDeleteSuccess } from '~/utils/bootstrap-notify'
import BTextInputWithValidation from '~/components/base/input/BTextInputWithValidation'

export default {
  name: 'CacheTag',
  components: {
    BTextInputWithValidation,
    ValidationObserver
  },
  data() {
    return {
      loading: false,
      form: {},
      vForm: new Form()
    }
  },
  methods: {
    async validateAppVersionForm() {
      const isValid = await this.$refs.observer.validate()
      if (isValid) {
        await this.updateAppVerion()
      }
    },
    async updateAppVerion() {
      try {
        this.loading = true
        this.vForm = new Form(this.form)
        await this.vForm.post(this.$axios.defaults.baseURL + '/cache/clear-tag')

        notifyDeleteSuccess('Tag')
      } catch (e) {
        if (e.response) {
          if (status !== 422) {
            notifyTryAgain()
          }
        } else {
          notifyTryAgain()
        }
      }
      this.loading = false
    }
  }
}
</script>
