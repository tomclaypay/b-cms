<template>
  <div
    class="kt-grid__item kt-grid__item--fluid kt-grid kt-grid--desktop kt-grid--ver-desktop kt-grid--hor-tablet-and-mobile"
  >
    <!--begin::Aside-->
    <div
      :style="
        `background-image:url(${require('~/assets/media/auth/login-visual-1.svg')})`
      "
      class="aside-img d-flex flex-row-fluid bgi-no-repeat bgi-position-y-bottom bgi-position-x-center login-background"
    >
      <div class="login-text-wrapper">
        <a href="javascript:;" class="kt-login__logo">
          <img src="~assets/media/logos/favicon.png" />
        </a>
        <h2
          class="kt-font-weight-bolder text-center font-size-h4 font-size-h1-lg"
        >
          SmartGateway
        </h2>
      </div>
    </div>

    <!--begin::Aside-->

    <!--begin::Content-->
    <div
      class="kt-grid__item kt-grid__item--fluid kt-grid__item--order-tablet-and-mobile-1 kt-login__wrapper"
    >
      <!--begin::Body-->
      <div class="kt-login__body">
        <!--begin::Signin-->
        <div class="kt-login__form">
          <div class="kt-login__title">
            <h3>
              {{ $t('login.title') }}
            </h3>
          </div>
          <validation-observer ref="form" v-slot="{ passes }">
            <!--begin::Form-->
            <form
              @submit.prevent="passes(validateBeforeSubmit)"
              class="kt-form"
              method="post"
            >
              <validation-provider
                v-slot="{ errors }"
                name="Tên đăng nhập"
                rules="required"
              >
                <div class="form-group">
                  <input
                    v-model="username"
                    :placeholder="$t('login.username')"
                    class="form-control"
                    type="text"
                    autocomplete="off"
                  />
                  <div class="validated">
                    <p class="invalid-feedback">{{ errors[0] }}</p>
                  </div>
                </div>
              </validation-provider>

              <validation-provider
                v-slot="{ errors }"
                rules="required"
                name="Mật khẩu"
              >
                <div class="form-group">
                  <input
                    v-model="password"
                    :placeholder="$t('login.password')"
                    class="form-control"
                    type="password"
                    name="Mậu khẩu"
                  />
                  <div class="validated">
                    <p class="invalid-feedback">{{ errors[0] }}</p>
                  </div>
                </div>
              </validation-provider>
              <div class="kt-login__actions">
                <a href="#" class="kt-link kt-login__link-forgot">
                  {{ $t('login.forgot_password') }}
                </a>
                <button
                  id="kt_login_signin_submit"
                  class="btn btn-primary btn-elevate kt-login__btn-primary"
                >
                  {{ $t('login.title') }}
                </button>
              </div>
              <div v-if="error" class="form-group validated">
                <p class="invalid-feedback">
                  {{ $t('login.wrong_info') }}
                </p>
              </div>
            </form>
          </validation-observer>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ValidationProvider, ValidationObserver } from 'vee-validate'

export default {
  name: 'Login',
  components: { ValidationProvider, ValidationObserver },
  layout: 'auth',
  middleware: 'guest',
  head() {
    return {
      title: 'Đăng nhập'
    }
  },
  data() {
    return {
      username: '',
      password: '',
      isLoading: false,
      error: null
    }
  },
  methods: {
    validateBeforeSubmit() {
      this.login()
    },
    async login() {
      try {
        this.isLoading = true

        await this.$auth.login({
          data: {
            username: this.username.toLowerCase(),
            password: this.password
          }
        })

        this.isLoading = false

        // if (this.canBrokerCRUD) {
        this.$router.push('/')
        // }
      } catch (e) {
        this.error = e
        this.isLoading = false
      }
    }
  }
}
</script>
