<template>
  <el-dialog
    :visible.sync="visiable"
    :before-close="handleClose"
    v-if="transaction"
    title="Virtual Transaction"
    class="preview-modal"
  >
    <div>Ref Id</div>
    <div class="p-box">{{ transaction.refId }}</div>

    <div>{{ $t('status') }}</div>
    <div v-html="genStatus(transaction.status)" class="p-box"></div>

    <div>Amout</div>
    <div class="p-box">{{ transaction.amount | formatPrice }}</div>

    <div>Paid Amount</div>
    <div class="p-box">{{ transaction.paidAmout | formatPrice }}</div>

    <div>Service Code</div>
    <div v-html="genServiceCode(transaction.serviceCode)" class="p-box"></div>

    <div>bankCode</div>
    <div class="p-box">{{ transaction.bankCode }}</div>

    <div>{{ $t('bank.name') }}</div>
    <div class="p-box">{{ transaction.bankName }}</div>

    <div>{{ $t('bank.account') }}</div>
    <div class="p-box">{{ transaction.bankAccountNo }}</div>

    <div>{{ $t('bank.account_name') }}</div>
    <div class="p-box">{{ transaction.bankAccountName }}</div>

    <el-switch
      v-model="transaction.isBankAccountEnabled"
      :active-text="$t('is_bank_account_enabled')"
      class="mb-2"
    >
    </el-switch>

    <div>Return Url</div>
    <div class="p-box">{{ transaction.returnUrl }}</div>

    <div>Cancel Url</div>
    <div class="p-box">{{ transaction.cancelUrl }}</div>

    <div>QR Url</div>
    <div class="p-box">{{ transaction.qrUrl }}</div>

    <div>Deposit Order</div>
    <div class="p-box">
      {{
        transaction.depositOrder &&
          transaction.depositOrder.code +
            ' | ' +
            transaction.depositOrder.ref +
            ' | '
      }}
      {{
        transaction.depositOrder &&
          transaction.depositOrder.amount | formatPrice
      }}
    </div>
    <div>Order Expiry Time</div>
    <div class="p-box">
      {{ transaction.orderExpiryTime | formatDateTimeNormal }}
    </div>
    <div>
      {{ $t('created_at') }}
    </div>
    <div class="p-box">
      {{ transaction.created_at | formatDateTimeNormal }}
    </div>
    <div>
      {{ $t('updated_at') }}
    </div>
    <div class="p-box">
      {{ transaction.updated_at | formatDateTimeNormal }}
    </div>

    <span slot="footer" class="dialog-footer">
      <el-button @click="visiable = false">{{ $t('cancel') }}</el-button>
    </span>
  </el-dialog>
</template>

<script>
import cloneDeep from 'lodash/cloneDeep'
import { formatDateTimeNormal } from '~/utils/formatTime'
import { formatPrice } from '~/utils/formatString'
export default {
  filters: {
    formatDateTimeNormal,
    formatPrice
  },
  data() {
    return {
      transaction: {},
      visiable: false
    }
  },
  methods: {
    show(item) {
      this.transaction = cloneDeep(item)

      this.$nextTick(() => {
        this.visiable = true
      })
    },

    handleClose() {
      this.visiable = false
    },
    genStatus(data) {
      switch (data) {
        case 'INITIAL':
          return `<span class="text-primary uppercase">INITIAL</span>`
        case 'PROCESSING':
          return `<span class="text-info uppercase">PROCESSING</span>`
        case 'SUCCEED':
          return `<span class="text-success uppercase">SUCCEED</span>`
        case 'CANCELED':
          return `<span class="text-warning uppercase">CANCELED</span>`
        case 'REVIEW':
          return `<span class="text-cyan uppercase">REVIEW</span>`
        case 'REFUNDING':
          return `<span class="text-indigo uppercase">REFUNDING</span>`
        case 'REFUNDED':
          return `<span class="text-fuchsia uppercase">REFUNDED</span>`
        case 'PENDING':
          return `<span class="text-orange uppercase">PENDING</span>`
        case 'WAIT_INSTALLMENT':
          return `<span class="text-emerald uppercase">WAIT_INSTALLMENT</span>`
        case 'REFUNDED_A_PART':
          return `<span class="text-yellow uppercase">REFUNDED_A_PART</span>`
      }
    },
    genServiceCode(data) {
      switch (data) {
        case 'COLLECTCASH':
          return `<span class="text-primary uppercase">COLLECTCASH</span>`
        case 'PAYCASH':
          return `<span class="text-success uppercase">PAYCASH</span>`
      }
    }
  }
}
</script>
