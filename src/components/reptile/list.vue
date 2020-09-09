<template>
  <el-tabs v-model="tabVal" type="card" @tab-remove="removeTab">
    <el-tab-pane
      v-for="(item, index) in tabs"
      :key="item.name"
      :label="item.title"
      :name="item.name"
      :closable="item.closable"
    >
      <div v-show="item.name === 'list'" class="app-container">
        <el-form inline="true" :model="qForm" size="mini" class="demo-form-inline">
          <el-row :gutter="20">
            <el-col :span="8">
              <el-form-item label="标题">
                <el-input v-model="qForm.title" clearable placeholder="标题"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="16">
              <el-form-item label="创建时间">
                <el-date-picker
                  v-model="qForm.qstime"
                  type="datetimerange"
                  value-format="yyyy-MM-dd HH:mm:ss"
                  :picker-options="pickerOptions"
                  range-separator="至"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期"
                  align="right">
                </el-date-picker>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="8">
              <el-form-item label="状态">
                <el-select clearable v-model="qForm.status" placeholder="状态">
                  <el-option
                    v-for="item in option.statusOption"
                    :key="item.value"
                    :label="item.text"
                    :value="item.value">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-form-item>
            <el-button type="primary" @click="query">查询</el-button>
            <el-button type="primary" @click="gain">捞取</el-button>
            <el-button type="danger" @click="del">删除</el-button>
          </el-form-item>
        </el-form>
        <el-table ref="table" @row-dblclick="dbClick" :data="tableData" border stripe height="200" style="width: 100%;">
          <el-table-column header-align="center" type="selection" width="35"/>
          <el-table-column header-align="center" prop="title" label="标题" width="400"
                           show-overflow-tooltip="true"/>
          <el-table-column header-align="center" prop="desc" label="描述" width="280"
                           show-overflow-tooltip="true"/>
          <el-table-column header-align="center" prop="link" label="参考链接" width="80">
            <template slot-scope="scope">
              <el-link :href="scope.row.link"
                       :disabled="scope.row.link === '' ? true : false"
                       target="_blank" type="primary">
                <i class="el-icon-view el-icon--right"></i> 查看
              </el-link>
            </template>
          </el-table-column>
          <el-table-column header-align="center" prop="status" label="状态"
                           :formatter="formatStatus"
                           :key=""
                           width="80">
            <template slot-scope="scope">
              <el-tag :type="tagType[scope.row.status]">
                {{option.statusOption.find(value => value.value === scope.row.status).text}}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column header-align="center" prop="createTime" label="创建时间" width="140"/>
        </el-table>
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="currentPage"
          :page-sizes="[10, 50, 100, 150, 200]"
          :page-size="size"
          :hide-on-single-page="show"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total">
        </el-pagination>
      </div>
      <div v-show="item.name === 'reptileEdit'" class="app-container">
        <reptileEdit ref="child" :row="editRow" :opt="option" @getJson="getJson"
                        @removeTab="removeTab"></reptileEdit>
      </div>
    </el-tab-pane>
  </el-tabs>
</template>

