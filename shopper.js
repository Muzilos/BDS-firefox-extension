var priceNumRegex = new RegExp("(\\d+\.\\d+)");
var possibleIds = ["priceblock_ourprice", "priceblock_saleprice"];
var productTitleId = "productTitle";
var sellerNameId = "bylineInfo"
var amznPriceElm = null;

function onError(error) {
    console.error(`EthicalShopper : Error ${error}`);
}
function checkResponse(response) {
    console.log(response.json());
    console.log(JSON.stringify(response));
}

function getWikipediaToken() {
    var loginUrl = "https://en.wikipedia.org/w/api.php?action=query&meta=tokens&format=json&type=login";
    let headers = new Headers({
        "Accept": "application/json"
    });
    let init = {
        method: 'GET',
        headers
    };
    let url = loginUrl;
    let request = new Request(url, init);
    fetch(request).then(checkResponse);
}

function getWikipediaSections(pageName) {
    var wikiSections = `https://en.wikipedia.org/w/api.php?format=json&action=parse&prop=sections&page=${pageName}`
    let headers = new Headers({
        "Accept": "application/json"
    });
    let init = {
        method: 'GET',
        headers
    };
    let url = wikiSections;
    let request = new Request(url, init);
    fetch(request).then(checkResponse);
    return sections;
}

function getControversies() {
    var sellerName = document.getElementById(sellerNameId).textContent;
    if (sellerName) {
        console.log(`Seller name: ${sellerName}`);
        try {
            sections = getWikipediaSections(sellerName);
        } catch (error) {
            alert(error);
        }
    }
}

function displayConvertedPrice(result) {
    var audRate = result.exchange_rate || 1.3;
    var priceArray = priceNumRegex.exec(amznPriceElm.textContent);
    var productTitleElm = document.getElementById(productTitleId);

    if (priceArray) {
        var audPrice = priceArray[0] * audRate;
        var previouslyDisplayedDiv = document.getElementById("as_price");
        var productTitle = "";

        if (previouslyDisplayedDiv) {
            previouslyDisplayedDiv.remove();
        }

        if (productTitleElm) {
            productTitle = encodeURIComponent(productTitleElm.innerText);
        }

        var containingDiv = document.createElement('div');
        containingDiv.setAttribute('id', 'as_price');
        containingDiv.setAttribute('style', 'color: purple');

        // price span
        var priceSpan = document.createElement('span');
        var priceText = document.createTextNode(`AUD${audPrice.toFixed(2)}`);
        priceSpan.setAttribute('style', 'margin-right: 5px');
        priceSpan.appendChild(priceText);

        // link span and its anchor
        var linkSpan = document.createElement('span');
        var linkAnchor = document.createElement('a');
        var anchorText = document.createTextNode('Find on StaticIce');
        linkAnchor.setAttribute('href', `http://www.staticice.com.au/cgi-bin/search.cgi?q=${productTitle}`);
        linkAnchor.setAttribute('target', '_blank');
        linkAnchor.appendChild(anchorText);

        linkSpan.appendChild(linkAnchor);

        // append new elements to the price block
        containingDiv.appendChild(priceSpan);
        containingDiv.appendChild(linkSpan);
        amznPriceElm.parentElement.appendChild(containingDiv);
    }

}

function lookForPrice() {
    var priceElm = null;

    for (priceIdKey in possibleIds) {
        priceElm = document.getElementById(possibleIds[priceIdKey]);

        if (priceElm) {
            amznPriceElm = priceElm;
            break;
        }
    }

    if (priceElm) {
        var getting = browser.storage.local.get("exchange_rate");
        getting.then(displayConvertedPrice, onError);
    }
}

// lookForPrice();
getControversies();
// getWikipediaSections("Anker");
// getWikipediaToken();