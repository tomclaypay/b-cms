<template>
  <select2-with-validation
    :required="required"
    v-model="role"
    :error="error"
    :multiple="multiple"
    :searchable="false"
    v-bind="$attrs"
    placeholder="Chọn một nhóm người dùng..."
    label="Nhóm người dùng"
    data-vv-as="Nhóm người dùng"
    id-field="id"
    text-field="title"
    ajax="/admin/roles/suggest"
    name="role"
  />
</template>

<script>
import Select2WithValidation from '~/components/base/input/Select2WithValidation'
export default {
  name: 'RoleChosen',
  components: { Select2WithValidation },
  props: {
    error: {
      type: String,
      default: ''
    },
    value: {
      type: [Object, Array],
      default: null
    },
    multiple: {
      type: Boolean,
      default: false
    },
    required: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      role: null
    }
  },
  watch: {
    role(val) {
      this.$emit('input', val)
    },
    value(newVal, oldVal) {
      if (newVal) {
        if (!oldVal || (oldVal && newVal.id !== oldVal.id)) {
          this.role = newVal
        }
      } else {
        this.role = newVal
      }
    }
  },
  created() {
    if (this.value) {
      this.$nextTick(() => (this.role = this.value))
    }
  }
}
</script>
