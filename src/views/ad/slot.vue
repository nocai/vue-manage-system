<template>
  <div>
    <div class="crumbs">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item> <i class="el-icon-lx-calendar"></i> 广告管理 </el-breadcrumb-item>
        <el-breadcrumb-item> <i class="el-icon-lx-cascades"></i> 广告位 </el-breadcrumb-item>
      </el-breadcrumb>
    </div>

    <div class="container">
      <div class="handle-box">
        <el-input v-model="q.name" placeholder="名称" class="handle-input mr10"></el-input>
        <el-select v-model="q.adType" placeholder="类型" class="handle-select mr10">
          <el-option label="全部" value></el-option>
          <el-option v-for="(lab, val) in this.$store.state.AdType" :label="lab" :value="val" :key="val"></el-option>
        </el-select>
        <el-select v-model="q.os" placeholder="操作系统" class="handle-select mr10">
          <el-option label="全部" value></el-option>
          <el-option v-for="(lab, val) in this.$store.state.OS" :label="lab" :value="val" :key="val"></el-option>
        </el-select>
        <el-select v-model="q.status" placeholder="是否有效" class="handle-select mr10">
          <el-option label="全部" value></el-option>
          <el-option v-for="(lab, val) in this.$store.getters.validList" :label="lab" :value="val" :key="val"></el-option>
        </el-select>
        <el-button
          type="primary"
          icon="el-icon-search"
          @click="
            page = 1;
            pageData();
          "
          >搜索</el-button
        >
      </div>

      <el-table :data="tableData" border>
        <el-table-column label="ID" prop="id" fixed="left" min-width="50"></el-table-column>
        <el-table-column label="名称" prop="name" min-width="200"></el-table-column>
        <el-table-column label="说明" min-width="120">
          <template scope="sc">
            <div>宽高: {{ sc.row.width }} * {{ sc.row.height }}</div>
            <div>系统: {{ $store.state.OS[sc.row.os] }}</div>
          </template>
        </el-table-column>
        <el-table-column label="竞价（元）" min-width="100">
          <template scope="sc">
            <div>CPC: {{ sc.row.biddingCpc }}</div>
            <div>CPM: {{ sc.row.biddingCpm }}</div>
            <div>CPT: {{ sc.row.biddingCpt }}</div>
          </template>
        </el-table-column>
        <el-table-column label="支持类型" min-width="120px">
          <template scope="sc">
            <el-tag v-for="it in sc.row.supportAdTypes" :key="it.adType" size="mini" style="margin-right: 5px">
              {{ $store.state.AdType[it.adType] }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="时间" min-width="200px">
          <template slot-scope="sc">
            <div>创建时间: {{ sc.row.createdAt }}</div>
            <div>更新时间: {{ sc.row.updatedAt }}</div>
          </template>
        </el-table-column>
        <el-table-column label="无效/有效" width="80">
          <template slot-scope="sc">
            <el-switch v-model="sc.row.status" @change="statusChange(sc.row)" active-value="Valid" inactive-value="Invalid"></el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作" fixed="right" min-width="120px">
          <template slot="header">
            <el-button
              type="primary"
              icon="el-icon-plus"
              @click="
                update = false;
                dialogVisible = true;
              "
              >添加</el-button
            >
          </template>
          <template scope="sc">
            <el-button
              type="text"
              icon="el-icon-edit"
              @click="
                update = true;
                dialogVisible = true;
                form = { ...sc.row };
                form.supportAdTypes = sc.row.supportAdTypes.map(it => it.adType);
              "
              >修改</el-button
            >
            <el-button type="text" icon="el-icon-delete" class="red" @click="del(sc.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <div class="pagination">
        <el-pagination
          :total="total"
          :current-page.sync="page"
          :page-size="limit"
          layout="total, sizes, prev, pager, next, jumper"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        >
        </el-pagination>
      </div>
    </div>

    <el-dialog :title="title" :visible.sync="dialogVisible">
      <el-form ref="form" :model="form" :rules="formRules" label-position="right" label-width="80px">
        <el-form-item
          label="名称"
          required
          prop="name"
          :rules="[
            { required: true, message: '名称必填' },
            { min: 3, message: '长度 > 3' }
          ]"
        >
          <el-input v-model="form.name" placeholder="名称"></el-input>
        </el-form-item>
        <el-form-item label="宽 * 高" required>
          <el-col :span="11">
            <el-form-item prop="width" :rules="[{ required: true, message: '宽度必填' }]">
              <el-input-number v-model="form.width" :min="1" style="width: 100%;"></el-input-number>
            </el-form-item>
          </el-col>
          <el-col class="line" :span="2" style="text-align: center">*</el-col>
          <el-col :span="11">
            <el-form-item prop="height" :rules="[{ required: true, message: '高度必填' }]">
              <el-input-number v-model="form.height" :min="1" style="width: 100%;"></el-input-number>
            </el-form-item>
          </el-col>
        </el-form-item>
        <el-form-item label="操作系统" prop="os" required :rules="[{ required: true, message: '操作系统必填' }]">
          <el-col :span="11">
            <el-select v-model="form.os">
              <el-option v-for="(value, key) in $store.state.OS" :label="value" :value="key" :key="key"></el-option>
            </el-select>
          </el-col>
        </el-form-item>
        <el-form-item label="支持类型" prop="supportAdTypes" required :rules="[{ required: true, message: '支持类型必填' }]">
          <el-checkbox-group v-model="form.supportAdTypes">
            <el-checkbox v-for="(value, key) in $store.state.AdType" :label="key" :key="key">{{ value }}</el-checkbox>
          </el-checkbox-group>
        </el-form-item>
        <el-form-item label="CPC" prop="biddingCpc">
          <el-col :span="11">
            <el-input-number v-model="form.biddingCpc" :min="0" style="width: 100%;"></el-input-number>
          </el-col>
        </el-form-item>
        <el-form-item label="CPM" prop="biddingCpm">
          <el-col :span="11">
            <el-input-number v-model="form.biddingCpm" :min="0" style="width: 100%;"></el-input-number>
          </el-col>
        </el-form-item>
        <el-form-item label="CPT" prop="biddingCpt">
          <el-col :span="11">
            <el-input-number v-model="form.biddingCpt" :min="0" style="width: 100%;"></el-input-number>
          </el-col>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="subForm('form')">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
