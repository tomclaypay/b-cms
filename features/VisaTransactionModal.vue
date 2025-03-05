<template>
  <el-dialog
    :visible.sync="visiable"
    :before-close="handleClose"
    v-if="process"
    :title="$t('process.detail')"
    class="preview-modal"
  >
    <div>Ref Id</div>
    <div class="p-box">{{ process.refId }}</div>

    <div>{{ $t('status') }}</div>
    <div v-html="genStatus(process.status)" class="p-box"></div>

    <div>Fee</div>
    <div class="p-box">{{ process.fee | formatPrice }}</div>

    <div>Fullname</div>
    <div class="p-box">{{ process.fullname }}</div>

    <div>Email</div>
    <div class="p-box">{{ process.email }}</div>

    <div>Mobile</div>
    <div class="p-box">{{ process.mobile }}</div>

    <div>Address</div>
    <div class="p-box">{{ process.address }}</div>

    <div>Return Url</div>
    <div class="p-box">{{ process.returnUrl }}</div>

    <div>Cancel Url</div>
    <div class="p-box">{{ process.cancelUrl }}</div>

    <div>Checkout Url</div>
    <div class="p-box">{{ process.checkoutUrl }}</div>

    <div>Payment Method Code</div>
    <div class="p-box">{{ process.paymentMethodCode }}</div>

    <div>Deposit Order</div>
    <div class="p-box">
      {{
        process.depositOrder &&
          process.depositOrder.orderCode +
            ' | ' +
            process.depositOrder.orderRef +
            ' | ' +
            process.depositOrder.orderType +
            ' | '
      }}
      {{ process.depositOrder && process.depositOrder.amount | formatPrice }}
    </div>

    <div>
      {{ $t('created_at') }}
    </div>
    <div class="p-box">
      {{ process.created_at | formatDateTimeNormal }}
    </div>
    <div>
      {{ $t('updated_at') }}
    </div>
    <div class="p-box">
      {{ process.updated_at | formatDateTimeNormal }}
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
      process: {},
      visiable: false
    }
  },
  methods: {
    show(item) {
      this.process = cloneDeep(item)

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
      }
    }
  }
}
</script>
