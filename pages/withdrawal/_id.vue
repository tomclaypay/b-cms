<template>
  <the-portlet>
    <div v-if="withdrawal">
      <div class="mb-5">{{ $t('status') }}</div>
      <div v-html="genStatus(withdrawal.status)" class="p-box mb-25"></div>

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
        :href="withdrawal.callback"
        target="_blank"
        class="p-box mb-25 block"
        >{{ withdrawal.callback }}</a
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
        <el-button
          @click="openResendModal"
          v-if="withdrawal.status !== 'SUCCEED'"
          type="primary"
        >
          {{ $t('resend') }}
        </el-button>
        <el-button
          @click="openManualModal"
          v-if="isWithDrawalCrud && withdrawal.status === 'PENDING'"
          type="success"
        >
          {{ $t('open_manual') }}
        </el-button>
        <el-button v-if="isWithDrawalCrud" type="primary">
          {{ $t('withdrawal_crud') }}
        </el-button>
      </span>

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

      <transaction-modal ref="modal" />
    </div>
  </the-portlet>
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
import { WITHDRAWAL_CRUD } from '~/constants/permissions'
import BTextInputWithValidation from '~/components/base/input/BTextInputWithValidation'
import BTextAreaWithValidation from '~/components/base/input/BTextAreaWithValidation'
import ThePortlet from '~/components/base/ThePortlet'

const defaultForm = {
  bankNameSrc: '',
  bankAccountSrc: '',
  actualAmount: 0,
  content: '',
  reference: ''
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
    ThePortlet
  },
  props: {
    onActionSuccess: {
      type: Function,
      default: () => {}
    }
  },
  data() {
    return {
      withdrawal: null,
      vForm: new Form(),
      form: cloneDeep(defaultForm),
      options: [
        // { id: 'PENDING', text: 'Đang chờ' },
        { id: 'SUCCEED', text: this.$t('succeed') },
        { id: 'CANCELED', text: this.$t('canceled') }
        // { id: 'FAILED', text: 'Bị lỗi' }
      ]
    }
  },
  computed: {
    isWithDrawalCrud() {
      return this.$canPermission(WITHDRAWAL_CRUD)
    }
  },
  mounted() {
    this.loadData()
  },
  methods: {
    async loadData() {
      const { data } = await this.$axios.get(
        '/admin/withdrawals/' + this.$route.params.id
      )
      this.withdrawal = data
    },

    handleClose() {},
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
      setTimeout(() => {
        this.resendModalVisiable = true
      }, 200)
    },
    openManualModal() {
      // const $ = this
      // this.form.status = find(this.options, function(o) {
      //   return o.id === $.withdrawal.status
      // })

      setTimeout(() => {
        this.manualModalVisiable = true
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
        }
      } catch (e) {
        const mes = getServerErrors(e)
        notifyDanger(mes)
      }
    }
  }
}
</script>
