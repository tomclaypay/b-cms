<template>
  <validation-observer ref="observer" v-if="isReady" class="kt-form">
    <e-text-number-input-with-validation
      v-model="form.depositFeeFlat"
      :error="vForm.errors.get('depositFeeFlat')"
      :min="0"
      :placeholder="$t('setting.deposit_fee_flat')"
      :label="$t('setting.deposit_fee_flat')"
      type="number"
      name="depositFeeFlat"
    />

    <e-text-number-input-with-validation
      v-model="form.depositFeePct"
      :error="vForm.errors.get('depositFeePct')"
      :min="0"
      :max="100"
      :placeholder="$t('setting.deposit_fee_pct')"
      :label="$t('setting.deposit_fee_pct')"
      type="number"
      name="depositFeePct"
    />
    <e-text-number-input-with-validation
      v-model="form.depositCardFeeFlat"
      :error="vForm.errors.get('depositCardFeeFlat')"
      :min="0"
      :placeholder="$t('setting.deposit_card_fee_flat')"
      :label="$t('setting.deposit_card_fee_flat')"
      type="number"
      name="depositCardFeeFlat"
    />
    <e-text-number-input-with-validation
      v-model="form.depositCardFeePct"
      :error="vForm.errors.get('depositCardFeePct')"
      :min="0"
      :max="100"
      :placeholder="$t('setting.deposit_card_fee_pct')"
      :label="$t('setting.deposit_card_fee_pct')"
      type="number"
      name="depositCardFeePct"
    />

    <e-text-number-input-with-validation
      v-model="form.depositVirtualFeeFlat"
      :error="vForm.errors.get('depositVirtualFeeFlat')"
      :min="0"
      :placeholder="$t('setting.deposit_virtual_fee_flat')"
      :label="$t('setting.deposit_virtual_fee_flat')"
      type="number"
      name="depositVirtualFeeFlat"
    />
    <e-text-number-input-with-validation
      v-model="form.depositVirtualFeePct"
      :error="vForm.errors.get('depositVirtualFeePct')"
      :min="0"
      :max="100"
      :placeholder="$t('setting.deposit_virtual_fee_pct')"
      :label="$t('setting.deposit_virtual_fee_pct')"
      type="number"
      name="depositVirtualFeePct"
    />

    <e-text-number-input-with-validation
      v-model="form.withdrawFeeFlat"
      :error="vForm.errors.get('withdrawFeeFlat')"
      :min="0"
      :placeholder="$t('setting.withdraw_fee_flat')"
      :label="$t('setting.withdraw_fee_flat')"
      type="number"
      name="withdrawFeeFlat"
    />
    <e-text-number-input-with-validation
      v-model="form.withdrawFeePct"
      :error="vForm.errors.get('withdrawFeePct')"
      :min="0"
      :max="100"
      :placeholder="$t('setting.withdraw_fee_pct')"
      :label="$t('setting.withdraw_fee_pct')"
      type="number"
      name="withdrawFeePct"
    />

    <e-text-number-input-with-validation
      v-model="form.cashoutFeeFlat"
      :error="vForm.errors.get('cashoutFeeFlat')"
      :min="0"
      :placeholder="$t('setting.cashout_fee_flat')"
      :label="$t('setting.cashout_fee_flat')"
      type="number"
      name="cashoutFeeFlat"
    />
    <e-text-number-input-with-validation
      v-model="form.cashoutFeePct"
      :error="vForm.errors.get('cashoutFeePct')"
      :min="0"
      :max="100"
      :placeholder="$t('setting.cashout_fee_pct')"
      :label="$t('setting.cashout_fee_pct')"
      type="number"
      name="cashoutFeePct"
    />

    <e-text-number-input-with-validation
      v-model="form.expiredTime"
      :error="vForm.errors.get('expiredTime')"
      :min="0"
      :placeholder="$t('setting.expired_time')"
      :label="$t('setting.expired_time')"
      type="number"
      name="expiredTime"
    />

    <!-- <e-text-number-input-with-validation
      v-model="form.minDepositAmount"
      :error="vForm.errors.get('minDepositAmount')"
      :min="0"
      type="number"
      placeholder="Số tiền nạp tối thiểu"
      label="Số tiền nạp tối thiểu"
      name="minDepositAmount"
    /> -->

    <b-form-group
      :label="$t('setting.min_deposit_amount')"
      class="form-group-amount"
    >
      <vue-numeric v-model="form.minDepositAmount" separator=","></vue-numeric>
    </b-form-group>

    <b-form-group
      :label="$t('setting.max_deposit_amount')"
      class="form-group-amount"
    >
      <vue-numeric v-model="form.maxDepositAmount" separator=","></vue-numeric>
    </b-form-group>

    <b-form-group
      :label="$t('setting.min_withdrawal_amount')"
      class="form-group-amount"
    >
      <vue-numeric
        v-model="form.minWithdrawalAmount"
        separator=","
      ></vue-numeric>
    </b-form-group>

    <b-form-group
      :label="$t('setting.max_withdrawal_amount')"
      class="form-group-amount"
    >
      <vue-numeric
        v-model="form.maxWithdrawalAmount"
        separator=","
      ></vue-numeric>
    </b-form-group>

    <b-tags-input-with-validation
      v-model="form.withdrawalBanks"
      :error="vForm.errors.get('withdrawalBanks')"
      :label="$t('setting.withdrawal_banks')"
      :placeholder="$t('setting.withdrawal_banks')"
      name="tags"
    />

    <e-text-number-input-with-validation
      v-model="form.maxBankAmount"
      :error="vForm.errors.get('maxBankAmount')"
      :min="0"
      :placeholder="$t('setting.max_bank_amount')"
      :label="$t('setting.max_bank_amount')"
      type="number"
      name="maxBankAmount"
    />

    <b-form-group>
      <el-switch
        v-model="form.isUnderMaintenance"
        :active-text="$t('setting.is_under_maintenance')"
      >
      </el-switch>
    </b-form-group>
    <b-form-group>
      <el-switch v-model="form.isVpayEnabled" active-text="Enabled Bot">
      </el-switch>
    </b-form-group>

    <b-form-group>
      <el-switch
        v-model="form.isCardEnabled"
        :active-text="$t('setting.is_card_enabled')"
      >
      </el-switch>
    </b-form-group>

    <b-form-group>
      <el-switch
        v-model="form.isBankEnabled"
        :active-text="$t('setting.is_bank_enabled')"
      >
      </el-switch>
    </b-form-group>
    <b-form-group>
      <el-switch
        v-model="form.isVirtualEnabled"
        :active-text="$t('setting.is_virtual_enabled')"
      >
      </el-switch>
    </b-form-group>

    <b-form-group>
      <el-switch
        v-model="form.isXenditEnabled"
        :active-text="$t('setting.is_xendit_enabled')"
      >
      </el-switch>
    </b-form-group>

    <b-form-group>
      <el-switch
        v-model="form.isSplitTransaction"
        :active-text="$t('setting.is_split_transaction')"
      >
      </el-switch>
    </b-form-group>

    <b-form-group>
      <el-switch
        v-model="form.isAutoWithdrawal"
        :active-text="$t('setting.is_auto_withdrawal')"
      >
      </el-switch>
    </b-form-group>

    <b-form-group>
      <button @click="onSubmit" type="button" class="btn btn-primary">
        {{ $t('update') }}
      </button>
    </b-form-group>
  </validation-observer>
