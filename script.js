// 🔥 GLOBAL STREAM LINK (for share)
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
      body: JSON.stringify({
        url: url
      })
    });

    const data = await response.json();
    console.log(data);

    if (data.status !== "success") {
      alert("Failed to load video");
      return;
    }

    const videoData = data.list[0];

    // 🔥 GET BEST QUALITY STREAM
    let streamUrl = videoData.fast_stream_url["480p"] || videoData.fast_stream_url["360p"];

    // ✅ SAVE FOR SHARE BUTTON
    currentStreamUrl = streamUrl;

    const video = document.getElementById("videoPlayer");

    // ✅ HLS PLAYER
    if (Hls.isSupported()) {
      const hls = new Hls();
      hls.loadSource(streamUrl);
      hls.attachMedia(video);
    } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
      video.src = streamUrl;
    } else {
      alert("HLS not supported on this device");
    }

  } catch (error) {
    console.error(error);
    alert("Error loading video");
  }
}

// 🔥 SHARE BUTTON = EMBED PLAYER LINK (FIXED)
function shareVideo() {

  if (!currentStreamUrl) {
    alert("Load video first!");
    return;
  }

  // ✅ CREATE EMBED PLAYER LINK
  const embedLink =
    window.location.origin +
    "/player.html?video=" +
    encodeURIComponent(currentStreamUrl);

  if (navigator.share) {
    navigator.share({
      title: "Terabox Video",
      text: "Watch this video",
      url: embedLink
    });
  } else {
    navigator.clipboard.writeText(embedLink);
    alert("Embed player link copied!");
  }
}
