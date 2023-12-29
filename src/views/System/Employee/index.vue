<template>
  <div class="employee-container">
    <!-- 搜索区域 -->
    <div class="search-container">
      <div class="search-label">员工姓名：</div>
      <el-input clearable placeholder="请输入内容" class="search-main" v-model="params.name" />
      <el-button type="primary" @click="search">查询</el-button>
    </div>
    <div class="create-container">
      <el-button type="primary" @click="openDialog">添加员工</el-button>
    </div>
    <!-- 表格区域 -->
    <div class="table">
      <el-table style="width: 100%" :data="list">
        <el-table-column type="index" label="序号" prop="id" :index="indexMethod" />
        <el-table-column label="员工姓名" width="180" prop="name" />
        <el-table-column label="登录账号" width="180" prop="userName" />
        <el-table-column label="联系方式" width="120" prop="phonenumber" />
        <el-table-column label="角色" width="120" prop="roleName" />
        <el-table-column label="状态" prop="status" :formatter="formatterStatus">
<!--          <template #default="scope">-->
<!--            {{ scope.row.status }}-->
<!--          </template>-->
        </el-table-column>
        <el-table-column label="添加时间" prop="createTime" />
        <el-table-column label="操作" fixed="right" width="120">
          <template #default="scope">
            <el-button size="mini" type="text">编辑</el-button>
            <el-button size="mini" type="text">删除</el-button>
            <el-button size="mini" type="text">重置密码</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="page-container">
      <el-pagination
        :current-page="params.page"
        :page-sizes="[2, 4, 6, 8]"
        :page-size="params.pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      >
      </el-pagination>
    </div>
    <!-- 添加员工 -->
    <el-dialog
      title="添加员工"
      :visible="dialogVisible"
      width="480px"
      @close="closeDialog"
    >
      <!-- 表单接口 -->
      <div class="form-container">
        <el-form ref="addForm" :model="addForm" :rules="addFormRules" label-width="80px">
          <el-form-item label="员工姓名" prop="name">
            <el-input v-model="addForm.name" />
          </el-form-item>
          <el-form-item label="登录账号" prop="userName">
            <el-input v-model="addForm.userName" />
          </el-form-item>
<!--          <el-form-item label="登录密码" prop="password">-->
<!--            <el-input v-model="addForm.password" />-->
<!--          </el-form-item>-->
          <el-form-item label="电话号码" prop="phonenumber">
            <el-input v-model="addForm.phonenumber" />
          </el-form-item>
          <el-form-item label="分配角色" prop="roleId">
            <el-select v-model="addForm.roleId" placeholder="请选择角色">
              <el-option
                v-for="item in roleList"
                :key="item.roleId"
                :label="item.roleName"
                :value="item.roleId"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="员工状态" prop="status">
            <el-radio-group v-model="addForm.status">
              <el-radio :label="0">禁用</el-radio>
              <el-radio :label="1">启用</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-form>
      </div>
      <template #footer>
        <el-button size="mini" @click="closeDialog">取 消</el-button>
        <el-button size="mini" type="primary" @click="addEmployee">确 定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import { getEmployeeListAPI, addEmployeeAPI, getRoleListAPI } from '@/api/employee'
export default {
  name: 'Employee',
  data() {
    return {
      // 界面数据
      params: {
        id: 1,
        name: '',
        username: '',
        phonenumber: '',
        roleName: '',
        status: null,
        page: 1,
        pageSize: 2
      },
      // 添加员工信息
      addForm: {
        name: '',
        // userName: '',
        roleId: 2,
        password: '',
        status: 1,
        phonenumber: ''
      },
      // 添加员工校验规则
      addFormRules: {
        name: { required: true, message: '员工姓名不可为空', trigger: 'blur' },
        userName: { required: true, message: '登录账号不可为空', trigger: 'blur' },
        password: { required: true, message: '密码不可为空', trigger: 'blur' },
        phonenumber: [
          { required: true, message: '联系方式不可为空', trigger: 'blur' },
          {
            pattern: /^(?:(?:\+|00)86)?1(?:(?:3[\d])|(?:4[5-79])|(?:5[0-35-9])|(?:6[5-7])|(?:7[0-8])|(?:8[\d])|(?:9[189]))\d{8}$/,
            message: '手机号码格式不正确请重新输入',
            trigger: 'blur'
          }
        ],
        roleId: { required: true, message: '分配角色必选', trigger: 'blur' }
        // status: { required: true, message: '员工状态必选', trigger: 'blur' },
      },
      // 员工角色下拉选项
      roleList: [{
        // 角色id 传回后台用
        roleId: 2,
        // 下拉选项显示
        roleName: '数据管理'
      }],
      // 渲染界面数据
      list: [],
      // 总条数
      total: 0,
      // 添加员工窗口状态值
      dialogVisible: false
    }
  },
  created() {
    this.getEmployeeList()
  },
  methods: {
    // 获取角色列表
    async getRoleList() {
      const res = await getRoleListAPI()
      // console.log(res)
      this.roleList = res.data
    },
    // 添加员工
    addEmployee() {
      this.$refs.addForm.validate(async(flag) => {
        if (!flag) return
        // console.log('调用接口')
        const res = await addEmployeeAPI(this.addForm)
        console.log(res)
      })
    },
    // 输入员工姓名搜索
    search() {
      // this.params.page = 1
      this.getEmployeeList()
    },
    // 获取员工信息列表
    async getEmployeeList() {
      const res = await getEmployeeListAPI(this.params)
      // console.log(res)
      // 返回数据
      this.list = res.data.rows
      // 返回总条数
      this.total = res.data.total
    },
    // 格式化状态
    formatterStatus(row, column, cellValue, index) {
      const MAP = {
        0: '未启用',
        1: '启用'
      }
      return MAP[cellValue]
    },
    //   手动重置页面显示条数
    handleSizeChange(val) {
      this.params.pageSize = val
      this.getEmployeeList()
    },
    //   跳转页码
    handleCurrentChange(val) {
      this.params.page = val
      this.getEmployeeList()
    },
    // 处理序号
    indexMethod(index) {
      return (this.params.page - 1) * this.params.pageSize + index + 1
    },
    // 打开添加员工弹窗
    openDialog() {
      this.dialogVisible = true
      this.getRoleList()
    },
    // 关闭添加员工弹窗
    closeDialog() {
      this.dialogVisible = false
      this.addForm = []
    }
  }
}
</script>

<style lang="scss" scoped>
.employee-container {
  padding: 10px;
}

.search-container {
  display: flex;
  align-items: center;
  border-bottom: 1px solid rgb(237, 237, 237, .9);
;
  padding-bottom: 20px;

  .search-label {
    width: 100px;
  }

  .search-main {
    width: 220px;
    margin-right: 10px;
  }
}
.create-container{
  margin: 10px 0px;
}
.page-container{
  padding:4px 0px;
  text-align: right;
}
.form-container{
  padding:0px 80px;
}
</style>