</template>

<script>
import Form from 'vform'
import cloneDeep from 'lodash/cloneDeep'
import { ValidationObserver } from 'vee-validate'
import VueNumeric from 'vue-numeric'
import {
  notifyTryAgain,
  notifyUpdateSuccess,
  notifyDanger
} from '~/utils/bootstrap-notify'
import { getServerErrors } from '@/utils/utils'
import ETextNumberInputWithValidation from '~/components/base/input/ETextNumberInputWithValidation'
import BTagsInputWithValidation from '~/components/base/input/BTagsInputWithValidation'

const defaultForm = {
  isUnderMaintenance: true,
  depositFeeFlat: 0,
  depositFeePct: 0,
  depositCardFeeFlat: 0,
  depositCardFeePct: 0,
  depositVirtualFeeFlat: 0,
  depositVirtualFeePct: 0,
  withdrawFeeFlat: 0,
  withdrawFeePct: 0,
  cashoutFeeFlat: 0,
  cashoutFeePct: 0,
  expiredTime: 0,
  maxDepositAmount: 0,
  maxWithdrawalAmount: 0,
  minDepositAmount: 0,
  minWithdrawalAmount: 0,
  withdrawalBanks: [],
  isVpayEnabled: false,
  isCardEnabled: false,
  isVirtualEnabled: false,
  isBankEnabled: false,
  isAutoWithdrawal: false,
  isSplitTransaction: false,
  maxBankAmount: 0,
  isXenditEnabled: false
}

export default {
  name: 'Setting',
  components: {
    ETextNumberInputWithValidation,
    ValidationObserver,
    VueNumeric,
    BTagsInputWithValidation
  },
  meta: {
    pageTitle: 'Settings'
  },
  props: {
    onActionSuccess: {
      type: Function,
      default: () => {}
    }
  },
  data() {
    return {
      form: cloneDeep(defaultForm),
      vForm: new Form(),
      selected: null,
      isReady: false
    }
  },
  mounted() {
    this.loadData()
  },
  methods: {
    async loadData() {
      try {
        const { data } = await this.$axios.get('/admin/settings')
        if (data) {
          this.form = {
            ...data,
            depositFeePct: data.depositFeePct * 100,
            withdrawFeePct: data.withdrawFeePct * 100,
            depositCardFeePct: data.depositCardFeePct * 100,
            depositVirtualFeePct: data.depositVirtualFeePct * 100
          }
          this.isReady = true
        }
      } catch (e) {
        const mes = getServerErrors(e)
        notifyDanger(mes)
      }
    },
    async onSubmit() {
      await this.validateForm()
    },
    async validateForm() {
      const isValid = await this.$refs.observer.validate()
      if (isValid) {
        await this.updateItem()
      }
    },
    async updateItem() {
      try {
        this.vForm = new Form({
          ...this.form,
          depositFeePct: this.form.depositFeePct / 100,
          withdrawFeePct: this.form.withdrawFeePct / 100,
          depositCardFeePct: this.form.depositCardFeePct / 100,
          depositVirtualFeePct: this.form.depositVirtualFeePct / 100
        })
        await this.vForm.patch(this.$axios.defaults.baseURL + '/admin/settings')
        notifyUpdateSuccess('settings')
      } catch (e) {
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

<style lang="scss">
.form-group-amount {
  input {
    width: 100%;
    border: 1px solid #dcdfe6;
    height: 40px;
    padding: 0 15px;
    border-radius: 4px;
  }
}
</style>
