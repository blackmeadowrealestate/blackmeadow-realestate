(function () {
  var LEAD_TO = "blackmeadowrealestate@gmail.com";

  function qs(name) {
    return new URLSearchParams(window.location.search).get(name) || "";
  }

  function encodeMail(value) {
    return encodeURIComponent(value).replace(/%0A/g, "%0D%0A");
  }

  function mailTo(subject, body) {
    return "mailto:" + LEAD_TO + "?subject=" + encodeMail(subject) + "&body=" + encodeMail(body);
  }

  function setStatus(form, text) {
    var status = form.querySelector(".form-status");
    if (!status) return;
    status.hidden = false;
    status.textContent = text;
  }

  function onEmailForm(form) {
    form.addEventListener("submit", function (event) {
      event.preventDefault();
      var data = new FormData(form);
      var name = (data.get("name") || "").toString().trim();
      var email = (data.get("email") || "").toString().trim();
      var phone = (data.get("phone") || "").toString().trim();
      var preferred = (data.get("preferred") || "").toString().trim();
      var message = (data.get("message") || "").toString().trim();
      var type = form.getAttribute("data-email-type") || "lead";
      var subject, body;
      if (type === "booking") {
        subject = "Call booking request from " + (name || "a site visitor");
        body = [
          "A call booking request was sent from domsellsforyou.com.",
          "",
          "Name: " + name,
          "Email: " + email,
          "Phone: " + (phone || "not provided"),
          "Preferred date and time: " + preferred,
          "",
          "Notes:",
          message || "(none)"
        ].join("\n");
      } else {
        subject = "New website inquiry from " + (name || "a site visitor");
        body = [
          "A new lead was submitted on domsellsforyou.com.",
          "",
          "Name: " + name,
          "Email: " + email,
          "",
          "Message:",
          message
        ].join("\n");
      }
      window.location.href = mailTo(subject, body);
      setStatus(form, "Your email app should open with a message to " + LEAD_TO + ". Send that email to finish.");
    });
  }

  document.querySelectorAll("form[data-email-to]").forEach(onEmailForm);

  function esc(value) {
    return String(value == null ? "" : value).replace(/[&<>"']/g, function (ch) {
      return ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[ch];
    });
  }

  function allListings() {
    return (window.DSFY_LISTINGS || []).slice();
  }

  function listingFacts(item) {
    var parts = [];
    if (item.beds) parts.push(item.beds + " bed" + (item.beds === 1 ? "" : "s"));
    if (item.baths) parts.push(item.baths + " bath" + (String(item.baths) === "1" ? "" : "s"));
    if (item.sqft) parts.push(item.sqft + " sq ft");
    return parts.join(" · ");
  }

  function listingCard(item) {
    var place = [item.city, item.state, item.zip].filter(Boolean).join(", ");
    var facts = listingFacts(item);
    var agent = item.dominic
      ? "Listed by Dominic Santagato"
      : (item.agent ? "Listed by " + item.agent : "Joseph Baratta and Company");
    var photo = item.photo
      ? '<div class="home-card-photo" style="background-image:url(\'' + esc(item.photo) + '\')"></div>'
      : '<div class="home-card-photo home-card-photo-empty"></div>';
    var badge = item.dominic
      ? '<span class="home-card-badge">Listed by Dominic</span>'
      : (item.kind && item.kind !== "Home" ? '<span class="home-card-badge home-card-badge-muted">' + esc(item.kind) + "</span>" : "");
    return (
      '<a class="home-card" href="' + esc(item.url) + '" target="_blank" rel="noopener noreferrer">' +
        '<div class="home-card-media">' + photo + badge + "</div>" +
        '<div class="home-card-body">' +
          '<p class="home-card-price">' + esc(item.price) + "</p>" +
          "<h3>" + esc(item.street) + "</h3>" +
          '<p class="home-card-meta">' + esc(place) + "</p>" +
          (facts ? '<p class="home-card-meta">' + esc(facts) + "</p>" : "") +
          '<p class="home-card-agent">' + esc(agent) + " · Joseph Baratta and Company</p>" +
        "</div>" +
      "</a>"
    );
  }

  var results = document.getElementById("listing-results");
  if (results) {
    var location = qs("location").trim();
    var price = parseInt(qs("price"), 10) || 0;
    var beds = parseInt(qs("beds"), 10) || 0;
    var locationInput = document.getElementById("q-location");
    var priceInput = document.getElementById("q-price");
    var bedsInput = document.getElementById("q-beds");
    if (locationInput) locationInput.value = location;
    if (priceInput && qs("price")) priceInput.value = qs("price");
    if (bedsInput && qs("beds")) bedsInput.value = qs("beds");

    var matched = allListings().filter(function (item) {
      var hay = (item.street + " " + item.city + " " + item.state + " " + item.zip + " " + (item.agent || "")).toLowerCase();
      if (location && hay.indexOf(location.toLowerCase()) === -1) return false;
      if (price && item.priceValue > price) return false;
      if (beds && (item.beds || 0) < beds) return false;
      return true;
    });

    var summary = document.getElementById("search-summary");
    var asOf = window.DSFY_LISTINGS_AS_OF || "November 9, 2026";
    var bits = [];
    if (location) bits.push("location “" + location + "”");
    if (price) bits.push("up to $" + price.toLocaleString());
    if (beds) bits.push(beds + "+ beds");
    if (summary) {
      summary.innerHTML = bits.length
        ? "Showing " + matched.length + " current " + (matched.length === 1 ? "listing" : "listings") + " for " + esc(bits.join(", ")) + ". These come from <a href=\"https://www.josephbarattaandcompany.com/\" target=\"_blank\" rel=\"noopener noreferrer\">Joseph Baratta and Company</a> as of " + esc(asOf) + ". Click any home for the full listing on the brokerage site."
        : "Current homes for sale from <a href=\"https://www.josephbarattaandcompany.com/\" target=\"_blank\" rel=\"noopener noreferrer\">Joseph Baratta and Company</a>, as of " + esc(asOf) + ". Click any home to open the full listing on the brokerage site. Inventory can change.";
    }

    if (!matched.length) {
      results.innerHTML = "<p class=\"contact-note\">No current brokerage listings match those filters. Try a broader search, or <a class=\"text-link\" href=\"https://www.josephbarattaandcompany.com/fine/real/estate/newsearch\" target=\"_blank\" rel=\"noopener noreferrer\">search all listings</a> on the Joseph Baratta and Company site.</p>";
    } else {
      results.innerHTML = matched.map(listingCard).join("");
    }
  }

  var featured = document.getElementById("featured-homes");
  if (featured) {
    var homes = allListings().filter(function (item) { return item.type === "res"; }).slice(0, 6);
    featured.innerHTML = homes.map(listingCard).join("");
  }

  function initBackgroundMusic() {
    var STORAGE_KEY = "dsfy-music";
    var audio = document.createElement("audio");
    audio.src = "audio/chillax.mp3";
    audio.loop = true;
    audio.preload = "auto";
    audio.autoplay = true;
    audio.setAttribute("playsinline", "");
    audio.setAttribute("autoplay", "");
    audio.volume = 0.4;

    var saved = {};
    try { saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}"); } catch (e) {}
    if (typeof saved.volume === "number") {
      audio.volume = Math.min(1, Math.max(0, saved.volume));
    }

    // Default is to play and loop. Only stay off if the visitor already paused it.
    var userPaused = saved.playing === false;

    var player = document.createElement("div");
    player.className = "music-player";
    player.setAttribute("data-playing", "false");
    player.innerHTML =
      '<button type="button" aria-pressed="false" aria-label="Play background music">' +
        '<svg class="music-play-icon" width="14" height="14" viewBox="0 0 14 14" aria-hidden="true"><path fill="currentColor" d="M3 1.8v10.4L12 7 3 1.8z"/></svg>' +
        '<svg class="music-pause-icon" width="14" height="14" viewBox="0 0 14 14" aria-hidden="true"><path fill="currentColor" d="M3 2h3v10H3V2zm5 0h3v10H8V2z"/></svg>' +
      "</button>" +
      '<div class="music-copy">' +
        "<strong>Play music</strong>" +
        "<span>Chillax · Francisco Alvear</span>" +
      "</div>";

    document.body.appendChild(audio);
    document.body.appendChild(player);

    var button = player.querySelector("button");
    var label = player.querySelector("strong");
    var gestureBound = false;

    function persist() {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify({
          playing: !audio.paused,
          volume: audio.volume
        }));
      } catch (e) {}
    }

    function setPlaying(on) {
      player.setAttribute("data-playing", on ? "true" : "false");
      button.setAttribute("aria-pressed", on ? "true" : "false");
      button.setAttribute("aria-label", on ? "Pause background music" : "Play background music");
      label.textContent = on ? "Music on" : "Play music";
    }

    function teardownGestures() {
      if (!gestureBound) return;
      document.removeEventListener("pointerdown", onFirstGesture, true);
      document.removeEventListener("keydown", onFirstGesture, true);
      gestureBound = false;
    }

    function onFirstGesture(e) {
      if (userPaused) {
        teardownGestures();
        return;
      }
      if (player.contains(e.target)) return;
      if (audio.paused) play();
      teardownGestures();
    }

    function armGestures() {
      if (gestureBound || userPaused) return;
      document.addEventListener("pointerdown", onFirstGesture, true);
      document.addEventListener("keydown", onFirstGesture, true);
      gestureBound = true;
    }

    function play() {
      userPaused = false;
      var start = audio.play();
      if (start && start.then) {
        start.then(function () {
          setPlaying(true);
          persist();
          teardownGestures();
        }).catch(function () {
          setPlaying(false);
          armGestures();
        });
      } else {
        setPlaying(!audio.paused);
        persist();
        if (audio.paused) armGestures();
        else teardownGestures();
      }
    }

    function pause() {
      userPaused = true;
      teardownGestures();
      audio.pause();
      setPlaying(false);
      persist();
    }

    button.addEventListener("click", function () {
      if (audio.paused) play();
      else pause();
    });

    audio.addEventListener("play", function () { setPlaying(true); });
    audio.addEventListener("pause", function () {
      setPlaying(false);
      if (!userPaused && !audio.ended) {
        // A browser pause we did not ask for; try to keep it looping.
      }
    });

    if (!userPaused) play();
  }

  initBackgroundMusic();
})();
