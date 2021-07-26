<template>
<v-app>
<!--dialogs-->
  <!--save-->
  <transition name="fade">
    <save 
      v-if="dialogs.save.show" 
      @closeDialog="closeDialog($event)">
    </save>
  </transition>
  <!--confirm-->
    <transition name="fade">
      <confirm 
        :data='dialogs.confirm.question' 
        v-if="dialogs.confirm.show" 
        @processConfirmation="processConfirmation($event)">
      </confirm>
    </transition>
  <!--generic-->
    <transition name="fade">
      <generic 
        :data='item' 
        :params='params'
        v-if=" dialogs.dependent.show"
        @closeDialog="closeDialog($event)">
      </generic>
    </transition>
  <!--employee-->
    <transition name="fade">
      <employee 
        :data='item' 
        :params='params'
        v-if=" dialogs.employee.show"
        @closeDialog="closeDialog($event)">
      </employee>
    </transition>
<!--banner bar-->
  <banner class='no-print'></banner>
<!--header-->
  <v-card-title primary-title class='dizagara-sub-header' style='border-bottom: 1px solid #781602;'>
    <!--title-->
      <span class='mdi mdi-24px dizagara-margin-right' id='headerIcon'></span>
      <small>{{title}}</small>
    <!--add button-->
      <v-btn dense dark 
        class='dizagara-button-orange'
        style='position: absolute; right: 430px;'
        @click='add()'>
        <span class="mdi mdi-18px dizagara-margin-right" id='addIcon'></span>
        ADD
      </v-btn>
    <!--delete all button-->
      <v-btn dense dark 
        class='dizagara-button-red'
        style='position: absolute; right: 130px;'
        @click='deleteAll()'>
        <span class="mdi mdi-18px dizagara-margin-right" id='deleteIcon'></span>
        DELETE ALL
      </v-btn>
    <!--export button-->
      <v-btn dense dark 
        class='dizagara-button-orange'
        style='position: absolute; right: 295px;'
        @click='exportSpreadsheet()'>
        <span class="mdi mdi-18px dizagara-margin-right" id='exportIcon'></span>
        EXPORT
      </v-btn>
    <!--save button-->
      <v-btn dense dark 
        class='dizagara-button-green'
        style='position: absolute; right: 15px;'
        @click='save()'>
        <span class="mdi mdi-18px dizagara-margin-right" id='saveIcon'></span>
        SAVE
      </v-btn>
  </v-card-title>
  <span style='overflow-y: auto; height: calc(100vh - 150px)'>
