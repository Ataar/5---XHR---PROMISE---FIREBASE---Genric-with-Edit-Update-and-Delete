let cl = console.log;

const userData = document.getElementById('userData');
const title = document.getElementById('title');
const body = document.getElementById('body');
const userId = document.getElementById('userId');
const sBtn = document.getElementById('sBtn');
const uBtn = document.getElementById('uBtn');
const dataContainer = document.getElementById('dataContainer');
const loader = document.getElementById('loader')


const Base_Url = `https://xhr-firebase---get-and-p-7b428-default-rtdb.firebaseio.com`;
const Post_Url = `${Base_Url}/posts.json`
cl(Post_Url)


let  postArr = [];


const objToarr = (obj)=>{

    for(let key in obj)
    {
        postArr.push({...obj[key] , id : key})
    }
    return postArr
    
}

const onsendObjToDB = (eve)=>{
    eve.preventDefault()

    let newObj = 
    {
        title:title.value,
        body:body.value,
        userId:userId.value,
    }
    cl(newObj)
    userData.reset()
    loader.classList.remove('d-none') 
    let xhr = new XMLHttpRequest()
    xhr.open('POST',Post_Url,true)
    xhr.send(JSON.stringify(newObj))
    xhr.onload  = ()=> 
    {
        if(xhr.status>=200 && xhr.status<=299)
        {
            cl(xhr.response)
        let data = JSON.parse(xhr.response)
          createCard(newObj,data)
        }
        
    loader.classList.add('d-none') 
       
    }


}


const createCard = (obj,data)=>{
    let card = document.createElement('div')
    card.className = 'col-md-4 offset-md-4';
    card.id = data.name;
    card.innerHTML = `
            <div class = 'card'>
            <div class="card-header">${obj.title}</div>
            <div class="card-body">${obj.body}</div>
            <div class="card-footer d-flex justify-content-between">
            <button class="btn btn-primary" onclick='onEdit(this)'>Edit</button>
            <button class="btn btn-danger" onclick='onDelete(this)'>Delete</button>
            </div>
            </div>
    
    `
        dataContainer.append(card)

}



const fetchAllDataFromDB = ()=>{
    loader.classList.remove('d-none')
    let xhr = new XMLHttpRequest();
    xhr.open('GET',Post_Url,true)
    xhr.send(null)
    xhr.onload = ()=>{
        if(xhr.status>=200 && xhr.status<=299)
        {
            let data = JSON.parse(xhr.response);
            cl(data)
            let postArr = objToarr(data)
            temp(postArr)
            // cl(postArr)
            // const formattedArray = Object.entries(data).map(([key, value]) => ({ id: key, ...value }));
            // console.log(formattedArray);


        }

        loader.classList.add('d-none')
    }
}

fetchAllDataFromDB()





const temp = (arr=>{
    let result = '';
    arr.forEach(add => {
        result += `
        <div class='col-md-4 offset-md-4'>     
            <div class="card mb-3 my-3">
                <div class="card-header">${add.title}</div>
                <div class="card-body">${add.body}</div>
                <div class="card-footer d-flex justify-content-between">
                    <button class="btn btn-primary" onclick='onEdit(this)'>Edit</button>
                    <button class="btn btn-danger" onclick='onDelete(this)'>Delete</button>
                </div>
            </div>
        </div>
        `;
    });
    dataContainer.innerHTML = result;
})
userData.addEventListener('submit',onsendObjToDB)


