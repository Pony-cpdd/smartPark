<template>
  <div class="add-enterprise">
    <header class="add-header">
      <div class="left">
        <span class="arrow" @click="$router.back()"><i class="el-icon-arrow-left" />返回</span>
        <span>|</span>
<!--        <span>添加企业</span>-->
        <span v-if="id">编辑企业</span>
        <span v-else>添加企业</span>
      </div>
      <div class="right">
        SmartPark
      </div>
    </header>
    <main class="add-main">
      <div class="form-container">
        <div class="title">企业信息</div>
        <div class="form">
          <el-form :model="addForm" :rules="addFormRules" ref="addForm" label-width="100px">
            <el-form-item label="企业名称" prop="name">
              <el-input v-model="addForm.name"/>
            </el-form-item>
            <el-form-item label="法人" prop="legalPerson">
              <el-input v-model="addForm.legalPerson"/>
            </el-form-item>
            <el-form-item label="注册地址" prop="registeredAddress">
              <el-input v-model="addForm.registeredAddress"/>
            </el-form-item>
            <el-form-item label="所在行业" prop="industryCode">
              <!--              <el-select v-model="addForm.industryCode" />-->
              <el-select v-model="addForm.industryCode" placeholder="请选择">
                <el-option
                  v-for="item in industryList"
                  :key="item.industryCode"
                  :label="item.industryName"
                  :value="item.industryCode"
                >
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="企业联系人" prop="contact">
              <el-input v-model="addForm.contact"/>
            </el-form-item>
            <el-form-item label="联系电话" prop="contactNumber">
              <el-input v-model="addForm.contactNumber"/>
            </el-form-item>
            <el-form-item label="营业执照" prop="businessLicenseId">
              <el-upload
                class="upload-demo"
                action="#"
                :http-request="uploadFile"
                :before-upload="beforeUpload"
                :on-remove="onremove"
              >
                <el-button size="small" type="primary">点击上传</el-button>
                <div slot="tip" class="el-upload__tip">只能上传.jpg .jpeg .png文件，且不超过5M</div>
              </el-upload>
              <img v-if="id" :src="addForm.businessLicenseUrl" style="width: 100px">
            </el-form-item>
          </el-form>
        </div>
      </div>
    </main>
    <footer class="add-footer">
      <div class="btn-container">
        <el-button @click="resetForm">重置</el-button>
        <el-button type="primary" @click="confirmAdd">确定</el-button>
      </div>
    </footer>
  </div>
</template>

