<template>
  <div>
    <!-- <the-portlet>
      <b-row>
        <b-col>
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
        </b-col>
        <b-col>
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
        </b-col>
        <b-col>
          <b-form-group :label="$t('verify')">
            <the-select2
              v-model="isVerifying"
              :searchable="false"
              :has-all-option="true"
              :options="verifyingOptions"
              :placeholder="$t('status')"
              :data-vv-as="$t('status')"
              id-field="id"
              text-field="text"
            />
          </b-form-group>
        </b-col>
      </b-row>
    </the-portlet> -->
    <the-portlet title="Cashouts">
      <template v-slot:tool>
        <button
          v-if="isCashoutCrud"
          @click="showModal"
          type="button"
          class="btn btn-primary"
        >
          <i class="la la-plus"></i> Thêm mới
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
        url="/admin/cashouts/list-for-datatable"
        order-type="desc"
      />

      <cashout-modal ref="modal" :on-action-success="updateItemSuccess" />
    </the-portlet>
  </div>
</template>

<script>
import ThePortlet from '~/components/base/ThePortlet'
import DataTable from '~/components/base/DataTable'
import { generateTableAction } from '~/utils/tableHelper'
import CashoutModal from '~/features/CashoutModal'
import { formatPrice } from '~/utils/formatString'
import { CASHOUT_GET, CASHOUT_CRUD } from '~/constants/permissions'
import { formatDateTimeNormal } from '~/utils/formatTime'
// import { i18n } from '~/plugins/i18n'

export default {
  name: 'Deposit',
  permission: CASHOUT_GET,
  components: {
    CashoutModal,
    DataTable,
    ThePortlet
    // TheSelect2: () => import('~/components/base/TheSelect2'),
  },
  head() {
    return {
      title: this.$t('deposit.list')
    }
  },
  meta: {
    pageTitle: 'deposit.list'
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
          data: 'amount',
          title: 'Amount',
          render(d) {
            return formatPrice(d)
          }
        },
        {
          data: 'fee',
          title: 'Fee',
          render(d) {
            return formatPrice(d)
          }
        },
        {
          data: 'ref',
          title: 'Ref'
        },
        {
          data: 'note',
          title: 'Note'
        },
        {
          data: 'createdAt',
          title: this.$t('created_at'),
          render(d) {
            return formatDateTimeNormal(d)
          }
        },
        {
          data: null,
          title: this.$t('datatable.action_col'),
          responsivePriority: 1,
          orderable: false,
          class: `text-center tb-actions ${!this.$canPermission(CASHOUT_CRUD) &&
            'hidden'} `,
          render() {
            return generateTableAction('edit', 'showDetail')
          }
        }
      ]
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
    },
    isCashoutCrud() {
      return this.$canPermission(CASHOUT_CRUD)
    }
  },
  watch: {
    isManual(val) {
      this.$refs.table.setPage(0)
      this.postData.isManual = val.id

      this.$nextTick(() => {
        this.reloadTable()
      })
    },
    status(val) {
      this.$refs.table.setPage(0)
      this.postData.status = val.id

      this.$nextTick(() => {
        this.reloadTable()
      })
    },
    isVerifying(val) {
      this.$refs.table.setPage(0)
      this.postData.isVerifying = val.id

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
