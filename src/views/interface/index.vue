<template>
  <div class="app-container">
    <!-- 查询条件 -->
    <div class="filter-container">
      <el-row>
        <el-col align="left" :span="8">
          <el-button type="primary add_btn height32" icon="el-icon-circle-plus-outline" size="small"
                     @click="handleCreate">新增
          </el-button>
        </el-col>
        <el-col align="right" :span="16">
          <el-input v-model="listQuery.name" placeholder="接口名称" style="width: 200px; margin-left: 10px;" size="small"/>
          <el-button type="primary" class="height32" icon="el-icon-search" style="margin-left: 10px;" size="small"
                     @click="handleFilter">查询
          </el-button>
        </el-col>
      </el-row>
    </div>
    <!-- 显示数据列表 -->
    <el-table size="small" :key="tableKey" v-loading="listLoading" :data="list" border fit highlight-current-row style="width: 100%; margin-top: 10px;">
      <el-table-column label="序号" type="index" :index="typeIndex" width="50" />
      <el-table-column label="接口名称" align="center" show-overflow-tooltip=true>
        <template slot-scope="{row}"><span>{{ row.name }}</span></template>
      </el-table-column>
      <el-table-column label="接口地址" align="center">
        <template slot-scope="{row}"><span>{{ row.url }}</span></template>
      </el-table-column>
      <el-table-column label="请求方法" align="center">
        <template slot-scope="{row}"><span>{{ row.method | statusFilter}}</span></template>
      </el-table-column>
      <!--<el-table-column label="请求数据" align="center" show-overflow-tooltip=true>-->
        <!--<template slot-scope="{row}"><span>{{ row.data}}</span></template>-->
      <!--</el-table-column>-->
      <!--<el-table-column label="请求头部" align="center" show-overflow-tooltip=true>-->
        <!--<template slot-scope="{row}"><span>{{ row.header}}</span></template>-->
      <!--</el-table-column>-->
      <el-table-column label="发送状态" align="center">
        <template slot-scope="{row}"><span>{{ row.status | statusFilter1}}</span></template>
      </el-table-column>
      <el-table-column label="备注" align="center" show-overflow-tooltip=true>
        <template slot-scope="{row}"><span>{{ row.remark}}</span></template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="{row}">
          <el-button type="primary" size="small" @click="handleUpdate(row)" plain>编辑</el-button>
          <el-button type="danger" size="small" @click="handleDelete(row)" plain>删除</el-button>
          <el-button type="primary" size="small" @click="handleSend(row)" plain>发送</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 页标 -->
    <pagination v-show="total>0" :total="total" :page.sync="pageInfo.page" :limit.sync="pageInfo.limit"
                @pagination="getList"/>
    <!-- 新增-修改 -->
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" width="36%">
      <el-form ref="dataForm" :rules="rules" :model="temp" label-position="left" label-width="100px" style="width: 400px; margin-left:50px;">
        <el-form-item label="接口名称" prop="name" size="small">
          <el-input v-model="temp.name" placeholder="请输入接口名称"/>
        </el-form-item>
        <el-form-item label="接口地址" prop="url" size="small">
          <el-input v-model="temp.url" placeholder="请输入接口地址"/>
        </el-form-item>
        <el-form-item label="请求头部" size="small" prop="header">
          <el-input v-model="temp.header" placeholder="请输入请求头部"/>
        </el-form-item>
        <el-form-item label="请求方法" prop="method">
          <el-select v-model="temp.method" class="filter-item" placeholder="请选择请求方法" style="width:100%" size="small">
            <el-option v-for="item in selectOptions" :key="item.key" :label="item.display_name" :value="item.key"/>
          </el-select>
        </el-form-item>
        <el-form-item label="请求数据" size="small" prop="data">
          <el-input v-model="temp.data" :autosize="{ minRows: 4, maxRows: 6}" type="textarea" placeholder="请输入请求数据"/>
        </el-form-item>
        <el-form-item label="备注" size="small" prop="data">
          <el-input v-model="temp.remark" :autosize="{ minRows: 4, maxRows: 6}" type="textarea" placeholder="请输入请求数据"/>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" size="small" @click="dialogStatus==='create'?createData():updateData()">保存</el-button>
        <el-button size="small" @click="dialogFormVisible = false">关闭</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import {dictDetailList, createDictDetail, updateDictDetail, deleteDictDetail,sendDictDetail} from '@/api/interface'   // 引入调用api
  import Pagination from '@/components/Pagination' // secondary package based on el-pagination

  const selectOptions = [
    {key: 0, display_name: 'put'},
    {key: 1, display_name: 'get'},
    {key: 2, display_name: 'post'},
    {key: 3, display_name: 'delete'},
  ]
  const statusTypeKeyValue = selectOptions.reduce((acc, cur) => {
    acc[cur.key] = cur.display_name
    return acc
  }, {})

  const selectOptions1 = [
    {key: 0, display_name: '未发送'},
    {key: 1, display_name: '已发送成功'},
    {key: 2, display_name: '已发送失败'},
  ]
  const statusTypeKeyValue1 = selectOptions1.reduce((acc, cur) => {
    acc[cur.key] = cur.display_name
    return acc
  }, {})

  export default {
    components: {Pagination},  // 分页
    filters: {
      statusFilter(type) {    // 类似map
        return statusTypeKeyValue[type]
      },
      statusFilter1(type) {    // 类似map
        return statusTypeKeyValue1[type]
      }
    },
    data() {
      return {
        tableKey: 0,
        list: null,   // table list
        total: 0,		// 总数
        listLoading: true, // 懒加载
        listQuery: {   //查询条件
          name: undefined,
        },
        pageInfo: {   //分页对象
          page: 1,
          limit: 10
        },
        selectOptions, //状态
        selectOptions1, //状态
        temp: {  //新增/修改temp
          id: undefined,
          name: '',
          url: '',
          data: '',
          method: '',
          header: '',
          remark:'',
          status:''
        },
        dialogFormVisible: false,  //新增修改弹出框
        dialogStatus: '',	  //弹出框 显示隐藏控制
        textMap: {
          update: '修改',
          create: '新增'
        },
        rules: {    //新增修改保存时 校验规则
          url: [{required: true, message: '接口地址不能为空', trigger: 'blur'}],
          data: [{required: true, message: '请求数据不能为空', trigger: 'blur'}],
          method: [{required: true, message: '请选择方法', trigger: 'change'}],
          header: [{required: true, message: '请求头部不能为空', trigger: 'blur'}],
          name: [{required: true, message: '接口名称不能为空', trigger: 'blur'}],
        }
      }
    },
    created() {  //打开界面执行动作
      this.getList()
    },
    methods: {
      getList() {  //查询分页
        this.listLoading = true
        dictDetailList(this.listQuery, this.pageInfo).then(response => {
          this.list = response.data.records
          this.total = response.data.total
          setTimeout(() => {
            this.listLoading = false
          }, 1 * 1000)
        })
      },
      handleFilter() { // 查询过滤
        this.pageInfo.page = 1
        this.getList()
      },
      resetTemp() {   // 重置 表单
        this.temp = {
          id: undefined,
          name: '',
          url: '',
          data: '',
          method: '',
          header: '',
          response:'',
          remark:'',
          status:''
        }
      },
      handleCreate() {   // 点击新增操作
        this.resetTemp()
        this.dialogStatus = 'create'
        this.dialogFormVisible = true
        this.$nextTick(() => {
          this.$refs['dataForm'].clearValidate()
        })
      },
      createData() {   // 执行后端 新增方法
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            // const tempData = Object.assign({}, this.temp)
            // var params = new URLSearchParams()
            // params=tempData
            createDictDetail(this.temp).then((res) => {
              if (res.code == 200) {
                this.dialogFormVisible = false
                this.getList()
                this.$notify({title: '新增', message: '新增成功!', type: 'success', duration: 2000})
              }
            })
          }
        })
      },
      handleUpdate(row) {  // 点击修改操作
        this.temp = Object.assign({}, row) // copy obj
        this.dialogStatus = 'update'
        this.dialogFormVisible = true
        this.$nextTick(() => {
          this.$refs['dataForm'].clearValidate()
        })
      },
      updateData() {   // 执行后端 修改方法
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            // const tempData = Object.assign({}, this.temp)
            // var params = new URLSearchParams()
            // params=tempData
            updateDictDetail(this.temp).then((res) => {
              if (res.code == 200) {
                this.dialogFormVisible = false
                this.getList()
                this.$notify({title: '修改', message: '修改成功', type: 'success', duration: 2000})
              }
            })
          }
        })
      },
      handleDelete(row) { // 执行后端 删除方法
        this.$confirm('你确定要删除该信息, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(async () => {
          await deleteDictDetail({'id':row.id})
          this.getList()
          this.$message({type: 'success', message: '删除成功!'})
        }).catch(() => {
          // this.$message({type: 'success', message: '已取消删除'})
        })
      },
      handleSend(row){
        this.$confirm('你确定要发送该请求, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(async () => {
          await sendDictDetail({'id':row.id});
          this.getList();
          this.$message({type: 'success', message: '发送成功!'})
        }).catch(() => {
          // this.$message({type: 'success', message: '已取消发送'})
        })
      }
    }
  }
</script>
