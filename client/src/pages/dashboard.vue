<template>
<v-app>
<!--banner bar-->
	<banner class='no-print'></banner>
<!--header-->
	<v-card-title class='dizagara-sub-header' style='border-bottom: 1px solid #781602;'>
	<span class='mdi mdi-18px dizagara-margin-right' id='headerIcon'></span>
		<span>Dashboard</span>
	</v-card-title>
	<v-row v-if='license.percentage < 100'>
	<v-col>
<!--chart01-->
	<v-card 
		class='dizagara-panel-body' 
		style='margin: 10px 0px -20px 20px; height: calc(100vh - 350px)'>
	<!--header-->
		<v-list-item-title class='dizagara-panel-header'>
			<span class='mdi mdi-18px dizagara-margin-right' id='employeeIcon'></span>
			Employees
		</v-list-item-title>
	<!--chart-->
		<v-card-text>
			<chart v-if="ready.charts" 
			:data="chartData.chart01 || {}" 
			style='height: calc(40vh); width: calc(40vh); text-align: center; margin: calc(5vh) auto auto auto;'>
			</chart>
		</v-card-text>
	</v-card>
	</v-col>
	<v-col>
<!--chart02-->
	<v-card class='dizagara-panel-body' 
		style='margin: 10px 20px -20px 0px; height: calc(100vh - 350px)'>
	<!--header-->
		<v-list-item-title class='dizagara-panel-header'>
			<span class='mdi mdi-18px dizagara-margin-right' id='budgetIcon'></span>
			Budget
		</v-list-item-title>
	<!--chart-->
		<v-card-text>
			<chart v-if="ready.charts" 
			:data="chartData.chart02 || {}" 
			style='height: calc(40vh); width: calc(40vh); text-align: center; margin: calc(5vh) auto auto auto;'>
			</chart>
		</v-card-text>
	</v-card>
	</v-col>
	</v-row>
	<v-row>
		<v-col>
		<v-card 
			class='dizagara-panel-body' 
			style='margin: 0px 20px 0px 20px;'>
		<!--header-->
			<v-list-item-title class='dizagara-panel-header'>
				<span class='mdi mdi-18px dizagara-margin-right' id='licenseIcon'></span>
				License
			</v-list-item-title>
		<!--license bar-->
			<v-card-text>		
				<v-progress-linear
					striped
					:color='license.percentage >= 100 ? "red" : "orange"'
					:value="license.percentage"
					height="25" 
					readonly>
					<strong>
						{{Math.ceil(license.percentage)}}% Complete - {{license.remaining}} Days Remaining
					</strong>
				</v-progress-linear>
			</v-card-text>
		</v-card>
		</v-col>
	</v-row>
</v-app>
</template>
<script>
//import
	import bridge from '../bridge.js';
	import banner from '../components/generics/banner.vue';
	import references from '../utils/references.js';
	import converters from '../utils/converters.js';
	import chart from "../components/generics/pie.js";
//master
	export default {
//name
	name: 'dashboard',
//components
  components: {
    banner, chart
  },
//cycle methods
  async created(){
	//get generics
	  	this.userId = this.$route.params.id;
  	//get data
		this.employees = await bridge.getCollection({collection: 'employees'}) || [];
		this.application = await bridge.getConfig({config: `application`}) || {};
		this.calibration = await bridge.getConfig({config: `calibration`}) || {};
	//init
		let labels = {
			chart01: [],
			chart02: []
		};
		let data = {
			chart01: [],
			chart02: []
		};
		let backColors = {
			chart01: [],
			chart02: [],
		};
		let hoverColors = {
			chart01: [],
			chart02: []
		};
		let orangeBot = 100;
		let orangeTop = 250;
		let orangeMid = (orangeBot + orangeTop) / 2;
	//chart01
		let totalCost = 0;
		this.employees.forEach((a, ai) => {
			labels.chart01.push(`${a.first}, ${a.last}`);
			data.chart01.push(a.cost);
			totalCost += a.cost;
			let orangeIncrement = (orangeTop - orangeBot) / this.employees.length;
			backColors.chart01.push(converters.getColor(255, orangeTop - (ai * orangeIncrement), 55, 1.00));
			hoverColors.chart01.push(converters.getColor(255, orangeTop - (ai * orangeIncrement), 55, 0.75));
		});
	//chart02
		//labels
			labels.chart02.push(`Employees`);
			labels.chart02.push(`Overhead`);
			labels.chart02.push(`Remaining`);
		//colors
			backColors.chart02.push(converters.getColor(255, orangeBot, 55, 1.00));
			hoverColors.chart02.push(converters.getColor(255, orangeBot, 55, 0.75));
			backColors.chart02.push(converters.getColor(255, orangeMid, 55, 1.00));
			hoverColors.chart02.push(converters.getColor(255, orangeMid, 55, 0.75));
			backColors.chart02.push(converters.getColor(255, orangeTop, 55, 1.00));
			hoverColors.chart02.push(converters.getColor(255, orangeTop, 55, 0.75));
		//data
			data.chart02.push(totalCost);
			data.chart02.push(this.calibration.overhead);
			data.chart02.push(this.calibration.totalBudget - this.calibration.overhead - totalCost);
	//bind data
		this.chartData = {
		//chart01
			chart01: {
				labels: labels.chart01,
				datasets: [{
					label: 'chart01',
					data: data.chart01,
					backgroundColor: backColors.chart01,
					hoverBackgroundColor: hoverColors.chart01,
					borderWidth: 1,
					borderColor: converters.getColor(155, 55, 0, 1.00)
				}]
			},
		//chart02
			chart02: {
				labels: labels.chart02,
				datasets: [{
					label: 'chart02',
					data: data.chart02,
					backgroundColor: backColors.chart02,
					hoverBackgroundColor: hoverColors.chart02,
					borderWidth: 1,
					borderColor: converters.getColor(155, 55, 0, 1.00)
				}]
			}
		}
	//license
		//get numbers
			let license = await bridge.getLicenseByUser({
				username: this.userId
			});
			this.license.total = license.duration * 30;
			this.license.remaining = Math.round(moment(license.expiration).diff(moment(), 'days', true));
			this.license.expired = this.license.total - this.license.remaining;
			this.license.percentage = Math.round((this.license.expired / this.license.total) * 100);
		//cap percentage
			if(this.license.percentage < 0){
				this.license.percentage = 0;
			}else if(this.license.percentage > 100){
				this.license.percentage = 100;
				toastr.info(`This license# expired, contact ${this.application.email} for a new one!`, ``, {'closeButton': true, positionClass: 'toast-bottom-right'});
			}
		//cap remainings
			if(this.license.remaining < 0){
				this.license.remaining = 0;
			}
	//get icons (must be after stuff above)
		setTimeout(() => {
			$('#employeeIcon').addClass(references.getIcon('employee'));
			$('#budgetIcon').addClass(references.getIcon('budget'));
			$('#licenseIcon').addClass(references.getIcon('license'));
			$('#headerIcon').addClass(references.getIcon('dashboard'));
		}, 0);
		this.ready.charts = true;
  },
//global
	data: global => ({
		userId: '',
		application: {},
		calibration: {},
		ready: {
			charts: false
		},
		license: {
			total: 0,
			remaining: 0,
			expired: 0,
			percentage: 0
		},
		chartData: null //must be null
	})
}
</script>