<template>
  <div class="add-card">
    <header class="add-header">
      <el-page-header :content="id?'编辑月卡':'增加月卡'" @back="$router.back()" />
    </header>
    <main class="add-main">
      <div class="form-container">
        <div class="title">车辆信息</div>
        <div class="form">
          <el-form label-width="100px" :model="carInfoFrom" :rules="carInfoRules" ref="carInfoFrom">
            <el-form-item label="车主姓名" prop="personName">
              <el-input v-model="carInfoFrom.personName" />
            </el-form-item>
            <el-form-item label="联系方式" prop="phoneNumber">
              <el-input v-model="carInfoFrom.phoneNumber" />
            </el-form-item>
            <el-form-item label="车辆号码" prop="carNumber">
              <el-input v-model="carInfoFrom.carNumber" />
            </el-form-item>
            <el-form-item label="车辆品牌" prop="carBrand">
              <el-input v-model="carInfoFrom.carBrand" />
            </el-form-item>
          </el-form>
        </div>
      </div>
      <div class="form-container">
        <div class="title">最新一次月卡缴费信息</div>
        <div class="form">
          <el-form label-width="100px" :model="payInfoFrom" :rules="payInfoRules" ref="payInfoFrom">
            <el-form-item label="有效日期" prop="payTime">
              <el-date-picker
                v-model="payInfoFrom.payTime"
                type="daterange"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                format="yyyy-MM-dd"
                value-format="yyyy-MM-dd"
              />
            </el-form-item>
            <el-form-item label="支付金额" prop="paymentAmount">
              <el-input v-model="payInfoFrom.paymentAmount" />
            </el-form-item>
            <el-form-item label="支付方式" prop="paymentMethod">
              <el-select v-model="payInfoFrom.paymentMethod">
                <el-option
                  v-for="item in payMethodList"
                  :key="item.id"
                  :value="item.id"
                  :label="item.name"
                />
              </el-select>
            </el-form-item>
          </el-form>
        </div>
      </div>

    </main>
    <footer class="add-footer">
      <div class="btn-container">
        <el-button @click="resetFrom">重置</el-button>
        <el-button type="primary" @click="confirmAdd">确定</el-button>
      </div>
    </footer>
  </div>
</template>

<script>
import { addCardAPI, getCardDetailByIdAPI, editCardAPI } from '@/api/card'
export default {
  data() {
    return {
      // 车辆信息
      carInfoFrom: {
        personName: '',
        phoneNumber: '',
        carNumber: '',
        carBrand: ''
      },
      // 车辆信息校验规则
      carInfoRules: {
        personName: [
          { required: true, message: '车主姓名不可为空', trigger: 'blur' }
        ],
        phoneNumber: [
          { required: true, message: '联系方式不可为空', trigger: 'blur' },
          {
            pattern: /^(?:(?:\+|00)86)?1(?:(?:3[\d])|(?:4[5-79])|(?:5[0-35-9])|(?:6[5-7])|(?:7[0-8])|(?:8[\d])|(?:9[189]))\d{8}$/,
            message: '手机号码格式不正确请重新输入',
            trigger: 'blur'
          }
        ],
        carNumber: [
          { required: true, message: '车辆号码不可为空', trigger: 'blur' },
          { validator: this.validatorCarNumber, trigger: 'blur' }
        ],
        carBrand: [
          { required: true, message: '车辆品牌不可为空', trigger: 'blur' }
        ]
      },
      // 支付信息
      payInfoFrom: {
        payTime: [],
        paymentAmount: '',
        paymentMethod: ''
      },
      // 支付信息校验规则
      payInfoRules: {
        payTime: [
          { required: true, message: '请选择有效日期', trigger: 'blur' }
        ],
        paymentAmount: [
          { required: true, message: '请输入支付金额', trigger: 'blur' }
        ],
        paymentMethod: [
          { required: true, message: '请选择支付方式', trigger: 'change' }
        ]
      },
      // 支付方式列表
      payMethodList: [
        {
          id: 'Alipay',
          name: '支付宝'
        },
        {
          id: 'WeChat',
          name: '微信'
        },
        {
          id: 'Cash',
          name: '线下'
        }
      ]
    }
  },
  computed: {
    // 获取路径id值
    id() {
      return this.$route.query.id
    }
  },
  created() {
    // 有id直接查
    if (this.id) {
      this.getCardDetailById()
    }
  },
  methods: {
    // 编辑功能 根据id查月卡详情
    async getCardDetailById() {
      // 返回的值存在data
      const { data } = await getCardDetailByIdAPI(this.id)
      // console.log(data)
      //  数据回填 顺便将编辑参数 carInfoId rechargeId一并存入carInfoForm 和 payInfoForm
      const { personName, phoneNumber, carNumber, carBrand, carInfoId } = data
      this.carInfoFrom = { personName, phoneNumber, carNumber, carBrand, carInfoId }
      const { cardStartDate, cardEndDate, paymentAmount, paymentMethod, rechargeId } = data
      this.payInfoFrom = {
        payTime: [cardStartDate, cardEndDate],
        paymentMethod,
        paymentAmount,
        rechargeId
      }
    },
    // 校验车牌号格式
    // rule value callback
    // rule 校验规则
    // value 用户输入的值
    // callback 返回的信息 成功：callback() 失败：callback(new Error('提示'))
    validatorCarNumber(rule, value, callback) {
      const plateNumberRegex = /^[\u4E00-\u9FA5][\da-zA-Z]{6}$/
      if (plateNumberRegex.test(value)) {
        callback()
      } else {
        callback(new Error('车牌号码格式不正确'))
      }
    },
    //   兜底校验
    //   先验证车辆信息是否无误再对缴费信息进行校验
    confirmAdd() {
      this.$refs.carInfoFrom.validate((flag) => {
        if (!flag) return
        this.$refs.payInfoFrom.validate(async(flag) => {
          if (!flag) return
          // console.log('调用接口')
          //   封装数据
          // 注意日期格式 以及 接口接收的传参数是否一致
          const requestData = {
            ...this.carInfoFrom,
            ...this.payInfoFrom,
            cardStartDate: this.payInfoFrom.payTime[0],
            cardEndDate: this.payInfoFrom.payTime[1]
          }
          // 接口做了校验只要8个参数 多了个payTime参数 要删除
          delete requestData.payTime
          // 判断是编辑还是新增
          if (this.id) {
            // 调用编辑接口API
            await editCardAPI(requestData)
            //   弹窗提示修改成功
            this.$message.success('月卡更新成功')
          } else {
            //   调用新增接口
            await addCardAPI(requestData)
            //  弹提示添加成功
            this.$message.success('月卡添加成功')
          }
          //   跳转至月卡信息列表页
          // this.$router.back()
          // back回跳上一页 go看参数值1跳回上一页 2回上上页 以此类推
          this.$router.go(-1)
        })
      })
    },
    // 清空表单
    resetFrom() {
      // 如果没有prop属性 则手动清除
      this.$refs['carInfoFrom'].resetFields()
      this.$refs['payInfoFrom'].resetFields()
    }
  }

}
</script>

<style scoped lang="scss">
.add-card {
  background-color: #f4f6f8;
  height: 100vh;

  .add-header {
    display: flex;
    align-items: center;
    padding: 0 20px;
    height: 64px;
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
        padding-left: 20px;
      }

      .form {
        margin-bottom: 20px;
        padding: 20px 65px 24px;

        .el-form {
          display: flex;
          flex-wrap: wrap;

          .el-form-item {
            width: 50%;
          }
        }
      }
    }
    .preview{
      img{
        width: 100px;
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
