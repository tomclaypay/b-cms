<template>
  <div>
    <the-portlet title="Card Transaction">
      <data-table
        ref="table"
        :columns="columns"
        :order-column-index="1"
        :server-side="true"
        :actions="actions"
        :post-data="postData"
        :pageLength="25"
        url="/admin/card-transactions/list-for-datatable"
        order-type="desc"
      />

      <visa-transaction-modal
        ref="modal"
        :on-action-success="updateItemSuccess"
      />
    </the-portlet>
  </div>
</template>

<script>
import ThePortlet from '~/components/base/ThePortlet'
import DataTable from '~/components/base/DataTable'
import { generateTableAction } from '~/utils/tableHelper'
import VisaTransactionModal from '~/features/VisaTransactionModal'
import { formatDateTimeNormal } from '~/utils/formatTime'
import { CARD_TRANSACTION_GET } from '~/constants/permissions'
import { formatPrice } from '~/utils/formatString'

export default {
  name: 'Transaction',
  permission: CARD_TRANSACTION_GET,
  components: {
    VisaTransactionModal,
    DataTable,
    ThePortlet
  },
  head() {
    return {
      title: 'Card Transaction'
    }
  },
  meta: {
    pageTitle: 'Card Transaction'
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
          data: 'refId',
          title: this.$t('ref')
        },
        {
          data: 'fullname',
          title: 'Fullname'
        },
        {
          data: 'fee',
          title: 'Fee',
          render(d) {
            return d ? formatPrice(d) : ''
          }
        },
        {
          data: 'email',
          title: 'Email'
        },
        {
          data: 'mobile',
          title: 'Mobile'
        },
        {
          data: 'status',
          title: 'Status',
          render(data) {
            switch (data) {
              case 'INITIAL':
                return `<span class="text-primary uppercase">INITIAL</span>`
              case 'PROCESSING':
                return `<span class="text-info uppercase">PROCESSING</span>`
              case 'SUCCEED':
                return `<span class="text-success uppercase">SUCCEED</span>`
              case 'CANCELED':
                return `<span class="text-warning uppercase">CANCELED</span>`
              case 'REVIEW':
                return `<span class="text-cyan uppercase">REVIEW</span>`
              case 'REFUNDING':
                return `<span class="text-indigo uppercase">REFUNDING</span>`
              case 'REFUNDED':
                return `<span class="text-fuchsia uppercase">REFUNDED</span>`
            }
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
          text: 'All'
        },
        {
          id: 1,
          text: 'Order matched'
        },
        {
          id: 0,
          text: 'Order not matched'
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
