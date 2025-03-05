<template>
  <div>
    <el-dialog
      :visible.sync="visiable"
      :before-close="handleClose"
      v-if="withdrawal"
      :title="$t('transaction.detail')"
      class="preview-modal"
    >
      <div class="mb-5">{{ $t('status') }}</div>
      <div v-html="genStatus(withdrawal.status)" class="p-box mb-25"></div>

      <div v-if="withdrawal.note" class="mb-5">{{ $t('failed_reason') }}</div>
      <div v-if="withdrawal.note" class="p-box mb-25">
        {{ withdrawal.note }}
      </div>

      <div class="mb-5">{{ $t('code') }}</div>
      <div class="p-box mb-25">{{ withdrawal.code }}</div>

      <div class="mb-5">{{ $t('ref') }}</div>
      <div class="p-box mb-25">{{ withdrawal.ref }}</div>

      <div class="mb-5">{{ $t('deposit.amount') }}</div>
      <div class="p-box mb-25">{{ withdrawal.amount | formatPrice }}</div>

      <div class="mb-5">{{ $t('bank_name_dest') }}</div>
      <div class="p-box mb-25">{{ withdrawal.bankNameDest }}</div>

      <div class="mb-5">{{ $t('bank_account_number_dest') }}</div>
      <div class="p-box mb-25">{{ withdrawal.bankAccountNumberDest }}</div>

      <div class="mb-5">{{ $t('bank_account_name_dest') }}</div>
      <div class="p-box mb-25">{{ withdrawal.bankAccountNameDest }}</div>

      <div class="mb-5">Callback</div>
      <a
        :href="withdrawal.callbackUrl"
        target="_blank"
        class="p-box mb-25 block"
        >{{ withdrawal.callbackUrl }}</a
      >

      <div class="mb-5">{{ $t('deposit.bank') }}</div>
      <div
        @click="showTransactionModal(withdrawal.transaction)"
        v-if="withdrawal.transaction"
        class="color-secondary-2 cursor-pointer p-box mb-25"
      >
        {{
          withdrawal.transaction.bankName +
            ' | ' +
            withdrawal.transaction.bankAccount +
            ' | ' +
            withdrawal.transaction.reference
        }}
      </div>

      <div v-else class="p-box mb-25"></div>

      <div class="mb-5">{{ $t('deposit.type') }}</div>
      <div v-html="genType(withdrawal.isManual)" class="p-box mb-25"></div>

      <div>{{ $t('created_at') }}</div>
      <div class="p-box mb-25">
        {{ withdrawal.createdAt | formatDateTimeNormal }}
      </div>

      <div class="mb-5">{{ $t('updated_at') }}</div>
      <div class="p-box mb-25">
        {{ withdrawal.createdAt | formatDateTimeNormal }}
      </div>

      <span slot="footer" class="dialog-footer">
        <el-button @click="visiable = false">{{ $t('cancel') }}</el-button>
        <el-button @click="openQrGeneratorModal" type="warning">
          {{ $t('withdrawal_gen_qr') }}
        </el-button>
        <el-button
          @click="openUpdateStatusModal"
          v-if="withdrawal.status === 'PENDING'"
          type="danger"
        >
          {{ $t('update_status') }}
        </el-button>
        <el-button
          @click="openResendModal"
          v-if="withdrawal.status !== 'PENDING'"
          type="primary"
        >
          {{ $t('resend') }}
        </el-button>
        <el-button
          @click="openManualModal"
          v-if="isWithdrawalCrud && withdrawal.status === 'PENDING'"
          type="success"
        >
          {{ $t('open_manual') }}
        </el-button>
        <el-button
          v-if="
            isWithdrawalCrud &&
              (!this.withdrawal?.virtualTransaction || isWithdrawalMultiple)
          "
          @click="openAutoWithdrawalModal"
          type="primary"
        >
          {{ $t('withdrawal_crud') }}
        </el-button>
      </span>
    </el-dialog>

    <!-- Modal cập nhật giao dịch thủ công -->
    <el-dialog :visible.sync="manualModalVisiable" :title="$t('open_manual')">
      <ul>
        <li class="color-yellow">
          {{ $t('withdrawal.open_manual_t1') }}
        </li>
        <li class="color-yellow">
          {{ $t('withdrawal.open_manual_t2') }}
        </li>
        <li class="color-yellow">
          {{ $t('withdrawal.open_manual_t3') }}
        </li>
      </ul>
      <validation-observer ref="observer" class="kt-form">
        <b-text-input-with-validation
          v-model="form.bankNameSrc"
          :error="vForm.errors.get('bankNameSrc')"
          :required="true"
          label="Tên ngân hàng"
          placeholder="Tên ngân hàng"
          rules="required"
          name="bankNameSrc"
        />
        <b-text-input-with-validation
          v-model="form.bankAccountSrc"
          :error="vForm.errors.get('bankAccountSrc')"
          :required="true"
          label="Số tài khoản"
          placeholder="Số tài khoản"
          rules="required"
          name="bankAccountSrc"
        />

        <b-text-input-with-validation
          v-model="form.reference"
          :error="vForm.errors.get('reference')"
          :required="true"
          label="Ref"
          placeholder="Ref"
          rules="required"
          name="reference"
        />

        <b-form-group :label="$t('actual_amount')" class="form-group-amount">
          <vue-numeric
            v-model="form.actualAmount"
            :min="0"
            separator=","
          ></vue-numeric>
        </b-form-group>

        <b-text-area-with-validation
          v-model="form.content"
          :required="true"
          :label="$t('content')"
          :placeholder="$t('content')"
          :error="vForm.errors.get('content')"
          rules="required"
          rows="5"
          name="content"
        />
      </validation-observer>
      <span slot="footer" class="dialog-footer">
        <el-button @click="validateForm" type="primary">
          {{ $t('send') }}
        </el-button>
      </span>
    </el-dialog>

    <!-- Modal gửi lại callback -->
    <el-dialog
      :visible.sync="resendModalVisiable"
      :title="$t('resend')"
      class="preview-action-modal"
    >
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

    <!-- Modal cập nhật status khi giao dịch failed -->
    <el-dialog
      :visible.sync="updateStatusModalVisiable"
      :title="$t('update_status')"
      class="preview-action-modal"
    >
      <b-text-area-with-validation
        v-model="statusForm.note"
        :required="true"
        :label="$t('note')"
        :placeholder="$t('note')"
        :error="vForm.errors.get('note')"
        rules="required"
        rows="5"
        name="note"
      />
      <span slot="footer" class="dialog-footer">
        <el-button @click="updateStatus" type="primary">
          Gửi
        </el-button>
      </span>
    </el-dialog>

    <!-- Modal QR -->
    <el-dialog
      :visible.sync="qrGeneratorModalVisiable"
      title="QR Generator"
      class="preview-action-modal"
    >
      <img
        :src="
          `https://img.vietqr.io/image/${withdrawal.bankNameDest}-${withdrawal.bankAccountNumberDest}-compact2.png?amount=${withdrawal.amount}&addInfo=${withdrawal.code}&accountName=${withdrawal.bankAccountNameDest}`
        "
        class="qr-generator"
      />
    </el-dialog>

    <el-dialog
      :visible.sync="autoWithdrawalModalVisiable"
      :title="$t('confirm_bank_information')"
    >
      <validation-observer ref="autoWithdrawal" class="kt-form">
        <select2-with-validation
          v-if="bankNameDestOptions"
          :required="true"
          v-model="autoWithdrawalForm.bankNameDest"
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
        <div class="mb-5">{{ $t('bank_account_number_dest') }}</div>
        <div class="p-box mb-25">{{ withdrawal.bankAccountNumberDest }}</div>

        <div class="mb-5">{{ $t('bank_account_name_dest') }}</div>
        <div class="p-box mb-25">{{ withdrawal.bankAccountNameDest }}</div>
        <el-button
          :loading="isLoadingAutoWithdrawal"
          @click="validateAutoWithdrawalForm"
          type="primary"
        >
          {{ $t('confirm') }}
        </el-button>
      </validation-observer>
    </el-dialog>

    <transaction-modal ref="modal" />
  </div>
