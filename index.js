const express = require('express');
const cors = require("cors")
const { config } = require("dotenv")
const multer = require('multer')
const csvtojson = require('csvtojson');
const createCsvWriter = require('csv-writer').createObjectCsvWriter;
const urlVerify = require('./gitverify')

const PORT = process.env.PORT || 3001
const app = express();
config()

// https://github.com/Ezhilananthsakthivel/GUVI-PHP-Task
// https://github.com/Rishikendai/php-task
// https://github.com/lukog2002/guvi
// https://github.com/GayathriG1423/guvi_task


app.use(express.static('public'))
app.use(cors())
app.use(express.json())
const upload = multer({ dest: 'uploads/' });


app.get("/api", (_, res) => res.send("Welcome"));

//app.get("/api/file", async (req, res) => {
app.post("/api/file", upload.single('file'), async (req, res) => {
    try {
        const filePath = req.file.path;

        let jsonObj = await csvtojson({ headers: ['no', 'name', 'email', 'github'] }).fromFile(filePath)
        let finalJson = await Promise.all(jsonObj.map(async (val) => {
            val['fileObj'] = await urlVerify(val.github)
            delete val['field5']
            let finalObj = val.fileObj
            let points = 0, cb = 0, missarr = []
            for (let i in finalObj) {
                if (i == 'bootstrap' || i == 'css') {
                    if (finalObj[i] == 'Yes')
                        cb = 1
                }
                else if (finalObj[i] == 'Yes')
                    points++
                else
                    missarr.push(i)
            }
            val['points'] = points += cb
            val['status'] = points >= 8 ? 'Select' : 'Reject'
            val['missing conditions'] = missarr.lenght == 0 ? '-' : missarr.join(' ')
            return val
        }))

        function flattenObject(obj, prefix = '') {
            let flattenedObj = {};

            for (let key in obj) {
                if (typeof obj[key] === 'object' && obj[key] !== null) {
                    const nestedObj = flattenObject(obj[key], prefix + key + '_');
                    flattenedObj = { ...flattenedObj, ...nestedObj };
                } else {
                    flattenedObj[prefix + key] = obj[key];
                }
            }

            return flattenedObj;
        }

        const csvWriter = createCsvWriter({
            path: 'output.csv',
            header: [
                { id: 'no', title: 'No' },
                { id: 'name', title: 'Name' },
                { id: 'email', title: 'Email' },
                { id: 'github', title: 'Github' },
                { id: 'points', title: 'Points out of 10' },
                { id: 'mission conditions', title: 'Mission Conditions' },
                { id: 'fileObj_html', title: 'html' },
                { id: 'fileObj_css', title: 'css' },
                { id: 'fileObj_js', title: 'js' },
                { id: 'fileObj_ajax', title: 'ajax' },
                { id: 'fileObj_php', title: 'php' },
                { id: 'fileObj_jquery', title: 'jquery' },
                { id: 'fileObj_bootstrap', title: 'bootstrap' },
                { id: 'fileObj_sql', title: 'sql' },
                { id: 'fileObj_mongodb', title: 'mongodb' },
                { id: 'fileObj_redis', title: 'redis' },
                { id: 'fileObj_ps', title: 'ps' },
            ],
        });

        const flattenedData = finalJson.map((obj) => flattenObject(obj));
        csvWriter.writeRecords(flattenedData)

        res.send(finalJson);
    } catch (err) {
        res.send(err);
    }
});

app.get("/api/download", (_, res) => {
    try {
        const filepath = 'output.csv'
        res.download(filepath, 'data.csv')
    } catch (err) {
        res.send(err)
    }
})

app.post("/api/data", async (req, res) => {
    try {
        let finalObj = await urlVerify(req.body.apiUrl)
        res.send(finalObj)
    }
    catch (err) {
        res.send(err)
    }
})


app.listen(PORT)






// fs.createReadStream(filePath)
//         .pipe(csv())
//         .on('data', data => results.push(data))
//         .on('end', () => {
//             //fs.unlinkSync(filePath); // Delete the temporary file

//             // Handle the CSV data here
//             console.log('File data:', results);



// let apiUrl = 'https://github.com/Ezhilananthsakthivel/GUVI-PHP-Task'
// apiUrl = apiUrl.split('/')

// let fileObj = {
//     html: 'No',
//     css: 'No',
//     js: 'No',
//     ajax: 'No',
//     php: 'No',
//     jquery: 'No',
//     bootstrap: 'No',
//     sql: 'No',
//     mongodb: 'No',
//     redis: 'No'
// }

