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

    // 🔥 get best quality stream
    let streamUrl = videoData.fast_stream_url["480p"] || videoData.fast_stream_url["360p"];

    const video = document.getElementById("videoPlayer");

    // ✅ HLS PLAYER
    if (Hls.isSupported()) {
      const hls = new Hls();
      hls.loadSource(streamUrl);
      hls.attachMedia(video);
    } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
      video.src = streamUrl;
    } else {
      alert("HLS not supported");
    }

  } catch (error) {
    console.error(error);
    alert("Error loading video");
  }
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
