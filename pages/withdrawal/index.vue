<template>
  <div>
    <the-portlet>
      <b-row>
        <b-col>
          <b-form-group :label="$t('type')">
            <the-select2
              v-model="isManual"
              :has-all-option="true"
              :options="typeOptions"
              :searchable="false"
              :placeholder="$t('type')"
              :data-vv-as="$t('created_at')"
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
      </b-row>
    </the-portlet>
    <the-portlet :title="$t('withdrawl.list')">
      <template v-slot:tool>
        <button
          @click="$refs.exportModal.show()"
          type="button"
          class="btn btn-success ml-20 d-flex align-items-center"
        >
          <i class="la la-download"></i> {{ $t('download_data') }}
        </button>
        <button
          v-if="isWithdrawalCreate"
          @click="showUpsertModal"
          type="button"
          class="btn btn-primary ml-20"
        >
          <i class="la la-plus"></i> {{ $t('button.add') }}
        </button>
        <button
          v-if="isWithdrawalCreateList"
          @click="showInsertListModal"
          type="button"
          class="btn btn-primary ml-20"
        >
          <i class="la la-plus"></i> {{ $t('button.add_multiple') }}
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
        url="/admin/withdrawals/list-for-datatable"
        order-type="desc"
      />

      <WithdrawalModal ref="modal" :on-action-success="updateItemSuccess" />
      <WithdrawalUpsertModal
        ref="upsertModal"
        :on-action-success="updateItemSuccess"
      />
      <export-modal ref="exportModal" />
      <WithdrawalInsertManyModal
        ref="insertListModal"
        :on-action-success="updateItemSuccess"
      ></WithdrawalInsertManyModal>
    </the-portlet>
  </div>
</template>

<script>
import ThePortlet from '~/components/base/ThePortlet'
import DataTable from '~/components/base/DataTable'
import { generateTableAction } from '~/utils/tableHelper'
import WithdrawalModal from '~/features/WithdrawalModal'
import WithdrawalUpsertModal from '~/features/WithdrawalUpsertModal'
import { formatPrice } from '~/utils/formatString'
import {
  WITHDRAWAL_GET,
  WITHDRAWAL_CREATE,
  WITHDRAWAL_CREATE_MULTIPLE
} from '~/constants/permissions'
import { formatDateTimeNormal } from '~/utils/formatTime'
import { i18n } from '~/plugins/i18n'
import WithdrawalInsertManyModal from '~/features/withdrawal/WithdrawalInsertManyModal.vue'

export default {
  name: 'Withdrawals',
  permission: WITHDRAWAL_GET,
  components: {
    WithdrawalModal,
    WithdrawalUpsertModal,
    WithdrawalInsertManyModal,
    DataTable,
    ThePortlet,
    TheSelect2: () => import('~/components/base/TheSelect2'),
    ExportModal: () => import('~/features/withdrawal/ExportModal')
  },
  head() {
    return {
      title: this.$t('withdrawl.list')
    }
  },
  meta: {
    pageTitle: 'withdrawl.list'
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
          data: 'mt5Id',
          title: 'Mt5 ID'
        },
        {
          data: 'code',
          title: 'Code'
        },
        {
          data: 'ref',
          title: 'Ref'
        },
        {
          data: 'amount',
          title: this.$t('amount'),
          render(d) {
            return formatPrice(d)
          }
        },
        {
          data: 'fee',
          title: this.$t('fee'),
          render(d) {
            return formatPrice(d)
          }
        },
        {
          data: 'ref',
          title: this.$t('withdrawl.ref'),
          render(d, t, r) {
            return (
              r.bankNameDest +
              '|' +
              r.bankAccountNameDest +
              '|' +
              r.bankAccountNumberDest
            )
          }
        },
        {
          data: 'isManual',
          title: this.$t('type'),
          render(d) {
            return d
              ? `<span class="text-danger uppercase">${i18n.t('manual')}</span>`
              : `<span class="text-success uppercase">${i18n.t('auto')}</span>`
          }
        },
        {
          data: 'status',
          title: 'Trạng thái',
          render(data) {
            switch (data) {
              case 'PENDING':
                return `<span class="text-warning uppercase">
                ${i18n.t('pending')}
                </span>`
              case 'SUCCEED':
                return `<span class="text-success uppercase">
                ${i18n.t('succeed')}
                </span>`
              case 'CANCELED':
                return `<span class="text-danger uppercase">
                ${i18n.t('canceled')}
                </span>`
              case 'FAILED':
                return `<span class="text-info uppercase">
                ${i18n.t('failed')}
                </span>`
            }
          }
        },
        {
          data: 'createdAt',
          title: this.$t('created_at'),
          render(d) {
            return formatDateTimeNormal(d)
          }
        },
        {
          data: 'updatedAt',
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
      postData: {
        isManual: -1,
        status: -1
      },
      isManual: {
        id: -1,
        name: this.$t('all')
      },
      status: {
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
    },
    isWithdrawalCreate() {
      return this.$canPermission(WITHDRAWAL_CREATE)
    },
    isWithdrawalCreateList() {
      return this.$canPermission(WITHDRAWAL_CREATE_MULTIPLE)
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
    }
  },
  methods: {
    showDetail(table, rowData) {
      this.$refs.modal.show(rowData)
    },
    showModal() {
      this.$refs.modal.show()
    },
    showUpsertModal() {
      this.$refs.upsertModal.show()
    },
    showInsertListModal() {
      this.$refs.insertListModal.show()
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
