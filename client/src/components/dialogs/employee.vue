<template>
<div class='modal-mask' transition='modal'><!--background shade-->
<div class='center-block' style='width: 1400px; margin-top: 100px;'><!--modal props-->
<v-card class='dizagara-outline-orange' @keyup.enter='closeDialog("submit")'>
<!--title-->
	<v-card-title
		class="deep-orange"
		style='color: white;'>
		<span class='mdi mdi-24px dizagara-margin-right dizagara-margin-left' id='headerIcon'></span>
		Employee   
	</v-card-title>		
<!--content-->
<v-card-text>
<v-form ref = 'form' lazy-validation>
<v-row><!--master row-->
<v-col><!--left col-->
<!--employee-->
<v-card class='dizagara-panel-body' style='margin: 10px 0px 20px 10px;'>
<!--header-->
	<v-list-item-title class='dizagara-panel-header'>
		<span class='mdi mdi-18px dizagara-margin-right dizagara-margin-left' id='employeeIcon'></span>
		Employee
	</v-list-item-title>
<!--content-->
	<v-card-text>
	<!--first name-->
		<v-text-field dense outlined autocomplete='off'
			id='firstFocus'
			@keyup='updatePreview()'
			placeholder='Type first name...'
			v-model='employee.first'
			background-color='yellow lighten-4'
			label='First Name'
			:rules='[validate.required]'
		></v-text-field>
	<!--last name-->
		<v-text-field dense outlined autocomplete='off'
			placeholder='Type last name...'
			v-model='employee.last'
			background-color='yellow lighten-4'
			label='Last Name'
			:rules='[validate.required]'
		></v-text-field>
	<!--dependents-->
		<v-autocomplete dense outlined multiple
			background-color='yellow lighten-4'
			@change='updatePreview()'
			v-model='employee.dependents'
			:items='lists.dependents'
			:item-text='a => a.name'
			:item-value='a => a'
			label='Dependents'
			:rules='[validate.required]'>
			<template #selection="{item, index}">
				<v-chip dark close 
					@click:close="remove(index)" 
					color="orange accent-4">
					<span style='color: white'>
						{{item.name}}
					</span>
				</v-chip>
			</template>	
		</v-autocomplete>
	</v-card-text>
</v-card>
</v-col>
<v-col><!--right col-->
<v-card class='dizagara-panel-body' style='margin: 10px 10px 0px 0px;'>
<!--header-->
	<v-list-item-title class='dizagara-panel-header'>
		<span class='mdi mdi-18px dizagara-margin-right dizagara-margin-left' id='budgetIcon'></span>
		Preview
	</v-list-item-title>
<!--content-->
	<v-card-text style='padding: 20px;'>
	<!--base salary-->
		<v-icon left>arrow_forward</v-icon>
		<label>Base Salary=</label>&nbsp;
		<label style='color: red;'>{{getDollarFriendly(calibration.periodPay)}} pay/period * {{calibration.yearPeriods}} periods =&nbsp;</label>
		<v-chip color='error'><i class='fa fa-fw fa-minus'></i>{{getDollarFriendly(costs.salary)}}</v-chip>
		<br>
	<!--benefit costs-->
		<v-icon left>arrow_forward</v-icon>
		<label style='padding-top: 10px;'>Benefit Costs=</label>&nbsp;
		<v-chip color='error'>
			<i class='fa fa-fw fa-minus'></i>{{getDollarFriendly(costs.benefits)}}
		</v-chip>
		<br>
	<!--dependent costs-->
		<v-icon left>arrow_forward</v-icon>
		<label style='padding-top: 10px;'>Dependent Costs=</label>&nbsp;
		<label style='color: red;'>{{getDollarFriendly(calibration.dependentCost)}} cost/dependent * {{employee.dependents.length}} dependent(s) =&nbsp;</label>
		<v-chip color='error'>
			<i class='fa fa-fw fa-minus'></i>{{getDollarFriendly(costs.dependents)}}
		</v-chip>
		<br>
	<!--a-name discount-->
		<v-icon left>arrow_forward</v-icon>
		<label style='padding-top: 10px;'>A-Name Discount=</label>&nbsp;
		<span v-if='isDiscount()'>
			<label style='color: red;'>{{calibration.nameDiscount}}% * sum =&nbsp;</label>
			<v-chip color='success'><i class='fa fa-fw fa-plus'></i>{{getDollarFriendly(costs.discount)}}</v-chip>
		</span>
		<span v-if='!isDiscount()'>
			<label style='color: red;'>N/A - no person starts with letter A =&nbsp;</label>
			<v-chip color='success'><i class='fa fa-fw fa-plus'></i>{{getDollarFriendly(0.00)}}</v-chip>
		</span>
		<br>
	<!--annual net costs-->
		<v-icon left>arrow_forward</v-icon>
			<label style='padding-top: 10px;'>Annual Net Cost($)=</label>&nbsp;
			<v-chip color='warning'>
				<i class='fa fa-fw fa-minus'></i>{{getDollarFriendly(employee.cost)}}
			</v-chip><br>
	</v-card-text> 
