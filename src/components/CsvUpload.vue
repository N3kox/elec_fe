<template>
  <div class="app">
    <el-button class="filter-item" style="margin-left: 10px;" type="primary" @click="openCsvDialog()" icon="el-icon-plus">
      导入
    </el-button>
    <el-dialog :title="csvTitle" :visible.sync="csvVisible" width="50%" :modal="false">
      <div>
        <el-form ref="file" label-width="120px">
            <el-form-item label="选择文件类型">
                <el-select v-model="optionChosen">
                <el-option v-for="item in options" :key="item" :value="item" :label="item">
                </el-option>
                </el-select>
            </el-form-item>

          <el-form-item label="CSV文件导入：">
            <el-upload class="upload-demo" ref="upload" drag accept=".csv" :action="actionUrl" :auto-upload="false" :on-change="handleChange" :file-list="fileList" :on-exceed="uploadExceed">
              <i class="el-icon-upload"></i>
              <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
              <div class="el-upload__tip" slot="tip">只能上传csv文件</div>
            </el-upload>
          </el-form-item>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="cancelImport">取消</el-button>
        <el-button type="primary" @click="importCsv">导入</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data: () => ({
    files: null,
    csvVisible: false,
    csvTitle: '导入CSV文件',
    options:['标准工作任务单', '设备台账'],
    optionChosen:'',
    fileList:[],
    uploadRootUrl:'',
    actionUrl:'',
  }),
  methods: {
    openCsvDialog() {
      let that = this
      this.files = []
      this.csvVisible = true
      this.csvTitle = '导入CSV文件'
      this.$nextTick(() => {
        that.$refs['upload'].clearFiles()
      })
    },
    // 上传文件，获取文件流
    handleChange(f, fl) {
      this.fileList = fl;
      console.log(fl)
      this.$message.success("上传文件成功");
    },
    // handlePreview(file){
    //     window.console.log(file);
    // },
    uploadExceed(file, fileList){
        this.$message.error("请一次上传一个文件")
    },
    async importCsv() {
        if(this.optionChosen == ''){
            this.$message.error("请选择文件类型")
            return;
        }
        if (this.fileList.length > 0) {
            let type = '';
            if(this.optionChosen == '标准工作任务单') type = 'mission_ticket'
            else if(this.optionChosen == '设备台账') type = 'device'

            this.actionUrl = this.uploadRootUrl+`?type=${type}`;

            let formData = new FormData();
            for(let index in this.fileList){
              formData.append("files", this.fileList[index].raw);
            }
            let config = {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            }
            this.$http.post(this.actionUrl, formData, config).then(res=>{
                if(res.ok == true && res.body == true){
                  this.csvVisible = false
                  this.$message.success("提交成功");
                }
            })

            // this.$refs.upload.submit();
            
            // window.console.log(this.file)
            
            // if (res.code === 0) {
            // this.csvVisible = false
            // this.$message({
            //     type: 'success',
            //     message: '导入成功',
            //     duration: 1500,
            //     onClose: async () => {}
            // })
            // }
        } else {
            this.$message.error('上传文件不能为空')
        }
    },
    cancelImport(){
        this.csvVisible = false
        this.$refs['upload'].clearFiles()
    }
  },
  mounted(){
      this.uploadRootUrl = this.patchUrl(`/source/csv_upload`)
  }
}
</script>

<style scoped></style>
