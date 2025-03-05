<template>
  <el-dialog
    :visible.sync="visiable"
    :before-close="handleClose"
    v-if="transaction"
    :title="$t('transaction.detail')"
    class="preview-modal"
  >
    <div class="mb-5">{{ $t('bank.name') }}</div>
    <div class="p-box mb-25">{{ transaction.bankName }}</div>

    <div class="mb-5">{{ $t('bank.account') }}</div>
    <div class="p-box mb-25">{{ transaction.bankAccount }}</div>

    <div class="mb-5">{{ $t('deposit.type') }}</div>
    <div class="p-box mb-25">{{ transaction.transactionType }}</div>

    <div class="mb-5">{{ $t('reference') }}</div>
    <div class="p-box mb-25">{{ transaction.reference }}</div>

    <div class="mb-5">{{ $t('content') }}</div>
    <div class="p-box mb-25">{{ transaction.content }}</div>

    <div class="mb-5">{{ $t('Số tiền') }}</div>
    <div class="p-box mb-25">{{ transaction.amount | formatPrice }}</div>

    <div class="mb-5">{{ $t('transaction.time') }}</div>
    <div class="p-box mb-25">
      {{ transaction.transactionTime | formatDateTimeNormal }}
    </div>

    <div class="mb-5">{{ $t('transaction.created_at') }}</div>
    <div class="p-box mb-25">
      {{ transaction.created_time | formatDateTimeNormal }}
    </div>

    <div class="mb-5">
      {{ $t('transaction.updated_at') }}
    </div>
    <div class="p-box mb-25">
      {{ transaction.updated_time | formatDateTimeNormal }}
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
    }
  }
}
</script>
