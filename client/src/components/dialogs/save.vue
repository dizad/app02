<template>
<div class='modal-mask' transition='modal'><!--background shade-->
<div class='center-block' style='width: 450px; margin-top: calc(40vh);'><!--modal props-->
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
        <span style='text-align: center; margin: auto; color: red;'>Are you sure you want to exit without saving your changes?</span>
    </v-card-text> 
<!--actions-->
    <v-card-actions>
    <v-row>
        <v-col class="text-center">
        <!--save button-->
            <v-btn 
                id='firstFocus'
                class='dizagara-button-orange dizagara-button-width-short'
                @click='closeDialog(`submit`)'>
                <span class="mdi mdi-24px dizagara-margin-right" id='saveIcon'></span>
                Save
            </v-btn>
        <!--ignore button-->
            <v-btn 
                style='margin-left: 20px;'
                class='dizagara-button-red dizagara-button-width-short'
                @click='closeDialog(`ignore`)'>
                <span class="mdi mdi-24px dizagara-margin-right" id='ignoreIcon'></span>
                Ignore
            </v-btn>
        <!--cancel button-->
            <v-btn 
                style='margin-left: 20px;'
                class='dizagara-button-red dizagara-button-width-short'
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
    import references from '../../utils/references.js';
//master
	export default {
//name
	name: 'save',
//components
	components: {
	},
	props: [],
//cycle methods
    async created(){
        //get icon
        setTimeout(() => {
            $('#firstFocus').focus();
            $('#headerIcon').addClass(references.getIcon('caution'));
            $('#saveIcon').addClass(references.getIcon('submit'));
            $('#ignoreIcon').addClass(references.getIcon('delete'));
            $('#cancelIcon').addClass(references.getIcon('cancel'));
        }, 0);
	},
//custom methods
    methods: {
	//close dialog
		closeDialog(action){
            this.$emit('closeDialog', {
                action: action
            });
		}
    },
//global vars
	data: global => ({
    })
}
</script>