</v-card>	
</v-col>
</v-row>
</v-form>		
</v-card-text>   
<!--actions-->
	<v-card-actions style='margin-top: -30px;'>
		<v-row>
		<v-col class="text-right">
	<!--add/edit button-->
		<v-btn dense
			class='dizagara-button-orange dizagara-button-width-medium' 
			style='margin-right: 20px;'
			@click='closeDialog("submit")'>
			<span class="mdi mdi-24px mdi-check-circle dizagara-margin-right"></span>
			{{this.params.isNew ? 'ADD' : 'EDIT'}}
		</v-btn>
	<!--cancel button-->
		<v-btn dense dark
			class='dizagara-button-red dizagara-button-width-medium'
			style='margin-right: 20px;'
			@click='closeDialog("cancel")'>
			<span class="mdi mdi-24px mdi-cancel dizagara-margin-right"></span>
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
	import bridge from '../../bridge.js';
	import references from '../../utils/references.js';
	import converters from '../../utils/converters.js';
	import utils from '../../utils/utils.js';
//master
	export default {
//name
	name: 'employee',
//components
	components: {
	},
	props: ['data', 'params'],
//cycle methods
    async created(){
	//focus the first textbox
		setTimeout(() => {
			$('#firstFocus').focus();
			$('#headerIcon').addClass(references.getIcon('employee'));
			$('#employeeIcon').addClass(references.getIcon('employee'));
			$('#budgetIcon').addClass(references.getIcon('budget'));		
		}, 0);
    //get raw props
		let users = [];
		if(this.params.data){
			users = utils.deepClone(this.params.data);
		}else{
			users = await bridge.getCollection({collection: `users`}) || [];
		}
		let dependents = await bridge.getCollection({collection: `dependents`}) || [];
		this.calibration = await bridge.getConfig({config: `calibration`}) || {};
		delete this.calibration._id;
		Object.keys(this.calibration).forEach(a => {
			this.calibration[a] = Number(this.calibration[a]);
		});
	//condition props
	  this.lists.dependents = dependents.map(a => {return {
		  key: a._id,
		  name: `${a.first}, ${a.last}`
	  }});
      this.lists.usernames = users.map(a => a.username);
	//get data
		if(!this.params.isNew && this.data){
			this.employee = utils.deepClone(this.data);
			this.temp.oldUser = this.employee.username;
			this.temp.oldLicense = this.employee.license;
		}else{
			let dataIds = users.map(a => a._id);
			this.employee._id = `emp#${utils.getNextId(dataIds)}`;
		}
	//update the preview
		this.updatePreview();
	},
//custom methods
    methods: {
	//update preview
		updatePreview(){
			this.costs.salary = this.calibration.periodPay * this.calibration.yearPeriods;
			this.costs.dependents = this.calibration.dependentCost * this.employee.dependents.length;
			this.costs.benefits = this.calibration.benefitsCost;
			this.employee.cost = this.costs.salary + this.costs.dependents + this.costs.benefits;
			if(this.isDiscount()){
				this.costs.discount = this.employee.cost * (this.calibration.nameDiscount / 100);
				this.employee.cost -= this.costs.discount;
			}
		},
	//display dollar friendly cost
		getDollarFriendly(value){
 			return converters.getDollarFriendly(value);
		},
	//check if employee is allowed a discount
		isDiscount(){
		//init
			let isDiscount = false;
		//check if 1st letter of employee or dependent starts with A
			if(this.employee){
				if((this.employee.first && this.employee.first[0].toLowerCase() == `a`) || 
					(this.employee.dependents && this.employee.dependents.some(a => a && a.name && a.name[0].toLowerCase() == `a`))){
					isDiscount = true;
				}
			}
		//return
			return isDiscount;
		},
	//remove item
        remove(index){
            this.employee.dependents.splice(index, 1);
			this.updatePreview();
        },
	//close dialog
        async closeDialog(action){
		if(action == 'submit'){
		//form
			if(!this.$refs.form.validate()){
				toastr.error(references.getToast(`genericFormError`), ``, {'closeButton': true, positionClass: 'toast-bottom-right'});
				return;
			}
		//trim white space
			Object.keys(this.employee).forEach(a => {
				if(this.employee[a] && typeof this.employee[a] == `string`){
					this.employee[a] = this.employee[a].trim();
				}
			});
		}		
		//send data
			this.$emit('closeDialog', {
				action: action,
				data: this.employee
			});
		}
    },
//global vars
	data: global => ({
		lists: {
			privileges:  ['master', 'user'],
			dependents: [],
			usernames: []
		},
		calibration: {},
		costs: {
			benefits: 0.00,
			salary: 0.00,
			dependents: 0.00,
			discount: 0.00
		},
		employee: {
			first: ``,
			last: ``,
			dependents: [],
			cost: 0.00
		},
		temp:{
			oldUser: ``,
			code : ``,
			fruit: ``
		},
		validate: {
			required: a => !!a || 'Entry is required!',
			number: a => !isNaN(a) || 'Number is required!'
		}
	})
}
</script>