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
      <el-table style="width: 100%" :data="list">
        <el-table-column type="index" :index="indexMethod" label="序号" />
        <el-table-column label="企业名称" width="320" prop="name" />
        <el-table-column label="联系人" prop="contact" />
        <el-table-column
          label="联系电话"
          prop="contactNumber"
        />
        <el-table-column label="操作">
          <template #default="scope">
            <el-button size="mini" type="text">添加合同</el-button>
            <el-button size="mini" type="text">查看</el-button>
            <el-button size="mini" type="text" @click="editEnterprise(scope.row.id)">编辑</el-button>
            <el-button size="mini" type="text">删除</el-button>
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
  </div>
</template>
<script>
import { getEnterpriseListAPI } from '@/api/enterprise'
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
      total: 0
    }
  },
  created() {
    this.getEnterpriseList()
  },
  methods: {
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
    /**
     * 获取企业列表
     * @returns {Promise<void>}
     */
    async getEnterpriseList() {
      const res = await getEnterpriseListAPI(this.params)
      // console.log(res)
      this.list = res.data.rows
      this.total = res.data.total
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
    }
    //   监听查询按钮事件，
    //   用户输入完文本框内容按回车实现点击查询按钮
    /* handleEnter(name) {
      this.search(name)
    } */
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
