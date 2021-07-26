//imports
    import login from './pages/login.vue';
    import properties from './pages/properties.vue';
    import dashboard from './pages/dashboard.vue';
    import settings from './pages/settings.vue';

//define routes
    export default [{
            name: 'login',
            path: '/login',
            component: login
        },{
            name: 'settings',
            path: "/settings/:prop/:id",
            component: settings
        },{
            name: 'properties',
            path: '/properties/:prop/:id',
            component: properties
        },{
            name: 'dashboard',
            path: '/dashboard/:id',
            component: dashboard
        },{
            name: 'default',
            path: "*",
            redirect: "/login"
        }
    ];