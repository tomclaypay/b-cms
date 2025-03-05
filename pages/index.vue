<template>
  <the-portlet title="Dashboard">
    <template v-slot:tool>
      <DateRangePicker v-model="timeRange" />
    </template>
    <b-row>
      <b-col :md="6" :sm="12" v-if="balance !== null && statistics" class="statistic">
        <div>
          <div>
            {{ $t('balance') }}
          </div>
          <div>{{ balance | formatPrice }}</div>
        </div>
      </b-col>
      <b-col :md="6" :sm="12" v-if="balance !== null && statistics" class="statistic">
        <div>
          <div>
            Floating balance
          </div>
          <div>
            {{
              (statistics.succeedDepositTotalAmount -
                statistics.succeedDepositTotalFee -
                statistics.succeedWithdrawalTotalAmount -
                statistics.succeedWithdrawalTotalFee -
                statistics.cashoutTotalAmount -
                statistics.cashoutTotalFee)
                | formatPrice
            }}
          </div>
        </div>
      </b-col>
    </b-row>
    <h2 class="mt-80 text-center uppercase">Giao dịch nạp</h2>
    <b-row v-if="balance !== null && statistics">
      <b-col :md="4" :sm="12" class="statistic">
        <div>
          <div>
            {{ $t('succeed_deposit_total') }}
          </div>
          <div>{{ statistics.succeedDepositTotal }}</div>
        </div>
      </b-col>
      <b-col :md="4" :sm="12" class="statistic">
        <div>
          <div>
            {{ $t('pending_deposit_total') }}
          </div>
          <div>{{ statistics.pendingDepositTotal }}</div>
        </div>
      </b-col>
      <b-col :md="4" :sm="12" class="statistic">
        <div>
          <div>
            {{ $t('manual_deposit_total') }}
          </div>
          <div>{{ statistics.manualDepositTotal }}</div>
        </div>
      </b-col>
      <b-col :offset-md="2" :md="4" :sm="12" class="statistic">
        <div>
          <div>
            {{ $t('succeed_deposit_total_amount') }}
          </div>
          <div>{{ statistics.succeedDepositTotalAmount | formatPrice }}</div>
        </div>
      </b-col>
      <b-col :md="4" :sm="12" class="statistic">
        <div>
          <div>
            {{ $t('succeed_deposit_total_fee') }}
          </div>
          <div>{{ statistics.succeedDepositTotalFee | formatPrice }}</div>
        </div>
      </b-col>
    </b-row>

    <h2 class="mt-80 text-center uppercase">Giao dịch rút</h2>
    <b-row v-if="balance !== null && statistics">
      <b-col :md="6" :sm="12" class="statistic withdrawl">
        <div>
          <div>
            {{ $t('succeed_withdrawal_total') }}
          </div>
          <div>{{ statistics.succeedWithdrawalTotal }}</div>
        </div>
      </b-col>
      <b-col :md="6" :sm="12" class="statistic withdrawl">
        <div>
          <div>
            {{ $t('pending_withdrawal_total') }}
          </div>
          <div>{{ statistics.pendingWithdrawalTotal }}</div>
        </div>
      </b-col>
      <b-col :md="6" :sm="12" class="statistic withdrawl">
        <div>
          <div>
            {{ $t('succeed_withdrawal_total_amount') }}
          </div>
          <div>{{ statistics.succeedWithdrawalTotalAmount | formatPrice }}</div>
        </div>
      </b-col>
      <b-col :md="6" :sm="12" class="statistic withdrawl">
        <div>
          <div>
            {{ $t('succeed_withdrawal_total_fee') }}
          </div>
          <div>{{ statistics.succeedWithdrawalTotalFee | formatPrice }}</div>
        </div>
      </b-col>
    </b-row>

    <h2 class="mt-80 text-center uppercase">Cashout</h2>
    <b-row v-if="balance !== null && statistics">
      <b-col :md="4" :sm="12" class="statistic cashout">
        <div>
          <div>
            {{ $t('cashout_total') }}
          </div>
          <div>{{ statistics.cashoutTotal }}</div>
        </div>
      </b-col>
      <b-col :md="4" :sm="12" class="statistic cashout">
        <div>
          <div>
            {{ $t('cashout_total_amount') }}
          </div>
          <div>{{ statistics.cashoutTotalAmount | formatPrice }}</div>
        </div>
      </b-col>
      <b-col :md="4" :sm="12" class="statistic cashout">
        <div>
          <div>
            {{ $t('cashout_total_fee') }}
          </div>
          <div>{{ statistics.cashoutTotalFee | formatPrice }}</div>
        </div>
      </b-col>
    </b-row>
  </the-portlet>
</template>

<script>
import moment from 'moment'
import ThePortlet from '~/components/base/ThePortlet'
import { formatPrice } from '~/utils/formatString'
import { convertToNewTimezone } from '~/utils/formatTime'
import { BALANCE_SHOW } from '~/constants/permissions'

export default {
  filters: { formatPrice },
  components: {
    ThePortlet,
    DateRangePicker: () => import('~/components/base/DateRangePicker')
  },
  data() {
    return {
      timeRange: [moment().startOf('month'), moment().endOf('day')],
      statistics: null,
      balance: 0
    }
  },
  mounted() {
    this.loadInit()
  },
  computed: {
    isBalanceShow() {
      return this.$canPermission(BALANCE_SHOW)
    }
  },
  watch: {
    timeRange(val) {
      this.loadData()
    }
  },

  methods: {
    async loadData() {
      const { data } = await this.$axios.get('/admin/summary', {
        params: {
          startDate: convertToNewTimezone(this.timeRange[0]),
          endDate: convertToNewTimezone(this.timeRange[1])
        }
      })
      this.statistics = data
    },
    async loadInit() {
      const { data } = await this.$axios.get('/admin/summary-balance')
      this.balance = data
    }
  }
}
</script>

<style lang="scss">
.statistic {
  padding: 10px;

  &.withdrawl > div {
    background: #0abb87;
  }

  &.cashout > div {
    background: #20d2dc;
  }

  & > div {
    background: #409eff;
    border-radius: 8px;
    padding: 20px;
    text-align: center;
    color: #fff;
    font-size: 16px;
    min-height: 100px;

    div:last-child {
      text-transform: uppercase;
      font-size: 24px;
      font-weight: bold;
    }
  }
}
</style>
