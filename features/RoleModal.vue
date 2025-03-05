<template>
  <b-modal
    ref="modal"
    :cancel-title="$t('button.cancel')"
    :ok-title="isEdit ? $t('button.update') : $t('button.add')"
    :title="isEdit ? $t('role.edit') : $t('role.add')"
    :no-enforce-focus="true"
    @ok="handleModalOk"
    @show="onShow"
    @hidden="handleModalHide"
    size="lg"
  >
    <validation-observer ref="observer" class="kt-form">
      <b-text-input-with-validation
        v-model="form.title"
        :required="true"
        :error="vForm.errors.get('title')"
        label="Tiêu đề"
        placeholder="Tiêu đề"
        rules="required|max:100"
        name="title"
      />

      <b-text-input-with-validation
        v-model="form.key"
        :required="true"
        :error="vForm.errors.get('key')"
        label="Role key"
        placeholder="Role key"
        rules="required|max:255"
        name="key"
      />

      <b-text-area-with-validation
        v-model="form.description"
        :label="$t('role.description')"
        :placeholder="$t('role.description')"
        :error="vForm.errors.get('description')"
        rules="max:255"
        name="description"
      />
    </validation-observer>

    <div class="form-group m-form__group">
      <div class="row">
        <div class="col-md-12">
          <label>Danh sách quyền người dùng</label>
          <div class="input-group">
            <input
              v-model="search"
              type="text"
              class="form-control"
              placeholder="Tìm kiếm quyền người dùng"
            />
            <div class="input-group-append">
              <span class="input-group-text"><i class="la la-search"></i></span>
            </div>
          </div>
        </div>
      </div>

      <perfect-scrollbar class="inputSearchPermission">
        <div class="container-fluid row">
          <div
            v-for="item in filteredList"
            :key="item._id"
            class="col-md-6"
            data-height="150"
          >
            <div class="kt-checkbox kt-checkbox--primary">
              <label class="kt-checkbox kt-checkbox--bold kt-checkbox--brand">
                <input
                  :value="item.id"
                  v-model="form.permissionIdList"
                  type="checkbox"
                  class="form-check-input"
                />
                {{ item.title }}
                <span></span>
              </label>
            </div>
          </div>
        </div>
      </perfect-scrollbar>
    </div>
    <template #modal-footer="{ ok, cancel }">
      <el-button @click="cancel()">{{ $t('button.cancel') }}</el-button>
      <el-button type="primary" :loading="isLoadingBtn" @click="ok()">{{
        isEdit ? $t('button.update') : $t('button.add')
      }}</el-button>
    </template>
  </b-modal>
</template>

<style>
.inputSearchPermission {
  height: 200px;
  margin-top: 20px;
}
</style>

<script>
import Form from 'vform'
import cloneDeep from 'lodash/cloneDeep'
import $ from 'jquery'
import { ValidationObserver } from 'vee-validate'
import {
  notifyAddSuccess,
  notifyTryAgain,
  notifyUpdateSuccess
} from '~/utils/bootstrap-notify'
import BTextInputWithValidation from '~/components/base/input/BTextInputWithValidation'
import BTextAreaWithValidation from '~/components/base/input/BTextAreaWithValidation'

const defaultForm = {
  key: '',
  title: '',
  description: '',
  permissionIdList: []
}

export default {
  name: 'RoleModal',
  components: {
    ValidationObserver,
    BTextInputWithValidation,
    BTextAreaWithValidation
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
      permissionList: [],
      search: ''
    }
  },
  computed: {
    // function search permission
    filteredList() {
      return this.permissionList.filter((item) => {
        return item.title.toLowerCase().includes(this.search.toLowerCase())
      })
    }
  },
  mounted() {
    this.loadData()
  },
  methods: {
    async loadData() {
      try {
        const res = await this.$axios.get('admin/permissions')
        const { data } = res
        this.permissionList = data
      } catch (e) {}
    },
    show(item = null) {
      if (item) {
        this.isEdit = true
        this.form = cloneDeep(item)

        // cập nhật những permission có sẵn
        this.form.permissionIdList = this.form.permissions.map(function(e) {
          return e
        })
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
        await this.vForm.post(this.$axios.defaults.baseURL + '/admin/roles')
        notifyAddSuccess('Nhóm người dùng')
        this.isLoadingBtn = false
        this.$refs.modal.hide()
        await this.$auth.fetchUser()
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
          this.$axios.defaults.baseURL + '/admin/roles/' + this.form.id
        )

        notifyUpdateSuccess('Nhóm người dùng')
        this.isLoadingBtn = false
        this.$refs.modal.hide()
        this.onActionSuccess()
        await this.$auth.fetchUser()
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
    onShow() {
      $('.inputSearchPermission').animate({ scrollTop: 0 }, 'slow')
    }
  }
}
</script>