<script>
import { getIndustryListAPI, addEnterpriseAPI, getEnterpriseByIdAPI, updateEnterpriseAPI } from '@/api/enterprise'
import { upload } from '@/api/common'
export default {
  data() {
    return {
      // 表单数据
      addForm: {
        name: '', // 企业名称
        legalPerson: '', // 法人
        registeredAddress: '', // 注册地址
        industryCode: '', // 所在行业
        contact: '', // 企业联系人
        contactNumber: '', // 联系人电话
        businessLicenseUrl: '', // 营业执照url
        businessLicenseId: '' // 营业执照id
      },
      // 校验表单
      addFormRules: {
        name: [{ required: true, message: '企业名称不可为空', trigger: 'blur' }],
        legalPerson: [{ required: true, message: '法人不可为空', trigger: 'blur' }],
        registeredAddress: [{ required: true, message: '注册地址不可为空', trigger: 'blur' }],
        industryCode: [{ required: true, message: '所在行业必选', trigger: 'change' }],
        contact: [{ required: true, message: '企业联系人不可为空', trigger: 'blur' }],
        contactNumber: [
          { required: true, message: '联系人电话不可为空', trigger: 'blur' },
          // 正则表达式规则不用加 ''
          { pattern: /^(?:(?:\+|00)86)?1(?:(?:3[\d])|(?:4[5-79])|(?:5[0-35-9])|(?:6[5-7])|(?:7[0-8])|(?:8[\d])|(?:9[189]))\d{8}$/,
            message: '联系人电话格式不正确',
            trigger: 'blur'
          }
        ],
        businessLicenseId: [{ required: true, message: '请上传营业执照', trigger: 'blur' }]
      },
      // 行业下拉列表
      industryList: [{
        industryCode: 1001,
        industryName: '电子商务'
      }]
    }
  },
  computed: {
    id() {
      return this.$route.query.id
    }
  },
  created() {
    this.getIndustryList()
    if (this.id) {
      this.getEnterpriseById()
    }
  },
  methods: {
    // 监听用户上传营业执照
    onremove() {
      this.addForm.businessLicenseId = ''
      this.addForm.businessLicenseUrl = ''
      this.$refs.addForm.validateField('businessLicenseId')
    },
    // 根据id查询企业
    async getEnterpriseById() {
      const res = await getEnterpriseByIdAPI(this.id)
      // 企业数据回填
      const { name, legalPerson, registeredAddress, industryCode, contact, contactNumber, businessLicenseUrl, businessLicenseId, id } = res.data
      this.addForm = { name, legalPerson, registeredAddress, industryCode, contact, contactNumber, businessLicenseUrl, businessLicenseId, id }
      // console.log(this.fileList.name)
    },
    // 上传图片的校验
    beforeUpload(file) {
      // 图片类型
      const imgType = ['image/jpeg', 'image/jpg', 'image/png']
      // 检验图片类型
      const type = imgType.includes(file.type)
      // 检查图片大小
      const size = file.size / 1024 / 1024 < 5
      // 判断是否符合上传图片标准
      if (type && size) {
        return true
      } else {
        this.$message.warning('上传图片不符合要求，请重新上传')
        return false
      }
    },
    // 上传图片
    async uploadFile({ file }) {
      // 数据封装
      const data = new FormData()
      // console.log(flag)
      data.append('file', file)
      data.append('type', 1)
      const res = await upload(data)
      // console.log(res)
      // 参数回填至addForm
      this.addForm.businessLicenseId = res.data.id
      this.addForm.businessLicenseUrl = res.data.url
      //   对上传按钮单独进行校验
      this.$refs.addForm.validateField('businessLicenseUrl')
    },
    // 重置表单
    resetForm() {
      this.$refs.addForm.resetFields()
      // 清空上传组件的文件列表
      const uploadComponent = this.$refs.upload
      if (uploadComponent) {
        // 清空文件列表
        uploadComponent.clearFiles()
        // 清空已上传的文件列表（通过操作 file-list 属性）
        uploadComponent.fileList = []
      }
      this.$message.warning('已重置')
    },
    // 提交添加
    confirmAdd() {
      // 兜底校验
      this.$refs.addForm.validate(async(flag) => {
        if (!flag) return
        // console.log('调用接口')
        if (this.id) {
          await updateEnterpriseAPI(this.addForm)
          this.$message.success('更新成功')
        } else {
          await addEnterpriseAPI(this.addForm)
          this.$message.success('添加成功')
        }
        // 跳回上一页
        this.$router.back()
      })
    },
    /**
     * 获取行业下拉列表
     * @returns {Promise<void>}
     */
    async getIndustryList() {
      const res = await getIndustryListAPI(this.addForm)
      // console.log(res)
      this.industryList = res.data
    }
  }
}
</script>

<style scoped lang="scss">
.add-enterprise {
  background-color: #f4f6f8;
  height: 100vh;

  .add-header {
    display: flex;
    justify-content: space-between;
    padding: 0 20px;
    height: 64px;
    line-height: 64px;
    font-size: 16px;
    font-weight: bold;
    background-color: #fff;

    .left {
      span {
        margin-right: 4px;
      }
      .arrow{
        cursor: pointer;
      }
    }

    .right {
      text-align: right;
    }
  }

  .add-main {
    background: #f4f6f8;
    padding: 20px 130px;

    .form-container {
      background-color: #fff;
      .title {
        height: 60px;
        line-height: 60px;
        padding-left:20px;
      }
      .form {
        margin-bottom: 20px;
        padding: 20px 65px 24px;
        .el-form{
          display: flex;
          flex-wrap: wrap;
          .el-form-item{
            width: 50%;
          }
        }
      }
    }
  }

  .add-footer {
    position: fixed;
    bottom: 0;
    width: 100%;
    padding: 24px 50px;
    color: #000000d9;
    font-size: 14px;
    background: #fff;
    text-align: center;
  }
}
</style>
