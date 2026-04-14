function loadVideo() {
  const url = document.getElementById("videoUrl").value;

  if (!url) {
    alert("Paste a Terabox link first!");
    return;
  }

  document.getElementById("videoFrame").src = url;
}

function shareVideo() {
  const url = document.getElementById("videoUrl").value;

  if (!url) {
    alert("No video to share!");
    return;
  }

  if (navigator.share) {
    navigator.share({
      title: "Terabox Video",
      text: "Watch this video",
      url: url
    });
  } else {
    navigator.clipboard.writeText(url);
    alert("Link copied!");
  }
}