// async function checkFiles(uname, repo, path = '') {
//     const res = await axios.get(`https://api.github.com/repos/${uname}/${repo}/contents/${path}`,
//         {
//             Headers: {
//                 'Authorization': 'token' + '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'
//             }
//         })
//     const contents = res.data
//     const obj = {}
//     for (const i of contents) {
//         if (i.type === 'file')
//             obj[i.name] = i.download_url;
//         else if (i.type == 'dir' && i.name === 'vendor')
//             continue
//         else if (i.type === 'dir')
//             obj[i.name] = await checkFiles(uname, repo, i.path);
//     }
//     return obj
// }

// async function fileupdate(i, obj) {
//     if (i.endsWith('html')) {
//         fileObj['html'] = "Yes"
//         let { data } = await axios.get(obj[i],
//             {
//                 Headers: {
//                     'Authorization': 'token' + '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'
//                 }
//             })
//         fileObj['jquery'] = fileObj['jquery'] != 'Yes' ? datafunction(data, 'jquery') : 'Yes'
//         fileObj['bootstrap'] = fileObj['bootstrap'] != 'Yes' ? datafunction(data, 'bootstrap') : 'Yes'
//         fileObj['js'] = fileObj['js'] != 'Yes' ? datafunction(data, 'script') : 'Yes'
//         fileObj['ajax'] = fileObj['ajax'] != 'Yes' ? datafunction(data, 'ajax') : 'Yes'
//         //fileObj['css'] = datafunction(data, 'css')
//     }

//     else if (i == "css")
//         fileObj['css'] = 'Yes'

//     else if (i == "js") {
//         fileObj['js'] = 'Yes'
//         for (j in obj[i]) {
//             let { data } = await axios.get(obj[i][j],
//                 {
//                     Headers: {
//                         'Authorization': 'token' + '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'
//                     }
//                 })

//             if (data.includes("ajax"))
//                 fileObj['ajax'] = 'Yes'
//         }
//     }
//     else if (i == "php") {
//         fileObj['php'] = 'Yes'
//         for (j in obj[i]) {
//             let { data } = await axios.get(obj[i][j],
//                 {
//                     Headers: {
//                         'Authorization': 'token' + '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'
//                     }
//                 })

//             fileObj['sql'] = fileObj['sql'] != 'Yes' ? datafunction(data, 'mysqli') : 'Yes'
//             fileObj['mongodb'] = fileObj['mongodb'] != 'Yes' ? datafunction(data, 'mongodb') : 'Yes'
//             fileObj['redis'] = fileObj['redis'] != 'Yes' ? datafunction(data, 'redis') : 'Yes'
//             fileObj['PS'] = fileObj['PS'] != 'Yes' ? datafunction(data, 'bind_param') : 'Yes'
//         }
//     }
//     else if (i.endsWith('js')) {
//         fileObj['js'] = 'Yes'
//         let { data } = await axios.get(obj[i],
//             {
//                 Headers: {
//                     'Authorization': 'token' + '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'
//                 }
//             })

//         if (data.includes('ajax'))
//             fileObj['ajax'] = 'Yes'
//     }

//     else if (i.endsWith('php')) {
//         fileObj['php'] = 'Yes'
//         let { data } = await axios.get(obj[i],
//             {
//                 Headers: {
//                     'Authorization': 'token' + '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'
//                 }
//             })

//         fileObj['sql'] = fileObj['sql'] != 'Yes' ? datafunction(data, 'mysqli') : 'Yes'
//         fileObj['mongodb'] = fileObj['mongodb'] != 'Yes' ? datafunction(data, 'mongodb') : 'Yes'
//         fileObj['redis'] = fileObj['redis'] != 'Yes' ? datafunction(data, 'redis') : 'Yes'
//         fileObj['PS'] = fileObj['PS'] != 'Yes' ? datafunction(data, 'bind_param') : 'Yes'
//     }

//     else if (i.endsWith('css'))
//         fileObj['css'] = 'Yes'
//     return fileObj
// }

// function datafunction(data, val) {
//     if (data.includes(val))
//         return 'Yes'
//     else
//         return 'No'
// }

// async function main() {
//     const obj = await checkFiles(apiUrl[3], apiUrl[4])
//     let finalObj = {}
//     for (i in obj)
//         finalObj = await fileupdate(i, obj)
//     console.log(finalObj)
// }


// main()

