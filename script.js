// Main loop
checkGameStatus();

function checkGameStatus() {
  console.log("I have arrived here!!!");
  document.arrive(".game-over-review-button-background", function () {
    console.log("and we come here,.,.,. letss goo!");
    // Arrive.unbindAllArrive();

    // Create button
    const overlay = document.createElement("div");
    overlay.id = "myOverlay";
    overlay.innerHTML = "Analyze on Lichess";

    // Append overlay to body
    document.body.appendChild(overlay);

    // Add event listener to button
    overlay.addEventListener("click", () => {
      console.log("Button clicked");
      sendToLichess();
    });
  });
}

// Injects a button similar to chess.com's native "Analysis" button
function injectButton(analysisButton) {
  // Duplicate the original button
  let newButton = analysisButton.cloneNode("deep");
  // Style it and link it to the Lichess import function.
  newButton.childNodes[2].innerText = "Lichess Analysis";
  newButton.style.margin = "8px 0px 0px 0px";
  newButton.style.padding = "0px 0px 0px 0px";
  newButton.childNodes[0].classList.remove("icon-font-chess");
  newButton.childNodes[0].classList.add("button-class");
  newButton.classList.add("shine-hope-anim");
  newButton.childNodes[0].style["height"] = "3.805rem";
  newButton.addEventListener("click", () => {
    sendToLichess();
  });
  // Append back into the DOM
  let parentNode = analysisButton.parentNode;
  parentNode.append(newButton);
}

// Make request to Lichess through the API (fetch)
function sendToLichess() {
  // 1. Get PGN

  // Get and click download button on chess.com
  let downloadButton = document.getElementsByClassName(
    "icon-font-chess share live-game-buttons-button"
  )[0];
  downloadButton.click();

  // Wait for share tab to pop up
  document.arrive(".share-menu-tab-pgn-textarea", function () {
    // Get PGN from text Area
    var PGN = document.getElementsByClassName("share-menu-tab-pgn-textarea")[0]
      .value;

    // Exit out of download view (x button)
    document
      .querySelector("div.icon-font-chess.x.ui_outside-close-icon")
      .click();

    // 2. Send a POST request to Lichess to import the current game
    let importUrl =
      "http://localhost:8080/proxy?url=https://lichess.org/api/import";
    let req = { pgn: PGN };

    post(importUrl, req)
      .then((response) => {
        console.log("response", response);
        if (!response.ok) {
          throw new Error("Network response was not ok " + response.statusText);
        }
        return response.json();
      })
      .then((data) => {
        console.log("Data:", data);
        if (data?.url) {
          window.open(data?.url);
        }
      })
      .catch((e) => {
        console.log("error", e);
        alert("Error getting response from lichess.org");
      })
      .finally(() => {
        Arrive.unbindAllArrive();
      });
  });
}

// async POST function
async function post(url = "", data = {}) {
  var formBody = [];
  for (var property in data) {
    var encodedKey = encodeURIComponent(property);
    var encodedValue = encodeURIComponent(data[property]);
    formBody.push(encodedKey + "=" + encodedValue);
  }
  formBody = formBody.join("&");

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Accept: "application/json",
      },
      body: formBody,
    });
    return response;
  } catch (error) {
    console.error("Error:", error);
    throw error; // Optionally rethrow the error
  }
}
