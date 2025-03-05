<template>
  <b-modal ref="modal" :busy="false" title="Export Withdrawal" size="md">
    <b-form-group :label="$t('type')">
      <the-select2
        v-model="isManual"
        :has-all-option="true"
        :options="typeOptions"
        :searchable="false"
        :placeholder="$t('type')"
        :data-vv-as="$t('type')"
        id-field="id"
        text-field="text"
      />
    </b-form-group>
    <b-form-group :label="$t('status')">
      <the-select2
        v-model="status"
        :searchable="false"
        :has-all-option="true"
        :options="statusOptions"
        :placeholder="$t('status')"
        :data-vv-as="$t('status')"
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
        name="Withdrawals.csv"
        :escapeCsv="false"
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
          id: 'manual',
          text: this.$t('manual')
        },
        {
          id: 'auto',
          text: this.$t('auto')
        }
      ],
      statusOptions: [
        {
          id: -1,
          text: this.$t('all')
        },
        {
          id: 'PENDING',
          text: this.$t('pending')
        },
        {
          id: 'SUCCEED',
          text: this.$t('succeed')
        },
        {
          id: 'CANCELED',
          text: this.$t('canceled')
        },
        {
          id: 'FAILED',
          text: this.$t('failed')
        }
      ],
      isManual: {
        id: -1,
        name: this.$t('all')
      },
      status: {
        id: -1,
        name: this.$t('all')
      },
      json_fields: {
        'Created At': {
          field: 'createdAt',
          callback: (value) => {
            return moment(value).format('YYYY/MM/DD HH:mm')
          }
        },
        'MT5 ID': {
          field: 'mt5Id',
          callback: (value) => {
            return value.trim().split('\t')[0]
          }
        },
        Code: 'code',
        Ref: 'ref',
        Amount: 'amount',
        Fee: 'fee',
        'Is Manual': 'isManual',
        Status: 'status',
        Note: {
          field: 'note',
          callback: (value) => {
            return value.replace(/[\n\t]/g, '')
          }
        },
        Callback: 'callback',
        'Bank reference': 'transaction.reference',
        'Updated At': {
          field: 'updatedAt',
          callback: (value) => {
            return moment(value).format('YYYY/MM/DD HH:mm')
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
        '/admin/withdrawals/list-for-export',
        {
          startDate: convertToNewTimezone(this.timeRange[0]),
          endDate: convertToNewTimezone(this.timeRange[1]),
          isManual: this.isManual.id,
          status: this.status.id
        }
      )
      return data
    }
  }
}
</script>
