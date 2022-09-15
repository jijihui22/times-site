let news = []
let page = 1
let total_page = 0
let menus = document.querySelectorAll(".menus button")
menus.forEach((menu) => menu.addEventListener("click",(event)=>getNewsByTopic(event)))
let searchButton = document.getElementById("search-Button")
let url;

const getNews = async () => {
    try{
    let header = new Headers({
    "x-api-key":"FHmOeKu82b0oIFLNljKC7z7GnEfdAOCMb34OKcr4ODs"})
    url.searchParams.set('page',page)
        console.log(url)
    let response = await fetch(url, {headers : header})
    let data = await response.json()
    if(response.status == 200){
        if(data.total_hits == 0){
            throw new Error("검색된 결과값이 없습니다.")
        }
        console.log("받는 데이터",data)
        total_page = data.tatal_pages
        page = data.page
        news = data.articles;
        console.log(news);  

        render()
        pagenation()
        } else {
            throw new Error(data.message)
    }
    }catch(error){
        console.log("잡힌 에러는",error.message)
        errorRender(error.message)
    }
}

const getLatestNews = async () => {
    url = new URL('https://api.newscatcherapi.com/v2/latest_headlines?countries=KR&topic=sport&page_size=10')
    getNews()
};
const getNewsByTopic = async (event) => {
    console.log(event.target.textContent);
    let topic = event.target.textContent.toLowerCase()
    url = new URL(`https://api.newscatcherapi.com/v2/latest_headlines?countries=KR&page_size=10&topic=${topic}`)
    
    getNews()
};

const  getNewsByKeyword = async () => {
    let keyword = document.getElementById("search-Input").value
    url = new URL(`https://api.newscatcherapi.com/v2/search?q=${keyword}&page_size=10`)
    
    getNews()
}

const render = () => {
    let newHTML = ""
    newHTML = news.map((item) => {
        return `<div class="row news">
                <div class="col-lg-4">
                    <img class="new-Img" src="${item.media}" alt="">
                </div>
                <div class="col-lg-8">
                    <h2>${item.title}</h2>
                    <P>${item.summary}</P>
                    <div>${item.rights} * ${item.published_date}</div>
                </div>
            </div>`
    }).join('') 
        
    console.log(newHTML)
    
    
    document.getElementById("new-board").innerHTML = newHTML
}

const errorRender = (message) => {
    let errorHTML = `<div class="alert alert-danger text-center" role="alert">
    ${message}</div>`;
    document.getElementById("new-board").innerHTML = errorHTML
}

const pagenation = () => {
    let pagenationHTML = ``
    
    let pageGroup = Math.ceil(page/5)
    let last = pageGroup*5
    let first = last - 4 
    
    pagenationHTML = `<li class="page-item">
      <a class="page-link" href="#" aria-label="Previous"onclick="moveToPage(${page-1})">
        <span aria-hidden="true">&lt;</span>
      </a>
    </li>`
    for(let i=first;i<=last;i++){
        pagenationHTML += `<li class="page-item ${page==i?"active" : ""}"><a class="page-link" href="#" onclick="moveToPage(${i})">${i}</a></li>`
    }
    
        pagenationHTML += `<li class="page-item">
      <a class="page-link" href="#" aria-label="Next"onclick="moveToPage(${page+1})">
        <span aria-hidden="true">&gt;</span>
      </a>
    </li>`
    document.querySelector(".pagination").innerHTML = pagenationHTML
}

const moveToPage = (pageNum) => {
    page = pageNum
    getNews()
}

searchButton.addEventListener("click",getNewsByKeyword)

getLatestNews();