<script>

  import axios from 'axios'
  import reptileEdit from '@/components/reptile/edit'

  export default {
    name: "list",
    components: {
      reptileEdit
    },
    data() {
      return {
        qForm: {
          title: '',
          status: '0',
          qstime: []/*[new Date(2000, 10, 10, 10, 10), new Date(2000, 10, 11, 10, 10)]*/
        },
        tableData: [],
        currentPage: 0,
        size: 10,
        show: false,
        total: 0,
        option: {
          statusOption: [
            {
              text: '未捞取',
              value: '0'
            },
            {
              text: '已捞取',
              value: '1'
            }
          ]
        },
        pickerOptions: {
          shortcuts: [{
            text: '最近一周',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit('pick', [start, end]);
            }
          }, {
            text: '最近一个月',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              picker.$emit('pick', [start, end]);
            }
          }, {
            text: '最近三个月',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
              picker.$emit('pick', [start, end]);
            }
          }]
        },
        tagType: {
          '0': 'danger',
          '1': 'warning'
        },
        tabVal: 'list',
        tabs: [{
          title: '列表',
          name: 'list',
          closable: false
        }],
        editRow: {}
      }
    },
    methods: {
      getJson() {
        axios.post('/api/reptile/data/get', {
          title: this.qForm.title,
          status: this.qForm.status,
          startTime: this.isNotEmpty(this.qForm.qstime) ? this.qForm.qstime[0] : '',
          endTime: this.isNotEmpty(this.qForm.qstime) ? this.qForm.qstime[1] : '',
          current: this.currentPage,
          size: this.size
        }).then(response => {
          console.log(response);
          this.tableData = response.data.data.records;
          this.total = response.data.data.total;
        });
      },
      query() {
        this.getJson();
      },
      handleSizeChange(val) {
        console.log(`每页 ${val} 条`);
        this.size = val;
        this.getJson();
      },
      handleCurrentChange(val) {
        console.log(`当前页: ${val}`);
        this.currentPage = val;
        this.getJson()
      },
      formatSource(row, column) {
        let t = this.option.sourceOption.find(value => value.value === row.source);
        return t.text;
      },
      formatStatus(row, column) {
        let t = this.option.statusOption.find(value => value.value === row.status);
        return t.text;
      },
      isNotEmpty(value) {
        if (value && value != undefined && value != null && value != '') return true;
      },
      dbClick(row, column, event) {
        this.edit(row);
      },
      edit(row) {
        var obj = {
          title: '编辑',
          name: 'reptileEdit',
          closable: true
        };
        var flag = this.tabs.some(value => {
          if (value.name === obj.name) {
            return true;
          }
        })
        if (!flag) {
          this.tabs.push(obj);
        } else {
          this.$refs.child.forEach(value => {
            console.log(value);
            value.resetForm('tecForm');
            value.row = row;
            value.showData();
          });
        }
        this.tabVal = obj.name;
        this.editRow = row;
      },
      removeTab(targetName) {
        this.tabs.forEach(function (item, index, arr) {
          if (item.name === targetName) {
            arr.splice(index, 1);
          }
        });
        if (targetName === this.tabVal) {
          this.tabVal = this.tabs[0].name;
        }
      },
      del() {
        var selected = this.$refs.table[0].selection;
        if (selected.length === 0) {
          this.$message.error('请至少选择一条记录');
          return;
        }
        var ids = '';
        for (var item of selected) {
          ids += (item.id + ',');
        }
        ids = ids.substr(0, ids.length - 1);
        this.$confirm('确定删除这些数据吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          axios.get('/api/tech/data/del/' + ids)
            .then(response => {
              if (response.data.success) {
                this.$message({
                  type: 'success',
                  message: '删除成功!'
                });
                this.getJson();
              } else {
                this.$message.error(response.data.message);
              }
            });
        })
      },
      gain() {
        var selected = this.$refs.table[0].selection;
        if (selected.length === 0) {
          this.$message.error('请至少选择一条记录');
          return;
        }
        var ids = '';
        for (var item of selected) {
          ids += (item.id + ',');
        }
        ids = ids.substr(0, ids.length - 1);
        this.$confirm('确定捞取这些数据吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          axios.get('/api/reptile/data/gain/' + ids)
            .then(response => {
              console.log(response);
              if (response.data.success) {
                this.$message({
                  message: response.data.message,
                  type: 'success'
                });
                this.getJson();
              } else {
                this.$message.error(response.data.message);
              }
            });
        });
      },
      del() {
        var selected = this.$refs.table[0].selection;
        if (selected.length === 0) {
          this.$message.error('请至少选择一条记录');
          return;
        }
        var ids = '';
        for (var item of selected) {
          ids += (item.id + ',');
        }
        ids = ids.substr(0, ids.length - 1);
        this.$confirm('确定删除这些数据吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          axios.get('/api/reptile/data/del/' + ids)
            .then(response => {
              console.log(response);
              if (response.data.success) {
                this.$message({
                  message: response.data.message,
                  type: 'success'
                });
                this.getJson();
              } else {
                this.$message.error(response.data.message);
              }
            });
        });
      }
    },
    mounted() {
    }
  }
</script>

<style scoped>

</style>
