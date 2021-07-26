//imports
    import axios from 'axios';
    let url = 'api/posts/';

//class
    class bridge {
    //generics
        //collection
            //get
                static getCollection(params){
                    return new Promise(async (resolve, reject) => {
                        try {
                            let command = 'getCollection';
                            let res = await axios.post(url + command, params);
                            resolve(res.data);
                        } catch(err){
                            reject(err);
                        }
                    });
                }
            //set
                static setCollection(params){
                    try {
                        let command = 'setCollection';
                        return axios.post(url + command, params);
                    } catch(err){
                        reject(err);
                    }
                }
        //document
            //get
                static getDocument(params){
                    return new Promise(async (resolve, reject) => {
                        try {
                            let command = 'getDocument';
                            let res = await axios.post(url + command, params);
                            resolve(res.data);
                        } catch(err){
                            reject(err);
                        }
                    });
                }
            //set
                static setDocument(params){
                    try {
                        let command = 'setDocument';
                        return axios.post(url + command, params);
                    } catch(err){
                        reject(err);
                    }
                }
        //field
            //get
                static getField(params){
                    return new Promise(async (resolve, reject) => {
                        try {
                            let command = 'getField';
                            let res = await axios.post(url + command, params);
                            resolve(res.data);
                        } catch(err){
                            reject(err);
                        }
                    });
                }
            //set
                static setField(params){
                    try {
                        let command = 'setField';
                        return axios.post(url + command, params);
                    } catch(err){
                        reject(err);
                    }
                }
    //customs
        //get token
            static getToken(user){
                return new Promise(async (resolve, reject) => {
                    try {
                        let command = 'getToken';
                        let res = await axios.post(url + command, user);
                        resolve(res.data);
                    } catch(err){
                        reject(err);
                    }
                });
            }
        //get user
            static getUser(params){
                return new Promise(async (resolve, reject) => {
                    try {
                        let command = 'getUser';
                        let res = await axios.post(url + command, params);
                        resolve(res.data);
                    } catch(err){
                        reject(err);
                    }
                });
            }
        //get license by user
            static getLicenseByUser(params){
                return new Promise(async (resolve, reject) => {
                    try {
                        let command = 'getLicenseByUser';
                        let res = await axios.post(url + command, params);
                        resolve(res.data);
                    } catch(err){
                        reject(err);
                    }
                });
            }
        //get config
            static getConfig(params){
                return new Promise(async (resolve, reject) => {
                    try {
                        let command = 'getConfig';
                        let res = await axios.post(url + command, params);
                        resolve(res.data);
                    } catch(err){
                        reject(err);
                    }
                });
            }
    }
    //export
        export default bridge;