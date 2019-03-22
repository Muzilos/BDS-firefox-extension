function saveOptions(e) {
  e.preventDefault();
}

function restoreOptions() {

  function onError(error) {
    console.log(`Error: ${error}`);
  }

}

document.addEventListener("DOMContentLoaded", restoreOptions);
document.querySelector("form").addEventListener("submit", saveOptions);