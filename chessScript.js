// Main loop
checkGameStatus();

function checkGameStatus() {
  document.arrive(".game-over-review-button-background", function () {
    // Arrive.unbindAllArrive();

    // Create button
    const overlay = document.createElement("div");
    overlay.id = "myOverlay";
    overlay.innerHTML = `<svg viewBox="-0.692 0.5 51.573 55.285" xmlns="http://www.w3.org/2000/svg" width="20" height="20" style="margin-right: 8px;"><path d="M38.956.5c-3.53.418-6.452.902-9.286 2.984C5.534 1.786-.692 18.533.68 29.364 3.493 50.214 31.918 55.785 41.329 41.7c-7.444 7.696-19.276 8.752-28.323 3.084S-.506 27.392 4.683 17.567C9.873 7.742 18.996 4.535 29.03 6.405c2.43-1.418 5.225-3.22 7.655-3.187l-1.694 4.86 12.752 21.37c-.439 5.654-5.459 6.112-5.459 6.112-.574-1.47-1.634-2.942-4.842-6.036-3.207-3.094-17.465-10.177-15.788-16.207-2.001 6.967 10.311 14.152 14.04 17.663 3.73 3.51 5.426 6.04 5.795 6.756 0 0 9.392-2.504 7.838-8.927L37.4 7.171z" stroke="#000" stroke-linejoin="round"/></svg>
    Analyze on Lichess`;

    // Add inline styles
    overlay.style.display = "flex";
    overlay.style.alignItems = "center";
    overlay.style.position = "fixed";
    overlay.style.top = "20px";
    overlay.style.right = "20px";
    overlay.style.padding = "10px 20px";
    overlay.style.backgroundColor = "#4CAF50";
    overlay.style.color = "white";
    overlay.style.fontSize = "16px";
    overlay.style.borderRadius = "5px";
    overlay.style.cursor = "pointer";
    overlay.style.zIndex = "1000";

    // Append overlay to body
    document.body.appendChild(overlay);

    // Add event listener to button
    overlay.addEventListener("click", () => {
      sendToLichess();
    });
  });
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
        if (!response.ok) {
          throw new Error("Network response was not ok " + response.statusText);
        }
        return response.json();
      })
      .then((data) => {
        console.log("Data:", data);
        if (data?.url) {
          let urlWithParam = new URL(data.url);
          urlWithParam.searchParams.append("fromChesscom", "true");
          window.open(urlWithParam);
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
