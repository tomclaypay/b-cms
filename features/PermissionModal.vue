<template>
  <b-modal
    ref="modal"
    :cancel-title="$t('button.cancel')"
    :ok-title="isEdit ? $t('button.update') : $t('button.add')"
    :title="isEdit ? $t('permission.edit') : $t('permission.add')"
    @ok="handleModalOk"
    @hidden="handleModalHide"
    size="lg"
    no-enforce-focus
    no-close-on-backdrop
  >
    <validation-observer ref="observer" class="kt-form">
      <b-text-input-with-validation
        v-model="form.title"
        :required="true"
        :error="vForm.errors.get('title')"
        label="Tiêu đề"
        placeholder="Tiêu đề"
        rules="required|max:100|isPermissionName"
        name="title"
      />

      <b-text-input-with-validation
        v-model="form.key"
        :required="true"
        :error="vForm.errors.get('key')"
        label="Permission key"
        placeholder="Permission key"
        rules="required|max:255"
        name="key"
      />

      <b-text-area-with-validation
        v-model="form.description"
        :label="$t('permission.description')"
        :placeholder="$t('permission.description')"
        :error="vForm.errors.get('description')"
        rules="max:255"
        rows="5"
        name="description"
      />
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
  notifyUpdateSuccess
} from '~/utils/bootstrap-notify'
import BTextInputWithValidation from '~/components/base/input/BTextInputWithValidation'
import BTextAreaWithValidation from '~/components/base/input/BTextAreaWithValidation'

const defaultForm = {
  title: '',
  key: '',
  description: ''
}

export default {
  name: 'PermissionModal',
  components: {
    BTextAreaWithValidation,
    BTextInputWithValidation,
    ValidationObserver
  },
  props: {
    onActionSuccess: {
      type: Function,
      default: () => {}
    }
  },
  data() {
    return {
      isEdit: false,
      isLoadingBtn: false,
      form: cloneDeep(defaultForm),
      vForm: new Form(),
      selected: null
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
        this.vForm = new Form(this.form)
        await this.vForm.post(
          this.$axios.defaults.baseURL + '/admin/permissions'
        )
        notifyAddSuccess(this.$t('permission.permission'))
        this.isLoadingBtn = false
        this.$refs.modal.hide()
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
    },
    async updateItem() {
      try {
        this.vForm = new Form(this.form)
        await this.vForm.patch(
          this.$axios.defaults.baseURL + '/admin/permissions/' + this.form.id
        )

        notifyUpdateSuccess(this.$t('permission.permission'))
        this.isLoadingBtn = false
        this.$refs.modal.hide()
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
