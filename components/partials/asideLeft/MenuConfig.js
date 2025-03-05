import * as permissions from '~/constants/permissions'

export default [
  {
    title: 'menu.dashboard',
    icon: 'flaticon2-architecture-and-city',
    page: '/',
    bullet: 'dot'
  },
  {
    title: 'Banks',
    permission: permissions.BANK_CRUD,
    icon: 'flaticon-piggy-bank',
    page: '/banks',
    bullet: 'dot'
  },
  {
    title: 'Settings',
    permission: permissions.SETTING_CRUD,
    icon: 'flaticon2-gear',
    page: '/settings',
    bullet: 'dot'
  },
  {
    title: 'Withdrawals',
    permission: permissions.WITHDRAWAL_GET,
    icon: 'flaticon-interface-3',
    page: '/withdrawal',
    bullet: 'dot'
  },
  {
    title: 'Deposits',
    permission: permissions.DEPOSIT_GET,
    icon: 'flaticon-price-tag',
    page: '/deposits',
    bullet: 'dot'
  },
  {
    title: 'Bank transactions',
    permission: permissions.TRANSACTION_GET,
    icon: 'flaticon-graphic-1',
    page: '/transactions',
    bullet: 'dot'
  },
  {
    title: 'Cashouts',
    permission: permissions.CASHOUT_GET,
    icon: 'flaticon-reply',
    page: '/cashouts'
  },
  {
    title: 'Card Transaction',
    permission: permissions.CARD_TRANSACTION_GET,
    icon: 'flaticon-cart',
    page: '/card-transaction',
    bullet: 'dot'
  },
  {
    title: 'Virtual Transaction',
    permission: permissions.VIRTUAL_TRANSACTION_GET,
    icon: 'flaticon-app',
    page: '/virtual-transaction',
    bullet: 'dot'
  },
  {
    title: 'menu.access_management',
    icon: 'flaticon-profile-1',
    bullet: 'dot',
    submenu: [
      {
        permission: permissions.USER_CRUD,
        title: 'menu.user_management',
        page: '/user'
      },
      {
        permission: permissions.ROLE_CRUD,
        title: 'menu.role_management',
        page: '/role'
      },
      {
        permission: permissions.PERMISSION_CRUD,
        title: 'menu.permission_management',
        page: '/permission'
      }
    ]
  }
]
