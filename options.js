function saveOptions(e) {
  e.preventDefault();
  browser.storage.local.set({
    exchange_rate: document.querySelector("#exchange_rate").value
  });
}

function restoreOptions() {

  function setCurrentExchangeRate(result) {
    document.querySelector("#exchange_rate").value = result.exchange_rate || 1.3;
  }

  function onError(error) {
    console.log(`Error: ${error}`);
  }

  var getting = browser.storage.local.get("exchange_rate");
  getting.then(setCurrentExchangeRate, onError);
}

document.addEventListener("DOMContentLoaded", restoreOptions);
document.querySelector("form").addEventListener("submit", saveOptions);