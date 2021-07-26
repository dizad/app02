module.exports = {
//get icons
    getIcon: prop => {
        let icons = {
            time: 'mdi-clock-outline',
            revise: 'mdi-lead-pencil',
            settings: 'mdi-settings',
            download: 'mdi-download',
            save: 'mdi-content-save',
            add: 'mdi-plus-circle',
            login: 'mdi-login',
            password: 'mdi-help-circle',
            dashboard: 'mdi-view-dashboard',
            license: 'mdi-license',
            calibration: 'mdi-speedometer',
            about: 'mdi-information',
            logout: 'mdi-logout',
            user: 'mdi-account-circle',
            help: 'mdi-help',
            delete: 'mdi-close-circle',
            cancel: 'mdi-cancel',
            caution: 'mdi-alert',
            submit: 'mdi-check-circle',
            application: 'mdi-application-import',
            employee: 'mdi-human-handsdown',
            dependent: 'mdi-baby-carriage',
            budget: 'mdi-currency-usd'
        }
        return icons[prop] || '';
    },
//get toasts
    getToast: prop => {
        let toasts = {
            genericFormError: `Form has errors!`,
            validatorRequired: `Entry is required!`
        }
        return toasts[prop] || ``;
    }
}