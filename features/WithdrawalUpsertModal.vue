<template>
  <b-modal
    ref="modal"
    :ok-title="isEdit ? 'Cập nhật' : 'Thêm mới'"
    :title="isEdit ? 'Cập nhật withdrawal' : 'Thêm withdrawal'"
    :no-enforce-focus="true"
    :no-close-on-backdrop="true"
    @ok="handleModalOk"
    @hidden="handleModalHide"
    cancel-title="Hủy bỏ"
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
        placeholder="Amount"
        label="Amount"
        :precision="0"
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
    <template #modal-footer="{ ok, cancel }">
      <el-button @click="cancel()">{{ $t('button.cancel') }}</el-button>
      <el-button type="primary" :loading="isLoadingBtn" @click="ok()">{{
        isEdit ? $t('button.update') : $t('button.add')
      }}</el-button>
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
  notifyUpdateSuccess,
  notifyDanger
} from '~/utils/bootstrap-notify'
import BTextInputWithValidation from '~/components/base/input/BTextInputWithValidation'
import ETextNumberInputWithValidation from '~/components/base/input/ETextNumberInputWithValidation'
import { getServerErrors } from '@/utils/utils'
import Select2WithValidation from '~/components/base/input/Select2WithValidation'

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
  }
}

export default {
  name: 'UserModal',
  components: {
    ValidationObserver,
    BTextInputWithValidation,
    ETextNumberInputWithValidation,
    Select2WithValidation
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
      bankNameDestOptions: null,
      isLoadingBtn: false
    }
  },
  mounted() {
    this.loadData()
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

      await this.validateForm()
    },
    handleModalHide(bvModalEvt) {
      this.form = cloneDeep(defaultForm)
      this.vForm = new Form(this.form)
      this.isEdit = false
    },
    async validateForm() {
      const isValid = await this.$refs.observer.validate()
      if (isValid) {
        this.isLoadingBtn = true
        if (this.isEdit) {
          await this.updateItem()
        } else {
          await this.addItem()
        }
      }
    },
    async addItem() {
      try {
        this.form.bankNameDest = this.form.bankNameDestObject.id
        this.vForm = new Form(this.form)
        await this.vForm.post(
          this.$axios.defaults.baseURL + '/admin/withdrawals/'
        )
        this.isLoadingBtn = false
        notifyAddSuccess('withdrawal')
        this.$refs.modal.hide()
        this.onActionSuccess()
      } catch (e) {
        this.isLoadingBtn = false
        if (e.response) {
          if (status !== 422) {
            notifyTryAgain()
          }
        } else {
          notifyTryAgain()
        }
      }
    },
    async updateItem() {
      try {
        this.form.bankNameDest = this.form.bankNameDestObject.id
        this.vForm = new Form(this.form)
        await this.vForm.patch(
          this.$axios.defaults.baseURL + '/admin/cashouts/' + this.form.id
        )
        this.isLoadingBtn = false
        notifyUpdateSuccess('withdrawal')
        this.$refs.modal.hide()
        this.onActionSuccess()
      } catch (e) {
        this.isLoadingBtn = false
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
