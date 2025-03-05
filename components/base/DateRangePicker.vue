<template>
  <el-date-picker
    v-model="selected"
    :picker-options="pickerOptions"
    :default-time="['00:00:00', '23:59:59']"
    :range-separator="$t('date_picker.to')"
    :start-placeholder="$t('date_picker.start_date')"
    :end-placeholder="$t('date_picker.end_date')"
    format="dd/MM/yyyy"
    value-format="timestamp"
    type="daterange"
    align="right"
    unlink-panels
  >
  </el-date-picker>
</template>

<script>
import moment from 'moment'

export default {
  name: 'DateRangePicker',
  props: {
    value: {
      type: Array,
      require: true
    }
  },
  data() {
    return {
      selected: [null, null],
      pickerOptions: {
        shortcuts: [
          {
            text: 'Hôm nay',
            onClick(picker) {
              picker.$emit('pick', [
                moment().startOf('day'),
                moment().endOf('day')
              ])
            }
          },
          {
            text: '7 ngày trước',
            onClick(picker) {
              picker.$emit('pick', [
                moment()
                  .startOf('day')
                  .subtract(6, 'day'),
                moment().endOf('day')
              ])
            }
          },
          {
            text: '30 ngày trước',
            onClick(picker) {
              picker.$emit('pick', [
                moment()
                  .startOf('day')
                  .subtract(29, 'day'),
                moment().endOf('day')
              ])
            }
          },
          {
            text: 'Tuần này',
            onClick(picker) {
              picker.$emit('pick', [
                moment().startOf('week'),
                moment().endOf('day')
              ])
            }
          },
          {
            text: 'Tuần trước',
            onClick(picker) {
              picker.$emit('pick', [
                moment()
                  .subtract(1, 'week')
                  .startOf('week'),
                moment()
                  .subtract(1, 'week')
                  .endOf('week')
              ])
            }
          },
          {
            text: 'Tháng trước',
            onClick(picker) {
              picker.$emit('pick', [
                moment()
                  .subtract(1, 'month')
                  .startOf('month'),
                moment()
                  .subtract(1, 'month')
                  .endOf('month')
              ])
            }
          }
        ]
      }
    }
  },
  watch: {
    selected(val) {
      if (val) {
        this.$emit('input', [
          moment(val[0]).toISOString(),
          moment(val[1]).toISOString()
        ])
      } else {
        this.$emit('input', [null, null])
      }
    }
  },
  created() {
    if (this.value) {
      this.selected = [
        moment(this.value[0]).valueOf(),
        moment(this.value[1]).valueOf()
      ]
    }
  }
}
</script>
