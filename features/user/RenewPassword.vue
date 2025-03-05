<template>
  <b-modal
    ref="renewPasswordModal"
    :cancel-title="$t('button.cancel')"
    :ok-title="$t('button.update')"
    :title="$t('user.renew_password')"
    @ok="handleModalOk"
    @hidden="handleModalHide"
    size="lg"
  >
    <validation-observer ref="observer" class="kt-form">
      <form-control
        v-model="form.username"
        :error="vForm.errors.get('username')"
        :is-disabled="true"
        label="Username"
        data-vv-as="Username"
        name="username"
      />

      <b-text-input-with-validation
        v-model="form.password"
        :label="$t('user.password')"
        :error="vForm.errors.get('password')"
        :required="true"
        :vid="$t('user.password')"
        :rules="'required|max:128|isPassword'"
        :placeholder="$t('user.password')"
        type="password"
        name="password"
      />

      <b-text-input-with-validation
        :placeholder="$t('user.repassword')"
        v-model="form.repassword"
        :label="$t('user.repassword')"
        :data-vv-as="$t('user.repassword')"
        :error="vForm.errors.get('repassword')"
        :required="true"
        :rules="`required|max:128|confirmedTarget:${$t('user.password')}`"
        type="password"
        name="email"
      />
    </validation-observer>
    <template #modal-footer="{ ok, cancel }">
      <el-button @click="cancel()">{{ $t('button.cancel') }}</el-button>
      <el-button type="primary" :loading="isLoadingBtn" @click="ok()">{{
        $t('button.update')
      }}</el-button>
    </template>
  </b-modal>
</template>

<script>
import Form from 'vform'
import cloneDeep from 'lodash/cloneDeep'
import { ValidationObserver } from 'vee-validate'
import FormControl from '~/components/base/FormControl'
import { notifyTryAgain, notifyUpdateSuccess } from '~/utils/bootstrap-notify'
import BTextInputWithValidation from '~/components/base/input/BTextInputWithValidation'

const defaultForm = {
  username: '',
  password: '',
  repassword: ''
}

export default {
  name: 'RenewPasswordModal',
  components: { FormControl, ValidationObserver, BTextInputWithValidation },
  props: {
    onActionSuccess: {
      type: Function,
      default: () => {}
    },
    isReviewer: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      isEdit: false,
      isLoadingBtn: false,
      form: cloneDeep(defaultForm),
      vForm: new Form()
    }
  },
  mounted() {},
  methods: {
    show(item = null) {
      if (item) {
        this.form = cloneDeep(item)
      }
      this.form.password = null
      this.form.repassword = null

      this.$nextTick(() => {
        this.$refs.renewPasswordModal.show()
      })
    },
    async handleModalOk(bvModalEvt) {
      bvModalEvt.preventDefault()

      await this.validateForm()
    },
    handleModalHide(bvModalEvt) {
      this.form = cloneDeep(defaultForm)
    },
    async validateForm() {
      const isValid = await this.$refs.observer.validate()
      if (isValid) {
        this.isLoadingBtn = true
        await this.savePassword()
      }
    },
    async savePassword() {
      try {
        this.vForm = new Form({
          password: this.form.password,
          role: this.form.role.id
        })
        await this.vForm.patch(
          this.$axios.defaults.baseURL +
            '/admin/users/' +
            this.form.id +
            '/update'
        )
        notifyUpdateSuccess(this.$t('user.update_password'))
        this.isLoadingBtn = false
        this.$refs.renewPasswordModal.hide()
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
