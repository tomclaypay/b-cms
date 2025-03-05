<template>
  <div>
    <el-dialog :visible.sync="visiable" :before-close="handleClose" v-if="deposit" :title="$t('order.detail')"
      class="preview-modal">
      <div class="mb-5">{{ $t('status') }}</div>
      <div v-html="genStatus(deposit.status)" class="p-box mb-25"></div>

      <div class="mb-5">{{ $t('code') }}</div>
      <div class="p-box mb-25">{{ deposit.code }}</div>

      <div class="mb-5">{{ $t('transaction.ref') }}</div>
      <div class="p-box mb-25">{{ deposit.ref }}</div>

      <div class="mb-5">{{ $t('fee') }}</div>
      <div class="p-box mb-25">{{ deposit.fee | formatPrice }}</div>

      <div class="mb-5">{{ $t('deposit.amount') }}</div>
      <div class="p-box mb-25">{{ deposit.amount | formatPrice }}</div>

      <div class="mb-5">{{ $t('deposit.actual_amount') }}</div>
      <div class="p-box mb-25">{{ deposit.actualAmount | formatPrice }}</div>

      <div class="mb-5">{{ $t('deposit.callback_url') }}</div>
      <a :href="deposit.callbackUrl" target="_blank" class="p-box mb-25 block">{{
        deposit.callbackUrl
      }}</a>

      <div class="mb-5">{{ $t('deposit.bank') }}</div>
      <div class="color-secondary-2 cursor-pointer p-box mb-25">
        <div v-for="transaction in deposit.transactions" :key="transaction.id">
          <div @click="showTransactionModal(transaction)" v-if="transaction.bankName" class="">
            {{
              transaction.bankName +
              ' | ' +
              transaction.bankAccount +
              ' | ' +
              transaction.reference
            }}
          </div>
        </div>
      </div>

      <el-switch v-model="deposit.isManual" :active-text="$t('deposit.manual')" class="mb-25 uppercase">
      </el-switch>

      <div>{{ $t('created_at') }}</div>
      <div class="p-box mb-25">
        {{ deposit.createdAt | formatDateTimeNormal }}
      </div>

      <div class="mb-5">{{ $t('updated_at') }}</div>
      <div class="p-box mb-25">
        {{ deposit.createdAt | formatDateTimeNormal }}
      </div>

      <div class="mb-5">{{ $t('note') }}</div>
      <div class="deposit-note p-box mb-25">{{ deposit.updatedNotes }}</div>

      <span slot="footer" class="dialog-footer">
        <el-button @click="visiable = false">{{ $t('cancel') }}</el-button>
        <el-button @click="openResendModal" v-if="deposit.status !== 'PENDING'" type="primary">
          {{ $t('resend') }}
        </el-button>
        <!-- <el-button
          @click="openVerifyModal"
          v-if="deposit.status === 'SUCCEED'"
          type="primary"
        >
          {{ $t('btn_verify_update') }}
        </el-button> -->
        <el-button @click="openManualModal" v-if="['PENDING', 'CANCELED'].includes(deposit.status)" type="primary">
          {{ $t('open_manual') }}
        </el-button>
        <el-button v-if="deposit.status === 'VERIFYING'" @click="verify" type="primary">
          {{ $t('verified') }}
        </el-button>
      </span>
    </el-dialog>

    <!-- Modal gửi lại callback -->
    <el-dialog :visible.sync="resendModalVisiable" :title="$t('resend')" class="preview-action-modal">
      <ul>
        <li class="color-yellow">
          {{ $t('deposit.resend_t1') }}
        </li>
        <li class="color-yellow">
          {{ $t('deposit.resend_t2') }}
        </li>
      </ul>
      <span slot="footer" class="dialog-footer">
        <el-button @click="resend" type="primary">
          Gửi
        </el-button>
      </span>
    </el-dialog>

    <!-- Modal cập nhật giao dịch thủ công -->
    <el-dialog :visible.sync="manualModalVisiable" :title="$t('open_manual')" :before-close="onCloseManualModal"
      class="preview-action-modal">
      <ul>
        <li class="color-yellow">
          {{ $t('deposit.open_manual_t1') }}
        </li>
        <li class="color-yellow">
          {{ $t('deposit.open_manual_t2') }}
        </li>
      </ul>
      <validation-observer ref="observer" class="kt-form">
        <b-form-group :label="$t('actual_amount')" class="form-group-amount">
          <vue-numeric v-model="form.actualAmount" :min="0" separator=","></vue-numeric>
        </b-form-group>

        <select2-with-validation :multiple="true" :required="true" v-model="form.transaction" :searchable="false"
          :placeholder="$t('deposit.bank')" :label="$t('deposit.bank')" :data-vv-as="$t('deposit.bank')"
          text-field="display" id-field="id" rules="required" name="transaction" ajax="/admin/transactions/suggest" />
      </validation-observer>
      <span slot="footer" class="dialog-footer">
        <el-button @click="validateForm" type="primary">
          {{ $t('button.send') }}
        </el-button>
      </span>
    </el-dialog>

    <!-- Modal cập nhật trạng thái xác minh -->
    <el-dialog :visible.sync="verifyModalVisiable" title="Xác minh giao dịch" class="preview-action-modal">
      <ul>
        <li>Áp dụng với giao dịch cần phải xác minh lại với đối tác</li>
        <li>Cập nhật trạng thái sau khi đã xác minh với đối tác</li>
      </ul>
      <div>
        Trạng thái hiện tại:
        <strong>
          {{ deposit.isVerifying ? 'ĐANG XÁC MINH' : 'ĐÃ XÁC MINH' }}
        </strong>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button :disabled="deposit.isVerifying" @click="onSubmitVerificationForm(true)" type="primary">
          Cần xác minh
        </el-button>
        <el-button :disabled="!deposit.isVerifying" @click="onSubmitVerificationForm(false)" type="success">
          Đã xác minh
        </el-button>
      </span>
    </el-dialog>

    <transaction-modal ref="modal" />
  </div>