<!--filters-->
    <v-card-title style = 'margin-bottom: -40px;'>
      <!--filter term-->
        <v-text-field dense outlined autocomplete='off'
            style='margin-right: 10px;'
            append-icon='mdi-magnify'
            background-color='yellow lighten-4'
            v-model='searchTerm'
            placeholder='Type search term.'
            label='Filter Term'
            v-on:keyup='filterTerm'
        ></v-text-field>
      <!--fitler dropdown-->
        <v-autocomplete dense outlined
          style='margin-left: 10px;'
          background-color='yellow lighten-4'
          v-model='filterCol'
          :items='filterCols'
          :item-text='a => a.name'
          :item-value='a => a.key'
          label='Filter Column'
          @change="filterTerm"
        ></v-autocomplete>
  </v-card-title>
  <!--table-->
    <v-simple-table 
      style='margin: 20px; padding-bottom: 20px;'
      v-if='data.length && isShows' 
      v-sortable-data-table  
      @sorted="saveOrder">
      <template v-slot:default>
      <!--header-->
          <thead>
            <tr>
                <th class='text-left' v-for='header in headers' :key='header.key'>
                <!--name-->
                  {{header.key == 'isShow' ? '' : header.name}}
                <!--sort-->
                  <v-btn dense dark small icon v-if='header.key != "isShow"'
                    :class='header.sort == 0 ? "dizagara-button-orange dizagara-round-small" : "dizagara-button-green dizagara-round-small"'
                    style='margin-right: 10px;'
                    @click='sortHeader(header)'
                    title='Sort header.'>
                  <!--icon-->
                    <span v-if='header.sort == 1' class="mdi mdi-12px mdi-arrow-up"></span>
                    <span v-if='header.sort == 0' class="mdi mdi-12px mdi-minus"></span>
                    <span v-if='header.sort == -1' class="mdi mdi-12px mdi-arrow-down"></span>
                  </v-btn>
                </th>
                <th class='text-center'>
                  Action
                </th>
            </tr>
          </thead>
      <!--body-->
          <tbody>
            <tr v-for='item in data' :key='item._id' v-show='item.isShow'>
          <!--identity chip-->
              <td class='text-left' v-for='key in Object.keys(item)' :key='key'>
                <!--generic converters-->
                  <!--id-->
                    <span v-if='key == "_id"'>
                      <v-chip dark>
                      {{item._id}}
                      </v-chip>
                    </span>
                <!--mutli pill displays-->
                  <!--prep-->
                    <span v-else-if='key == "dependents"'>
                      <span v-for='prep in item.dependents' :key='prep.key'>
                        <v-chip color="orange accent-4" dark style='margin-left: 5px;'>
                          {{prep.name}}
                        </v-chip>
                      </span>
                    </span>
                <!--nested fields-->
                  <!--anesthesia-->
                    <span v-else-if='key == "cost"'>
                      {{getDollarFriendly(item[key])}}
                    </span>
                  <!--moded date-->
                    <span v-else-if='key == "modDate" || key == "expiration"'>
                      {{getFriendlyDateTime(item[key])}}
                    </span>
                  <!--everything else-->
                    <span v-else-if='key != "isShow"'>
                      {{item[key]}}
                    </span>
              </td>
            <!--action-->
              <td class='text-center'>
                <!--edit-->
                  <v-btn dense dark small icon
                    class='dizagara-button-orange dizagara-round-medium'
                    style='margin-right: 10px;'
                    @click='edit(item)'
                    title='Edit this item.'>
                    <span class="mdi mdi-18px mdi-pencil"></span>
                  </v-btn>
              <!--remove-->
                <v-btn dense dark small icon
                    class='dizagara-button-red dizagara-round-medium'
                    @click='remove(item)'
                    title='Delete this item.'>
                  <span class="mdi mdi-18px mdi-close"></span>
                </v-btn>
              </td>
            </tr>
          </tbody>
      </template>
    </v-simple-table>
    </span>
<label v-if='!data.length || !isShows' style='color: gray; text-align: center; margin: 20px auto auto auto;'>No Data</label>
</v-app>
</template>
<script>
//import
  import employee from '../components/dialogs/employee.vue';
  import confirm from '../components/dialogs/confirm.vue';
  import generic from '../components/dialogs/generic.vue';
  import save from '../components/dialogs/save.vue';
  import banner from '../components/generics/banner.vue';
  import converters from '../utils/converters.js';
  import references from '../utils/references.js';
  import utils from '../utils/utils.js';
  import sortable from 'sortablejs';
  import bridge from '../bridge.js';
