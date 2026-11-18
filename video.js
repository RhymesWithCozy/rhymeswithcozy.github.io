const videoLinks = document.querySelectorAll(".interview-video-link");
const videoDialog = document.querySelector(".video-dialog");
const videoPlayer = videoDialog.querySelector(".video-player");

if (typeof videoDialog.showModal === "function") {
  let opener;
  for (const videoLink of videoLinks) {
    videoLink.setAttribute("aria-haspopup", "dialog");
    videoLink.addEventListener("click", (event) => {
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      event.preventDefault();
      opener = videoLink;

      const url = new URL(videoLink.href);
      url.searchParams.set("autoplay", "1");

      const frame = document.createElement("iframe");
      frame.title = videoLink.getAttribute("aria-label").replace(/^Play /, "");
      frame.src = url.href;
      frame.allow = "autoplay; fullscreen; picture-in-picture; encrypted-media";
      frame.allowFullscreen = true;
      frame.referrerPolicy = "strict-origin-when-cross-origin";

      videoDialog.showModal();
      videoPlayer.replaceChildren(frame);
    });
  }

  videoDialog.addEventListener("close", () => {
    videoPlayer.replaceChildren();
    opener?.focus();
  });
}
