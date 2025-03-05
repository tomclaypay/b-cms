<template>
  <b-modal
    ref="modal"
    :ok-title="isEdit ? $t('title.edit') : $t('title.add')"
    :title="isEdit ? $t('bank.edit') : $t('bank.add')"
    @ok="handleModalOk"
    @hidden="handleModalHide"
    :cancel-title="$t('button.cancel')"
    size="lg"
    no-enforce-focus
  >
    <validation-observer ref="observer" class="kt-form">
      <select2-with-validation
        :required="true"
        v-model="form.bankAccountTypeObject"
        :options="bankAccountTypeOptions"
        :searchable="false"
        :label="$t('bank.account_type')"
        :data-vv-as="$t('bank.account_type')"
        :placeholder="$t('bank.account_type')"
        text-field="text"
        id-field="id"
        rules="required"
        name="bankAccountType"
      />

      <select2-with-validation
        :required="true"
        v-model="form.bankTypeObject"
        :options="bankTypeOptions"
        :searchable="false"
        :placeholder="$t('bank.type')"
        :label="$t('bank.type')"
        :data-vv-as="$t('bank.type')"
        text-field="text"
        id-field="id"
        rules="required"
        name="bankType"
      />

      <select2-with-validation
        :required="true"
        v-model="form.bankNameObject"
        :options="bankNameOptions"
        :searchable="false"
        :label="$t('bank.name')"
        :data-vv-as="$t('bank.name')"
        text-field="text"
        id-field="id"
        placeholder="$t('bank.name')"
        rules="required"
        name="bankName"
      />

      <b-text-input-with-validation
        v-model="form.bankAccount"
        :required="true"
        :error="vForm.errors.get('bankAccount')"
        :placeholder="$t('bank.account')"
        :label="$t('bank.account')"
        rules="required"
        name="bankAccount"
      />

      <b-text-input-with-validation
        v-model="form.bankAccountName"
        :required="true"
        :error="vForm.errors.get('bankAccountName')"
        :placeholder="$t('bank.account_name')"
        :label="$t('bank.account_name')"
        rules="required"
        name="bankAccountName"
      />

      <e-text-number-input-with-validation
        v-model="form.getTxLimit"
        :error="vForm.errors.get('getTxLimit')"
        :placeholder="$t('bank.get_tx_limit')"
        :label="$t('bank.get_tx_limit')"
        type="number"
        name="getTxLimit"
      />

      <!-- <b-text-input-with-validation
        v-model="form.bankUsername"
        :required="true"
        :error="vForm.errors.get('bankUsername')"
        :placeholder="$t('username')"
        :label="$t('username')"
        rules="required"
        name="bankUsername"
      />

      <b-text-input-with-validation
        v-if="!isEdit"
        v-model="form.bankPassword"
        :required="true"
        :error="vForm.errors.get('bankPassword')"
        :placeholder="$t('bank.password')"
        :label="$t('bank.password')"
        rules="required"
        name="bankPassword"
      /> -->

      <el-switch v-model="form.isEnabled" :active-text="$t('active')">
      </el-switch>
    </validation-observer>
    <template #modal-footer="{ ok, cancel }">
      <el-button @click="cancel()">{{ $t('button.cancel') }}</el-button>
      <el-button type="primary" :loading="isLoadingBtn" @click="ok()">{{
        isEdit ? $t('title.edit') : $t('title.add')
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
import Select2WithValidation from '~/components/base/input/Select2WithValidation'
import ETextNumberInputWithValidation from '~/components/base/input/ETextNumberInputWithValidation'

const defaultForm = {
  bankName: '',
  bankAccount: '',
  bankAccountName: '',
  // bankUsername: '',
  // bankPassword: '',
  bankAccountType: '',
  getTxLimit: 20,
  bankType: '',
  isEnabled: true,
  bankAccountTypeObject: {
    id: 'INDIVIDUAL',
    text: 'Individual'
  },
  bankTypeObject: {
    id: 'DEPOSIT',
    text: 'Deposit'
  },
  bankNameObject: {
    id: 'VIETCOMBANK',
    text: 'VIETCOMBANK'
  }
}

export default {
  name: 'PermissionModal',
  components: {
    BTextInputWithValidation,
    Select2WithValidation,
    ValidationObserver,
    ETextNumberInputWithValidation
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
      isLoadingBtn: false,
      selected: null,
      bankAccountTypeOptions: [
        {
          id: 'INDIVIDUAL',
          text: this.$t('individual')
        },
        {
          id: 'CORPORATE',
          text: this.$t('corpotate')
        }
      ],
      bankTypeOptions: [
        {
          id: 'DEPOSIT',
          text: this.$t('deposit')
        },
        {
          id: 'WITHDRAWAL',
          text: this.$t('withdrawl')
        }
      ],
      bankNameOptions: [
        {
          id: 'VIETCOMBANK',
          text: 'VIETCOMBANK'
        },
        {
          id: 'ACB',
          text: 'ACB'
        },
        {
          id: 'ABBANK',
          text: 'ABBANK'
        },
        {
          id: 'VIETINBANK',
          text: 'VIETINBANK'
        },
        {
          id: 'BIDV',
          text: 'BIDV'
        },
         {
          id: 'TPBANK',
          text: 'TPBANK'
        }
      ]
    }
  },
  mounted() {},
  methods: {
    show(item = null) {
      if (item) {
        this.isEdit = true
        item.bankNameObject = {
          id: item.bankName ? item.bankName : 'VIETCOMBANK',
          text: 'VIETCOMBANK'
        }
        item.bankTypeObject = {
          id: item.bankType ? item.bankType : 'DEPOSIT',
          text: this.$t('deposit')
        }
        item.bankAccountTypeObject = {
          id: item.bankAccountType ? item.bankAccountType : 'INDIVIDUAL',
          text: this.$t('individual')
        }
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
        this.form.bankName = this.form.bankNameObject.id
        this.form.bankType = this.form.bankTypeObject.id
        this.form.bankAccountType = this.form.bankAccountTypeObject.id
        this.vForm = new Form(this.form)
        await this.vForm.post(this.$axios.defaults.baseURL + '/admin/banks')
        this.isLoadingBtn = false
        notifyAddSuccess(this.$t('bank'))
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
        this.form.bankName = this.form.bankNameObject.id
        this.form.bankType = this.form.bankTypeObject.id
        this.form.bankAccountType = this.form.bankAccountTypeObject.id
        this.vForm = new Form(this.form)
        await this.vForm.patch(
          this.$axios.defaults.baseURL + '/admin/banks/' + this.form.id
        )
        this.isLoadingBtn = false
        notifyUpdateSuccess(this.$t('bank'))
        this.$refs.modal.hide()
        this.onActionSuccess()
      } catch (e) {
        this.isLoadingBtn = false
        console.log(e)
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
