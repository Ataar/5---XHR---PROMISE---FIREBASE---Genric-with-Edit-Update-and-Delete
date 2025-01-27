let cl = console.log;

const userForm = document.getElementById("userForm");
const title = document.getElementById("title");
const body = document.getElementById("body");
const userId = document.getElementById("userId");
const sBtn = document.getElementById("sBtn");
const uBtn = document.getElementById("uBtn");
const cardsContainer = document.getElementById("cardsContainer");

let Base_Url = `https://jsonplaceholder.typicode.com/`;
let Post_Url = `${Base_Url}/posts`;

const temp = (arr=>{
    let result = ''
    arr.forEach(add=>{
        result+=`
           <div class="col-md-4">
          <div class="card mb-3 text-center">
            <div class="card-header">
              <h3>${add.title}
            </div>
            <div class="card-body">
                     ${add.body}
            </div>
            <div class="card-footer d-flex justify-content-between">
              <button class="btn btn-primary">Edit</button>
              <button class="btn btn-danger">Delete</button>
            </div>
          </div>
         </div>
        
        `
        cardsContainer.innerHTML = result
    })
})

let xhr = new XMLHttpRequest()
xhr.open('GET',Post_Url,true)
xhr.send(null)
xhr.onload = function()
{
    if(xhr.status>=200 && xhr.status<=299)
    {
       let data = JSON.parse(xhr.response)
       cl(data)
       temp(data)
    }
}
