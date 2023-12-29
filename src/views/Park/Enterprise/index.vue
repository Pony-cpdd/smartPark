<template>
  <div class="building-container">
    <!-- 搜索区域 -->
    <div class="search-container">
      <div class="search-label">企业名称：</div>
      <el-input clearable placeholder="请输入内容" class="search-main" v-model="params.name" />
      <el-button type="primary" @click="search">查询</el-button>
    </div>
    <div class="create-container">
      <el-button type="primary" @click="$router.push('/park/addEnterprise')">添加企业</el-button>
    </div>
    <!-- 表格区域 -->
    <div class="table">
      <el-table style="width: 100%" :data="list" @expand-change="expandChange">
        <el-table-column type="expand">
          <template #default="scope">
            <el-table :data="scope.row.rentList">
              <el-table-column label="租赁楼宇" width="320" prop="buildingName" />
              <el-table-column label="租赁起始时间" prop="startTime" >
                <template #default="rentObj">
                  {{rentObj.row.startTime}}至{{rentObj.row.endTime}}
                </template>
              </el-table-column>
              <el-table-column label="合同状态" prop="status">
                <template #default="rentObj">
                  <el-tag :type="formatterTag(rentObj.row.status)">
                  {{formatterStatus(rentObj.row.status)}}
                  </el-tag>
                </template>
              </el-table-column>
              <el-table-column label="操作" width="180">
                <template #default="scope">
                  <el-button size="mini" type="text">退租</el-button>
                  <el-button size="mini" type="text">删除</el-button>
                </template>
              </el-table-column>
            </el-table>
          </template>
        </el-table-column>
        <el-table-column type="index" :index="indexMethod" label="序号" />
        <el-table-column label="企业名称" width="320" prop="name" />
        <el-table-column label="联系人" prop="contact" />
        <el-table-column
          label="联系电话"
          prop="contactNumber"
        />
        <el-table-column label="操作">
          <template #default="scope">
            <el-button size="mini" type="text" @click="addRent(scope.row.id)">添加合同</el-button>
            <el-button size="mini" type="text">查看</el-button>
            <el-button size="mini" type="text" @click="editEnterprise(scope.row.id)">编辑</el-button>
            <el-button size="mini" type="text" @click="deleteEnterprise(scope.row.id)">删除</el-button>
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
    <el-dialog
      title="添加合同"
      :visible="rentDialogVisible"
      width="580px"
      :close-on-click-modal="false"
      @close="closeDialog"
    >
      <!-- 表单区域 -->
      <div class="form-container">
        <el-form ref="addForm" :model="rentForm" :rules="rentRules" label-position="top">
          <el-form-item label="租赁楼宇" prop="buildingId">
            <el-select v-model="rentForm.buildingId" placeholder="请选择">
              <el-option
                v-for="item in rentBuilding"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="租赁起止日期" prop="rentTime">
            <el-date-picker
              v-model="rentForm.rentTime"
              type="daterange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              value-format="yyyy-MM-dd"
            />
          </el-form-item>
          <el-form-item label="租赁合同" prop="contractId">
            <el-upload
              action="#"
              ref="upload"
              :http-request="httpRequest"
              :before-upload="beforeUpload"
              :limit="1"
              :on-exceed="onExceed"
              :on-remove="onremove"
            >
              <el-button size="small" type="primary" plain>上传合同文件</el-button>
              <div slot="tip" class="el-upload__tip">支持扩展名：.doc .docx .pdf, 文件大小不超过5M</div>
            </el-upload>
          </el-form-item>
        </el-form>
      </div>
      <template #footer>
        <el-button size="mini" @click="closeDialog">取 消</el-button>
        <el-button size="mini" type="primary" @click="confirmAdd">确 定</el-button>
      </template>
    </el-dialog>
  </div>
