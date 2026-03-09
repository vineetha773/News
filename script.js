const API_KEY = "c52bd918eae40d9cd640a0871f2ce481";

const container = document.getElementById("newsContainer");
const searchInput = document.getElementById("searchInput");
const banner = document.getElementById("breakingNews");
const slider = document.getElementById("trendingSlider");

let page = 1;
let currentCategory = "general";

/* Dark mode */

const modeToggle = document.getElementById("modeToggle");
if(modeToggle){
modeToggle.onclick = () => {
document.body.classList.toggle("dark");
};
}

/* Page load */

window.onload = () => {

const params = new URLSearchParams(window.location.search);
const query = params.get("q");

if(query){
searchNews(query);
}
else{
getNews();
}

};

/* Fetch news */

async function getNews(category=currentCategory){

currentCategory = category;

const url = `https://corsproxy.io/?https://gnews.io/api/v4/top-headlines?category=${category}&lang=en&country=in&max=10&page=${page}&apikey=${API_KEY}`;

const response = await fetch(url);
const data = await response.json();

if(container){
displayNews(data.articles);
}

if(banner){
showBreaking(data.articles);
}

if(slider){
showTrending(data.articles);
}

}

/* Display news */

function displayNews(articles){

articles.forEach(article=>{

const card = document.createElement("div");
card.className="card";

card.innerHTML = ` <img src="${article.image || 'https://via.placeholder.com/300'}">

<h3>${article.title}</h3>
<p>${article.description || ""}</p>
<a href="${article.url}" target="_blank">Read More</a>
<br>
<button onclick='bookmarkArticle(${JSON.stringify(article)})'>⭐ Bookmark</button>
`;

container.appendChild(card);

});

}

/* Go to search page */

function goToSearch(){

const query = searchInput.value;

if(query){
window.location.href = `search.html?q=${query}`;
}

}

/* Search news */

async function searchNews(query){

if(!query){
query = searchInput.value;
}

const url = `https://corsproxy.io/?https://gnews.io/api/v4/search?q=${query}&lang=en&max=10&apikey=${API_KEY}`;

const response = await fetch(url);
const data = await response.json();

container.innerHTML="";

displayNews(data.articles);

}

/* Breaking news */

function showBreaking(articles){

if(banner && articles.length>0){
banner.innerText="🔥 Breaking: "+articles[0].title;
}

}

/* Trending slider */

function showTrending(articles){

if(!slider) return;

slider.innerHTML="";

articles.slice(0,5).forEach(article=>{

const slide=document.createElement("div");

slide.className="slide";

slide.innerHTML=` <img src="${article.image}" width="100%">

<p>${article.title}</p>
`;

slider.appendChild(slide);

});

}

/* Bookmark */

function bookmarkArticle(article){

let saved=JSON.parse(localStorage.getItem("bookmarks"))||[];

saved.push(article);

localStorage.setItem("bookmarks",JSON.stringify(saved));

alert("Saved ⭐");

}

/* Infinite scroll */

window.addEventListener("scroll",()=>{

if(window.innerHeight+window.scrollY>=document.body.offsetHeight-200){

page++;

getNews();

}

});
