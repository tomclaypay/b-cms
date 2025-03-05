<template>
  <div>
    <the-portlet>
      <b-row>
        <b-col :md="6">
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
        </b-col>
        <b-col :md="6">
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
        </b-col>
      </b-row>
    </the-portlet>
    <the-portlet :title="$t('transaction.title')">
      <template v-slot:tool>
        <button
          @click="$refs.exportModal.show()"
          type="button"
          class="btn btn-success ml-20 d-flex align-items-center"
        >
          <i class="la la-download"></i> {{$t('download_data')}}
        </button>
      </template>
      <data-table
        ref="table"
        :columns="columns"
        :order-column-index="1"
        :server-side="true"
        :actions="actions"
        :post-data="postData"
        :pageLength="25"
        url="/admin/transactions/list-for-datatable"
        order-type="desc"
      />

      <transaction-modal ref="modal" :on-action-success="updateItemSuccess" />
      <export-modal ref="exportModal" />
    </the-portlet>
  </div>
</template>

<script>
import ThePortlet from '~/components/base/ThePortlet'
import DataTable from '~/components/base/DataTable'
import { generateTableAction } from '~/utils/tableHelper'
import TransactionModal from '~/features/TransactionModal'
import { formatPrice } from '~/utils/formatString'
import { formatDateTimeNormal } from '~/utils/formatTime'
import { TRANSACTION_GET } from '~/constants/permissions'

export default {
  name: 'Transaction',
  permission: TRANSACTION_GET,
  components: {
    TransactionModal,
    DataTable,
    ThePortlet,
    TheSelect2: () => import('~/components/base/TheSelect2'),
    ExportModal: () => import('~/features/transaction/ExportModal')
  },
  head() {
    return {
      title: this.$t('transaction.title')
    }
  },
  meta: {
    pageTitle: 'transaction.title'
    // transaction: PERMISSION_MANAGEMENT
  },
  data() {
    return {
      columns: [
        {
          data: '_id',
          title: '_id',
          class: 'data-table-column-id'
        },
        {
          data: 'bankName',
          title: this.$t('bank.name')
        },
        {
          data: 'bankAccount',
          title: this.$t('bank.account')
        },
        {
          data: 'transactionType',
          title: this.$t('type')
        },
        {
          data: 'amount',
          title: this.$t('amount'),
          render(d) {
            return formatPrice(d)
          }
        },
        {
          data: 'reference',
          title: this.$t('reference')
        },
        {
          data: 'content',
          title: this.$t('content')
        },
        {
          data: null,
          title: 'Order',
          render(d, t, r) {
            return r.deposit
              ? `<a target="blank" href="/deposits/${r.deposit.id}">Deposit | ${r.deposit.code}</a>`
              : r.withdrawal
              ? `<a target="blank" href="/withdrawal/${r.withdrawal.id}">Withdrawal | ${r.withdrawal.code}</a>`
              : ''
          }
        },
        {
          data: 'created_time',
          title: this.$t('created_at'),
          render(d) {
            return formatDateTimeNormal(d)
          }
        },
        {
          data: 'updated_time',
          title: this.$t('updated_at'),
          render(d) {
            return formatDateTimeNormal(d)
          }
        },
        {
          data: null,
          title: this.$t('datatable.action_col'),
          responsivePriority: 1,
          orderable: false,
          className: 'text-center tb-actions',
          render() {
            return generateTableAction('preview', 'showDetail')
          }
        }
      ],
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
      postData: {
        type: -1,
        isMatched: -1
      },
      type: {
        id: -1,
        name: this.$t('all')
      },
      isMatched: {
        id: -1,
        name: this.$t('all')
      }
    }
  },
  computed: {
    actions() {
      return [
        {
          type: 'click',
          name: 'showDetail',
          action: this.showDetail
        }
      ]
    }
  },
  watch: {
    type(val) {
      this.$refs.table.setPage(0)
      this.postData.type = val.id

      this.$nextTick(() => {
        this.reloadTable()
      })
    },
    isMatched(val) {
      this.$refs.table.setPage(0)
      this.postData.isMatched = val.id

      this.$nextTick(() => {
        this.reloadTable()
      })
    }
  },
  methods: {
    showDetail(table, rowData) {
      this.$refs.modal.show(rowData)
    },
    showModal() {
      this.$refs.modal.show()
    },
    updateItemSuccess() {
      this.$refs.table.reload()
    },
    reloadTable() {
      this.$refs.table.reload()
    }
  }
}
</script>
