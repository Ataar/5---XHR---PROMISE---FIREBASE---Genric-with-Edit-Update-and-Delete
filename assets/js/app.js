let cl = console.log;

let blogContainer = document.getElementById("blogContainer");
let userPostForm = document.getElementById("userPost"); 
let titleInput = document.getElementById("title"); 
let contentInput = document.getElementById("content"); 


let blogArr = [
  {
    title: "First Post", content: "This is the first blog post" 
  },
  { 
    title: "Second Post", content: "This is the second blog post"
   },
  {
     title: "Third Post", content: "This is the third blog post"
     },
  { 
    title: "Fourth Post", content: "This is the fourth blog post"
   },
  {
     title: "Fifth Post", content: "This is the fifth blog post" 
    },
  { 
    title: "Sixth Post", content: "This is the sixth blog post" 
  }
];


let storedBlogs = JSON.parse(localStorage.getItem("blogArr")) || [blogArr];
console.log(storedBlogs);

const newObjectBlogs = (eve) => {
  eve.preventDefault(); 
  let newObject = {
    title: titleInput.value,
    content: contentInput.value
  };

   blogArr.push(newObject);
   localStorage.setItem("blogArr", JSON.stringify(blogArr));
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

const renderBlogPosts = () => {
  let result = "";
  blogArr.forEach((post) => {
    result += `
        <div class="col-md-4 mb-4 text-center">
            <div class="card">
                <div class="card-body">
                    <h5 class="card-title text-center">${post.title}</h5>
                    <p class="card-text">${post.content}</p>
                </div>
            </div>
        </div>
        `;
  });
  blogContainer.innerHTML = result;
};


renderBlogPosts();

userPostForm.addEventListener("submit", newObjectBlogs);



const letters = [
  { text: 'B', color: '#ee0303' },  
  { text: 'L', color: '#f3f3ea' },  
  { text: 'O', color: '#0ef796' },   
  { text: 'G', color: '#fc07c7' },      
  { text: 'S', color: '#fbff05' },      
];

const h1 = document.createElement('h1');
h1.style.textAlign = 'center'; 
letters.forEach(letter => {
  const span = document.createElement('span');
  span.textContent = letter.text; 
  span.style.color = letter.color;
  h1.appendChild(span); 
});

h1.style.position = 'absolute';
h1.style.top = '1%';
h1.style.left = '50%';
h1.style.transform = 'translateX(-50%)'; 
h1.style.textAlign = 'center';
h1.style.letterSpacing = '15px';
h1.style.fontFamily = 'Castellar';

const form = document.getElementById('userPost');

form.parentNode.insertBefore(h1, form);
