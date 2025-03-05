<template>
  <div>
    <the-portlet>
      <b-row>
        <b-col>
          <b-form-group :label="$t('bank.type')">
            <the-select2
              v-model="bankType"
              :has-all-option="true"
              :options="bankTypeOptions"
              :searchable="false"
              :placeholder="$t('bank.type')"
              :data-vv-as="$t('bank.type')"
              id-field="id"
              text-field="text"
            />
          </b-form-group>
        </b-col>
        <b-col>
          <b-form-group :label="$t('status')">
            <the-select2
              v-model="isEnabled"
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
    <the-portlet :title="$t('bank.list')">
      <template v-slot:tool>
        <button @click="showModal" type="button" class="btn btn-primary">
          <i class="la la-plus"></i> {{ $t('button.add') }}
        </button>
      </template>

      <data-table
        ref="table"
        :columns="columns"
        :order-column-index="1"
        :server-side="true"
        :actions="actions"
        :post-data="postData"
        :pageLength="10"
        :searching="false"
        url="/admin/banks/list-for-datatable"
        order-type="desc"
      />

      <bank-modal ref="modal" :on-action-success="updateItemSuccess" />
    </the-portlet>
  </div>
</template>

<script>
import ThePortlet from '~/components/base/ThePortlet'
import DataTable from '~/components/base/DataTable'
import { generateTableAction, htmlEscapeEntities } from '~/utils/tableHelper'
import BankModal from '~/features/BankModal'
import { notifyDeleteSuccess, notifyTryAgain } from '~/utils/bootstrap-notify'
import { formatPrice } from '~/utils/formatString'
import { BANK_CRUD } from '~/constants/permissions'
import { i18n } from '~/plugins/i18n'

export default {
  name: 'Bank',
  permission: BANK_CRUD,
  components: {
    BankModal,
    DataTable,
    ThePortlet,
    TheSelect2: () => import('~/components/base/TheSelect2')
  },
  head() {
    return {
      title: this.$t('bank.list')
    }
  },
  meta: {
    pageTitle: 'bank.list'
    // bank: PERMISSION_MANAGEMENT
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
          data: 'bankAccountName',
          title: this.$t('bank.account_name')
        },
        {
          data: 'balance',
          title: this.$t('bank.balance'),
          render(d) {
            return formatPrice(d)
          }
        },
        {
          data: 'bankAccountType',
          title: this.$t('bank.account_type'),
          render(d) {
            return d === 'CORPORATE'
              ? i18n.t('bank.corporate')
              : i18n.t('bank.individual')
          }
        },
        {
          data: 'bankType',
          title: this.$t('bank.type'),
          render(d) {
            return d === 'DEPOSIT' ? i18n.t('deposit') : i18n.t('withdrawl')
          }
        },
        {
          data: 'isEnabled',
          title: this.$t('status'),
          render(data) {
            return data
              ? `<span class="text-success">${i18n.t('active')}</span>`
              : `<span class="text-danger">${i18n.t('inactive')}</span>`
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
              generateTableAction('edit', 'showDetail') +
              generateTableAction('delete', 'deleteItem')
            )
          }
        }
      ],
      bankTypeOptions: [
        {
          id: -1,
          text: this.$t('all')
        },
        {
          id: 'DEPOSIT',
          text: this.$t('deposit')
        },
        {
          id: 'WITHDRAWAL',
          text: this.$t('withdrawl')
        }
      ],
      statusOptions: [
        {
          id: -1,
          text: this.$t('all')
        },
        {
          id: 'active',
          text: this.$t('active')
        },
        {
          id: 'inactive',
          text: this.$t('inactive')
        }
      ],
      postData: {
        bankType: -1,
        isEnabled: -1
      },
      bankType: {
        id: -1,
        name: this.$t('bank.all')
      },
      isEnabled: {
        id: -1,
        name: this.$t('bank.all')
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
          name: 'deleteItem',
          action: this.deleteItem
        }
      ]
    }
  },
  watch: {
    bankType(val) {
      this.$refs.table.setPage(0)
      this.postData.bankType = val.id

      this.$nextTick(() => {
        this.reloadTable()
      })
    },
    isEnabled(val) {
      this.$refs.table.setPage(0)
      this.postData.isEnabled = val.id

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
    deleteItem(table, rowData) {
      this.$bvModal
        .msgBoxConfirm(
          this.$t('bank.delete_confirm', [htmlEscapeEntities(rowData.title)]),
          {
            title: this.$t('alert.notice'),
            okVariant: 'danger',
            okTitle: this.$t('button.ok'),
            cancelTitle: this.$t('button.cancel')
          }
        )
        .then(async (value) => {
          if (value) {
            await this.$axios.patch('/admin/banks/' + rowData.id, {
              isEnabled: false
            })
            notifyDeleteSuccess(this.$t('bank'))
            this.$refs.table.reload()
          }
        })
        .catch(() => {
          notifyTryAgain()
        })
    },
    reloadTable() {
      this.$refs.table.reload()
    }
  }
}
</script>
