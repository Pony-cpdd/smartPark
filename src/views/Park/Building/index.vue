<template>
  <div class="building-container">
    <!-- 搜索区域 -->
    <div class="search-container">
      <div class="search-label">楼宇名称：</div>
      <el-input placeholder="请输入内容" class="search-main" v-model="params.name" />
      <el-button type="primary" @click="search">查询</el-button>
    </div>
    <!-- 添加楼宇弹框 -->
    <el-dialog
      :title="id?'编辑楼宇':'添加楼宇'"
      :visible="dialogVisible"
      width="580px"
      @close="closeDialog"
    >
      <span>
        <!-- 表单接口 -->
          <div class="form-container">
            <el-form :model="addForm" :rules="addFormRules" ref="addForm">
            <el-form-item label="楼宇名称" prop="name">
              <el-input v-model="addForm.name"/>
            </el-form-item>
            <el-form-item label="楼宇层数" prop="floors">
              <el-input v-model="addForm.floors"/>
            </el-form-item>
            <el-form-item label="在管面积" prop="area">
              <el-input v-model="addForm.area"/>
            </el-form-item>
            <el-form-item label="物业费" prop="propertyFeePrice">
              <el-input v-model="addForm.propertyFeePrice"/>
            </el-form-item>
          </el-form>
        </div>
      </span>
      <template #footer>
        <el-button size="mini" @click="closeDialog">取 消</el-button>
        <el-button size="mini" type="primary" @click="confirmAdd">确 定</el-button>
      </template>
    </el-dialog>
    <el-button type="primary" @click="addBuilding">添加楼宇</el-button>
    <!-- 表格区域 -->
    <div class="table">
      <el-table
        style="width: 100%"
        :data="list"
      >
        <el-table-column
          prop="id"
          label="序号"
        />
        <el-table-column
          label="楼宇名称"
          width="180"
          prop="name"
        />
        <el-table-column
          label="层数"
          prop="floors"
        />
        <el-table-column
          label="在管面积(m²)"
          prop="area"
          width="120"
        />
        <el-table-column
          label="物业费(元/m²)"
          prop="propertyFeePrice"
          width="120"
        />
        <el-table-column
          label="状态"
          prop="status"
          :formatter="formatterStatus"
        />
        <el-table-column
          label="操作"
        >
          <template #default="scope">
            <el-button
              size="mini"
              type="text"
              @click="editBuilding(scope.row)"
            >编辑</el-button>
            <el-button
              size="mini"
              type="text"
              @click="deleteBuildingById(scope.row.id)"
            >删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="page-container">
        <el-pagination
          :current-page="params.page"
          :page-sizes="[10, 20, 30, 40]"
          :page-size="params.pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>

    </div>
  </div>
</template>

<script>
import { getBuildingListAPI, addBuildingAPI, deleteBuildingByIdAPI, editBuildingAPI } from '@/api/building'
export default {
  name: 'Building',
  computed: {
    //   获取id值做标识
    id() {
      return this.addForm.id
    }
  },
  data() {
    return {
      params: {
        id: 101,
        name: '',
        floor: 1,
        area: 80,
        propertyFeePrice: 11,
        page: 1,
        pageSize: 10,
        status: null
      },
      list: [],
      total: 0,
      dialogVisible: false,
      addForm: {
        id: '',
        name: '',
        floors: null,
        area: null,
        propertyFeePrice: null
      },
      addFormRules: {
        name: [{ required: true, message: '楼宇名称不可为空', trigger: 'blur' }],
        floors: [{ required: true, message: '楼宇层数不可为空', trigger: 'blur' }],
        area: [{ required: true, message: '在管面积不可为空', trigger: 'blur' }],
        propertyFeePrice: [{ required: true, message: '物业费单价不可为空', trigger: 'blur' }]
      }
    }
  },
  created() {
    this.getBuildingList()
  },
  methods: {
    // 编辑楼宇信息
    async editBuilding(row) {
      // 弹出编辑窗口
      this.addBuilding()
      // 解构原本数据
      const { id, area, floors, name, propertyFeePrice } = row
      //   数据回填
      this.addForm = { id, area, floors, name, propertyFeePrice }
    },
    // 根据id删除楼宇
    deleteBuildingById(id) {
      // console.log(id)
      this.$confirm('此操作将删除该数据, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async() => {
        // console.log('ok')
        // 调用接口
        await deleteBuildingByIdAPI(id)
        this.$message({
          type: 'success',
          message: '删除成功!'
        })
        // 判断是否最后一页删除，若是且只有一条数据则删完向前退一页
        if (this.list.length === 1 && this.params.page > 1) {
          this.params.page--
        }
        this.getBuildingList()
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    // 获取楼宇信息列表
    async getBuildingList() {
      const res = await getBuildingListAPI(this.params)
      // console.dir(res)
      this.list = res.data.rows
      this.total = res.data.total
    },
    //   格式化状态
    formatterStatus(row, column, cellValue, index) {
      const MAP = {
        0: '空置中',
        1: '租赁中'
      }
      return MAP[cellValue]
    },
    // 设置跳转页码
    handleCurrentChange(val) {
      this.params.page = val
      this.getBuildingList()
    },
    // 设置页码显示条数
    handleSizeChange(val) {
      this.params.pageSize = val
      this.getBuildingList()
    },
    //   根据楼宇名称查楼宇
    search() {
      this.params.page = 1
      this.getBuildingList()
    },
    // 弹窗判断
    addBuilding() {
      this.dialogVisible = true
    },
    // 关闭弹窗
    closeDialog() {
      this.dialogVisible = false
      this.addForm = {
        id: '',
        name: '',
        floors: null,
        area: null,
        propertyFeePrice: null
      }
      this.$refs.addForm.resetFields()
    },
    // 添加楼宇
    confirmAdd() {
      // 兜底校验
      this.$refs.addForm.validate(async(flag) => {
        if (!flag) return
        // console.log('调用接口')
        if (this.addForm.id) {
          await editBuildingAPI(this.addForm)
          this.$message.success('更新成功')
        } else {
          // 注意传参参数
          delete this.addForm.id
          // 调用接口
          await addBuildingAPI(this.addForm)
          this.$message.success('添加成功')
        }
        // router.back()
        this.getBuildingList()
        this.closeDialog()
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.department-container{
  padding:10px;
}
.page-container{
  padding:4px 0px;
  text-align: right;
}
.search-container{
  display: flex;
  align-items: center;
  border-bottom: 1px solid rgb(237,237,237,.9);;
  padding-bottom: 20px;
  .search-label{
    width:100px;
  }
  .search-main{
    width: 220px;
    margin-right: 10px;
  }
}
</style>
