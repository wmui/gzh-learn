<template>
  <div class="content">
    <div class="related-products">
      <table class="table">
        <thead>
          <tr>
            <th>图片</th>
            <th>标题</th>
            <th>价格</th>
            <th>简介</th>
            <th>参数</th>
            <th>修改</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in products">
            <td>
              <!-- 图片上传至七牛暂时未做 -->
              <!-- <div class="img" v-for="image in item.images">
                <img :src="imageCDN + image + "?imageView2/1/format/jpg/q/75/imageslim"" alt="">
              </div> -->
              <!-- 随机图片代替 -->
              <div class="img">
                <img src="https://picsum.photos/200/300/?random" alt="">
              </div>
            </td>
            <td>{{item.title}}</td>
            <td>{{item.price}}</td>
            <td v-html="item.intro"></td>
            <td>
              <p v-for="parameter in item.parameters">{{parameter.key}} {{parameter.value}}</p>
            </td>
            <td>
              <button class="btn" @click="editProduct(item)">
              	
              <div class="material-icon">edit</div>
              </button>
              <button class="btn" @click="deleteProduct(item)">
                <div class="material-icon">delete</div>
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <div class="edit-product" :class="{active: editing}">
      <div class="edit-header">
        <div class="material-icon">edit</div>
        <div style="flex: 1">
          <div class="material-icon" @click="editing =! editing">close</div>
        </div>
      </div>
      <div class="edit-body">
        <div class="form edit-form">
          <div class="input-group">
            <label for="">标题</label>
            <input type="text" v-model="edited.title">
          </div>
          <div class="input-group">
            <label for="">价格</label>
            <input v-model="edited.price" type="number">
          </div>
          <div class="input-group">
            <label for="">简介</label>
            <textarea name="" id="" cols="30" rows="10" v-model="edited.intro" @keyup="editedIntro"></textarea>
          </div>
          <!-- <div class="input-group">
            <label for="">图片</label>
            <div class="upload-images">
              <div class="img" v-for="item, index in edited.images">
                <img :src="imageCDN + item + "?imageView2/1/format/jpg/q/75/imageslim"" alt="">
                <div class="tools">
                  <div class="material-icon" @click="deleteImg(index)">delete</div>
                </div>
              </div>
              <div class="upload-btn">
                <g id="Page-1" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
                  <g id="ic_backup_black_24px" transform="translate(-1.000000, -6.000000)">
                    <polygon id="Shape" points="0 0 55 0 55 55 0 55"></polygon>
                    <path id="outline" d="M42.6907609,20.7503727 C41.2853571,13.6200155 35.0230435,8.26708075 27.5,8.26708075 C21.5270342,8.26708075 16.339441,11.6565839 13.7559783,16.6168323 C7.535,17.2781988 2.69875776,22.5484627 2.69875776,28.9347826 C2.69875776,35.7757919 8.25836957,41.3354037 15.0993789,41.3354037 L41.9673913,41.3354037 C47.671677,41.3354037 52.3012422,36.7058385 52.3012422,31.0015528 C52.3012422,25.5452795 48.0643634,21.1223913 42.6907609,20.7503727 Z" , stroke="#78909C" stroke-width="3" :stroke-dasharray="upload.dasharray" :stroke-dashoffset="upload.dashoffset"></path>
                    <path id="Shape" d="M42.6907609,20.7503727 C41.2853571,13.6200155 35.0230435,8.26708075 27.5,8.26708075 C21.5270342,8.26708075 16.339441,11.6565839 13.7559783,16.6168323 C7.535,17.2781988 2.69875776,22.5484627 2.69875776,28.9347826 C2.69875776,35.7757919 8.25836957,41.3354037 15.0993789,41.3354037 L41.9673913,41.3354037 C47.671677,41.3354037 52.3012422,36.7058385 52.3012422,31.0015528 C52.3012422,25.5452795 48.0643634,21.1223913 42.6907609,20.7503727 Z M31.6335404,26.8680124 L31.6335404,35.1350932 L23.3664596,35.1350932 L23.3664596,26.8680124 L17.1661491,26.8680124 L27.5,16.5341615 L37.8338509,26.8680124 L31.6335404,26.8680124 Z" fill="#CFD8DC" fill-rule="nonzero"></path>
                  </g>
                </g>
                <br>
                <div class="text">上传图片</div>
                <input type="text" type="file" @change="uploadImg($event)">
              </div>
            </div>
          </div> -->
          <div class="input-group">
            <label for="">参数</label>
            <div class="parameters">
             <div class="inputs" v-for="(item, index) in edited.parameters" :key="index">
               <input type="text" v-model="item.key" placeholder="名称">
               <input type="text" v-model="item.value" placeholder="值">
               <div class="remove" @click="removeParameter(index)">
                 <div class="material-icon">remove</div>
               </div>
             </div>
           </div>
          </div>
        </div>
      </div>
      <div class="edit-footer">
        <button class="btn save" @click="saveEdited" v-if="!isProduct">创建宝贝</button>
        <button class="btn save" @click="saveEdited" v-if="isProduct">保存修改</button>
        <div class="btn add-parameter" @click="addParameter">
          <div class="material-icon">添加参数</div>
        </div>
      </div>
    </div>
    <div class="float-btn" @click="createProduct">
      <div class="material-icon">add</div>
    </div>
    <v-snackbar :open.sync="openSnackbar">
      <span slot="body">保存成功</span>
    </v-snackbar>
  </div>
