<template>
<div class='modal-mask' transition='modal'><!--background shade-->
<div class='center-block' style='width: 475px; margin-top: 100px;'><!--modal props-->
<v-card class='dizagara-outline-orange' @keyup.enter='closeDialog("submit")'>
<!--title-->
    <v-card-title
        class="deep-orange"
        style='color: white;'>
        <span class='mdi mdi-24px dizagara-margin-right' id='headerIcon'></span>
        Edit {{title}}   
    </v-card-title>		
<!--content-->
    <v-card-text>
    <v-form ref='form' lazy-validation>
<!--textboxes-->
    <span v-if='generic.textboxes && generic.textboxes.length' >
        <span v-for='(textbox, index) in generic.textboxes' :key='textbox.key' >
            <v-text-field dense outlined autocomplete='off'
                :id="index == 0 ? 'firstFocus' : ''"
                :style="index == 0 ? 'margin-top: 20px;': ''"
                background-color='yellow lighten-4'
                v-model='textbox.value'
                :placeholder='textbox.placeholder'
                :label='textbox.label'
                type='text'
                :rules='[validate.required]'
            ></v-text-field>
        </span>
     </span>
<!--dropdowns-->
    <span v-if='generic.dropdowns.length'>
        <span v-for='(dropdown, index) in generic.dropdowns' :key='dropdown.key'>
            <v-autocomplete dense outlined deletable-chips
                background-color='yellow lighten-4'
                :style="index == 0 && !generic.textboxes.length ? 'margin-top: 20px;': ''"
                v-model='dropdown.value'
                :label='dropdown.label'
                :items='dropdown.items'
                :chips='dropdown.isMulti'
                :multiple='dropdown.isMulti'
                :item-text='a => typeof a == `string` ? a : a.name'
                :item-value='a => a'
                :rules='dropdown.isRequired ? [validate.required] : []'>
                <template #selection="{item, index}">
                    <v-chip dark close 
                        @click:close="remove(index, dropdown.value)" 
                        color="light-blue">
                        <span style='color: white'>
                            {{typeof item == `string` ? item : item.name}}
                        </span>
                    </v-chip>
                </template>
            </v-autocomplete>
        </span>
     </span>
<!--checkboxes-->
    <span v-if='generic.checkboxes.length'>
        <span v-for='checkbox in generic.checkboxes' :key='checkbox.key' >
            <v-checkbox hide-details
                style='margin: 0px 0px 20px 0px;'
                v-model='checkbox.value'
                :label='checkbox.label'
            ></v-checkbox>
        </span>
    </span>
<!--name-->
</v-form>
</v-card-text>   
<!--actions-->
	<v-card-actions style='margin-top: -40px;'>
		<v-row>
            <v-col class="text-center">
        <!--submit button-->
            <v-btn dense
                class='dizagara-button-orange dizagara-button-width-medium' 
                style='margin-right: 10px;'
                @click='closeDialog("submit")'>
                <span class="mdi mdi-24px dizagara-margin-right" id='okIcon'></span>
                {{this.params.isNew ? 'ADD' : 'EDIT'}}
            </v-btn>
        <!--cancel button-->
            <v-btn dense dark
                class='dizagara-button-red dizagara-button-width-medium'
                style='margin-left: 10px;'
                @click='closeDialog("cancel")'>
                <span class="mdi mdi-24px dizagara-margin-right" id='cancelIcon'></span>
                CANCEL
            </v-btn>
		</v-col>
		</v-row>
	</v-card-actions>
</v-card>
</div>
</div>
</template>
<script>
//imports
    import references from '../../utils/references.js';
    import converters from '../../utils/converters.js';
    import utils from '../../utils/utils.js';
//master
	export default {
//name
	name: 'generic',
//components
//props
	props: ['data', 'params'],
//life cycle
    async created(){
	//focus the first textbox
        setTimeout(() => {
            $('#firstFocus').focus();
            $('#headerIcon').addClass(references.getIcon(this.params.prop));
            $('#okIcon').addClass(references.getIcon('submit'));
            $('#cancelIcon').addClass(references.getIcon('cancel'));
        }, 0);
    //update title
        this.title = converters.capitalizeFirst(this.params.prop);
    //get data
        this.generic = utils.deepClone(this.data);
	},
//customs
    methods: {
    //close track dialog
        closeDialog(action){
        if(action == `submit`){
        //check validation
            if(!this.$refs.form.validate()){
                toastr.error(references.getToast(`genericFormError`), ``, {'closeButton': true, positionClass: 'toast-bottom-right'});
                return;
            }
        //check unique
            if(this.params.validation && this.params.validation.length){
                for(let i = 0; i < this.params.validation.length; i++){
                    let item = this.params.validation[i];
                    let textbox = this.generic.textboxes.find(a => a.key == item.key);
                    if(item.values.some((a, ai) => a == textbox.value && ai != this.params.index)){
                        toastr.error(`The '${item.key}' field is not unique!`, ``, {'closeButton': true, positionClass: 'toast-bottom-right'});
                        return;
                    }
                }
            }
        //condition
            this.generic.textboxes.forEach(a => {
                if(a.value && typeof a.value == `string`){
                    a.value = a.value.trim();
                }
            });
        }
        //send
            this.$emit('closeDialog', {
                action: action,
                data: this.generic
            });
        },
    //remove item
        remove(index, data){
            data.splice(index, 1);
        }
    },
//global vars
	data: global => ({
        generic: {},
        title: '',
        validate: {
            required: a => !!a || 'Entry is required!'
        }
    })
}
</script>