//master
	export default {
//name
	name: 'properties',
//components
	components: {
    employee, confirm, save, banner, generic, sortable 
	},
//cycle methods
  async created(){
    //get url params
      this.userId = this.$route.params.id;
      this.prop = this.$route.params.prop;
      this.params.prop = this.prop;
    //get icon
      setTimeout(() => {
        $('#headerIcon').addClass(references.getIcon(this.prop));
        $('#addIcon').addClass(references.getIcon('add'));
        $('#saveIcon').addClass(references.getIcon('save'));
        $('#deleteIcon').addClass(references.getIcon('delete'));
        $('#exportIcon').addClass(references.getIcon('download'));
      }, 0);
    //get title
      this.title = `${converters.capitalizeFirst(this.prop)}s`;
    //get data
      let collectionName = `${this.prop}s`;
      this.data = await bridge.getCollection({collection: collectionName}) || [];
      this.original = utils.deepClone(this.data);
      this.data.forEach(a => a.isShow = true); //add show to each
    //init table
      this.initTable();
  },
//checks re-route to same page
  beforeRouteUpdate (to, from, next){
    if(!this.redirect.hasConfirmed){
      if(this.dirtyCheck()){ 
        this.redirect.path = to.fullPath;
        this.params.dialog = `save`;
        this.dialogs.save.show = true;
      }else{
        next();
      }
    }else{
      this.redirect.hasConfirmed = false;
      next();
    }
  },
//checks re-route to different page
  beforeRouteLeave (to, from, next){
    if(!this.redirect.hasConfirmed){
      if(this.dirtyCheck()){ 
        this.redirect.path = to.fullPath;
        this.params.dialog = `save`;
        this.dialogs.save.show = true;
      }else{
        next();
      }
    }else{
      this.redirect.hasConfirmed = false;
      next();
    }
  },
//custom methods
  methods: {
  //prompt last save
    dirtyCheck(){
      let cleanMods = utils.deepClone(this.data);
      cleanMods.forEach(a => delete a.isShow);
      let originalJson = JSON.stringify(this.original);
      let modifiedJson = JSON.stringify(cleanMods);
      return Boolean(originalJson.localeCompare(modifiedJson) != 0);
    },
  //init table
    initTable(){
    //build headers
      this.headers = [];
      this.filterCols = [{key: 'all', name: 'All'}];
      this.filterCol = this.filterCols[0].key; //select 1st item
      if(this.data.length){
        let keys = Object.keys(this.data[0]);
        let modCount = 0;
        keys.forEach(a => {
        //add all data
          let name = converters.capitalizeFirst(a);
          if(a == '_id'){
            name = 'Key';
          }else if(a == 'totalAccounts'){
            name = 'Total Accounts';
          }else if(a == 'name' && this.prop == 'code'){
            name = 'Code';
          }else if(a == 'usedAccounts'){
            name = 'Used Accounts';
          }else if(a == 'modBy' && modCount == 0){
            name = 'Moded By';
            modCount++;
          }else if(a == 'modDate' && modCount == 1){
            name = 'Moded Date';
          }
        //determine type
          this.headers.push({
              key: a,
              name: name,
              type: typeof this.data[0][a],
              sort: 0
          });
          if(!this.omitFields.includes(a)){
            this.filterCols.push({
              key: a,
              name: name
            });
          }
        });
      }
    },
  //add prop to datatable
    add(){
    //prep
      this.buildValidationParams();
      if(this.prop != 'employee'){
        this.groupGenericFields();
      }else{
        this.params.data = this.data;
      }
    //params
      this.params.isNew = true;
    //show
      this.dialogs[this.prop].show = true;
    },
  //edit item
    edit(item){
      //prep
        this.buildValidationParams();
        if(this.prop != 'employee'){
          this.groupGenericFields(item);
        }
        else{
          this.params.data = this.data;
          this.item = item;
        }
      //params
        this.params.item = item;
        this.params.index = this.data.findIndex(a => a._id == item._id);
        this.params.isNew = false;
      //show
        this.dialogs[this.prop].show = true;
    },
  //group item fields
    groupGenericFields(item){
      if(!this.dialogs[this.prop].fields){
        return;
      }
      this.item = {
        textboxes: [],
        dropdowns: [],
        checkboxes: []
      };
      this.dialogs[this.prop].fields.forEach(a => {
        let label = converters.capitalizeFirst(a);
        let placeholder = `Type ${a}...`;
        if(this.prop == `code` && a == `name`){
          label = `Code`;
          placeholder = `Type code...`;
        }
        let value = {
          key: a,
          value: item && item[a] || '',
          label: label,
          placeholder: placeholder
        }
      //dropdowns
        if(this.dialogs[this.prop].dropdowns && this.dialogs[this.prop].dropdowns.some(b => b.field == a)){
          let find = this.dialogs[this.prop].dropdowns.find(b => b.field == a);
          value.items = find.items;
          value.isMulti = find.isMulti;
          value.isRequired = find.isRequired;
          this.item.dropdowns.push(value);
        }
      //checkboxes
        else if(this.dialogs[this.prop].checkboxes && this.dialogs[this.prop].checkboxes.some(b => b == a)){
          this.item.checkboxes.push(value);
        }
      //textboxes
        else{
          this.item.textboxes.push(value);
        }
      });
    },
  //build validation params
    buildValidationParams(){
      if(!this.dialogs[this.prop].distincts){
        return;
      }
      this.dialogs[this.prop].distincts.forEach(a => {
        let distinctValues = [];
        this.data.forEach(b => {
          distinctValues.push(b[a]);
        });
        this.params.validation = [];
        this.params.validation.push({
          key: a,
          values: distinctValues
        });
      });
    },
  //dialogs
    processConfirmation(action){
      if(action == `submit`){
          if(this.dialogs.confirm.command == 'deleteAll'){
              this.data = [];
          }       
      }
     this.dialogs.confirm.show = false;
    },
  //close dialog
    closeDialog(params){
      if(this.params.dialog == `save`){
        this.dialogs.save.show = false;
        if(params.action == 'submit'){
          this.save();
          this.redirect.hasConfirmed = true;
          this.$router.push({path: this.redirect.path});
        }else if(params.action == 'ignore'){
          this.redirect.hasConfirmed = true;
          this.$router.push({path: this.redirect.path});
        }else if(params.action == 'cancel'){
          this.params.dialog = `other`;
          return;
        }
      }else{
        this.dialogs[this.prop].show = false;
        if(params.action == 'submit'){
        //init
          let item = {};
        //add key
          if(this.params.isNew){
            let dataIds = this.data.map(a => a._id);
            item._id = `${this.prop.slice(0,3)}#${utils.getNextId(dataIds)}`;
          }else{
            item._id = this.params.item._id;
          }
        //add fields
          if(this.prop == 'employee'){
            let keys = Object.keys(params.data);
            keys.forEach(a => {
              item[a] = params.data[a];
            });
          }else{
            let fieldTypes = ['textboxes', 'dropdowns', 'checkboxes'];
            fieldTypes.forEach(a => {
              if(params.data[a] && params.data[a].length){
                params.data[a].forEach(b => {
                  item[b.key] = b.value;
                });
              }
            });
          }
        //add standards
          item.modBy = this.userId;
          item.modDate = moment();
          item.isShow = true;
        //if new, add
          if(this.params.isNew){
            this.data.push(item);
            if(this.data.length == 1){//if data was empty, will need to build headers
              this.initTable();
            }
          }
        //if existing, replace
          else{
            this.data.splice(this.params.index, 1, item);
          }
        }
      }
    },
  //remove item
      async remove(item){
        this.deleteIndex = this.data.findIndex(a => a == item);
        this.data.splice(this.deleteIndex, 1);
    },
  //export to csv
    exportSpreadsheet(){
      //init
        let csvStructure = [];
      //remove is show
        let toExport = utils.deepClone(this.data);
        toExport.forEach(a => delete a.isShow);
      //build data
        //headers
          let headers = Object.keys(toExport[0]);
          csvStructure.push(headers);
        //content
          toExport.forEach(a => {
            let row = [];
            headers.forEach(b => {
            //filter types
              let element = ``;
              if(Array.isArray(a[b])){
                element = a[b].map(c => `(${converters.getKeyValueFriendly(c.key, c.name)})`).join('+');
              }else if(b == `modDate`){
                element = converters.getFriendlyDate(a[b]);
              }else{
                element = a[b].toString();
              }
            //filter bad chars
              element = element.replace(/#/g, '').toString();
              element = element.replace(/,/g, ' ').toString();
            //push element
              row.push(element);
            });
            csvStructure.push(row);
          });
      //bind
        let csvContent = "data:text/csv;charset=utf-8," + csvStructure.map(e => e.join(",")).join("\n");
      //download
        var encodedUri = encodeURI(csvContent);
        var link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", `${this.prop}s.csv`);
        document.body.appendChild(link);
        link.click();
    },
  //save data
    async save(){
      //condition
        let toSave = utils.deepClone(this.data);
        toSave.forEach(a => {
          delete a['isShow'];
        });
      //save property
          let collectionName = `${this.prop}s`;
          await bridge.setCollection({
            collection: collectionName,
            data: toSave
          });
          this.original = utils.deepClone(toSave);
      //notify
        toastr.success(`${this.title} saved successfully!`, ``, {'closeButton': true, positionClass: 'toast-bottom-right'});
    },
    deleteAll(){
      this.dialogs.confirm.command = 'deleteAll';
      this.dialogs.confirm.question = 'Are you sure you want to delete all items?';
      this.dialogs.confirm.show = true;
    },
  //round robin header sort
    sortHeader(header){
      //reset headers
        this.headers.forEach(a => {
          if(a != header){
            a.sort = 0;
          }
        });
      //determine direction
        if(header.sort == -1){
          header.sort = 0; 
        }else if(header.sort == 0){
          header.sort = 1;
          this.data.sort((a, b) => {
          //get first + second
            let compare = this.getCompareObject(a, b, header.key);
          //return sort
            if(header.key == `_id`){
              let firstNumb = parseInt(compare.first.split('#')[1]);
              let secondNumb = parseInt(compare.second.split('#')[1]);
              return firstNumb - secondNumb;
            }else if(header.type == 'number' || (compare.type && compare.type == `number`)){
              return compare.first - compare.second;
            }else if(header.type == `boolean`){
              return compare.first.toString().localeCompare(compare.second.toString());
            }else{
              return compare.first.localeCompare(compare.second);
            }
          });
        }else if(header.sort == 1){
          header.sort = -1;
          this.data.sort((a, b) => {
          //get first + second
            let compare = this.getCompareObject(a, b, header.key);
          //return sort
            if(header.key == `_id`){
              let firstNumb = parseInt(compare.first.split('#')[1]);
              let secondNumb = parseInt(compare.second.split('#')[1]);
              return secondNumb - firstNumb;
            }else if(header.type == 'number' || (compare.type && compare.type == `number`)){
              return compare.second - compare.first;
            }else if(header.type == `boolean`){
              return compare.second.toString().localeCompare(compare.first.toString());
            }else{
              return compare.second.localeCompare(compare.first);
            }
          });
        }
    },
  //get compare object
    getCompareObject(a, b, key){
      let compare = {
        first: ``,
        second: ``
      }
      if(key == `dependents`){
        compare.first = a[key].length;
        compare.second = b[key].length;
        compare.type = `number`;
      }else{
        compare.first = a[key];
        compare.second = b[key];
      }
      return compare;
    },
  //save order
    saveOrder (event){
      this.data.splice(event.newIndex, 0, this.data.splice(event.oldIndex, 1)[0]);
    },
  //filter table
    filterTerm(){
      //reset
        this.isShows = true;
      //filter data
        this.data.forEach(a => {
          a.isShow = false;
          let keys = Object.keys(a);
          if(this.filterCol == 'all'){
              for(let i = 0; i < keys.length; i++){
                if(!this.omitFields.includes(keys[i]) && typeof a[keys[i]] == 'string' && a[keys[i]].toLowerCase().includes(this.searchTerm.toLowerCase())){
                  a.isShow = true;
                  break;
                }
              }
            }else{
              if(!this.omitFields.includes(this.filterCol) && typeof a[this.filterCol] == 'string' && a[this.filterCol].toLowerCase().includes(this.searchTerm.toLowerCase())){
                a.isShow = true;
              }
            }
        });
      //check if empty
        if(!this.data.filter(a => a.isShow).length){
          this.isShows = false;
        }
      //reset data
        this.data.push({});
        this.data.pop();
    },
  //get friendly date time
    getFriendlyDateTime(date){
     return converters.getFriendlyDateTime(date);
    },
  //get friendly dollar value
    getDollarFriendly(value){
      return converters.getDollarFriendly(value);
    }
  },
//required for drag and drop
  directives: {
    sortableDataTable: {
      bind (el, binding, vnode) {
        let options = {
          animation: 150,
          onUpdate: event => {
            vnode.child.$emit('sorted', event);
          }
        }
        sortable.create(el.getElementsByTagName('tbody')[0], options);
      }
    }
  },
//computed
    watch: {
    },
//global vars
	data: global => ({
    redirect: {
      path: ``,
      hasConfirmed: false
    },
    isShows: true,
    userId: '',
    prop: '',
    title: '',
    original: [],
    data: [],
    item: {},
    params: {},
    omitFields: ['isShow', 'modDate', '_id', 'dependents', 'cost'],
    filterCol: '',
    filterCols: [],
    headers: [],
    searchTerm: '',
    deleteIndex: 0,
		dialogs: {
    //dependents
      dependent: {
        show: false,
        dialog: 'generic',
        fields: ['first', 'last'],
        distincts: []
      },
    //employees
      employee: {
        show: false,
        dialog: 'employee',
        distincts: ['username']
      },
    //cofirm
      confirm: {
        show: false,
        command: '',
        question: ''
      },
    //save
      save: {
        show: false
      }
		}
  })
}
</script>