<template>
  <div class="header">
    <div class="left">
      <i v-if="hasBack" class="el-icon-back" @click="back"></i>
      <span style="font-size: 20px">{{ name }}</span>
    </div>
    <div class="right">
      <el-popover
          placement="bottom"
          :width="320"
          trigger="click"
          popper-class="popper-user-box"
      >
        <template #reference>
          <div class="author">
            <i class="icon el-icon-s-custom"/>
            {{ userInfo && userInfo.nickName || '' }}
            <i class="el-icon-caret-bottom"/>
          </div>
        </template>
        <div class="nickname">
          <p>Login name: {{ userInfo && userInfo.loginUserName || '' }}</p>
          <p>Nick nam: {{ userInfo && userInfo.nickName || '' }}</p>
          <el-tag size="small" effect="dark" class="logout" @click="logout">Logout</el-tag>
        </div>
      </el-popover>
    </div>
  </div>
</template>

<script>
import {onMounted, reactive, toRefs} from 'vue'
import {useRouter} from 'vue-router'
import {ElPopover, ElTag} from 'element-plus'
// import * as api from "../utils/hostUtils.js"
import * as api from "../utils/remoteUtils.js"

export default {
  name: 'Header',
  components: {ElPopover, ElTag},
  setup() {
    console.log(`The router-remote‘s  Header call its own setup.`);
    const router = useRouter()
    const state = reactive({
      name: 'dashboard',
      userInfo: {},
      hasBack: false
    })
    onMounted(() => {
      router.afterEach((to) => {
        const {id} = to.query
        state.name = api.pathMap[to.name]
        if (id && to.name === 'add') {
          state.name = '编辑商品'
        }
        state.hasBack = ['level2', 'level3', 'order_detail'].includes(to.name)
      })
      const pathname = window.location.hash.split('/')[1] || ''
      if (!['login'].includes(pathname)) {
        getUserInfo()
      }
    })
    const getUserInfo = () => {
      const userInfo = api.getUserInfo()
      state.userInfo = userInfo
    }
    const logout = () => {
      console.log("-----logout-----")
      api.localRemove('token')
      window.location.reload()
    }
    const back = () => {
      router.back()
    }
    return {
      ...toRefs(state),
      logout,
      back
    }
  }
}
</script>

<style scoped>
.header {
  height: 50px;
  border-bottom: 1px solid #e9e9e9;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 20px;
}

.el-icon-back {
  border: 1px solid #e9e9e9;
  padding: 4px;
  border-radius: 50px;
  margin-right: 10px;
}

.right > div > .icon {
  font-size: 18px;
  margin-right: 6px;
}

.author {
  margin-left: 10px;
  cursor: pointer;
}
</style>
<style>
.popper-user-box {
  background: url('https://s.yezgea02.com/lingling-h5/static/account-banner-bg.png') 50% 50% no-repeat !important;
  background-size: cover !important;
  border-radius: 0 !important;
}

.popper-user-box .nickname {
  position: relative;
  color: #ffffff;
}

.popper-user-box .nickname .logout {
  position: absolute;
  right: 0;
  top: 0;
  cursor: pointer;
}
</style>
