var priceNumRegex = new RegExp("(\\d+\.\\d+)");
var possibleIds = ["priceblock_ourprice", "priceblock_saleprice"];
var productTitleId = "productTitle";
var sellerNameId = "bylineInfo";
var categoryId = "searchDropdownBox";
var amznPriceElm = null;

function onError(error) {
    console.error(`EthicalShopper : Error ${error}`);
}

function checkResponse(response) {
    var json_response = response.json();
    return json_response;
}

function generateRequest(request_url) {
    let headers = new Headers({ "Accept": "application/json" });
    let init = {method: 'GET', headers};
    let url = request_url;
    let request = new Request(url, init);
    return request;
}

function getWikipediaToken() {
    var url = "https://en.wikipedia.org/w/api.php?action=query&meta=tokens&format=json&type=login";
    var request = generateRequest(url);
    var token = null;
    function getToken(response) {
        var temp_token = response['query']['tokens']['logintoken'];
        console.log("Token: " + temp_token);
        token = temp_token;
    }
    fetch(request)
        .then(checkResponse)
        .then(getToken);
}

function getWikipediaPageName(pageName, category) {
    var url = `https://en.wikipedia.org/w/api.php?format=json&action=query&prop=categories&titles=${pageName}`;
    var request = generateRequest(url);
    var correct_page = null;
    function checkDisambiguation(response) {
        var pages = response['query']['pages'];
        var categories = pages[Object.keys(pages)[0]]['categories'];
        var disam_flag = false;
        console.log(url);
        for (let cat of categories) {
            if (cat['title'].indexOf("All article disambiguation pages") !== -1) {
                disam_flag = true;
                console.log('Disambiguation: ' + cat['title']);
            } else {
                console.log(`Other: ${cat['title']}`);
            }
        }
        if (!disam_flag) {
            console.log(pageName)
            return pageName;
        } else {
            console.log(`${pageName}_(${category})`);
            return `${pageName}_(${category})`;
        }
    }
    fetch(request)
        .then(checkResponse)
        .then(checkDisambiguation)
        .then(response => correct_page=response);
    console.log(correct_page);
    return correct_page;
}

function getWikipediaSections(pageName) {
    var url = `https://en.wikipedia.org/w/api.php?format=json&action=parse&prop=sections&page=${pageName}`
    var request = generateRequest(url);
    function get_sections(response) {
        var parsed_sections = response['parse']['sections'];
        var sections_list = [];
        for (let section of parsed_sections) {
            console.log(JSON.stringify(section['line']));
        }
        // console.log('Sections: ' + JSON.stringify(parse));
        return parse;
    }
    fetch(request)
        .then(checkResponse)
        .then(get_sections);
    return sections;
}

function getProductCategory() {
    var category_list = document.getElementById(categoryId);
    var category = category_list.options[category_list.selectedIndex].text;
    console.log("Category: " + category);
}

function getControversies() {
    var sellerName = document.getElementById(sellerNameId).textContent;
    if (sellerName) {
        console.log(`Seller name: ${sellerName}`);
        sections = getWikipediaSections(sellerName);
    }
}

// getControversies();
// getWikipediaSections("Anker");
// getWikipediaPageName("Amazon");
// getWikipediaPageName("Anker");
// getWikipediaPageName("Microsoft");
getProductCategory();