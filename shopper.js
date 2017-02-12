var priceNumRegex = new RegExp("(\\d+\.\\d+)");
var possibleIds = ["priceblock_ourprice", "priceblock_saleprice"];
var productTitleId = "productTitle";
var amznPriceElm = null;

function onError(error) {
    console.error(`AussieShopper : Error ${error}`);
}

function displayConvertedPrice(result) {
    var audRate = result.exchange_rate || 1;
    var priceArray = priceNumRegex.exec(amznPriceElm.textContent);
    var productTitleElm = document.getElementById(productTitleId);

    if (priceArray) {
        var audPrice = priceArray[0] * audRate;
        var previouslyDisplayedDiv = document.getElementById("as_price");
        var productTitle = "";

        if (previouslyDisplayedDiv) {
            previouslyDisplayedDiv.remove();
        }

        if(productTitleElm){
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

lookForPrice();