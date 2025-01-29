let cl = console.log;

const userForm = document.getElementById("userForm");
const title = document.getElementById("title");
const body = document.getElementById("body");
const userId = document.getElementById("userId");
const sBtn = document.getElementById("sBtn");
const uBtn = document.getElementById("uBtn");
const cardsContainer = document.getElementById("cardsContainer");

let Base_Url = `https://jsonplaceholder.typicode.com`;
let Post_Url = `${Base_Url}/posts`;

const snackBar = ((msg,icon)=>{
   Swal.fire({
     title:msg,
     icon:icon,
     timer:1500
   })

})

const onDelete = (ele)=>{
  let getdel_ID = ele.closest('.card').id;
  let getdelUrl = `${Base_Url}/posts/${getdel_ID}`;
  cl(getdelUrl);

  Swal.fire({
    title: "Are you sure?",
    text: "You won't be able to revert this!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Yes, delete it!"
  }).then((result) => {
    if (result.isConfirmed) {
      let xhr = new XMLHttpRequest()
      xhr.open('DELETE',getdelUrl,true)
      xhr.send(null)
      xhr.onload = function()
      {
        if(xhr.status>=200 && xhr.status<=299)
        {
           ele.closest(".card").remove()
        }
      }
      Swal.fire({
        title: "Deleted!",
        text: "Your file has been deleted.",
        icon: "success",
        timer:1000
      });
    }
  });

 
} 


const onUpdate = ()=>{
  let updateObj = 
  {
    title: title.value,
    body: body.value,
    userId: userId.value,
  }
     
     
     userForm.reset()

  let getUpdateId = localStorage.getItem('editId')
  let updateUrl = `${Base_Url}/posts/${getUpdateId}`

  let xhr = new XMLHttpRequest()
  xhr.open('PATCH',updateUrl,true)
  xhr.setRequestHeader('Content-Type', 'application/json;charset=UTF-8');
  xhr.send(JSON.stringify(updateObj))
  xhr.onload = function()
  {
    if(xhr.status>=200 && xhr.status<=299)
    {
        let data = JSON.parse(xhr.response)
        cl(data)

        let cardelement = document.getElementById(data.id).children;
        cardelement[0].innerHTML = `
        <h3>${data.title}</h3>
        ` 
        cardelement[1].innerHTML = `
           <p> ${data.body}</p>
        
        `
        sBtn.classList.remove('d-none')
        uBtn.classList.add('d-none')
        snackBar('Updated SuccessFully','success')
    }

    else
    {
       snackBar('Please Check Your DataInfo','error')
    }
  }
}





const onEdit = (ele)=>{
  console.log(ele);
  let getEdit_ID = ele.closest('.card').id;
  console.log(getEdit_ID);

  localStorage.setItem('editId',getEdit_ID);
  
  let getEdit_Url = `${Base_Url}/posts/${getEdit_ID}`;
  console.log(getEdit_Url);

  let xhr  = new XMLHttpRequest();
  xhr.open('GET',getEdit_Url,true);
  xhr.send(null);
  xhr.onload =  function () {
     if(xhr.status>=200 && xhr.status<=299) {
       let data  = JSON.parse(xhr.response);
       console.log(data);
       title.value = data.title;
       body.value = data.body;
       userId.value = data.userId;
       sBtn.classList.add('d-none');
       uBtn.classList.remove('d-none');
      }
  }
}


const temp = (arr) => {
  let result = "";
  arr.forEach((add) => {
    result += `
           <div class="col-md-4">
          <div class="card mb-3" id ='${add.id}'>
            <div class="card-header">
              <h3>${add.title}</h3>
            </div>
            <div class="card-body">
                  <p> ${add.body}</p>
            </div>
            <div class="card-footer d-flex justify-content-between">
              <button class="btn btn-primary" onclick = "onEdit(this)">Edit</button>
              <button class="btn btn-danger"  onclick = "onDelete(this)">Delete</button>
            </div>
          </div>
         </div>
        
        `;
    cardsContainer.innerHTML = result;
  });
};




const addDataTosaveInDB = (eve) => {
  eve.preventDefault();
  let newObj = {
    title: title.value,
    body: body.value,
    userId: userId.value,
  };

  userForm.reset()
  cl(newObj);

  let xhr = new XMLHttpRequest();
  xhr.open("POST", Post_Url, true);
  xhr.send(JSON.stringify(newObj));
  xhr.onload = function () {
    if (xhr.status >= 200 && xhr.status <= 299) {
      let data = JSON.parse(xhr.response);
      cl(data);
      let card = document.createElement("div");
      card.className = "col-md-4";
      card.id = data.id;
      card.innerHTML = `
           <div class ="card text-center" id="${data.id}">
           <div class="card-header">
              <h3>${newObj.title}</h3>
            </div>
            <div class="card-body">
                   <p> ${newObj.body}</p>
            </div>
            <div class="card-footer d-flex justify-content-between">
              <button class="btn btn-primary"   onclick = "onEdit(this)">Edit</button>
              <button class="btn btn-danger"    onclick=  "onDelete(this)">Delete</button>
            </div>
            </div>
          
            
            `;
      cardsContainer.append(card);
      snackBar('Post Added SucsessFully','success')
    } 

    else
    {
       snackBar('somthing went wrong','error')
    }
  };
};





const getDatathroughAPI = () => {
  let xhr = new XMLHttpRequest();
  xhr.open("GET", Post_Url, true);
  xhr.send(null);
  xhr.onload = function () {
    if (xhr.status >= 200 && xhr.status <= 299) {
      let data = JSON.parse(xhr.response);
      cl(data);
      temp(data);
    }
  };
};

getDatathroughAPI();

userForm.addEventListener("submit", addDataTosaveInDB);
uBtn.addEventListener('click',onUpdate)