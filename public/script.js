const text = document.querySelector('.url')
const load = document.querySelector('h2')
const file = document.querySelector('.file')
const listbody = document.querySelector('.listbody')
const an = document.querySelector('a')
const uname = document.querySelector('.uname')
const filebtn = document.querySelector('.filebtn')
const urlbtn = document.querySelector('.urlbtn')
const pointsbody = document.querySelector('.pointsbody')
const my_modal = document.querySelector('.my_modal')
const modal_table = document.querySelector('.modal_table')
const modal_body = document.querySelector('.modal_body')
const modaluname = document.querySelector(".modaluname")


function modalClose() {
    my_modal.style.display = 'none'
}

function resultModal(obj) {
    my_modal.style.display = 'flex'
    obj = JSON.parse(decodeURIComponent(obj))
    //text.value = ''
    finalObj = obj.fileObj
    uname.innerHTML = obj.name
    modaluname.innerHTML = obj.name
    let points = 0, cb = 0, missarr = []
    for (let i in finalObj) {
        j = document.querySelector(`.${i}`)
        j.innerText = finalObj[i]
        if (i == 'bootstrap' || i == 'css')
            continue
        else if (finalObj[i] == 'No')
            missarr.push(i)
    }
    pointsbody.innerHTML = ''
    modal_body.innerHTML = ''
    let tr = document.createElement('tr')
    tr.innerHTML = `
    <td>${obj.points}</td>
    <td>${missarr.length == 0 ? 'Nothing' : missarr.join(', ')}</td>
    <td>${obj.status}</td>`
    pointsbody.appendChild(tr)
    modal_body.appendChild(tr)
}

async function urlVerify() {
    try {
        if (text.value != '') {
            urlbtn.innerHTML = `<button class="btn btn-success loader" type="button" disabled>
            <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
            Loading...</button>`
            let obj = await fetch('/api/data', {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ apiUrl: text.value })
            })
            let finalObj = await obj.json()
            urlbtn.innerHTML = `<button class="btn btn-success" onclick="urlVerify()">Verify</button>`
            uname.innerHTML = 'URL'
            let points = 0, cb = 0, missarr = []
            for (let i in finalObj) {
                j = document.querySelector(`.${i}`)
                j.innerText = finalObj[i]
                if (i == 'bootstrap' || i == 'css') {
                    if (finalObj[i] == 'Yes')
                        cb = 1
                }
                else if (finalObj[i] == 'Yes')
                    points++
                else
                    missarr.push(i)
            }
            pointsbody.innerHTML = ''
            let tr = document.createElement('tr')
            tr.innerHTML = `
                    <td>${points += cb}</td>
                    <td>${missarr.length == 0 ? 'Nothing' : missarr.join(',')}</td>
                    <td>${points >= 8 ? 'Select' : 'Reject'}</td>`
            pointsbody.appendChild(tr)
        } else
            alert('Enter the URL')
    } catch (err) {
        console.log(err)
    }
}

async function fileVerify() {
    try {
        if (file.files[0]) {
            filebtn.innerHTML = `<button class="btn btn-success loader" type="button" disabled>
            <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
            Loading...</button>`
            const fileInput = file.files[0];
            const formData = new FormData();
            formData.append('file', fileInput);
            let finalJSON = await fetch('/api/file',
                {
                    method: 'POST',
                    body: formData

                })
            finalJSON = await finalJSON.json()
            filebtn.innerHTML = `<button class="btn btn-success" onclick="fileVerify()">Verify</button>`
            let count = 0
            listbody.innerHTML = ''
            finalJSON.map((val) => {
                let tr = document.createElement('tr')
                tr.innerHTML = `<td>${++count}</td>
        <td>${val.name}</td>
        <td>${val.email}</td>
        <td>${val.github}</td>
        <td><button class="btn btn-primary" onclick="resultModal('${encodeURIComponent(JSON.stringify(val))}')">View</button></td>`
                listbody.appendChild(tr)
            })
            an.classList.add('down_btn')
        } else
            alert('Upload file')

    } catch (err) {
        console.log(err)
    }
}







// [
//     {
//       no: '1',
//       name: 'Gokul Raj',
//       email: 'gokulraj@guvi.in',
//       github: 'https://github.com/lukog2002/guvi',
//       field5: '',
//       fileObj: {
//         html: 'Yes',
//         css: 'Yes',
//         js: 'Yes',
//         ajax: 'Yes',
//         php: 'Yes',
//         jquery: 'Yes',
//         bootstrap: 'No',
//         sql: 'Yes',
//         mongodb: 'Yes',
//         redis: 'Yes',
//         ps: 'Yes'
//       }
//     },
//     {
//       no: '2',
//       name: 'Rishikesh',
//       email: 'rishikesh@guvi.in',
//       github: 'https://github.com/Rishikendai/php-task',
//       field5: '',
//       fileObj: {
//         html: 'Yes',
//         css: 'Yes',
//         js: 'Yes',
//         ajax: 'Yes',
//         php: 'Yes',
//         jquery: 'Yes',
//         bootstrap: 'Yes',
//         sql: 'Yes',
//         mongodb: 'Yes',
//         redis: 'Yes',
//         ps: 'Yes'
//       }
//     },
//     {
//       no: '3',
//       name: 'Gayathri',
//       email: 'gayathri@guvi.in',
//       github: 'https://github.com/GayathriG1423/guvi_task',
//       field5: '',
//       fileObj: {
//         html: 'Yes',
//         css: 'Yes',
//         js: 'Yes',
//         ajax: 'Yes',
//         php: 'Yes',
//         jquery: 'Yes',
//         bootstrap: 'Yes',
//         sql: 'Yes',
//         mongodb: 'No',
//         redis: 'No',
//         ps: 'Yes'
//       }
//     },
//     {
//       no: '4',
//       name: 'Sakthivel',
//       email: 'sakthivel@guvi.in',
//       github: 'https://github.com/Ezhilananthsakthivel/GUVI-PHP-Task',
//       field5: '',
//       fileObj: {
//         html: 'Yes',
//         css: 'No',
//         js: 'Yes',
//         ajax: 'Yes',
//         php: 'Yes',
//         jquery: 'Yes',
//         bootstrap: 'Yes',
//         sql: 'Yes',
//         mongodb: 'Yes',
//         redis: 'Yes',
//         ps: 'Yes'
//       }
//     }
//   ]