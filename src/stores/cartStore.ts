//购物车
import { computed, ref } from 'vue'
import { defineStore } from 'pinia'
import { useUserStore } from './userStore'
import { insertCartAPI, findNewCartListAPI, delCartAPI } from '../apis/cart'

export const useCartStore = defineStore('cart',
  () => {
    const userStore = useUserStore()
    const isLogin = computed(() => userStore.userInfo.token)

    const cartList = ref([])

    const updateNewList = async () => {
      const res = await findNewCartListAPI()
      cartList.value = res.result
    }

    const addCart = async (goods) => {
      const { skuId, count } = goods
      if (isLogin.value) {
        // 登录之后线上添加商品
        await insertCartAPI({ skuId, count })
        updateNewList()

      } else {
        const item = cartList.value.find(item => item.skuId === goods.skuId)
        if (item) {
          item.count++
        } else {
          cartList.value.push(goods)
        }
      }
    }

    const delCart = async (skuId) => {
      if (isLogin.value) {
        await delCartAPI([skuId])
        updateNewList()
      } else {
        const idx = cartList.value.findIndex(item => skuId === item.skuId)
        cartList.value.splice(idx, 1)
      }
    }

    const singleCheck = (skuId, selected) => {
      // 修改store中商品项的selected
      const item = cartList.value.find(item => item.skuId === skuId)
      item.selected = selected
    }

    const selectAll = (selected) => {
      cartList.value.forEach(item => item.selected = selected)
    }

    const clearCart = () => {
      cartList.value = []
    }

    //计算属性
    const allCount = computed(() => cartList.value.reduce((a, c) => a + c.count, 0))
    const allPrice = computed(() => cartList.value.reduce((a, c) => a + c.count * c.price, 0))
    const isAll = computed(() => cartList.value.every(item => item.selected))
    const selectedCount = computed(() => cartList.value.filter(item => item.selected).reduce((a, c) => a + c.count, 0))
    const selectedPrice = computed(() => cartList.value.filter(item => item.selected).reduce((a, c) => a + c.count * c.price, 0))

    return {
      cartList,
      allCount,
      allPrice,
      isAll,
      selectedCount,
      selectedPrice,
      addCart,
      delCart,
      singleCheck,
      selectAll,
      clearCart,
      updateNewList,
    }
  },
  {
    persist: true
  }
)