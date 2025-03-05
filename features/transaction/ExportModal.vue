<template>
  <b-modal ref="modal" :busy="false" title="Export Deposits" size="md">
    <b-form-group :label="$t('type')">
      <the-select2
        v-model="type"
        :has-all-option="true"
        :options="typeOptions"
        :searchable="false"
        :placeholder="$t('type')"
        :data-vv-as="$t('type')"
        id-field="id"
        text-field="text"
      />
    </b-form-group>
    <b-form-group label="Trạng thái khớp lệnh">
      <the-select2
        v-model="isMatched"
        :has-all-option="true"
        :options="matchOptions"
        :searchable="false"
        placeholder="Trạng thái khớp lệnh"
        data-vv-as="Trạng thái khớp lệnh"
        id-field="id"
        text-field="text"
      />
    </b-form-group>
    <b-form-group :label="$t('range_date')">
      <DateRangePicker v-model="timeRange" />
    </b-form-group>
    <template #modal-footer="">
      <download-excel
        :fetch="fetchData"
        :fields="json_fields"
        class="btn btn-success ml-20"
        type="csv"
        name="Deposits.csv"
      >
        Tải về
      </download-excel>
    </template>
  </b-modal>
</template>

<script>
import moment from 'moment'
import { convertToNewTimezone } from '~/utils/formatTime'
export default {
  name: 'ExportUserModal',
  components: {
    DateRangePicker: () => import('~/components/base/DateRangePicker'),
    TheSelect2: () => import('~/components/base/TheSelect2')
  },
  data() {
    return {
      timeRange: [moment().startOf('month'), moment().endOf('day')],
      typeOptions: [
        {
          id: -1,
          text: this.$t('all')
        },
        {
          id: 'DEBIT',
          text: 'DEBIT'
        },
        {
          id: 'CREDIT',
          text: 'CREDIT'
        }
      ],
      matchOptions: [
        {
          id: -1,
          text: 'Tất cả'
        },
        {
          id: 1,
          text: 'Đã khớp lệnh'
        },
        {
          id: 0,
          text: 'Chưa khớp lệnh'
        }
      ],
      type: {
        id: -1,
        name: this.$t('all')
      },
      isMatched: {
        id: -1,
        name: this.$t('all')
      },
      json_fields: {
        'Created At': {
          field: 'created_time',
          callback: (value) => {
            return value && `${moment(value).format('DD/MM/YYYY HH:mm')}`
          }
        },
        'Bank Name': 'bankName',
        'Bank Account': 'bankAccount',
        Type: 'transactionType',
        Amount: 'amount',
        Reference: 'reference',
        Note: 'content',
        'Updated At': {
          field: 'updated_time',
          callback: (value) => {
            return value && `${moment(value).format('DD/MM/YYYY HH:mm')}`
          }
        }
      }
    }
  },
  methods: {
    show() {
      this.$refs.modal.show()
    },
    async fetchData() {
      const { data } = await this.$axios.post(
        '/admin/transactions/list-for-export',
        {
          startDate: convertToNewTimezone(this.timeRange[0]),
          endDate: convertToNewTimezone(this.timeRange[1]),
          type: this.type.id,
          isMatched: this.isMatched.id,
          length: -1
        }
      )
      return data
    }
  }
}
</script>
