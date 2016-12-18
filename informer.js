var priceNumRegex = new RegExp("(\\d+\.\\d+)");
var possibleIds = ["priceblock_ourprice", "priceblock_saleprice"];

function convertPrice() {
    var priceElm = null;

    function displayPrice(result) {
        var audRate = result.exchange_rate || 1;

        if (priceElm) {
            var priceArray = priceNumRegex.exec(priceElm.textContent);

            if (priceArray) {
                var audPrice = priceArray[0] * audRate;

                priceElm.textContent += "/AUD" + audPrice.toFixed(2);
            }
        }
    }

    for (priceIdKey in possibleIds) {
        priceElm = document.getElementById(possibleIds[priceIdKey]);

        if (priceElm) {
            break;
        }
    }
    var getting = browser.storage.local.get("exchange_rate");
    getting.then(displayPrice);
}

convertPrice();