</template>

<script>
import Form from 'vform'
import cloneDeep from 'lodash/cloneDeep'
import { ValidationObserver } from 'vee-validate'
import VueNumeric from 'vue-numeric'
import { formatDateTimeNormal } from '~/utils/formatTime'
import { formatPrice } from '~/utils/formatString'
import { notifyUpdateSuccess, notifyDanger } from '~/utils/bootstrap-notify'
import { getServerErrors } from '@/utils/utils'
import TransactionModal from '~/features/TransactionModal'
import Select2WithValidation from '~/components/base/input/Select2WithValidation'

const defaultVerificationForm = {
  isVerifying: false
}
const defaultForm = {
  isVerifying: false
}

export default {
  filters: {
    formatDateTimeNormal,
    formatPrice
  },
  components: {
    Select2WithValidation,
    ValidationObserver,
    TransactionModal,
    VueNumeric
  },
  props: {
    onActionSuccess: {
      type: Function,
      default: () => { }
    }
  },
  data() {
    return {
      deposit: {},
      visiable: false,
      resendModalVisiable: false,
      manualModalVisiable: false,
      verifyModalVisiable: false,
      vForm: new Form(),
      form: cloneDeep(defaultForm),
      verificationForm: cloneDeep(defaultVerificationForm)
    }
  },
  watch: {
    'form.transaction'(val) {
      this.form.actualAmount = val
        ? val.reduce((accum, item) => accum + item.amount, 0)
        : 0
    }
  },
  methods: {
    show(item) {
      this.deposit = cloneDeep(item)

      let transactions = []
      if (item?.bankTransactions?.length) {
        transactions = item.bankTransactions
      }
      if (item?.virtualTransactions?.length) {
        transactions = item.virtualTransactions
      }
      if (item?.cardTransactions?.length) {
        transactions = item.cardTransactions
      }

      this.deposit = {
        ...this.deposit,
        transactions
      }

      this.$nextTick(() => {
        this.visiable = true
      })
    },

    handleClose() {
      this.visiable = false
    },
    genStatus(key) {
      switch (key) {
        case 'PENDING':
          return `<span class="text-warning uppercase">
          ${this.$t('pending')}
          </span>`
        case 'SUCCEED':
          return `<span class="text-success uppercase">
          ${this.$t('succeed')}
          </span>`
        case 'VERIFYING':
          return `<span class="text-primary text-uppercase">
                 ${this.$t('verifying')}</span>`
        case 'CANCELED':
          return `<span class="text-danger uppercase">
          ${this.$t('canceled')}
          </span>`
        case 'FAILED':
          return `<span class="text-info uppercase">
          ${this.$t('failed')}
          </span>`
      }
    },
    genType(isManual) {
      return isManual
        ? `<span class="text-danger uppercase">${this.$t('manual')}</span>`
        : `<span class="text-success uppercase">${this.$t('auto')}</span>`
    },
    openResendModal() {
      this.visiable = false

      setTimeout(() => {
        this.resendModalVisiable = true
      }, 200)
    },
    openManualModal() {
      this.visiable = false

      setTimeout(() => {
        this.manualModalVisiable = true
      }, 200)
    },
    openVerifyModal() {
      this.visiable = false
      this.verificationForm.isVerifying = this.deposit.isVerifying

      setTimeout(() => {
        this.verifyModalVisiable = true
      }, 200)
    },
    showTransactionModal(item) {
      this.$refs.modal.show(item)
    },
    async resend() {
      try {
        const { data } = await this.$axios.post(
          '/admin/deposits/' + this.deposit.id + '/resend-callback'
        )
        if (data) {
          notifyUpdateSuccess(this.$t('transaction'))
          this.resendModalVisiable = false
        }
      } catch (e) {
        const mes = getServerErrors(e)
        notifyDanger(mes)
      }
    },
    async validateForm() {
      const isValid = await this.$refs.observer.validate()
      if (isValid) {
        this.manual()
      }
    },
    async verify() {
      try {
        const { data } = await this.$axios.post(
          '/admin/deposits/' +
          this.deposit.id +
          '/manual-deposits'
        )
        if (data) {
          notifyUpdateSuccess(this.$t('transaction'))
          this.onActionSuccess()
          this.handleClose()
        }

      } catch (error) {
        const mes = getServerErrors(e)
        notifyDanger(mes)
      }
    },
    async manual() {
      try {
        this.form.transactionIds = this.form.transaction.map((item) => {
          return item.id
        })
        this.vForm = new Form(this.form)
        await this.vForm.post(
          this.$axios.defaults.baseURL +
          '/admin/deposits/' +
          this.deposit.id +
          '/manual-deposits'
        )
        notifyUpdateSuccess(this.$t('transaction'))
        this.form = cloneDeep(defaultForm)
        this.onActionSuccess()
      } catch (e) {
        const mes = getServerErrors(e)
        notifyDanger(mes)
      }
    },
    async onSubmitVerificationForm(isVerifying) {
      try {
        this.vForm = new Form({
          isVerifying
        })
        await this.vForm.post(
          this.$axios.defaults.baseURL +
          '/admin/deposits/' +
          this.deposit.id +
          '/verify-deposit'
        )
        notifyUpdateSuccess(this.$t('transaction'))
        this.verifyModalVisiable = false
        this.onActionSuccess()
      } catch (e) {
        const mes = getServerErrors(e)
        notifyDanger(mes)
      }
    },
    onCloseManualModal() {
      this.form = cloneDeep(defaultForm)
      this.manualModalVisiable = false
    }
  }
}
</script>