</template>

<script>
import Form from 'vform'
import cloneDeep from 'lodash/cloneDeep'
// import find from 'lodash/find'
import { ValidationObserver } from 'vee-validate'
import VueNumeric from 'vue-numeric'
import { formatDateTimeNormal } from '~/utils/formatTime'
import { formatPrice } from '~/utils/formatString'
import { notifyUpdateSuccess, notifyDanger } from '~/utils/bootstrap-notify'
import { getServerErrors } from '@/utils/utils'
import TransactionModal from '~/features/TransactionModal'
import {
  WITHDRAWAL_CRUD,
  WITHDRAWAL_MULTIPLE_AUTO
} from '~/constants/permissions'
import BTextInputWithValidation from '~/components/base/input/BTextInputWithValidation'
import BTextAreaWithValidation from '~/components/base/input/BTextAreaWithValidation'
import Select2WithValidation from '~/components/base/input/Select2WithValidation'

const defaultForm = {
  bankNameSrc: '',
  bankAccountSrc: '',
  actualAmount: 0,
  content: '',
  reference: ''
}

const defaultStatusForm = {
  note: '',
  status: 'FAILED'
}

const defaultAutoWithdrawalForm = {
  bankNameDest: ''
}

export default {
  filters: {
    formatDateTimeNormal,
    formatPrice
  },
  components: {
    ValidationObserver,
    TransactionModal,
    BTextAreaWithValidation,
    BTextInputWithValidation,
    VueNumeric,
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
      withdrawal: {},
      visiable: false,
      bankNameDestOptions: [],
      manualModalVisiable: false,
      resendModalVisiable: false,
      updateStatusModalVisiable: false,
      qrGeneratorModalVisiable: false,
      autoWithdrawalModalVisiable: false,
      isLoadingAutoWithdrawal: false,
      autoWithdrawalForm: cloneDeep(defaultAutoWithdrawalForm),
      vForm: new Form(),
      form: cloneDeep(defaultForm),
      statusForm: cloneDeep(defaultStatusForm),
      options: [
        // { id: 'PENDING', text: 'Đang chờ' },
        { id: 'SUCCEED', text: this.$t('succeed') },
        { id: 'CANCELED', text: this.$t('canceled') }
        // { id: 'FAILED', text: 'Bị lỗi' }
      ]
    }
  },
  computed: {
    isWithdrawalCrud() {
      return this.$canPermission(WITHDRAWAL_CRUD)
    },
    isWithdrawalMultiple() {
      return this.$canPermission(WITHDRAWAL_MULTIPLE_AUTO)
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
    show(item) {
      this.withdrawal = cloneDeep(item)
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
    openUpdateStatusModal() {
      this.visiable = false

      setTimeout(() => {
        this.updateStatusModalVisiable = true
      }, 200)
    },
    openAutoWithdrawalModal() {
      this.visiable = false
      this.autoWithdrawalForm.bankNameDest = this.bankNameDestOptions.find(
        (x) => x.text === this.withdrawal.bankNameDest
      )

      setTimeout(() => {
        this.autoWithdrawalModalVisiable = true
      }, 200)
    },
    openQrGeneratorModal() {
      this.visiable = false

      setTimeout(() => {
        this.qrGeneratorModalVisiable = true
      }, 200)
    },
    showTransactionModal(item) {
      this.$refs.modal.show(item)
    },
    async validateForm() {
      const isValid = await this.$refs.observer.validate()
      if (isValid) {
        this.manual()
      }
    },
    async validateAutoWithdrawalForm() {
      const isValid = await this.$refs.autoWithdrawal.validate()
      if (isValid && this.isLoadingAutoWithdrawal === false) {
        this.isLoadingAutoWithdrawal = true
        this.autoWithdrawal()
      }
    },
    async manual() {
      try {
        this.vForm = new Form(this.form)
        await this.vForm.post(
          this.$axios.defaults.baseURL +
            '/admin/withdrawals/' +
            this.withdrawal.id +
            '/manual-withdrawal'
        )
        notifyUpdateSuccess(this.$t('transaction'))
        this.manualModalVisiable = false
        this.onActionSuccess()
      } catch (e) {
        console.log(e)
        const mes = getServerErrors(e)
        notifyDanger(mes)
      }
    },
    async resend() {
      try {
        const { data } = await this.$axios.post(
          '/admin/withdrawals/' + this.withdrawal.id + '/resend-callback'
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
    async updateStatus() {
      try {
        this.vForm = new Form(this.statusForm)
        await this.vForm.post(
          this.$axios.defaults.baseURL +
            '/admin/withdrawals/' +
            this.withdrawal.id +
            '/update-status'
        )
        notifyUpdateSuccess(this.$t('transaction'))
        this.manualModalVisiable = false
        this.onActionSuccess()
      } catch (e) {
        console.log(e)
        const mes = getServerErrors(e)
        notifyDanger(mes)
      }
    },
    async autoWithdrawal() {
      try {
        if (!this.isLoadingAutoWithdrawal) return
        const { data } = await this.$axios.post(
          '/admin/withdrawals/' + this.withdrawal.id + '/auto-withdrawal',
          {
            bankName: this.autoWithdrawalForm.bankNameDest.id
          }
        )
        this.isLoadingAutoWithdrawal = false
        if (data) {
          notifyUpdateSuccess(this.$t('transaction'))
          this.autoWithdrawalModalVisiable = false
          this.onActionSuccess()
        }
      } catch (error) {
        this.isLoadingAutoWithdrawal = false
        const mes = getServerErrors(error)
        notifyDanger(mes)
      }
    }
  }
}
</script>

<style lang="scss">
.qr-generator {
  width: 100%;
}
</style>
