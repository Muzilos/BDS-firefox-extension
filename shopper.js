var priceNumRegex = new RegExp("(\\d+\.\\d+)");
var possibleIds = ["priceblock_ourprice", "priceblock_saleprice"];
var productTitleId = "productTitle";
var sellerNameId = "bylineInfo"
var amznPriceElm = null;

function onError(error) {
    console.error(`AussieShopper : Error ${error}`);
}

function getWikipediaSections(pageName) {
    var wikiSections = `https://en.wikipedia.org/w/api.php?format=json&action=parse&prop=sections&page=${pageName}`
    var sections = null
    console.log(`Querying ${wikiSections}`)
    jQuery.ajax({
        type: "GET",
        headers: {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Credentials": "true"
        },
        url: wikiSections,
        dataType: "json",
        processData: true,
        data: {},
        error: function (xhr, request, error) {
            var err = eval("(" + xhr.responseText + ")");
            alert(err.message);
        },
        success: function (result) {
            alert("HEKKI@");
            sections = result;
            alert(JSON.stringify(result));
            if (sections['sections'].length == 0) {
                getWikipediaSections(`${pageName} (company)`);
            }
            return sections;
        }
    });
}

function getControversies() {
    var sellerName = document.getElementById(sellerNameId).textContent;
    if (sellerName) {
        console.log(`Seller name: ${sellerName}`);
        try {
            sections = getWikipediaSections(sellerName);
        } catch (error) {
            alert(err.message);
        }
        console.log(sections);
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