const defForm = {
  supportAdTypes: []
};

export default {
  data() {
    var checkBidding = (rule, value, callback) => {
      var invalid = value => {
        return value == undefined || value === '' || value === 0;
      };
      if (invalid(this.form.biddingCpc) && invalid(this.form.biddingCpm) && invalid(this.form.biddingCpt)) {
        callback(new Error('CPC|CPM|CPT三选一必填'));
      } else {
        callback();
      }
    };
    return {
      update: false,
      dialogVisible: false,
      page: 1,
      limit: 10,
      q: {},
      form: defForm,
      tableData: [],
      total: 0,
      formRules: {
        biddingCpc: [{ validator: checkBidding }],
        biddingCpm: [{ validator: checkBidding }],
        biddingCpt: [{ validator: checkBidding }]
      }
    };
  },

  computed: {
    title() {
      return this.update ? '修改' : '添加';
    }
  },
  created() {
    this.pageData();
  },
  methods: {
    handleCurrentChange(val) {
      this.page = val;
      this.pageData();
    },
    handleSizeChange(val) {
      this.limit = val;
      this.pageData();
    },
    pageData() {
      this.axios
        .get('/ad/slot', {
          params: {
            page: this.page,
            limit: this.limit,
            ...this.q
          }
        })
        .then(resp => {
          this.tableData = resp.data.list || [];
          this.total = resp.data.total || 0;
        });
    },

    statusChange(row) {
      this.axios.put('/ad/slot/' + row.id + '/' + row.status).then(() => {
        this.$message.success('修改成功');
      });
    },

    del(row) {
      this.$confirm('确定要删除吗？', '提示', {
        type: 'warning'
      }).then(() => {
        this.axios.delete('/ad/slot/' + row.id).then(() => {
          this.pageData();
          this.$message.success('删除成功');
        });
      });
    },

    subForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          let method = 'post';
          let url = '/ad/slot';
          if (this.update) {
            method = 'put';
            url += '/' + this.form.id;
          }

          this.axios({
            method: method,
            url: url,
            data: this.form
          }).then(() => {
            this.dialogVisible = false;
            this.form = defForm;
            this.pageData();
            this.$message.success(this.title + '成功');
          });
        } else {
          return false;
        }
      });
    }
  }
};
</script>

<style scoped>
.handle-box {
  margin-bottom: 20px;
}

.handle-select {
  width: 120px;
}

.handle-input {
  width: 300px;
  display: inline-block;
}
.table {
  width: 100%;
  font-size: 14px;
}
.red {
  color: #ff0000;
}
.mr10 {
  margin-right: 10px;
}
.table-td-thumb {
  display: block;
  margin: auto;
  width: 40px;
  height: 40px;
}
</style>
