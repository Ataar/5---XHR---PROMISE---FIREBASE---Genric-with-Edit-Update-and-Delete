let cl = console.log;

let userPost = document.getElementById("userPost");
let title = document.getElementById("title");
let content = document.getElementById("content");
let blogContainer = document.getElementById("blogContainer");
let sBtn = document.getElementById("sBtn");
let uBtn = document.getElementById("uBtn");

const generateUUID = () => {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (char) => {
    const random = (Math.random() * 16) | 0;
    const value = char === "x" ? random : (random & 0x3) | 0x8;
    return value.toString(16);
  });
};

// Example usage:
// console.log(generateUUID());

let allBlogs = [
  {
    title: "Angular 2.0",
    content: "Angular 2.0 is an advanced extension",
    id: generateUUID(),
  },

  {
    title: "React 2.0",
    content: "React 2.0 is an advanced extension",
    id: generateUUID(),
  },
  {
    title: "Typscript 2.0",
    content: "Typscript 2.0 is an advanced extension",
    id: generateUUID(),
  },
];

let blogData = localStorage.getItem("allBlogs");
allBlogs = blogData ? JSON.parse(blogData) : allBlogs;

const Snackbar = (title, icon) => {
  Swal.fire({
    title: title,
    icon: icon,
    toast: true,
    position: "top",
    showConfirmButton: false,
    timer: 1000,
    timerProgressBar: true,
    didOpen: (toast) => {
      toast.addEventListener("mouseenter", Swal.stopTimer);
      toast.addEventListener("mouseleave", Swal.resumeTimer);
    },
  });
};
const onBlogSubmit = (eve) => {
  eve.preventDefault();

  // Create a new blog post object
  let newObjPost = {
    title: title.value,
    content: content.value,
    id: generateUUID(),
  };

  cl(newObjPost);
  userPost.reset();

    // If not editing, create a new post
    createObjectPost(newObjPost)
    .then(() => {
      Snackbar("Blog Created Successfully!", "success");
       return getData(); // Fetch updated data after creating the post
        })
        .then(() => {
      displayPostBlogs(allBlogs); // Display all blog posts
    })

        .catch((err) => {
          cl(err);
          Snackbar("Failed to process request", "error");
        });
    };
  

const createObjectPost = (blog) => {
  // this funcion is used to store the blog objects in the database and we want
  //  to send the outside data to the createObjectPost function so that we pass a parameter within createObjectPost function.
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      let data = false;
      if (!data) {
        allBlogs.push(blog);
        localStorage.setItem("allBlogs", JSON.stringify(allBlogs));
        resolve(allBlogs);
      } else {
        reject("Failed to create post");
      }
    }, 200); // 200 OK (success) and 200 Bad Request (error) status code for POST request body data type in the database.
  });
};

const getData = () => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      let data = false;
      if (!data) {
        resolve(allBlogs);
      } else {
        reject("Failed to get data");
      }
    }, 1500);  // 1000 seconds timeout in milliseconds for all blogs in the database.
  });
};

const onEditBlog = (ele) => {
  let getId = ele.closest(".card").id;
  localStorage.setItem("edit", getId);

  new Promise((resolve, reject) => {
    cl(getId);
    setTimeout(() => {
      let data = false;
      if (!data) {
        let blog = allBlogs.find((blog) => blog.id === getId);
        title.value = blog.title;
        content.value = blog.content;
        sBtn.classList.add("d-none");
        uBtn.classList.remove("d-none");
        resolve(allBlogs);
      } else {
        reject("Failed to edit post");
      }
    }, 200);
  })
  .then(() => {
    const scroll = () => {
      userPost.scrollIntoView({ block: "end", behavior: "instant" });
    };
    scroll();
  })
  .catch((error) => {
    console.error(error);
    Snackbar("Failed to process request", "error");
  });
};




// const onEditBlog = (ele)=>{
//   let getId = ele.closest('.card').id;
//   cl(getId)
//   let blog = allBlogs.find(blog => blog.id === getId);
//   title.value = blog.title;
//   content.value = blog.content;
//   sBtn.classList.add("d-none");
//   uBtn.classList.remove("d-none");
// }

