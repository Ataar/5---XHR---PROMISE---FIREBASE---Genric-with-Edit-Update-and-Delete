let cl = console.log;

let blogContainer = document.getElementById("blogContainer");
let userPostForm = document.getElementById("userPost");
let titleInput = document.getElementById("title");
let contentInput = document.getElementById("content");
const sBtn = document.getElementById("sBtn");
const uBtn = document.getElementById("uBtn");

const generateUUID = () => {
  let d = new Date().getTime();
  let d2 = (performance && performance.now && performance.now() * 1000) || 0;

  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    let r = Math.random() * 16;
    if (d > 0) {
      r = (d + r) % 16 | 0;
      d = Math.floor(d / 16);
    } else {
      r = (d2 + r) % 16 | 0;
      d2 = Math.floor(d2 / 16);
    }
    return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
  });
};

// Initialize blogArr from localStorage or use default blogs
let blogArr = [
  { 
    title: "Hi, How are you?", 
    content: "This is a great blog post!",
    id: generateUUID()
  }
];

const storedBlogs = JSON.parse(localStorage.getItem("blogArr")) || [];
blogArr = storedBlogs.length ? storedBlogs : blogArr;
cl(blogArr);

const newObjectBlogs = (eve) => {
  eve.preventDefault();
  let newObject = {
    title: titleInput.value,
    content: contentInput.value,
    id: generateUUID()
  };

  blogArr.push(newObject);
  localStorage.setItem("blogArr", JSON.stringify(blogArr)); // Persist changes
  renderBlogPosts();
  userPostForm.reset();
  Swal.fire({
    title: `<span style="color: #ff5733; font-size: 1.5rem;">Blog Post Added!</span>`,
    text: "Post successfully added!",
    icon: "success",
    timer: 1500,
    showConfirmButton: false,
  });
};

const onEdit = (ele) => {
  let getid = ele.closest(".card").id;
  cl(getid);

  localStorage.setItem('edit', getid);

  let getObj = blogArr.find(obj => obj.id == getid);

  titleInput.value = getObj.title;
  contentInput.value = getObj.content;
  sBtn.classList.add("d-none");
  uBtn.classList.remove("d-none");

  const scroll =()=>{userPost.scrollIntoView({ block:'end', behavior:'instant' })};
     scroll()  
};

const onUpdate = () => {
  const editId = localStorage.getItem('edit');
  if (!editId) return;

  const index = blogArr.findIndex(obj => obj.id === editId);
  if (index !== -1) {
    blogArr[index].title = titleInput.value;
    blogArr[index].content = contentInput.value;

    // Update localStorage
    localStorage.setItem('blogArr', JSON.stringify(blogArr));

    // Reset the form and buttons
    userPostForm.reset();
    sBtn.classList.remove("d-none");
    uBtn.classList.add("d-none");
    // localStorage.removeItem('edit'); 

    renderBlogPosts();
    Swal.fire({
      title: `<span style="color: #ff5733; font-size: 1.5rem;">Blog Post Updated!</span>`,
      text: "Post successfully updated!",
      icon: "success",
      timer: 1500,
      showConfirmButton: false,
    });
  }
};


const onDelete = (ele) => {
  const postId = ele.closest(".card").id;

  Swal.fire({

    title: "Are you sure?",
    text: "Post will be deleted Pemanently",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Yes, delete it!"
  }).then((result) => {
    if (result.isConfirmed) {
          
  blogArr = blogArr.filter(post => post.id !== postId);

  // Update localStorage
  localStorage.setItem('blogArr', JSON.stringify(blogArr));

  renderBlogPosts();

      Swal.fire({
        title: "Deleted!",
        text: "Your blog post has been deleted.",
        icon: "success",
        timer: 1500,
        showConfirmButton: false,
      });
    }
  });
};


const renderBlogPosts = () => {
  let result = "";
  blogArr.forEach((post) => {
    result += `
        <div class="col-md-4 mb-4 text-center">
            <div class="card" id="${post.id}">
                <div class="card-body">
                    <h5 class="card-title text-center">${post.title}</h5>
                    <p class="card-text">${post.content}</p>
                    <div class="d-flex justify-content-between">
                        <button class="btn btn-primary" onclick="onEdit(this)">Edit</button>
                        <button class="btn btn-danger" onclick="onDelete(this)">Delete</button>
                    </div>
                </div>
            </div>
        </div>
        `;
  });
  blogContainer.innerHTML = result;
};

// Render blogs on page load
renderBlogPosts();

// Add event listener for form submission
userPostForm.addEventListener("submit", newObjectBlogs);
uBtn.addEventListener("click", (eve) => {
  eve.preventDefault();
  onUpdate();
});

// Heading creation
const letters = [
  { text: "B", color: "#ee0303" },
  { text: "L", color: "#f3f3ea" },
  { text: "O", color: "#0ef796" },
  { text: "G", color: "#fc07c7" },
  { text: "S", color: "#fbff05" },
];

const h1 = document.createElement("h1");
h1.style.textAlign = "center";
letters.forEach((letter) => {
  const span = document.createElement("span");
  span.textContent = letter.text;
  span.style.color = letter.color;
  h1.appendChild(span);
});

h1.style.position = "absolute";
h1.style.top = "1%";
h1.style.left = "50%";
h1.style.transform = "translateX(-50%)";
h1.style.textAlign = "center";
h1.style.letterSpacing = "15px";
h1.style.fontFamily = "Castellar";

const form = document.getElementById("userPost");
form.parentNode.insertBefore(h1, form);


