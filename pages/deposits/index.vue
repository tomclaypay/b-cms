<template>
  <div>
    <the-portlet>
      <b-row>
        <!-- <b-col>
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
        </b-col> -->
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
        <!-- <b-col>
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
        </b-col> -->
        <b-col>
          <b-form-group :label="$t('transaction_type')">
            <the-select2
              v-model="transactionType"
              :searchable="false"
              :has-all-option="true"
              :options="transactionTypeOptions"
              placeholder="Transaction"
              data-vv-as="Transaction"
              id-field="id"
              text-field="text"
            />
          </b-form-group>
        </b-col>
      </b-row>
    </the-portlet>
    <the-portlet :title="$t('deposit.list')">
      <template v-slot:tool>
        <!-- <button
          v-if="isCreateDeposit"
          @click="showUpsertModal"
          type="button"
          class="btn btn-primary ml-20"
        >
          <i class="la la-plus"></i> {{ $t('button.add') }}
        </button> -->
        <button
          v-if="isCreateDeposit"
          @click="addDeposit"
          type="button"
          class="btn btn-primary ml-20"
        >
          <i class="la la-plus"></i> {{ $t('button.deposit') }}
        </button>
        <button
          @click="$refs.exportModal.show()"
          type="button"
          class="btn btn-success ml-20 d-flex align-items-center"
        >
          <i class="la la-download"></i> {{ $t('download_data') }}
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
        url="/admin/deposits/list-for-datatable"
        order-type="desc"
      />

      <deposit-modal ref="modal" :on-action-success="updateItemSuccess" />
      <export-modal ref="exportModal" />
      <DepositUpsertModal
        ref="upsertModal"
        :on-action-success="updateItemSuccess"
      />
      <CreateDepositModal
        ref="depositModal"
        :on-action-success="updateItemSuccess"
      />
    </the-portlet>
  </div>
</template>

<script>
import ThePortlet from '~/components/base/ThePortlet'
import DataTable from '~/components/base/DataTable'
import { generateTableAction } from '~/utils/tableHelper'
import DepositModal from '~/features/DepositModal'
import DepositUpsertModal from '~/features/deposit/DepositUpsertModal'
import CreateDepositModal from '~/features/deposit/CreateDepositModal'
import { formatPrice } from '~/utils/formatString'
import { DEPOSIT_CRUD, DEPOSIT_GET } from '~/constants/permissions'
import { formatDateTimeNormal } from '~/utils/formatTime'
import { i18n } from '~/plugins/i18n'
import { notifyDanger, notifyUpdateSuccess } from '~/utils/bootstrap-notify'
import {
  getServerErrors,
  generateRandomString,
  getRandomInt
} from '~/utils/utils'

export default {
  name: 'Deposit',
  permission: DEPOSIT_GET,
  components: {
    DepositModal,
    DepositUpsertModal,
    CreateDepositModal,
    DataTable,
    ThePortlet,
    TheSelect2: () => import('~/components/base/TheSelect2'),
    ExportModal: () => import('~/features/deposit/ExportModal')
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
          data: 'mt5Id',
          title: 'Mt5 ID'
        },
        {
          data: 'code',
          title: 'Code',
          class: 'data-table-code'
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
          data: 'actualAmount',
          title: this.$t('actual_amount'),
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
          data: 'orderType',
          title: this.$t('deposit.orderType')
        },
        {
          data: 'status',
          title: this.$t('status'),
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
              case 'VERIFYING':
                return `<span class="text-primary text-uppercase">
                 ${i18n.t('verifying')}</span>`
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
            return (
              generateTableAction('preview', 'showDetail') +
              generateTableAction('redirect', 'redirectPayment')
            )
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
      transactionTypeOptions: [
        {
          id: -1,
          text: this.$t('all')
        },
        {
          id: 'BANK',
          text: 'Bank'
        },
        {
          id: 'VIRTUAL',
          text: 'Virtual'
        },
        {
          id: 'CARD',
          text: 'Card'
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
          id: 'VERIFYING',
          text: this.$t('verifying')
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
      verifyingOptions: [
        {
          id: -1,
          text: this.$t('all')
        },
        {
          id: 1,
          text: this.$t('is_verifying')
        }
      ],
      postData: {
        isManual: -1,
        status: -1,
        isVerifying: -1,
        transactionType: -1
      },
      isManual: {
        id: -1,
        name: this.$t('all')
      },
      status: {
        id: -1,
        name: this.$t('all')
      },
      isVerifying: {
        id: -1,
        name: this.$t('all')
      },
      transactionType: {
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
        },
        {
          type: 'click',
          name: 'redirectPayment',
          action: this.redirectPayment
        }
      ]
    },
    isCreateDeposit() {
      return this.$canPermission(DEPOSIT_CRUD)
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
    },
    transactionType(val) {
      this.$refs.table.setPage(0)
      this.postData.transactionType = val.id

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
    },
    redirectPayment(table, rowData) {
      const type =
        rowData.orderType === 'BANK'
          ? 'bank'
          : rowData.virtualTransactions.length > 1
          ? 'virtuals'
          : 'virtual'
      window.open(
        `${
          rowData.isSplitTransaction
            ? 'https://payment-gray-tau.vercel.app'
            : 'https://online-payment.vercel.app'
        }/${type}?order=${rowData.hashId}`,
        '_blank',
        'noreferrer'
      )
    },
    showUpsertModal() {
      this.$refs.upsertModal.show()
    },
    async createDeposit() {
      try {
        const linkApi = `https://${generateRandomString(10)}.com/api`
        const { data } = await this.$axios.post('/admin/deposit/', {
          type: 'VIRTUAL',
          amount: getRandomInt(100000, 1000000),
          ref: generateRandomString(10),
          mt5Id: '',
          callbackUrl: linkApi,
          returnUrl: linkApi,
          cancelUrl: linkApi
        })
        if (data) {
          notifyUpdateSuccess(this.$t('deposit'))
          window.open(data.paymentUrl, '_blank', 'noreferrer')
        }
        this.reloadTable()
      } catch (error) {
        const mes = getServerErrors(error)
        notifyDanger(mes)
      }
    },
    addDeposit() {
      this.$refs.depositModal.show()
    }
  }
}
</script>
