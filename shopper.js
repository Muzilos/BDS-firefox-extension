var priceNumRegex = new RegExp("(\\d+\.\\d+)");
var possibleIds = ["priceblock_ourprice", "priceblock_saleprice"];
var amznPriceElm = null;

function onError(error) {
    console.error(`AussieShopper : Error ${error}`);
}

function displayConvertedPrice(result) {
        var audRate = result.exchange_rate || 1;
        var priceArray = priceNumRegex.exec(amznPriceElm.textContent);
        
        if (priceArray) {
            var audPrice = priceArray[0] * audRate;
            var displayString = `
            <div id='as_price' style='color: purple;'>
                <span>AUD${audPrice.toFixed(2)}</span>
                <span><a href='gohere.html'>StaticIce</a></span>
            </div>
            `;

            var previouslyDisplayedDiv = document.getElementById("as_price");

            if(previouslyDisplayedDiv){
                previouslyDisplayedDiv.remove();
            }

            amznPriceElm.insertAdjacentHTML('afterend', displayString);
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

    if(priceElm){
        var getting = browser.storage.local.get("exchange_rate");
        getting.then(displayConvertedPrice, onError);
    }
}

lookForPrice();