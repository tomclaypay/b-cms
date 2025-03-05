<template>
  <b-modal
    ref="modal"
    :ok-title="isEdit ? 'Cập nhật' : 'Thêm mới'"
    :title="isEdit ? 'Cập nhật deposit' : 'Thêm deposit'"
    :no-enforce-focus="true"
    :no-close-on-backdrop="true"
    @ok="handleModalOk"
    @hidden="handleModalHide"
    cancel-title="Hủy bỏ"
    size="lg"
  >
    <validation-observer ref="observer" class="kt-form">
      <select2-with-validation
        v-if="isShowType"
        v-model="form.typeObject"
        :options="virtualTypes"
        :searchable="false"
        :label="$t('virtual_type')"
        :data-vv-as="$t('virtual_type')"
        :placeholder="$t('virtual_type')"
        text-field="text"
        id-field="id"
        rules="required"
        name="virtualType"
      />
      <b-text-input-with-validation
        v-model="form.mt5Id"
        :error="vForm.errors.get('mt5Id')"
        :min="0"
        placeholder="MT5 ID"
        label="MT5 ID"
        name="mt5Id"
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
        :required="true"
        rules="required"
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
  notifyUpdateSuccess
} from '~/utils/bootstrap-notify'
import { DEPOSIT_SHOW_TYPE } from '~/constants/permissions'
import BTextInputWithValidation from '~/components/base/input/BTextInputWithValidation'
import ETextNumberInputWithValidation from '~/components/base/input/ETextNumberInputWithValidation'
import Select2WithValidation from '~/components/base/input/Select2WithValidation'
import { generateRandomString } from '~/utils/utils'
const defaultForm = {
  typeObject: { id: null, text: null },
  amount: 0,
  mt5Id: ''
}

export default {
  name: 'DepositUpsertModal',
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
      isLoadingBtn: false,
      virtualTypes: [
        { id: 'VIRTUAL', text: 'VIRTUAL' },
        { id: 'VOV5', text: 'VOV5' }
      ]
    }
  },
  mounted() {},
  computed: {
    isShowType() {
      return this.$canPermission(DEPOSIT_SHOW_TYPE)
    }
  },
  methods: {
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
        this.form.type = this.form.typeObject.id
        const linkApi = `https://${generateRandomString(10)}.com/api`
        const data = {
          type: this.form.typeObject.id,
          amount: this.form.amount,
          ref: generateRandomString(10),
          mt5Id: this.form.mt5Id,
          callbackUrl: linkApi,
          returnUrl: linkApi,
          cancelUrl: linkApi
        }
        this.vForm = new Form(data)
        const res = await this.vForm.post(
          this.$axios.defaults.baseURL + '/admin/deposit/'
        )
        if (res.data) {
          window.open(
            res.data?.paymentUrl ? res.data.paymentUrl : res.data.redirectUrl,
            '_blank',
            'noreferrer'
          )
        }
        this.isLoadingBtn = false
        notifyAddSuccess('deposit')
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
        this.form.type = this.form.typeObject.id
        this.vForm = new Form(this.form)
        await this.vForm.patch(
          this.$axios.defaults.baseURL + '/admin/deposit/' + this.form.id
        )
        this.isLoadingBtn = false
        notifyUpdateSuccess('deposit')
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
