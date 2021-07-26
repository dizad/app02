<template>
<div><!--empty div required to contain component-->
<!--dialogs-->
<!--about-->
    <transition name="fade">
        <about 
        v-if="dialogs.about.show" 
        @closeDialog='closeDialog($event, "about")'>
        </about>
    </transition>
<!--dialogs-->
    <v-toolbar color="orange" dark style='border-radius:0px; box-shadow: none !important;'>
    <img id="imageBanner" src="../../../public/banner.jpg" 
        style='height: 65px; margin: -20px;'/>
    <v-spacer></v-spacer><!--pushes buttons to the right-->
<!--banner buttons-->
    <!--account-->
        <v-btn icon class='orange darken-4' style='margin-right: 10px; border: 1px solid #6b2323 !important;' title='User' @click='edit()'>
            <span class='mdi mdi-24px' id='userIcon'></span>
        </v-btn>
    <!--help-->  
        <v-btn icon class='orange darken-4' style='margin-right: 10px; border: 1px solid #6b2323 !important;' title='Help' @click='help()'>
            <span class='mdi mdi-24px' id='helpIcon'></span>
        </v-btn>
    <!--about-->
        <v-btn icon class='orange darken-4' style='margin-right: 10px; border: 1px solid #6b2323 !important;' title='About' @click='about()'>
            <span class='mdi mdi-24px' id='aboutIcon'></span>
        </v-btn>
    <!--logout-->
        <v-btn icon class='orange darken-4' style='margin-right: 0px; border: 1px solid #6b2323 !important;' title='Logout' @click='logout()'>
            <span class='mdi mdi-24px' id='logoutIcon'></span>
        </v-btn>
    </v-toolbar>
<!--menu dropdowns-->
    <v-toolbar dense dark 
    style='border-radius:0px; background-color: #e6440e; height: 60px; border-top: 1px solid #781602; border-bottom: 1px solid #781602;' >
        <v-toolbar-items style='margin-left: -10px; height: 40px;'>
        <!--dashboard button-->
            <v-btn small class='dizagara-button-home dizagara-outline-orange' @click='redirect("dashboard")' title='Go to dashboard.'>
                <span class='mdi mdi-24px mdi-view-dashboard'></span>
            </v-btn>
        <!--properties dropdown-->
            <v-menu open-on-hover offset-y transition="slide-y-transition" v-if='["master"].includes(user.privilege) && !isExpired'>
            <!--header-->
                <template v-slot:activator="{on, attrs}">
                    <v-btn class='dizagara-button-banner dizagara-outline-orange' v-bind="attrs" v-on="on">
                        <span class='mdi mdi-18px mdi-cube dizagara-margin-right'></span>
                        PROPERTIES
                    </v-btn>
                </template>
            <!--item-->
                <v-list dense>
                    <span v-for='item of dropdowns.properties' :key='item.id'>
                        <v-list-item @click='redirect(`properties`, item.id)' v-if='item.access.includes(user.privilege)'>
                            <v-list-item-action>
                                <v-list-item-title>
                                    <span :class='`${item.icon} ${dropdowns.params.icon}`'></span>
                                    {{item.name}}
                                </v-list-item-title>
                            </v-list-item-action>
                        </v-list-item>
                    </span>
                </v-list>
            </v-menu>
        <!--settings dropdown-->
            <v-menu open-on-hover offset-y transition="slide-y-transition" v-if='["master"].includes(user.privilege) && !isExpired'>
            <!--header-->
                <template v-slot:activator="{ on, attrs }">
                    <v-btn class='dizagara-button-banner dizagara-outline-orange' v-bind="attrs" v-on="on">
                        <span class='mdi mdi-18px mdi-settings dizagara-margin-right'></span>
                        Settings
                    </v-btn>
                </template>
            <!--item-->
                <v-list dense>
                    <span v-for='item of dropdowns.settings' :key='item.id'>
                        <v-list-item @click='redirect(`settings`, item.id)' v-if='item.access.includes(user.privilege)'>
                            <v-list-item-action>
                                <v-list-item-title>
                                    <span :class='`${item.icon} ${dropdowns.params.icon}`'></span>
                                    {{item.name}}
                                </v-list-item-title>
                            </v-list-item-action>
                        </v-list-item>
                    </span>
                </v-list>
            </v-menu>
        </v-toolbar-items>
    </v-toolbar>
 </div>
</template>
<script>
//imports
    import about from '../dialogs/about.vue';
    import user from '../dialogs/employee.vue';
    import bridge from '../../bridge.js';
    import references from '../../utils/references.js';
    import utils from '../../utils/utils.js';
//master
	export default {
//name
	name: 'banner',
//components
	components: {
        about, user
	},
//cycle methods
    async created(){
    //get icon
      setTimeout(() => {
        $('#userIcon').addClass(references.getIcon('user'));
        $('#helpIcon').addClass(references.getIcon('help'));
        $('#aboutIcon').addClass(references.getIcon('about'));
        $('#logoutIcon').addClass(references.getIcon('logout'));
      }, 0);
    //sort dropdowns
        this.dropdowns.properties.sort((a, b) => a.id.localeCompare(b.id));
    //authenticate
        this.user = await bridge.getUser({
            id: this.$route.params.id
        });
        if(!this.user){
            this.$router.push({ path: '/login'});
        }
    //check if expired
		let expiration = await bridge.getField({
			collection: 'licenses',
			matchField: 'license',
			matchValue: this.user.license,
			getField: 'expiration'
		}) || ``;
        if(utils.getHoursFromNow(expiration) < 0){
            this.isExpired = true;
        }
	},
//custom methods
    methods: {
    //generics
        //redirect page
            redirect(page, prop){
                let path = ``;
                if(prop){
                    path = `/${page}/${prop}/${this.user.username}`;
                }else{
                    path = `/${page}/${this.user.username}`;
                }
                if(this.$route.path != path) {
                    this.$router.push({path: path});
                }
            },
        //logout
            logout(){
            //re-direct to login page
                this.$router.push({ path: '/login' });
            //notify
                toastr.info(`Logged out successfully!`, ``, {'closeButton': true, positionClass: 'toast-bottom-right'});
            },
        //download user guide
            help(){
                window.open('guide.pdf');           
            },
        //change user edit
            edit(){
               toastr.info(`Under construction!`, ``, {'closeButton': true, positionClass: 'toast-bottom-right'});
            },
        //display software about
            about(){
               this.dialogs.about.show = true; 
            },
    //close dialog
        closeDialog(params, prop){
            this.dialogs[prop].show = false;
        }
    },
//global vars
	data: global => ({
        isExpired: false,
        dialogs: {
            about: {
                show: false
            }
        },
        dropdowns: {
        //params
            params: {
                icon: 'mdi mdi-18px dizagara-icon-gray icon-right'
            },
        //services
            properties: [{
                id: 'employee',
                name: 'Employees',
                icon: references.getIcon('employee'),
                access: ['master', 'user']
            },{
                id: 'dependent',
                name: 'Dependents',
                icon: references.getIcon('dependent'),
                access: ['master', 'user']
            }],
        //settings
            settings: [{
                id: 'application',
                name: 'Application',
                icon: references.getIcon('application'),
                access: ['master']
            },{
                id: 'calibration',
                name: 'Calibration',
                icon: references.getIcon('calibration'),
                access: ['master']
            }]
        },
        user: {},
        params: {}
    })
}
</script>