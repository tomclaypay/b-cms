<template>
  <b-modal
    ref="modal"
    :cancel-title="$t('button.cancel')"
    :ok-title="isEdit ? $t('button.update') : $t('button.add')"
    :title="isEdit ? $t('user.edit') : $t('user.add')"
    :no-enforce-focus="true"
    @ok="handleModalOk"
    @hidden="handleModalHide"
    size="lg"
  >
    <validation-observer ref="observer" class="kt-form">
      <b-text-input-with-validation
        v-model="form.username"
        :required="true"
        :error="vForm.errors.get('username')"
        v-if="!isEdit"
        label="Username"
        placeholder="Username"
        rules="required|max:255"
        name="username"
      />
      <b-text-input-with-validation
        v-model="form.fullName"
        :required="true"
        :error="vForm.errors.get('user.fullName')"
        label="Họ tên"
        placeholder="Họ tên"
        rules="required|max:255"
        name="fullName"
      />

      <b-text-input-with-validation
        v-show="!isEdit"
        v-model="form.password"
        :label="$t('user.password')"
        :placeholder="$t('user.password')"
        :data-vv-as="$t('user.password')"
        :error="vForm.errors.get('password')"
        :required="true"
        :rules="!isEdit ? 'required|max:128|isPassword' : ''"
        :vid="$t('user.password')"
        type="password"
        name="password"
      />

      <b-text-input-with-validation
        v-show="!isEdit"
        v-model="form.repassword"
        :label="$t('user.repassword')"
        :data-vv-as="$t('user.repassword')"
        :placeholder="$t('user.repassword')"
        :error="vForm.errors.get('repassword')"
        :required="true"
        :rules="
          !isEdit
            ? `required|max:128|confirmedTarget:${$t('user.password')}`
            : ''
        "
        type="password"
        name="repassword"
      />

      <role-chosen
        v-model="form.role"
        :error="vForm.errors.get('role')"
        rules="required"
        name="role"
      />

      <el-switch v-model="form.active" active-text="Đang hoạt động">
      </el-switch>
    </validation-observer>
    <template #modal-footer="{ ok, cancel }">
      <el-button @click="cancel()">{{ $t('button.cancel') }}</el-button>
      <el-button type="primary" :loading="isLoadingBtn" @click="ok()">{{
        isEdit ? $t('button.update') : $t('button.add')
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
  notifyUpdateSuccess,
  notifyDanger
} from '~/utils/bootstrap-notify'
import RoleChosen from '~/components/elements/role/RoleChosen'
import BTextInputWithValidation from '~/components/base/input/BTextInputWithValidation'

const defaultForm = {
  fullName: '',
  username: '',
  password: '',
  repassword: '',
  role: null,
  active: true
}

export default {
  name: 'UserModal',
  components: {
    ValidationObserver,
    RoleChosen,
    BTextInputWithValidation
  },
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
        this.isEdit = true
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
      this.vForm = new Form(this.form)
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
        this.form.role = this.form.role.id
        const formData = cloneDeep(this.form)
        this.vForm = new Form(formData)

        await this.vForm.post(
          this.$axios.defaults.baseURL + '/admin/users/create'
        )
        notifyAddSuccess(this.$t('user.user'))
        this.isLoadingBtn = false
        this.$refs.modal.hide()
        this.onActionSuccess()
      } catch (e) {
        this.isLoadingBtn = false
        if (e.response) {
          const error = e.response.data.message
          if (error && error[0]) {
            notifyDanger(error[0])
          } else {
            notifyTryAgain()
          }
        } else {
          notifyTryAgain()
        }
      }
    },
    async updateItem() {
      try {
        this.form.role = this.form.role.id
        const formData = cloneDeep(this.form)
        this.vForm = new Form(formData)

        await this.vForm.patch(
          this.$axios.defaults.baseURL +
            '/admin/users/' +
            this.form.id +
            '/update'
        )

        notifyUpdateSuccess(this.$t('user.user'))
        this.isLoadingBtn = false
        this.$refs.modal.hide()
        this.onActionSuccess()
        await this.$auth.fetchUser()
      } catch (e) {
        this.isLoadingBtn = false
        if (e.response) {
          const error = e.response.data.message
          if (error && error[0]) {
            notifyDanger(error[0])
          } else {
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
