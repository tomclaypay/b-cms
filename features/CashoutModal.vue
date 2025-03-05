<template>
  <b-modal
    ref="modal"
    :ok-title="isEdit ? 'Cập nhật' : 'Thêm mới'"
    :title="isEdit ? 'Cập nhật cashout' : 'Thêm cashout'"
    :no-enforce-focus="true"
    :no-close-on-backdrop="true"
    @ok="handleModalOk"
    @hidden="handleModalHide"
    cancel-title="Hủy bỏ"
    size="lg"
  >
    <validation-observer ref="observer" class="kt-form">
      <e-text-number-input-with-validation
        v-model="form.amount"
        :required="true"
        :error="vForm.errors.get('amount')"
        :min="0"
        placeholder="Amount"
        label="Amount"
        rules="required"
        type="number"
        name="amount"
      />

      <b-text-input-with-validation
        v-model="form.ref"
        :required="true"
        :error="vForm.errors.get('ref')"
        placeholder="Nhập..."
        label="Ref"
        rules="required|max:255"
        name="ref"
      />

      <b-text-area-with-validation
        v-model="form.note"
        :error="vForm.errors.get('note')"
        placeholder="Ghi chú"
        label="Ghi chú"
        name="note"
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
import BTextInputWithValidation from '~/components/base/input/BTextInputWithValidation'
import ETextNumberInputWithValidation from '~/components/base/input/ETextNumberInputWithValidation'

const defaultForm = {
  title: '',
  topic: null,
  description: ''
}

export default {
  name: 'UserModal',
  components: {
    ValidationObserver,
    BTextInputWithValidation,
    ETextNumberInputWithValidation,
    BTextAreaWithValidation: () =>
      import('~/components/base/input/BTextAreaWithValidation')
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
      isLoadingBtn: false
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
        this.vForm = new Form(this.form)
        await this.vForm.post(this.$axios.defaults.baseURL + '/admin/cashouts/')
        this.isLoadingBtn = false
        notifyAddSuccess('cashout')
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
        this.vForm = new Form(this.form)
        await this.vForm.patch(
          this.$axios.defaults.baseURL + '/admin/cashouts/' + this.form.id
        )
        this.isLoadingBtn = false
        notifyUpdateSuccess('cashout')
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
