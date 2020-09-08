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
            <el-col :span="8">
              <el-form-item label="分类">
                <el-select v-model="qForm.cate" placeholder="分类">
                  <el-option
                    v-for="item in option.cateOption"
                    :key="item.value"
                    :label="item.text"
                    :value="item.value">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="来源">
                <el-select clearable v-model="qForm.source" placeholder="来源">
                  <el-option
                    v-for="item in option.sourceOption"
                    :key="item.value"
                    :label="item.text"
                    :value="item.value">
                  </el-option>
                </el-select>
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
          <el-form-item>
            <el-button type="primary" @click="query">查询</el-button>
            <el-button type="primary" @click="add">新增</el-button>
            <el-button type="danger" @click="del">删除</el-button>
          </el-form-item>
        </el-form>
        <el-table ref="table" @row-dblclick="dbClick" :data="tableData" border stripe height="200" style="width: 100%;">
          <el-table-column header-align="center" type="selection" width="35"/>
          <el-table-column header-align="center" prop="questionDescription" label="标题" width="400"
                           show-overflow-tooltip="true"/>
          <el-table-column header-align="center" prop="techniqueId" label="分类" :formatter="formatCate" width="60"/>
          <el-table-column header-align="center" prop="referUrl" label="参考链接" width="80">
            <template slot-scope="scope">
              <el-link :href="scope.row.referUrl"
                       :disabled="scope.row.referUrl === '' ? true : false"
                       target="_blank" type="primary">
                <i class="el-icon-view el-icon--right"></i> 查看
              </el-link>
            </template>
          </el-table-column>
          <el-table-column header-align="center" prop="source" label="来源"
                           :formatter="formatSource"
                           width="60"/>
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
          <el-table-column header-align="center" prop="updateTime" label="修改时间" width="140"/>
          <!--      <el-table-column prop="oper" label="操作" width="180"/>-->
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
      <div v-show="item.name === 'addTechinique'" class="app-container">
        <addTechinique ref="addchilid" :opt="option" @getJson="getJson" @removeTab="removeTab"></addTechinique>
      </div>
      <div v-show="item.name === 'editTechinique'" class="app-container">
        <editTechinique ref="child" :row="editRow" :opt="option" @getJson="getJson" @removeTab="removeTab"></editTechinique>
      </div>
    </el-tab-pane>
  </el-tabs>
</template>

<script>

  import axios from 'axios'
  import addTechinique from '@/components/technique/add'
  import editTechinique from '@/components/technique/edit'

  export default {
    name: "list",
    components: {
      addTechinique,
      editTechinique
    },
    data() {
      return {
        qForm: {
          title: '',
          cate: '',
          source: '',
          status: '',
          qstime: []/*[new Date(2000, 10, 10, 10, 10), new Date(2000, 10, 11, 10, 10)]*/
        },
        tableData: [],
        currentPage: 1,
        size: 10,
        show: false,
        total: 0,
        option: {
          cateOption: [],
          sourceOption: [],
          statusOption: []
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
        axios.post('/api/tech/data/get', {
          title: this.qForm.title,
          cate: this.qForm.cate,
          source: this.qForm.source,
          status: this.qForm.status,
          startTime: this.isNotEmpty(this.qForm.qstime) ? this.qForm.qstime[0] : '',
          endTime: this.isNotEmpty(this.qForm.qstime) ? this.qForm.qstime[1] : '',
          current: this.currentPage,
          size: this.size
        }).then(response => {
          console.log(response);
          this.tableData = response.data.records;
          this.total = response.data.total;
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
      // 初始化下拉框
      initOption() {
        var that_ = this;
        axios.get('/api/tech/option/init')
          .then(response => {
            that_.option.cateOption = response.data.cateOption;
            that_.option.sourceOption = response.data.sourceOption;
            that_.option.statusOption = response.data.statusOption;
          });
      },
      formatCate(row, column) {
        let t = this.option.cateOption.find(value => value.value === (row.techniqueId+''));
        if (t) {
          return t.text;
        }
        return '';
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
      add() {
        this.$refs.child[0].resetForm('tecForm');
        var obj = {
          title: '新增',
          name: 'addTechinique',
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
          this.$refs.addchilid.forEach(value => {
            value.resetForm('tecForm');
          })
        }
        this.tabVal = obj.name;
      },
      edit(row) {
        var obj = {
          title: '编辑',
          name: 'editTechinique',
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
        console.log(this.$refs.table[0].selection)
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
      }
    },
    mounted() {
      // 相当于jquery中的$.ready()  当dom元素全部渲染完成再执行
      this.$nextTick(function () {
        this.initOption();
      })
    }
  }
</script>

<style scoped>

</style>
