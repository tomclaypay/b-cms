<template>
  <validation-observer ref="observer" class="kt-form config-form">
    <b-form @submit.prevent="validateAppVersionForm">
      <b-row>
        <b-col cols="5">
          <select2-with-validation
            :required="true"
            v-model="form.service"
            :error="vForm.errors.get('service')"
            :options="asrServiceOptions"
            label-align="right"
            label-cols-sm="5"
            label-cols-lg="5"
            placeholder="Chọn dịch vụ ASR ..."
            label="ASR service"
            data-vv-as="ASR service"
            name="service"
            rules="required"
        /></b-col>
        <b-col cols="5">
          <checkboxes-with-validation
            :required="true"
            v-model="form.prevent_auto_update"
            :error="vForm.errors.get('prevent_auto_update')"
            label="Prevent auto update"
            placeholder="Prevent auto update"
            rules="required"
            name="prevent_auto_update"
            switch
            size="lg"
            label-align="right"
            label-cols-sm="5"
            label-cols-lg="5"
        /></b-col>
        <b-col
          ><b-button :disabled="loading" type="submit" variant="primary"
            ><b-spinner v-show="loading" small class="mr-2"></b-spinner>Cập
            nhật</b-button
          ></b-col
        >
      </b-row>
    </b-form>
  </validation-observer>
</template>

<script>
import Form from 'vform'
import { ValidationObserver } from 'vee-validate'
import { cloneDeep } from 'lodash'
import { notifyTryAgain, notifyUpdateSuccess } from '~/utils/bootstrap-notify'
import Select2WithValidation from '~/components/base/input/Select2WithValidation'
import CheckboxesWithValidation from '~/components/base/input/CheckboxesWithValidation'

export default {
  name: 'ConfigAsrService',
  components: {
    CheckboxesWithValidation,
    Select2WithValidation,
    ValidationObserver
  },
  data() {
    return {
      loading: false,
      form: {
        value: {
          service: '',
          prevent_auto_update: false
        }
      },
      vForm: new Form(),
      asrServiceOptions: [
        {
          _id: 'azure',
          text: 'Azure'
        },
        {
          _id: 'aic',
          text: 'AIC'
        }
      ]
    }
  },
  created() {
    this.loadAsrService()
  },
  methods: {
    async loadAsrService() {
      try {
        const { data } = await this.$axios.post('config/get-asr-service')
        data.service = {
          _id: data.service,
          text: ''
        }
        this.form = data
      } catch (e) {}
    },
    async validateAppVersionForm() {
      const isValid = await this.$refs.observer.validate()
      if (isValid) {
        await this.updateAsrService()
      }
    },
    async updateAsrService() {
      try {
        this.loading = true
        const formData = cloneDeep(this.form)
        formData.service = formData.service._id
        this.vForm = new Form(formData)
        await this.vForm.post(
          this.$axios.defaults.baseURL + '/config/set-asr-service'
        )

        notifyUpdateSuccess('ASR service')
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
