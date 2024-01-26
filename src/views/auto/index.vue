<template>
  <div class="app-container">
    <div class="filter-container">
      <el-row>
        <el-col align="left" :span="16">
          <el-input v-model="listQuery.name" placeholder="活动名称" style="width: 250px; " size="small"/>
          <el-button type="primary" class="height32" icon="el-icon-search" style="margin-left: 10px;" size="small" @click="handleFilter">查询</el-button>
          <!--<el-button type="success" @click="handleSuite()" align="right">一键测试</el-button>-->
          <el-button type="success" @click="handleSuite()" align="right">一键测试</el-button>
        </el-col>
      </el-row>
    </div>
    <el-table size="small" :key="tableKey" v-loading="listLoading" :data="list" border fit highlight-current-row
              style="width: 100%; margin-top: 10px;">
      <el-table-column label="序号" type="index" :index="typeIndex" width="100"  align="center"/>
      <el-table-column label="活动名称" align="center">
        <template slot-scope="{row}"><span>{{ row.activity_name }}</span></template>
      </el-table-column>
      <el-table-column label="执行次数" align="center">
        <template slot-scope="{row}"><span>{{ row.count }}</span></template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="{row}">
          <el-button type="primary" size="small" @click="handleTest(row)" plain>执行测试</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!--<el-dialog title="一键运行" :visible.sync="dialogFormVisible" width="20%" center >-->
      <!--<el-form ref="dataForm" :rules="rules" :model="temp" label-width=auto label-position="top">-->
        <!--<el-form-item size="	medium" prop="data">-->
          <!--<el-input v-model="temp.adjure" :rows=7 type="textarea" placeholder="1、如果不输入，则会立即运行；-->
  <!--2、请输入定时时间,例每天凌晨两点10执行任务 (秒 分 时 日 月 星期 年)，参数值：* 10 2 * * * *"/>-->
        <!--</el-form-item>-->
      <!--</el-form>-->
      <!--<div class="dialog-footer" align="center">-->
        <!--<el-button type="primary" size="small" @click="dialogStatus=testSuite()">保存</el-button>-->
        <!--<el-button size="small" @click="dialogFormVisible = false">关闭</el-button>-->
      <!--</div>-->
    <!--</el-dialog>-->
  </div>
</template>

<script>
  import {dictDetailList,autoTest,autoSuite} from '@/api/auto'   // 引入调用api
  export default {
    data() {
      return {
        rules: {    //新增修改保存时 校验规则
          url: [{required: true, message: '接口地址不能为空', trigger: 'blur'}],
        },
        temp: {  //新增/修改temp
          id: undefined,
          adjure: ''
        },
        domains: [{
          value: ''
        }],
        tableKey: 0,
        list: null,
        total: 0,
        listLoading: true,
        listQuery: {
          name: undefined,
        },
        pageInfo: {
          page: 1,
          limit: 100
        },
        DialogVisible: false,
        dialogFormVisible: false,  //新增修改弹出框
        dialogStatus: '',	  //弹出框 显示隐藏控制
      }
    },
    created() {
      this.getList()
    },
    methods: {
      getList() {
        this.listLoading = true
        dictDetailList(this.listQuery, this.pageInfo).then(response => {
          this.list = response.data.records
          this.total = response.data.total
          setTimeout(() => {
            this.listLoading = false
          }, 1 * 1000)
        })
      },
      handleFilter() {
        this.pageInfo.page = 1
        this.getList()
      },
      handleTest(row) {
        this.$confirm('是否自动测试该活动?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'info',
        }).then(async () => {
          this.$message({type: 'success', message: '请稍等，测试完成后您将会在企微收到测试报告！'})
          await autoTest({"id":row.id});
          this.getList();
        }).catch(() => {
          // this.$message({type: 'success', message: '已取消'})
        })
      },
      handleSuite() {
        this.$confirm('是否一键测试所有活动?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'info',
        }).then(async () => {
          this.$message({type: 'success', message: '请稍等，测试完成后您将会在企微收到测试报告！'})
          await autoSuite();
          this.getList();
        }).catch(() => {
          // this.$message({type: 'success', message: '已取消'})
        })
      },
      // handleSuite() {
      //   this.dialogStatus = 'create'
      //   this.dialogFormVisible = true
      // },
      testSuite() {
        // this.$refs['dataForm'].validate(async () =>{
        //     this.dialogFormVisible = false
        //     if(this.temp.adjure=='')
        //     {this.$message({type: 'success', message: '稍后将会在企业微信群聊中发送测试报告'})}
        //     else
        //     {this.$message({type: 'success', message: '将在设置的时间运行，并在企业微信群聊中发送测试报告'})}
        //     await autoSuite(this.temp)
        //     this.getList()
        //   })
      },
    }
  }
</script>
