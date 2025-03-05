<template>
  <validation-provider
    :vid="vid"
    :name="$attrs.label"
    :rules="rules"
    v-slot="{ valid, errors }"
  >
    <b-form-group v-bind="$attrs" :label-class="required ? 'required' : null">
      <date-time-picker
        v-model="innerValue"
        v-bind="$attrs"
        :class="[error || errors.length > 0 ? 'is-invalid' : null]"
        class="form-control"
      >
      </date-time-picker>
      <b-form-invalid-feedback>{{
        errors[0] || error
      }}</b-form-invalid-feedback>
    </b-form-group>
  </validation-provider>
</template>

<script>
import moment from 'moment'
import { ValidationProvider } from 'vee-validate'
import DateTimePicker from '~/components/base/DateTimePicker'

export default {
  name: 'BDateRangeWithValidation',
  components: {
    ValidationProvider,
    DateTimePicker
  },
  props: {
    vid: {
      type: String,
      default: null
    },
    rules: {
      type: [Object, String],
      default: ''
    },
    value: {
      type: null,
      default: null
    },
    error: {
      type: String,
      default: null
    },
    required: {
      type: Boolean,
      default: false
    }
  },
  data: () => ({
    innerValue: null
  }),
  watch: {
    innerValue(newVal) {
      this.$emit('input', moment(newVal).valueOf())
    }
  },
  created() {
    this.innerValue = moment(this.value).valueOf()
  }
}
</script>
