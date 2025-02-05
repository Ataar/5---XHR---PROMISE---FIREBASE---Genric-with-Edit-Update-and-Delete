let cl = console.log;

const userData = document.getElementById("userData");
const title = document.getElementById("title");
const body = document.getElementById("body");
const userId = document.getElementById("userId");
const sBtn = document.getElementById("sBtn");
const uBtn = document.getElementById("uBtn");
const dataContainer = document.getElementById("dataContainer");
const loader = document.getElementById("loader");

const Base_Url = `https://xhr--http---promise---firebase-default-rtdb.firebaseio.com/`;
const Post_Url = `${Base_Url}/posts.json`;

const snackBar = (title, iconHtml, bgColor = "#439643", color = "#fff") => {
  Swal.fire({
    title: `<div style="display: flex; align-items: center; justify-content: center; gap: 8px;">${iconHtml} ${title}</div>`,
    timer: 1500,
    width: "300px",
    padding: "0.5rem",
    showConfirmButton: false,
    toast: true,
    position: "top",
    color,
    customClass: {
      popup: "custom-snackbar",
    },
    didOpen: () => {
      document.querySelector(".custom-snackbar").style.backgroundColor =
        bgColor;
    },
  });
};



const makeApiCall = (methodName , apiUrl , body = null)=>{  // this is genric function for API Call
return new Promise((resolve,reject)=>{
  loader.classList.remove('d-none')
  let xhr = new XMLHttpRequest();
  xhr.open(methodName , apiUrl);
  xhr.setRequestHeader("Authorization","JWT ACCESS_TOKEN FROM_LOCAL_STORAGE");
  xhr.setRequestHeader("Content-type","application/json");
  xhr.onload = function()
  {
         loader.classList.add('d-none')
     if(xhr.status>=200 && xhr.status<=299)
     {
        let data = JSON.parse(xhr.response);
        resolve(data)
     }

     else
     {
        reject(xhr.statusText)
        snackBar("Something went wrong", "❌", "#d33");
     }
  }

  xhr.send(body ? JSON.stringify(body): null);

  xhr.onerror = function()
  {
    
    loader.classList.add('d-none')
    reject(`Network Error`)
  }
})
}


makeApiCall('GET',Post_Url , null)

.then(res=>{
 let data = objToarr(res)
 temp(data)
 cl(data)
  
})

.catch(err=>{
  cl(err)
})


// we call a function that retrun promise but not consume it still the API call is getting success 
// so this behavior of promise is called Eager behavior.



const objToarr = (obj)=>Object.keys(obj).map(key=>({...obj[key] , id: key}))
 
 





const temp = (arr) => {
  let result = "";
  arr.forEach(add => {
    result += `
            
            <div class="card" id ='${add.id}'>
                <div class="card-header">
                <h5>${add.title}</h5>
                </div>

                <div class="card-body">
                <p>${add.body}</p>
                </div>

                <div class="card-footer d-flex justify-content-between">
                    <button class="btn btn-primary" onclick='onEdit(this)'>Edit</button>
                    <button class="btn btn-danger" onclick='onDelete(this)'>Delete</button>
                </div>
            </div>
        
        `;
  });
  dataContainer.innerHTML = result;
};




const createCard = (obj, data) => {
  let card = document.createElement("div");
  card.className = 'card id="${card.id}"';
  card.id = data.name;
  card.innerHTML = `
           
            <div class="card-header">
            <h5>${obj.title}</h5>
            </div>


            <div class="card-body">
            <p>${obj.body}</p>
            </div>


            <div class="card-footer d-flex justify-content-between">
            <button class="btn btn-primary" onclick='onEdit(this)'>Edit</button>
            <button class="btn btn-danger" onclick='onDelete(this)'>Delete</button>
            </div>
            
    
    `;
  dataContainer.append(card);
};









const sendObjToDB = (eve)=>{
  eve.preventDefault();

  let newObj = 
  {
     title: title.value,
     body: body.value,
     userId: userId.value,
  }
  cl(newObj)
  userData.reset()

   makeApiCall('POST' , Post_Url , newObj)

   .then(res=>{
    snackBar("Added Successfully", "✅", "#28a745");

     createCard(newObj, res)
   })

   .catch(err=>{
     cl(err)
   })
}





const onEdit = (ele)=>{
  let Edit_ID = ele.closest('.card').id;
  localStorage.setItem('editId',Edit_ID);

  let Edit_URL = `${Base_Url}/posts/${Edit_ID}.json`;

  makeApiCall('GET',Edit_URL , null)

  .then(res=>{
     title.value = res.title,
     body.value = res.body,
     userId.value = res.userId,
     sBtn.classList.add('d-none')
     uBtn.classList.remove('d-none')
  })
  
}




const onUpadte = ()=>{

 let updateObj = 
 {
    title:title.value,
    body:body.value,
    userId:userId.value
 }
 cl(updateObj)

   userData.reset()

 let update_ID = localStorage.getItem('editId');
 
 let update_URL = `${Base_Url}/posts/${update_ID}.json`
 cl(update_URL)

 makeApiCall('PATCH', update_URL ,  updateObj)
 .then(res=>{

    let data = document.getElementById(update_ID).children
    data[0].innerHTML = ` <h5>${res.title}</h5>`;
    data[1].innerHTML = ` <p>${res.body}</p>`;
    sBtn.classList.remove('d-none');
    uBtn.classList.add('d-none');
    snackBar("Updated Successfully", "✏️", "#e9376c");

 })

 .catch(err=>{
  cl(err)
 })

}



const onDelete = (ele) => {
  let getDel_ID = ele.closest('.card').id;
  let getDel_URL = `${Base_Url}/posts/${getDel_ID}.json`;

  Swal.fire({
    title: "Are you sure?",
    text: "You won't be able to revert this!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Yes, delete it!",
    cancelButtonText: "Cancel",
  })
  .then((result) => {
    if (result.isConfirmed) {
      makeApiCall('DELETE', getDel_URL, null)
      .then(() => {
          let data = ele.closest('.card');
          data.remove();
          snackBar("Deleted Successfully", "✅");
        
    })
        .catch(error => {
          cl(error);
          snackBar("Something went wrong", "❌", "#d33");
        });
    } else if (result.dismiss === Swal.DismissReason.cancel) {
      snackBar("Action Cancelled", "ℹ️", "#334755");
    }
  });
};


userData.addEventListener('submit',sendObjToDB)
uBtn.addEventListener('click',onUpadte)