function getQueryParams() {
  const params = new URLSearchParams(window.location.search);
  return {
    fromChesscom: params.get("fromChesscom"),
  };
}

function interactWithLichess() {
  const queryParams = getQueryParams();

  if (queryParams.fromChesscom === "true") {
    console.log("Interacting with Lichess.org");

    clickButtonWithText("Request a computer analysis");
  }
}

function clickButtonWithText(buttonText) {
  const buttons = document.querySelectorAll("button.button.text");
  for (let button of buttons) {
    const span = button.querySelector("span.is3.text[data-icon]");
    if (span && span.textContent.trim() === buttonText) {
      button.click();
      console.log(`Clicked button with text: ${buttonText}`);
      break;
    }
  }
}

interactWithLichess();
