<template>
<div class='modal-mask' transition='modal'><!--background shade-->
<div class='center-block' style='width: 600px; margin-top: 150px;'>    
	<v-card class='dizagara-outline-orange' @keyup.enter='closeDialog("submit")'>
	<!--title-->
		<v-card-title
			class="deep-orange"
			style='color: white;'>
			<span class="mdi mdi-24px iconRight" id='headerIcon'></span>
			About   
		</v-card-title>		
	<!--content-->
		<v-card-text style='padding: 20px;'>
			<v-icon left>arrow_forward</v-icon>
				<label>Title =</label>&nbsp;
				<v-chip color="orange accent-3" style='color: white;'>{{application.title}}</v-chip><br>
			<v-icon left>arrow_forward</v-icon>
				<label style='padding-top: 10px;'>Author =</label>&nbsp;
				<v-chip color="orange accent-3" style='color: white;'>{{application.author}}</v-chip><br>
			<v-icon left>arrow_forward</v-icon>
				<label style='padding-top: 10px;'>Version =</label>&nbsp;
				<v-chip color="orange accent-3" style='color: white;'>{{application.version}}</v-chip><br>
			<v-icon left>arrow_forward</v-icon>
				<label style='padding-top: 10px;'>Last Update =</label>&nbsp;
				<v-chip color="orange accent-3" style='color: white;'>{{application.update}}</v-chip><br>
			<v-icon left>arrow_forward</v-icon>
				<label style='padding-top: 10px;'>Edition =</label>&nbsp;
				<v-chip color="orange accent-3" style='color: white;'>{{application.edition}}</v-chip><br>
			<v-icon left>arrow_forward</v-icon>
				<label style='padding-top: 10px;'>Headquarters =</label>&nbsp;
				<v-chip color="orange accent-3" style='color: white;'>{{application.headquarters}}</v-chip><br>
			<v-icon left>arrow_forward</v-icon>
				<label style='padding-top: 10px;'>Description =</label>&nbsp;
				{{application.description}}<br>
		</v-card-text>  
	<!--actions-->
		<v-card-actions style='margin-top: -20px;'>
			<v-row>
				<v-col class="text-center">
					<v-btn dense dark
						id='firstFocus'
						class='dizagara-button-orange dizagara-button-width-medium' 
						@click='closeDialog(`submit`)'>
						<span class="mdi mdi-24px iconRight" id='okIcon'></span>
						CLOSE
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
	import bridge from '../../bridge.js';
//master
	export default {
//name
	name: 'about',
//components
	components: {
	},
//cycle methods
    async created(){
	//get icons
		setTimeout(() => {
			$('#firstFocus').focus();
            $('#headerIcon').addClass(references.getIcon('application'));
            $('#okIcon').addClass(references.getIcon('submit'));
		}, 0);
	//get data
		this.application = await bridge.getConfig({config: `application`}) || {};
		this.application.update = moment(this.application.update).format('MM/DD/YY');
	},
//custom methods
    methods: {
	//close modal
		closeDialog(action){
			this.$emit('closeDialog', action);
		}
    },
//global vars
	data: global => ({
			application: {}
    	})
	}
</script>