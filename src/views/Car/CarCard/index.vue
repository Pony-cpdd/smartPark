<template>
  <div class="card-container">
    <!-- 搜索区域 -->
    <div class="search-container">
      <span class="search-label">车牌号码：</span>
      <el-input clearable placeholder="请输入内容" class="search-main" v-model="params.carNumber" />
      <span class="search-label">车主姓名：</span>
      <el-input clearable placeholder="请输入内容" class="search-main" v-model="params.personName" />
      <span class="search-label">状态：</span>
      <el-select v-model="params.cardStatus">
        <el-option v-for="item in options" :label="item.text" :value="item.value" :key="item.value" />
      </el-select>
      <el-button type="primary" class="search-btn" @click="search">查询</el-button>
    </div>
    <!-- 新增删除操作区域 -->
    <div class="create-container">
      <el-button type="primary" @click="$router.push('/car/addMonthCard')">添加月卡</el-button>
      <el-button @click="benchDeleteCard">批量删除</el-button>
    </div>
    <!-- 表格区域 -->
    <div class="table">
      <el-table style="width: 100%" :data="list" @selection-change="handleSelect">
        <el-table-column
          type="selection"
          width="55">
        </el-table-column>
        <el-table-column type="index" label="序号" prop="id" :index="indexMethod" />
        <el-table-column label="车主名称" prop="personName" />
        <el-table-column label="联系方式" prop="phoneNumber" />
        <el-table-column label="车牌号码" prop="carNumber" />
        <el-table-column label="车辆品牌" prop="carBrand" />
        <el-table-column label="剩余有效天数" prop="totalEffectiveDate" />
        <el-table-column label="状态" prop="cardStatus" :formatter="formatterStatus" />
        <el-table-column label="操作" fixed="right" width="180">
          <template #default="scope">
            <el-button size="mini" type="text">续费</el-button>
            <el-button size="mini" type="text">查看</el-button>
            <el-button size="mini" type="text" @click="editCard(scope.row.id)">编辑</el-button>
            <el-button size="mini" type="text" @click="deleteCard(scope.row.id)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="page-container">
      <!--current-page：当前页面页码 -->
      <!--page-sizes：可选的页面显示条数 -->
      <!--page-size：页面显示条数，一般和page-sizes的第一个值保持一致 -->
      <!--layout：分页样式 -->
      <!--total：总条数 -->
      <!--@size-change：更改页面容量条数 -->
      <!--@current-change：更改当前页码 -->
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
    <!-- 添加楼宇 -->
    <el-dialog
      title="添加楼宇"
      width="580px"
    >
      <!-- 表单接口 -->
      <div class="form-container">
        <!-- <el-form ref="addForm" :model="addForm" :rules="addFormRules">
          <el-form-item label="楼宇名称" prop="name">
            <el-input v-model="addForm.name" />
          </el-form-item>
          <el-form-item label="楼宇层数" prop="floors">
            <el-input v-model="addForm.floors" />
          </el-form-item>
          <el-form-item label="在管面积" prop="area">
            <el-input v-model="addForm.area" />
          </el-form-item>
          <el-form-item label="物业费" prop="propertyFeePrice">
            <el-input v-model="addForm.propertyFeePrice" />
          </el-form-item>
        </el-form> -->
      </div>
      <template #footer>
        <el-button size="mini">取 消</el-button>
        <el-button size="mini" type="primary">确 定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import { getCardListAPI, deleteCardAPI } from '@/api/card'
export default {
  data() {
    // 封装参数
    return {
      params: {
        page: 1,
        pageSize: 2,
        carNumber: '',
        personName: '',
        // 默认值为 null 传参时不带
        cardStatus: null
      },
      // 渲染界面数据
      list: [],
      // 总条数
      total: 0,
      // 状态下拉选项 ,注意键值对操作
      options: [
        {
          value: null,
          text: '全部'
        },
        {
          value: 0,
          text: '可用'
        },
        {
          value: 1,
          text: '不可用'
        }
      ],
      selectValue: []
    }
  },
  created() {
    this.getCardList()
  },
  methods: {
    // 批量删除
    benchDeleteCard() {
      if (this.selectValue <= 0) {
        this.$message.warning('请选择数据后再删除')
        return
      }
      // 从对象数组中提取特定属性的值
      const ids = this.selectValue.map(item => item.id)
      // console.log(ids)
      this.$confirm('此操作将永久删除该数据, 是否继续?', '温馨提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async() => {
        // 调用接口
        await deleteCardAPI(ids.join(','))
        this.$message({
          type: 'success',
          message: '删除成功!'
        })
        // 如果删除的时最后一页，则page--
        // if (this.list.length === 1 && this.params.page > 1) {
        //   this.params.page--
        // }
        this.getCardList()
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    // 用户选中的数据
    handleSelect(val) {
      this.selectValue = val
    },
    // 删除月卡
    deleteCard(id) {
      this.$confirm('此操作将永久删除该数据, 是否继续?', '温馨提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async() => {
        await deleteCardAPI(id)
        this.$message({
          type: 'success',
          message: '删除成功!'
        })
        // 如果删除的时最后一页，则page--
        if (this.list.length === 1 && this.params.page > 1) {
          this.params.page--
        }
        this.getCardList()
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    // 查询按钮，需重置查询页，查的是全部数据而不是当前页数据
    search() {
      this.params.page = 1
      this.getCardList()
    },
    // 获取月卡列表
    async getCardList() {
      const res = await getCardListAPI(this.params)
      // console.log(res)
      this.list = res.data.rows
      this.total = res.data.total
    },
    // 格式化状态
    formatterStatus(row, column, cellValue, index) {
      const MAP = {
        0: '可用',
        1: '不可用'
      }
      return MAP[cellValue]
    },
    // 手动设置页面显示条数大小
    handleSizeChange(val) {
      this.params.pageSize = val
      this.getCardList()
    },
    // 更改当前页码
    handleCurrentChange(val) {
      this.params.page = val
      this.getCardList()
    },
    //   自定义序号索引
    indexMethod(index) {
      return (this.params.page - 1) * this.params.pageSize + index + 1
    },
    //   编辑月卡
    editCard(id) {
      this.$router.push({
        path: '/car/addMonthCard',
        query: {
          id
        }
      })
    }
  }

}
</script>

<style lang="scss" scoped>
.card-container {
  padding: 20px;
  background-color: #fff;
}

.search-container {
  display: flex;
  align-items: center;
  border-bottom: 1px solid rgb(237, 237, 237, .9);
  padding-bottom: 20px;
  .search-main {
    width: 220px;
    margin-right: 10px;
  }
  .search-btn{
    margin-left:20px;
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
