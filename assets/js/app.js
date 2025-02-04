let cl = console.log;

const userData = document.getElementById("userData");
const title = document.getElementById("title");
const body = document.getElementById("body");
const userId = document.getElementById("userId");
const sBtn = document.getElementById("sBtn");
const uBtn = document.getElementById("uBtn");
const dataContainer = document.getElementById("dataContainer");
const loader = document.getElementById("loader");

const Base_Url = `https://xhr-firebase---get-and-p-7b428-default-rtdb.firebaseio.com`;
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

const onsendObjToDB = (eve) => {
  eve.preventDefault();
  let newObj = {
    title: title.value,
    body: body.value,
    userId: userId.value,
  };
  cl(newObj);
  userData.reset();

  snackBar("Added Successfully", "✅", "#28a745");

  makeApiCall("POST", Post_Url, newObj, (err, data) => {
    if (!err) {
      createCard(newObj, data);
    } else {
      snackBar("Something went wrong", "❌", "#d33");
    }
  });
};

const temp = (arr) => {
  let result = "";
  arr.forEach((add) => {
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

const makeApiCall = (methodName, apiUrl, msgBody = null, cbFun = () => {}) => {
  // we give the method name , Url and send body or data form outside the makeapi function.

  loader.classList.remove("d-none"); //start a loader because ApiCall is going to start

  let xhr = new XMLHttpRequest(); // it is API Call to get data

  xhr.open(methodName, apiUrl, true);

  xhr.send(msgBody ? JSON.stringify(msgBody) : null); // if data is null means falsy so xhr returns null and if data is object so xhr will send object into
  // DB by convering json.stringify() method.

  xhr.onload = () => {
    loader.classList.add("d-none");
    // If we get a response, whether it is a success or an error so stop the loader

    if (xhr.status >= 200 && xhr.status < 299) {
      let data = JSON.parse(xhr.response);
      cbFun(null, data);
      // null means no eror
    } else {
      cbFun(new Error(`HTTP Error ${xhr.status}`));
      //here we have to create custom error so we have a Constructor function i.e 'new Error'
      // and HTTP Error is a backend error.
      // If we get an error, we won't get the data.
    }
  };

  xhr.onerror = () => {
    // it is also a network error

    loader.classList.add("d-none");
    cbFun(new Error(`HTTP Error ${xhr.status}`));
  };
};

const fetchAllDatafromDB = () => {
  makeApiCall("GET", Post_Url, null, (err, data) => {
    if (!err) {
      let arr = objToarr(data);
      temp(arr);
    } else {
      cl(err);
    }
  });
};

fetchAllDatafromDB();

let postArr = [];

const objToarr = (obj) => {
  for (let key in obj) {
    postArr.push({ ...obj[key], id: key });
  }
  return postArr;
};

let onEdit = (ele) => {
  let Edit_ID = ele.closest(".card").id;

  localStorage.setItem("edit", Edit_ID);

  let Edit_URL = `${Base_Url}/posts/${Edit_ID}.json`;

  makeApiCall("GET", Edit_URL, null, (err, data) => {
    if (!err) {
      title.value = data.title;
      body.value = data.body;
      userId.value = data.userId;
      sBtn.classList.add("d-none");
      uBtn.classList.remove("d-none");
      const scroll = () => {
        userData.scrollIntoView({ block: "end", behavior: "instant" });
      };
      scroll();
    } else {
      cl(err);
    }
  });
};

const onUpdate = () => {
  let newUpdateobj = {
    title: title.value,
    body: body.value,
    userId: userId.value,
  };
  let getUpdate_ID = localStorage.getItem("edit");

  cl(getUpdate_ID);

  let getupdate_URL = `${Base_Url}/posts/${getUpdate_ID}.json`;
  cl(getupdate_URL);

  makeApiCall("PATCH", getupdate_URL, newUpdateobj, (err, data) => {
    if (!err) {
      let card = document.getElementById(getUpdate_ID).children;
      card[0].innerHTML = `<h5>${newUpdateobj.title}</h5>`;
      card[1].innerHTML = `<p>${newUpdateobj.body}</p>`;
      sBtn.classList.remove("d-none");
      uBtn.classList.add("d-none");
      userData.reset();
      snackBar("Updated Successfully", "✏️", "#e9376c");
    } else {
      snackBar("Something went wrong", "❌", "#d33");
    }
  });
};

const onDelete = (ele) => {
  cl(ele);
  let delete_ID = ele.closest(".card").id;
  cl(delete_ID);

  let delete_URL = `${Base_Url}/posts/${delete_ID}.json`;
  cl(delete_URL);

  Swal.fire({
    title: "Are you sure?",
    text: "You won't be able to revert this!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Yes, delete it!",
    cancelButtonText: "Cancel", // Custom text for the cancel button
  }).then((result) => {
    if (result.isConfirmed) {
      makeApiCall("DELETE", delete_URL, null, (err) => {
        if (!err) {
          let card = ele.closest(".card");
          card.remove(); // Remove the DOM element directly
          snackBar("Deleted Successfully", "✅");
        } else {
          cl(err);

          snackBar("Something went wrong", "❌", "#d33");
        }
      });
    } else if (result.dismiss === Swal.DismissReason.cancel) {
      snackBar("Action Cancelled", "ℹ️", "#334755");
    }
  });
};

userData.addEventListener("submit", onsendObjToDB);
uBtn.addEventListener("click", onUpdate);
