<template>
  <div class="building-container">
    <!-- 搜索区域 -->
    <div class="search-container">
      <div class="search-label">楼宇名称：</div>
      <el-input placeholder="请输入内容" class="search-main" />
      <el-button type="primary">查询</el-button>
    </div>
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
            >编辑</el-button>
            <el-button
              size="mini"
              type="text"
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
import { getBuildingListAPI } from '@/api/building'
export default {
  name: 'Building',
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
      total: 0
    }
  },
  created() {
    this.getBuildingList()
  },
  methods: {
    // 获取楼宇信息列表
    async getBuildingList() {
      const res = await getBuildingListAPI(this.params)
      console.dir(res)
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
