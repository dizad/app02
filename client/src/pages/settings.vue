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
<!--banner bar-->
  <banner class='no-print'></banner>
<!--header-->
  <v-card-title class='dizagara-sub-header' style='border-bottom: 1px solid #781602;'>
    <span class='mdi mdi-24px dizagara-margin-right' id='headerIcon'></span>
    <small>{{title}}</small>
      <!--save button-->
        <v-btn dense dark 
          class='dizagara-button-green'
          style='position: absolute; right: 15px; width: 100px !important;'
          @click='save()'>
          <span class="mdi mdi-18px dizagara-margin-right" id='saveIcon'></span>
          SAVE
        </v-btn>     
  </v-card-title>
<!--dynamic builder-->
    <v-card-text>
      <v-form ref = 'form' lazy-validation>
        <span v-if='configs'>
          <span v-for='key in Object.keys(configs)' :key='key'>
            <v-text-field dense outlined autocomplete='off'
                style='width: 450px; display: inline-block; margin: 20px 10px -20px 10px;'
                v-if='key != "_id"'
                background-color='yellow lighten-4'
                v-model='configs[key]'
                :placeholder='getPlaceholder(key)'
                :label='getLabel(key)'
                type='text'
                :rules='auxies.some(a => a.key == key && a.type == "number") ? [validate.required, validate.number]: [validate.required]'    
            ></v-text-field>
          </span>
        </span>
      </v-form>
    </v-card-text>
</v-app>
</template>
<script>
//import
	import banner from '../components/generics/banner.vue';
  import save from '../components/dialogs/save.vue';
  import references from '../utils/references.js';
  import converters from '../utils/converters.js';
  import utils from '../utils/utils.js';
  import bridge from '../bridge.js';
//master
	export default {
//name
	name: 'settings',
//components
  components: {
    banner, save
  },
//cycle methods
  async created(){
    //get url params
      this.userId = this.$route.params.id;
      this.prop = this.$route.params.prop;
    //get icon
      setTimeout(() => {
        $('#headerIcon').addClass(references.getIcon(this.prop));
        $('#saveIcon').addClass(references.getIcon(`save`));
      }, 0);
    //get title
      this.title = `${converters.capitalizeFirst(this.prop)}`;
    //get data
      this.configs = await bridge.getConfig({config: this.prop}) || [];
      this.original = utils.deepClone(this.configs);
  },
//do not use beforeRouteLeave(), will not run on generic pages
  beforeRouteUpdate(to, from, next){
    if(!this.redirect.hasConfirmed){
      let originalJson = JSON.stringify(this.original);
      let modifiedJson = JSON.stringify(this.configs);
      if(originalJson.localeCompare(modifiedJson) != 0){ 
        this.redirect.path = to.fullPath;
        this.dialogs.save.show = true;
      }else{
        next();
      }
    }else{
      this.redirect.hasConfirmed = false;
      next();
    }
  },
//checks re-route to same page
  beforeRouteUpdate (to, from, next){
    if(!this.redirect.hasConfirmed){
      if(this.dirtyCheck()){ 
        this.redirect.path = to.fullPath;
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
        this.dialogs.save.show = true;
      }else{
        next();
      }
    }else{
      this.redirect.hasConfirmed = false;
      next();
    }
  },
//methods
    methods: {
    //prompt last save
      dirtyCheck(){
        let originalJson = JSON.stringify(this.original);
        let modifiedJson = JSON.stringify(this.configs);
        return Boolean(originalJson.localeCompare(modifiedJson))
      },
    //close track dialog
      closeDialog(params){
        this.dialogs.save.show = false;
        if(params.action == 'submit'){
          this.save();
          this.redirect.hasConfirmed = true;
          this.$router.push({path: this.redirect.path});
        }else if(params.action == 'ignore'){
          this.redirect.hasConfirmed = true;
          this.$router.push({path: this.redirect.path});
        }else if(params.action == 'cancel'){
          return;
        }
      },
    //get placeholder
      getPlaceholder(key){
        key = this.spaceMultiKeys(key);
        return `Type ${key}...`;
      },
    //get label
      getLabel(key){
        key = this.spaceMultiKeys(key);
        return `${converters.capitalizeFirst(key)}`;
      },
    //space multi keys
      spaceMultiKeys(key){
        let auxy = this.auxies.find(a => a.key == key);
        if(auxy){
          return auxy.friendly;
        }else{
          return key;
        }
      },
    //save
      async save(){
      //check validation
        if(!this.$refs.form.validate()){
          toastr.error(references.getToast(`genericFormError`), ``, {'closeButton': true, positionClass: 'toast-bottom-right'});
          return;
        }
      //condition data
        Object.keys(this.configs).forEach(a => {
          if(this.auxies.some(b => b.key == a && b.type == `number`)){
            this.configs[a] = Number(this.configs[a]);
          }
        });
      //save
        await bridge.setDocument({
            collection: `configs`,
            item: this.configs
        }); 
        this.original = utils.deepClone(this.configs);
      //notify
          toastr.success(`Settings saved successfully!`, ``, {'closeButton': true, positionClass: 'toast-bottom-right'});
      }
    },
//global
	data: global => ({
    redirect: {
      path: ``,
      hasConfirmed: false
    },
    userId: ``,
    prop: ``,
    title: ``,
    original: [],
    configs: [],
    auxies: [{
        key: `periodPay`,
        friendly: `Pay / Period($)`,
        type: `number`
      },{
        key: `yearPeriods`,
        friendly: `Periods / year`,
        type: `number`
      },{
        key: `benefitsCost`,
        friendly: `Cost / Benefit($)`,
        type: `number`
      },{
        key: `dependentCost`,
        friendly: `Cost / Dependent($)`,
        type: `number`
      },{
        key: `nameDiscount`,
        friendly: `Name Discount(%)`,
        type: `number`
    },{
        key: `totalBudget`,
        friendly: `Total Budget($)`,
        type: `number`
    },{
        key: `overhead`,
        friendly: `Overhead($)`,
        type: `number`
    }],
    dialogs: {
      save: {
        show: false
      }
    },
    validate: {
      required: a => !!a || 'Entry is required!',
      number: a => !isNaN(a) || 'Number is required!'
    }
	})
}
</script>