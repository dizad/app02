<template>
<v-app>
<!--dialogs-->
<img class='back-plate' src='../../public/background.jpg' style='background-size: cover; position: absolute;'/>
<v-card elevation='2' style='width: 450px; text-align: center; margin: 100px auto auto auto;' class='dizagara-outline-orange' @keyup.enter='login()'>
<!--logo-->
	<img id='imageLogin' src='../../public/logo.jpg' style = 'width: 80%; margin-top: 10px;'/>	
<!--username textbox-->
	<v-text-field dense outlined
		id='firstFocus'
		append-icon='mdi-account-circle'
		label='Username'
		:rules='[validate.required]'
		placeholder='Type username...'
		v-model='username'
		autocomplete='off'
		background-color='yellow lighten-4'
		style='margin-left: 30px; margin-right: 30px;'
	></v-text-field>
<!--password textbox-->
	<v-text-field dense outlined
		append-icon='mdi-lock'
		label='Password'
		:rules='[validate.required]'
		placeholder='Type password...'
		v-model='fruit'
		type='password'
		autocomplete="off"
		background-color='yellow lighten-4'
		style='margin-left: 30px; margin-right: 30px;'
	></v-text-field>
<!--action buttons-->
<v-card-actions style='background-color: #bf3b21 !important;'>
	<v-form ref='form' lazy-validation>
		<v-card-text v-on:keyup.enter='login()'>
	<!--login button-->
		<v-btn dense class='dizagara-button-orange'
			style='width: 100%; margin: 0px 0px 10px 0px; font-weight: bold;'
			@click='login()'>
			<span class='mdi' id='loginIcon'></span>
			LOGIN
		</v-btn>
		<v-row class = "align-center">
	<!--register button-->
		<v-btn small class='dizagara-button-orange'
			style='margin: 10px; width: 190px' 
			@click="wip()" 
			title='Create an account'>
			<span class='mdi' id='accountIcon'></span>
			REGISTER
		</v-btn>
	<!--recover password-->
		<v-btn small class='dizagara-button-orange'
			style='margin: 10px; width: 190px;' 
			@click='wip()' 
			title='Recover your password.'>
			<span class='mdi' id='passwordIcon'></span>
			PASSWORD
		</v-btn>
		</v-row>
	<!--disclaimer-->
		<span style='font-size: small; font-style: italic; color: white; text-align: center; margin: auto;'>
		version = {{application.version}} / last update = {{application.update}}<br>
		contact {{application.email}} for login issues</span>
		</v-card-text>
</v-form>
</v-card-actions>
</v-card>
</v-app>
</template>
<script>
//import
	import bridge from '../bridge.js';
	import references from '../utils/references.js';
//master
    export default {
//name
	name: 'login',
//components
	components: {
	},
//cycle methods
	//created
	async created(){
	//init timeout 
		setTimeout(() => {
			$('#firstFocus').focus();
			$('#loginIcon').addClass(references.getIcon('login'));
			$('#accountIcon').addClass(references.getIcon('user'));
			$('#passwordIcon').addClass(references.getIcon('password'));
		}, 0);
	//get data
		this.application = await bridge.getConfig({config: `application`}) || {};
		this.application.update = moment(this.application.update).format('MM/DD/YY');
	},
//custom methods
	methods: {
	//login
		async login(){
		//validate entries
			if(!this.$refs.form.validate()){
				return;
			}
		//check user
			let token = await bridge.getToken({
				username: this.username,
				fruit: this.fruit
			});
		//invalid entries
			if(!token.validUsername){
				toastr.error(`Username does not exist!`, ``, {'closeButton': true, positionClass: 'toast-bottom-right'});
			}else if(!token.validFruit){
				toastr.error(`Password is incorrect!`, ``, {'closeButton': true, positionClass: 'toast-bottom-right'});
			}else if(!token.isEula){
				toastr.error(`EULA is not signed!`, ``, {'closeButton': true, positionClass: 'toast-bottom-right'});
			}else{
			//redirect if valid entries
				this.$router.push({ path: `/dashboard/${this.username}`});
			}
		},
	//under construction
		wip(){
			toastr.info(`Under construction!`, ``, {'closeButton': true, positionClass: 'toast-bottom-right'});
		}
	},
//global vars
	data: () => ({
		username: '',
		fruit: '',
		user: {},
		application: {},
		validate: {
			required: a => !!a || 'Entry required!'
		}
	}),
}
</script>