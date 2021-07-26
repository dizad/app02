<template>
<div class='modal-mask' transition='modal'><!--background shade-->
<div class='center-block' style='width: 325px; margin-top: 100px;'><!--modal props-->
<v-card class='dizagara-outline-orange' @keyup.enter='closeDialog("submit")'>
<!--title-->
    <v-card-title
        class='headline deep-orange' primary-title style='color: white;'>
        <span class='mdi mdi-24px dizagara-margin-right' id='headerIcon'></span>
        Confirm
    </v-card-title>
<!--add user-->
    <v-form ref='form' lazy-validation> 
    <v-card-text style='padding-bottom: 0px; font-weight: bold;' class="text-center">
        <span style='text-align: center; margin: auto; color: red;'>{{data}}</span>
    </v-card-text> 
<!--actions-->
    <v-card-actions>
        <v-row>
        <v-col class="text-center">
        <!--delete button-->
            <v-btn 
                id='firstFocus'
                style='margin-right: 10px; width: 125px;'
                class='dizagara-button-orange'
                @click='closeDialog(`submit`)'>
            <span class="mdi mdi-24px dizagara-margin-right" id='confirmIcon'></span>
                DELETE
            </v-btn>
        <!--cancel button-->
            <v-btn 
                style='margin-left: 10px; width: 125px;'
                class='dizagara-button-red'
                @click='closeDialog(`cancel`)'>
                <span class="mdi mdi-24px dizagara-margin-right" id='cancelIcon'></span>
                CANCEL
            </v-btn>
        </v-col>
        </v-row>
    </v-card-actions>
    </v-form>
</v-card>
</div>
</div>
</template>
<script>
//imports
	import converters from '../../utils/converters.js';
    import references from '../../utils/references.js';
//master
	export default {
//name
	name: 'confirm',
//components
	components: {
	},
	props: ['data'],
//cycle methods
    async created(){
        this.term = converters.capitalizeFirst(this.data);
        //get icons
        setTimeout(() => {
            $('#firstFocus').focus();
            $('#headerIcon').addClass(references.getIcon('caution'));
            $('#confirmIcon').addClass(references.getIcon('submit'));
            $('#cancelIcon').addClass(references.getIcon('cancel'));
        }, 0);
	},
//custom methods
    methods: {
	//close dialog
		closeDialog(action){
            this.$emit('processConfirmation', action);
		}
    },
//global vars
	data: global => ({
        term: ''
    })
}
</script>