<template>
  <b-modal
    ref="modal"
    :ok-title="$t('button.add')"
    :title="$t('button.add') + ' withdrawal'"
    :no-enforce-focus="true"
    :no-close-on-backdrop="true"
    @ok="handleModalOk"
    @hidden="handleModalHide"
    :cancel-title="$t('cancel')"
    size="lg"
  >
    <validation-observer ref="observer" class="kt-form">
      <select2-with-validation
        v-if="bankNameDestOptions"
        :required="true"
        v-model="form.bankNameDestObject"
        :options="bankNameDestOptions"
        :searchable="false"
        :label="$t('bank_name_dest')"
        :data-vv-as="$t('bank_name_dest')"
        :placeholder="$t('bank_name_dest')"
        text-field="text"
        id-field="id"
        rules="required"
        name="bankNameDest"
      />

      <b-text-input-with-validation
        v-model="form.bankAccountNumberDest"
        :required="true"
        :error="vForm.errors.get('bankAccountNumberDest')"
        :min="0"
        :placeholder="$t('bank_account_number_dest')"
        :label="$t('bank_account_number_dest')"
        rules="required"
        name="bankAccountNumberDest"
      />

      <b-text-input-with-validation
        v-model="form.bankAccountNameDest"
        :required="true"
        :error="vForm.errors.get('bankAccountNameDest')"
        :min="0"
        :placeholder="$t('bank_account_name_dest')"
        :label="$t('bank_account_name_dest')"
        rules="required"
        name="bankAccountNameDest"
      />

      <e-text-number-input-with-validation
        v-model="form.amount"
        :error="vForm.errors.get('amount')"
        :min="0"
        :precision="0"
        placeholder="Amount"
        label="Amount"
        type="number"
        name="amount"
      />

      <b-text-input-with-validation
        v-model="form.ref"
        :required="true"
        :error="vForm.errors.get('ref')"
        :min="0"
        placeholder="Ref"
        label="Ref"
        rules="required"
        name="ref"
      />

      <b-text-input-with-validation
        v-model="form.mt5Id"
        :error="vForm.errors.get('mt5Id')"
        :min="0"
        placeholder="MT5 ID"
        label="MT5 ID"
        name="mt5Id"
      />

      <b-text-input-with-validation
        v-model="form.callbackUrl"
        :required="true"
        :error="vForm.errors.get('callbackUrl')"
        :min="0"
        placeholder="Callback"
        label="Callback"
        rules="required"
        name="callbackUrl"
      />
    </validation-observer>
    <el-button type="primary" class="mb-2" @click="validateForm">{{
      isEdit ? 'Edit' : 'Add'
    }}</el-button>
    <h2>{{ $t('add_list') }}</h2>
    <data-table-prop-data
      ref="table"
      :columns="columns"
      :order-column-index="1"
      :server-side="false"
      :actions="actions"
      :pageLength="25"
      :dataProp="withdrawalList"
      order-type="desc"
    />
    <template #modal-footer="{ ok, cancel }">
      <el-button @click="cancel()">{{ $t('button.cancel') }}</el-button>
      <el-button type="primary" :loading="isLoadingAdd" @click="ok()"
        >{{ $t('button.add') }} {{ ' withdrawal' }}</el-button
      >
    </template>
  </b-modal>
</template>

<script>
import Form from 'vform'
import cloneDeep from 'lodash/cloneDeep'
import { ValidationObserver } from 'vee-validate'
import {
  notifyAddSuccess,
  notifyTryAgain,
  notifyDanger
} from '~/utils/bootstrap-notify'
import BTextInputWithValidation from '~/components/base/input/BTextInputWithValidation'
import ETextNumberInputWithValidation from '~/components/base/input/ETextNumberInputWithValidation'
import { getServerErrors } from '@/utils/utils'
import Select2WithValidation from '~/components/base/input/Select2WithValidation'
import { generateTableAction } from '~/utils/tableHelper'
import DataTablePropData from '~/components/base/DataTablePropData.vue'
import { i18n } from '~/plugins/i18n'
import { generateUniqueId } from '~/utils/random'

const defaultForm = {
  bankNameDest: '',
  bankAccountNumberDest: '',
  bankAccountNameDest: '',
  amount: 0,
  ref: '',
  mt5Id: '',
  callbackUrl: '',
  bankNameDestObject: {
    id: 'VCB',
    text: 'VCB'
  },
  id: null
}

