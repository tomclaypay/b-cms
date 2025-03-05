<template>
  <el-select v-model="value" placeholder="Select" style="width: 300px">
    <el-option
      v-for="item in options"
      :key="item.value"
      :label="item.label"
      :value="item.value"
    >
    </el-option>
  </el-select>
</template>

<script>
import { mapMutations } from 'vuex'
import { timezone } from '@/constants/timezone'
export default {
  data() {
    return {
      options: timezone,
      value: 0 - new Date().getTimezoneOffset() / 60
    }
  },
  watch: {
    value(val) {
      console.log('timezone', val)
      this.setTimezoneOffset(val)
    }
  },
  mounted() {
    this.setTimezoneOffset(this.value)
  },
  methods: {
    ...mapMutations({
      setTimezoneOffset: 'layoutConfig/setTimezoneOffset'
    })
  }
}
</script>
