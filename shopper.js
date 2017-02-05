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

        amznPriceElm.insertAdjacentHTML('afterend', `
            <div id='as_price' style='color: purple;'>
                <span>AUD${audPrice.toFixed(2)}</span>
                <span>
                    <a target='_blank' href='http://www.staticice.com.au/cgi-bin/search.cgi?q=${productTitle}'>Find on StaticIce</a>
                </span>
            </div>
            `);
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