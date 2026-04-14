// 🔥 GLOBAL STREAM LINK
let currentStreamUrl = "";

async function loadVideo() {
  const url = document.getElementById("videoUrl").value;

  if (!url) {
    alert("Paste a Terabox link first!");
    return;
  }

  try {
    const response = await fetch("https://xapiverse.com/api/terabox", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "xAPIverse-Key": "sk_9426e8f42e6b15560945f64bb1158418"
      },
      body: JSON.stringify({ url: url })
    });

    const data = await response.json();
    console.log(data);

    if (data.status !== "success") {
      alert("Failed to load video");
      return;
    }

    const videoData = data.list[0];

    // 🔥 AUTO PICK BEST QUALITY
    let streamUrl = "";

    if (videoData.fast_stream_url["720p"]) {
      streamUrl = videoData.fast_stream_url["720p"];
    } else if (videoData.fast_stream_url["480p"]) {
      streamUrl = videoData.fast_stream_url["480p"];
    } else if (videoData.fast_stream_url["360p"]) {
      streamUrl = videoData.fast_stream_url["360p"];
    }

    // ❗ DOUBLE CHECK
    if (!streamUrl) {
      alert("No stream available!");
      return;
    }

    // ✅ SAVE STREAM (ETO ANG IMPORTANTE)
    currentStreamUrl = streamUrl;

    const video = document.getElementById("videoPlayer");

    if (Hls.isSupported()) {
      const hls = new Hls();
      hls.loadSource(streamUrl);
      hls.attachMedia(video);
    } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
      video.src = streamUrl;
    }

  } catch (error) {
    console.error(error);
    alert("Error loading video");
  }
}

// 🔥 EMBED LINK GENERATOR
function getEmbedLink() {
  return window.location.origin +
    "/player.html?video=" +
    encodeURIComponent(currentStreamUrl);
}

// 🔥 SHARE BUTTON (FIXED)
function shareVideo() {

  if (!currentStreamUrl) {
    alert("Load video first!");
    return;
  }

  const embedLink = getEmbedLink();

  if (navigator.share) {
    navigator.share({
      title: "Video Player",
      url: embedLink
    });
  } else {
    navigator.clipboard.writeText(embedLink);
    alert("Embed player link copied!");
  }
}

// 🔥 COPY EMBED CODE
function copyEmbedCode() {

  if (!currentStreamUrl) {
    alert("Load video first!");
    return;
  }

  const embedLink = getEmbedLink();

  const embedCode = `<iframe src="${embedLink}" width="100%" height="500" frameborder="0" allowfullscreen></iframe>`;

  navigator.clipboard.writeText(embedCode);
  alert("Embed HTML code copied!");
}
