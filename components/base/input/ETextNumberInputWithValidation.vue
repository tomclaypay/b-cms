<template>
  <validation-provider
    :vid="vid"
    :name="$attrs.label ? $attrs.label : $attrs['label-name']"
    :rules="rules"
    v-slot="{ errors }"
  >
    <b-form-group
      v-bind="$attrs"
      :label-class="required ? 'required' : null"
      :class="formClass"
      class="e-text-input-number"
    >
      <el-input-number
        v-model="innerValue"
        @change="emitValue"
        v-bind="$attrs"
        :controls-position="controlsPosition"
      ></el-input-number>
      <b-form-invalid-feedback>{{
        errors[0] || error
      }}</b-form-invalid-feedback>
    </b-form-group>
  </validation-provider>
</template>

<script>
import { ValidationProvider } from 'vee-validate'

export default {
  components: {
    ValidationProvider
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
    },
    disabled: {
      type: Boolean,
      default: false
    },
    formClass: {
      type: String,
      default: null
    },
    lazy: {
      type: Boolean,
      default: false
    },
    controlsPosition: {
      type: String,
      default: 'right'
    }
  },
  data: () => ({
    innerValue: ''
  }),
  watch: {
    innerValue(newVal) {
      if (!this.lazy) {
        this.$emit('input', newVal)
      }
    },
    value(newVal) {
      this.innerValue = newVal
    }
  },
  created() {
    this.innerValue = this.value
  },
  methods: {
    emitValue() {
      if (this.lazy) {
        this.$emit('input', this.innerValue)
      }
    },
    focus() {
      this.$refs.inputForm.focus()
    }
  }
}
</script>

<style lang="scss">
.e-text-input-number {
  .el-input-number {
    width: 100%;
  }

  .el-input__inner {
    text-align: left;
  }
}
</style>