</template>
<script>
import { mapState } from 'vuex'
import axios from 'axios'
// import randomToken from 'random-token'
// import Uploader from 'qiniu-web-uploader'
import vSnackbar from '~/components/snackbar'

export default {
  layout: 'admin',
  head () {
    return {
      title: '宝贝列表'
    }
  },

  data () {
    return {
      isProduct: false,
      openSnackbar: false,
      edited: {
        images: [],
        parameters: []
      },
      upload: {
        dasharray: 0,
        dashoffset: 0
      },
      editing: false
    }
  },
  async mounted () {
    await this.$store.dispatch('fetchProducts')
  },
  computed: mapState([
    'imageCDN',
    'products'
  ]),

  methods: {
    editedIntro (e) {
      let html = e.target.value
      html = html.replace(/\n/g, '<br />')
      this.edited.intro = html
    },

    editProduct (item) {
      this.edited = item
      this.isProduct = true
      this.editing = true
    },

    deleteProduct (item) {
      this.$store.dispatch('deleteProduct', item)
    },

    createProduct () {
      this.edited = {
        images: [],
        parameters: []
      }

      this.isProduct = false
      this.editing = true
    },

    async saveEdited () {
      this.isProduct
        ? await this.$store.dispatch('patchProduct', this.edited)
        : await this.$store.dispatch('saveProduct', this.edited)

      this.openSnackbar = true
      this.isProduct = false
      this.edited = {
        images: [],
        parameters: []
      }
      this.editing = !this.editing
    },

    addParameter () {
      this.edited.parameters.push({
        key: '',
        value: ''
      })
    },

    removeParameter (index) {
      this.edited.parameters.splice(index, 1)
    },

    /*async getUptoken (key) {
      let res = await axios.get('/qiniu/token', {
        params: {
          key: key
        }
      })

      return res.data.data.token
    },*/

    /*async uploadImg (e) {
      let file = e.target.files[0]
      let key = randomToken(32)

      key = `products/${key}`
      let token = await this.getUptoken(key)

      let uptoken = {
        uptoken: token,
        key: Buffer.from(key).toString('base64')
      }

      // Uploader.QINIU_UPLOAD_URL = '//up-z2.qiniu.com'

      let uploader = new Uploader(file, uptoken) 

      uploader.on('progress', () => {
        console.log(uploader.percent)
        // let dashoffset = this.upload.dasharray * (1 - uploader.percent)
        // this.upload.dashoffset = dashoffset
      })

      let res = await uploader.upload()

      uploader.cancel()
      console.log(res)
      this.edited.images.push(res.key)
    },*/

    /*deleteImg (index) {
      this.edited.images.splice(index, 1)
    }*/
  },

  components: {
    vSnackbar
  }
}
</script>
<style lang='sass' src='~/static/sass/admin.sass'></style>