export default {
  name: 'WithdrawalInsetMany',
  components: {
    ValidationObserver,
    BTextInputWithValidation,
    ETextNumberInputWithValidation,
    Select2WithValidation,
    DataTablePropData
  },
  props: {
    onActionSuccess: {
      type: Function,
      default: () => {}
    }
  },
  data() {
    return {
      isEdit: false,
      form: cloneDeep(defaultForm),
      vForm: new Form(),
      componentKey: 0,
      index: 0,
      bankNameDestOptions: null,
      withdrawalList: [],
      isLoadingAdd: false,
      columns: [
        {
          data: '_id',
          title: '_id',
          class: 'data-table-column-id'
        },
        {
          data: 'bankNameDestObject.text',
          title: i18n.t('bank_name_dest')
        },
        {
          data: 'bankAccountNumberDest',
          title: i18n.t('bank_account_number_dest')
        },
        {
          data: 'bankAccountNameDest',
          title: i18n.t('bank_account_name_dest')
        },
        {
          data: 'ref',
          title: 'Ref'
        },
        {
          data: 'amount',
          title: 'Amount'
        },
        {
          data: 'mt5Id',
          title: 'MT5 Id'
        },
        {
          data: 'callbackUrl',
          title: 'Callback URL'
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
              generateTableAction('delete', 'showDelete')
            )
          }
        }
      ]
    }
  },
  mounted() {
    this.loadData()
  },
  computed: {
    actions() {
      return [
        {
          type: 'click',
          name: 'showDetail',
          action: this.selectEditItem
        },
        {
          type: 'click',
          name: 'showDelete',
          action: this.deleteItem
        }
      ]
    }
  },
  methods: {
    async loadData() {
      try {
        const { data } = await this.$axios.get('/admin/withdrawal-banks')
        if (data) {
          this.bankNameDestOptions = data.withdrawalBanks.map((bank) => {
            return {
              id: bank,
              text: bank
            }
          })
        }
      } catch (e) {
        const mes = getServerErrors(e)
        notifyDanger(mes)
      }
    },
    show(item = null) {
      if (item) {
        this.isEdit = true
        this.form = cloneDeep(item)
      }

      this.$nextTick(() => {
        this.$refs.modal.show()
      })
    },
    async handleModalOk(bvModalEvt) {
      bvModalEvt.preventDefault()
      this.isLoadingAdd = true
      await this.addWithdrawal()
    },
    handleModalHide(bvModalEvt) {
      this.form = cloneDeep(defaultForm)
      this.vForm = new Form(this.form)
      this.isEdit = false
    },
    async validateForm() {
      const isValid = await this.$refs.observer.validate()
      if (isValid) {
        if (this.isEdit) {
          this.editItem()
        } else this.addItem()
      }
    },

    addItem() {
      this.form.bankNameDest = this.form.bankNameDestObject.id
      this.form.id = generateUniqueId()
      this.withdrawalList.push(this.form)
      this.form = cloneDeep(defaultForm)
    },

    selectEditItem(table, rowData) {
      this.form = cloneDeep(rowData)
      this.isEdit = true
    },
    editItem() {
      let data = cloneDeep(this.withdrawalList)
      let index = this.withdrawalList.findIndex((x) => x.id == this.form.id)
      data[index] = this.form
      this.withdrawalList = data
      this.form = cloneDeep(defaultForm)
    },
    deleteItem(table, rowData) {
      let data = cloneDeep(this.withdrawalList)
      this.withdrawalList = data.filter((x) => x.id !== rowData.id)
    },

    async addWithdrawal() {
      try {
        let data = []
        for (let index = 0; this.withdrawalList.length > index; index++) {
          let item = this.withdrawalList[index]
          data.push({
            bankNameDest: item.bankNameDest,
            bankAccountNumberDest: item.bankAccountNumberDest,
            bankAccountNameDest: item.bankAccountNameDest,
            amount: item.amount,
            ref: item.ref,
            mt5Id: item.mt5Id,
            callbackUrl: item.callbackUrl,
            bankNameDestObject: item.bankNameDestObject
          })
        }
        await this.$axios.post('/admin/withdrawals/multiple', data)
        this.isLoadingAdd = false
        notifyAddSuccess('withdrawal')
        this.$refs.modal.hide()
        this.onActionSuccess()
      } catch (e) {
        this.isLoadingAdd = false
        if (e.response) {
          if (status !== 422) {
            notifyTryAgain()
          }
        } else {
          notifyTryAgain()
        }
      }
    }
  }
}
</script>
