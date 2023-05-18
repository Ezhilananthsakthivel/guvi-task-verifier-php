const axios = require('axios')

module.exports = async function (url) {
    try {
        //git@github.com:Ezhilananthsakthivel/GUVI-PHP-Task.git
        //let apiUrl = url.split('/')
        let a = '', b = ''
        if (url.endsWith('.git')) {
            a = url.split('/')
            b = a[1].split('.')[0]
            a = a[0].split(':')[1]
        }
        else {
            url = url.split('/')
            a = url[3]
            b = url[4]
        }


        let fileObj = {
            html: 'No',
            css: 'No',
            js: 'No',
            ajax: 'No',
            php: 'No',
            jquery: 'No',
            bootstrap: 'No',
            sql: 'No',
            mongodb: 'No',
            redis: 'No',
            ps: 'No'
        }

        async function checkFiles(uname, repo, path = '') {
            const res = await axios.get(`https://api.github.com/repos/${uname}/${repo}/contents/${path}`,
                {
                    Headers: {
                        'Authorization': 'token' + process.env.GIT_TOKEN
                    }
                })
            const contents = res.data
            const obj = {}
            for (const i of contents) {
                if (i.type === 'file')
                    obj[i.name] = i.download_url;
                else if (i.type == 'dir' && i.name === 'vendor')
                    continue
                else if (i.type === 'dir')
                    obj[i.name] = await checkFiles(uname, repo, i.path);
            }
            return obj
        }

        async function fileupdate(i, obj) {
            if (i.endsWith('html')) {
                fileObj['html'] = "Yes"
                let { data } = await axios.get(obj[i],
                    {
                        Headers: {
                            'Authorization': 'token' + process.env.GIT_TOKEN
                        }
                    })
                fileObj['jquery'] = fileObj['jquery'] != 'Yes' ? datafunction(data, 'jquery') : 'Yes'
                fileObj['bootstrap'] = fileObj['bootstrap'] != 'Yes' ? datafunction(data, 'bootstrap') : 'Yes'
                fileObj['js'] = fileObj['js'] != 'Yes' ? datafunction(data, 'script') : 'Yes'
                fileObj['ajax'] = fileObj['ajax'] != 'Yes' ? datafunction(data, 'ajax') : 'Yes'
                //fileObj['css'] = datafunction(data, 'css')
            }

            else if (i == "css" || i.startsWith('st'))
                fileObj['css'] = 'Yes'

            else if (i == "js" || i.startsWith('sc')) {
                fileObj['js'] = 'Yes'
                for (j in obj[i]) {
                    let { data } = await axios.get(obj[i][j],
                        {
                            Headers: {
                                'Authorization': 'token' + process.env.GIT_TOKEN
                            }
                        })

                    if (data.includes("ajax"))
                        fileObj['ajax'] = 'Yes'
                }
            }
            else if (i == "php" || i.startsWith('da')) {
                fileObj['php'] = 'Yes'
                for (j in obj[i]) {
                    let { data } = await axios.get(obj[i][j],
                        {
                            Headers: {
                                'Authorization': 'token' + process.env.GIT_TOKEN
                            }
                        })

                    fileObj['sql'] = fileObj['sql'] != 'Yes' ? datafunction(data, 'mysqli') : 'Yes'
                    fileObj['mongodb'] = fileObj['mongodb'] != 'Yes' ? datafunction(data, 'mongodb') : 'Yes'
                    fileObj['redis'] = fileObj['redis'] != 'Yes' ? datafunction(data, 'redis') : 'Yes'
                    fileObj['ps'] = fileObj['ps'] != 'Yes' ? datafunction(data, 'bind_param') : 'Yes'
                }
            }
            else if (i.endsWith('js')) {
                fileObj['js'] = 'Yes'
                let { data } = await axios.get(obj[i],
                    {
                        Headers: {
                            'Authorization': 'token' + process.env.GIT_TOKEN
                        }
                    })

                if (data.includes('ajax'))
                    fileObj['ajax'] = 'Yes'
            }

            else if (i.endsWith('php')) {
                fileObj['php'] = 'Yes'
                let { data } = await axios.get(obj[i],
                    {
                        Headers: {
                            'Authorization': 'token' + process.env.GIT_TOKEN
                        }
                    })

                fileObj['sql'] = fileObj['sql'] != 'Yes' ? datafunction(data, 'mysqli') : 'Yes'
                fileObj['mongodb'] = fileObj['mongodb'] != 'Yes' ? datafunction(data, 'mongodb') : 'Yes'
                fileObj['redis'] = fileObj['redis'] != 'Yes' ? datafunction(data, 'redis') : 'Yes'
                fileObj['ps'] = fileObj['ps'] != 'Yes' ? datafunction(data, 'bind_param') : 'Yes'
            }

            else if (i.endsWith('css'))
                fileObj['css'] = 'Yes'
            return fileObj
        }

        function datafunction(data, val) {
            if (data.includes(val))
                return 'Yes'
            else
                return 'No'
        }

        const obj = await checkFiles(a, b)
        let finalObj = {}
        for (i in obj)
            finalObj = await fileupdate(i, obj)
        return fileObj
    }
    catch (err) {
        return err
    }
}