const onUpdate = () => {
  let getId = localStorage.getItem('edit');
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      let data = false;
      if (!data) {
        let blog = allBlogs.find((blog) => blog.id === getId);
        blog.title = title.value;
        blog.content = content.value;
        localStorage.setItem("allBlogs", JSON.stringify(allBlogs));
        Snackbar("Blog Updated Successfully!", "success");
        sBtn.classList.remove("d-none");
        uBtn.classList.add("d-none");
        userPost.reset();
        resolve(allBlogs);
      } else {
        reject("Failed to update post");
      }
    }, 1000);
  })
  .then(updateBlog=>{
    displayPostBlogs(updateBlog);
  })
  .catch(error=>{
    console.error(error);
    Snackbar("Failed to process request", "error"); 
  })
}
   
const onDeleteBlog = (ele) => {
  return new Promise((resolve, reject) => {
    // Show the confirmation dialog first
    Swal.fire({
      title: "Are you sure?",
      text: "Post will be deleted permanently!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!"
    }).then((result) => {
      // If user confirmed the deletion
      if (result.isConfirmed) {
        let getId = ele.closest(".card").id; // Get the ID of the post to delete
        cl(getId);

        // Simulate asynchronous deletion
        setTimeout(() => {
          // Filter out the deleted blog post
          allBlogs = allBlogs.filter((blog) => blog.id !== getId);

          // Update localStorage with the new array of blogs
          localStorage.setItem("allBlogs", JSON.stringify(allBlogs));

          // Show success snackbar
          Snackbar("Blog Deleted Successfully!", "success");

          // Show success notification after deletion
          Swal.fire({
            title: "Deleted!",
            text: "Your blog post has been deleted.",
            icon: "success",
            timer: 1500,
            showConfirmButton: false,
          });

          // Resolve the promise with the updated list of blogs
          resolve(allBlogs);
        }, 1000);
      } else {
        reject("User canceled the deletion");
      }
    }).catch((error) => {
      reject(error);
    });
  })
  .then((updatedBlogs) => {
    // This part runs after successful deletion
    displayPostBlogs(updatedBlogs);
  })
  .catch((error) => {
    // This part handles errors, such as user cancellation or other issues
    console.error(error);
    Snackbar("Failed to process request", "error");
  });
};



// const onDeleteBlog = (ele) => {
//   return new Promise((resolve, reject) => {
//     setTimeout(() => {
//       let data = false;
//       if (!data) {
//         let getId = ele.closest(".card").id;
//         cl(getId);
//         allBlogs = allBlogs.filter((blog) => blog.id !== getId);
//         localStorage.setItem("allBlogs", JSON.stringify(allBlogs));
//         Snackbar("Blog Deleted Successfully!", "success");
//         resolve(allBlogs);
//         // displayPostBlogs(allBlogs);
//       } else {
//         reject("Blog not found");
//       }
//     }, 1000);
//   })

//   .then(deleteBlog=>{

//     displayPostBlogs(deleteBlog);

//   })
//   .catch(error=>{
//     console.error(error);
//     Snackbar("Failed to process request", "error");
//   })
// };

  

const displayPostBlogs = (arr) => {
  let result = "";
  arr.forEach((blog) => {
    result += `
       
      <div class="col-md-4 offset-md-4 my-4">
       <div class="card text-center" id="${blog.id}">
        <div class="card-header">
         <h2>${blog.title}</h2>
        </div>
        <div class="card-body">
         <p>${blog.content}</p>
        </div>
        <div class="card-footer d-flex justify-content-between">
         <button class="btn btn-primary edit-btn"onclick="onEditBlog(this)">Edit</button>
         <button class="btn btn-danger delete-btn" onclick="onDeleteBlog(this)">Delete</button>
        </div>
       </div>
      </div>

      `;
    });
    blogContainer.innerHTML = result;
}

displayPostBlogs(allBlogs);

userPost.addEventListener("submit", onBlogSubmit);
 uBtn.addEventListener("click", onUpdate);