</template>
<script>
import {
  getEnterpriseListAPI,
  deleteEnterpriseByIdAPI,
  addRentAPI,
  getRentBuildingAPI,
  getDetailByIdAPI
} from '@/api/enterprise'
import { upload } from '@/api/common'
export default {
  data() {
    return {
      // 企业列表参数
      params: {
        name: '',
        page: 1,
        pageSize: 2
      },
      // 表格渲染参数
      list: [],
      // 总条数
      total: 0,
      // 弹窗标识
      rentDialogVisible: false,
      // 添加合同参数
      rentForm: {
        buildingId: null,
        startTime: '',
        endTime: '',
        contractUrl: '',
        contractId: null,
        type: 0,
        enterpriseId: null
      },
      // 租赁时间
      rentTime: [],
      // 添加合同表单校验规则
      rentRules: {
        buildingId: [{ required: true, message: '请选择租赁楼宇', trigger: 'change' }],
        rentTime: [{ required: true, message: '请选择租赁时间', trigger: 'change' }],
        contractId: [{ required: true, message: '请上传租赁合同' }]
      },
      // 可租赁楼宇下拉数据
      rentBuilding: []
    }
  },
  created() {
    this.getEnterpriseList()
  },
  methods: {
    // 格式化合同状态样式
    formatterTag(status) {
      const MAP = {
        '0': 'info',
        '1': 'success',
        '2': 'warning',
        '3': 'danger'
      }
      return MAP[status]
    },
    // 格式化合同状态
    formatterStatus(status) {
      const MAP = {
        '0': '待生效',
        '1': '生效中',
        '2': '已到期',
        '3': '已退租'
      }
      return MAP[status]
    },
    /**
     * 获取企业列表
     * @returns {Promise<void>}
     */
    async getEnterpriseList() {
      const res = await getEnterpriseListAPI(this.params)
      // console.log(res)
      // 给列表中的每一个数据添加一个额外的属性
      this.list = res.data.rows.map(item => {
        return {
          ...item,
          // 展开详情时数据
          rentList: []
        }
      })
      this.total = res.data.total
    },
    // 展开详情
    // row:当前展开或关闭的那一行数据
    // expandRows: 所有展开行的数据
    async expandChange(row, expandRows) {
      // console.log(row)
      // console.log(expandRows)
      // 通过isInclude有没有值判断有没有展开行
      const isInclude = expandRows.find(item => item.id === row.id)
      // console.log(isInclude)
      // 如果没有数据不调用下面
      if (!isInclude) return
      const res = await getDetailByIdAPI(row.id)
      // 返回数据封装到rentList
      row.rentList = res.data
    },
    // 用户上传完合同又删除文件
    onremove() {
      this.rentForm.contractId = ''
      this.rentForm.contractUrl = ''
      this.$refs.addForm.validateField('contractId')
    },
    // 合同文件超出上传个数限制
    onExceed() {
      this.$message.warning('合同文件超出上传个数')
    },
    // 确认添加
    confirmAdd() {
      this.$refs.addForm.validate(async(flag) => {
        if (!flag) return
        this.rentForm.startTime = this.rentForm.rentTime[0]
        this.rentForm.endTime = this.rentForm.rentTime[1]
        delete this.rentForm.rentTime
        await addRentAPI(this.rentForm)
        this.$message.success('添加成功')
        this.getEnterpriseList()
        // 关闭弹窗并清空数据
        this.closeDialog()
      })
    },
    // 合同文件上传前校验
    beforeUpload(file) {
      const isFormatValid = /\.(doc|docx|pdf)$/.test(file.name.toLowerCase())
      const isSizeValid = file.size / 1024 / 1024 <= 5
      if (!isFormatValid) {
        this.$message.error('只能上传 .doc、.docx、.pdf 格式的文件')
      }
      if (!isSizeValid) {
        this.$message.error('文件大小不能超过 5MB')
      }
      return isFormatValid && isSizeValid
    },
    // 上传合同文件
    // file 直接解构数据 拿到需要的数据
    async httpRequest({ file }) {
      // console.log(data)
      const formData = new FormData()
      formData.append('file', file)
      formData.append('type', 2)
      const res = await upload(formData)
      this.rentForm.contractId = res.data.id
      this.rentForm.contractUrl = res.data.url
      this.$refs.addForm.validateField('contractId')
      // console.log(res.data.id)
      // console.log(res.data.url)
      // console.log(res)
    },
    // 查询可租赁楼宇
    async getRentBuilding() {
      const res = await getRentBuildingAPI()
      // 数据回填至下拉框
      this.rentBuilding = res.data
    },
    // 添加合同
    addRent(id) {
      this.rentDialogVisible = true
      // 获取可租赁下拉列表
      this.getRentBuilding()
      this.rentForm.enterpriseId = id
    },
    // 删除企业
    deleteEnterprise(id) {
      if (id) {
        this.$confirm('将永久删除该企业, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(async() => {
          await deleteEnterpriseByIdAPI(id)
          if (this.list.length === 1 && this.params.page > 1) {
            this.params.page--
          }
          this.getEnterpriseList()
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
      }
    },
    // 跳转至编辑页面
    editEnterprise(id) {
      this.$router.push({
        path: '/park/addEnterprise',
        query: {
          id
        }
      })
    },
    // 序号处理
    indexMethod(index) {
      return (this.params.page - 1) * this.params.pageSize + index + 1
    },
    // 实现查询
    search(name) {
      this.params.page = 1
      this.getEnterpriseList(name)
    },
    // 改变当前页面显示条数大小
    handleSizeChange(val) {
      this.params.pageSize = val
      this.getEnterpriseList()
    },
    // 跳转页码
    handleCurrentChange(val) {
      this.params.page = val
      this.getEnterpriseList()
    },
    //   监听查询按钮事件，
    //   用户输入完文本框内容按回车实现点击查询按钮
    /* handleEnter(name) {
      this.search(name)
    } */
    //   关闭弹出
    closeDialog() {
      // 关闭弹窗
      this.rentDialogVisible = false
      // 清除表单校验规则
      this.$refs.addForm.resetFields()
      // 表单数据清空
      this.rentForm = {
        buildingId: null,
        startTime: '',
        endTime: '',
        contractUrl: '',
        contractId: null,
        type: 0,
        enterpriseId: null
      }
      // 清除已上传的文件
      this.$refs.upload.clearFiles()
    }
  }
}
</script>
<style lang="scss" scoped>
.department-container {
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
