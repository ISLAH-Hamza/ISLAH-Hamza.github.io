/* Reads data/profile.json and renders the page.
   Edit the JSON, never this file, to change what the site says. */

(function () {
  "use strict";

  var DATA_URL = "data/profile.json";

  var LINK_LABELS = {
    google_scholar: "Google Scholar",
    github: "GitHub",
    orcid: "ORCID",
    linkedin: "LinkedIn",
    dblp: "DBLP"
  };

  // Font Awesome classes for each profile key, plus the built-in
  // email/resume links. Unknown keys fall back to a generic link glyph.
  var LINK_ICONS = {
    google_scholar: "fa-brands fa-google-scholar",
    github: "fa-brands fa-github",
    orcid: "fa-brands fa-orcid",
    linkedin: "fa-brands fa-linkedin",
    dblp: "fa-solid fa-book",
    twitter: "fa-brands fa-x-twitter",
    mastodon: "fa-brands fa-mastodon",
    website: "fa-solid fa-globe",
    email: "fa-solid fa-envelope",
    resume: "fa-solid fa-file-arrow-down"
  };

  function icon(key) {
    var i = el("i", LINK_ICONS[key] || "fa-solid fa-link");
    i.setAttribute("aria-hidden", "true");
    return i;
  }

  var MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
                "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

  /* ---------- helpers ---------- */

  function el(tag, cls, text) {
    var node = document.createElement(tag);
    if (cls) node.className = cls;
    if (text !== undefined && text !== null) node.textContent = text;
    return node;
  }

  function link(href, text, cls) {
    var a = el("a", cls, text);
    a.href = href;
    // outside links and the PDF open in a new tab, so the page is not lost
    if (/^https?:/.test(href) || /\.pdf$/i.test(href)) {
      a.rel = "noopener";
      a.target = "_blank";
    }
    return a;
  }

  function humanize(key) {
    return key.replace(/_/g, " ").replace(/^./, function (c) { return c.toUpperCase(); });
  }

  function titleCaseName(name) {
    return name.replace(/\b[A-ZÀ-Ý]{2,}\b/g, function (word) {
      return word.charAt(0) + word.slice(1).toLowerCase();
    });
  }

  function month(value) {
    if (!value) return "";
    var parts = String(value).split("-");
    if (parts.length < 2) return parts[0];
    return MONTHS[parseInt(parts[1], 10) - 1] + " " + parts[0];
  }

  function years(start, end) {
    if (!start && !end) return "";
    if (!end || String(end) === String(start)) return String(start);
    return start + "\u2013" + end;
  }

  function fill(id, text) {
    var node = document.getElementById(id);
    if (node) node.textContent = text || "";
  }

  /* ---------- sections ---------- */

  function renderRail(data) {
    var surname = (data.name || "").split(" ").slice(-1)[0];
    fill("name", data.name || "");
    fill("role", data.title || "");
    fill("affil", [data.affiliation, data.location].filter(Boolean).join(", "));
    document.title = titleCaseName(data.name || "Portfolio");

    var list = document.getElementById("links");
    list.innerHTML = "";

    Object.keys(data.profiles || {}).forEach(function (key) {
      if (!data.profiles[key]) return;
      var li = el("li");
      var a = link(data.profiles[key], LINK_LABELS[key] || humanize(key));
      a.insertBefore(icon(key), a.firstChild);
      li.appendChild(a);
      list.appendChild(li);
    });

    if (data.email) {
      var mail = el("li");
      var mailLink = link("mailto:" + data.email, "Email");
      mailLink.insertBefore(icon("email"), mailLink.firstChild);
      mail.appendChild(mailLink);
      list.appendChild(mail);
    }

    var cv = document.getElementById("resumeLink");
    if (cv) {
      if (data.resume) {
        cv.href = data.resume;
        cv.target = "_blank";
        cv.rel = "noopener";
        cv.hidden = false;
        var cvIcon = cv.querySelector("i");
        if (!cvIcon) cv.insertBefore(icon("resume"), cv.firstChild);
      } else {
        cv.hidden = true;
      }
    }

    return surname;
  }

  function renderResearch(data) {
    fill("bio", data.bio || "");

    var photo = document.getElementById("portrait");
    if (photo) {
      if (data.photo) {
        photo.src = data.photo;
        photo.alt = titleCaseName(data.name || "");
      } else {
        photo.remove();
      }
    }

    var ul = document.getElementById("interests");
    ul.innerHTML = "";
    (data.research_interests || []).forEach(function (item) {
      var li = el("li");
      var mark = el("i", "fa-solid fa-circle");
      mark.setAttribute("aria-hidden", "true");
      li.appendChild(mark);
      li.appendChild(document.createTextNode(item));
      ul.appendChild(li);
    });
  }

  function authorLine(authors, surname) {
    var p = el("p", "pub-authors");
    (authors || []).forEach(function (author, i) {
      var clean = titleCaseName(author);
      var isMe = surname && author.toLowerCase().indexOf(surname.toLowerCase()) >= 0;
      p.appendChild(el("span", isMe ? "me" : null, clean));
      if (i < authors.length - 1) p.appendChild(document.createTextNode(", "));
    });
    return p;
  }

  function pubEntry(pub, surname, status) {
    var wrap = el("article", "pub");
    wrap.appendChild(el("h4", "pub-title", pub.title));
    wrap.appendChild(authorLine(pub.authors, surname));

    var venue = el("p", "pub-venue");
    if (status) {
      var em = el("em", null, status);
      venue.appendChild(em);
    } else {
      venue.textContent = [pub.conference || pub.journal, pub.year].filter(Boolean).join(", ");
    }
    wrap.appendChild(venue);

    if (pub.doi) {
      wrap.appendChild(link("https://doi.org/" + pub.doi, "doi.org/" + pub.doi, "pub-doi"));
    } else if (pub.url) {
      wrap.appendChild(link(pub.url, "Read the paper", "pub-doi"));
    }
    return wrap;
  }

  function renderPublications(data, surname) {
    var host = document.getElementById("pubs");
    host.innerHTML = "";
    var pubs = data.publications || {};

    function group(title, items, status) {
      if (!items || !items.length) return;
      var section = el("div", "pub-group");
      section.appendChild(el("h3", null, title));
      items.forEach(function (p) { section.appendChild(pubEntry(p, surname, status)); });
      host.appendChild(section);
    }

    group("Peer reviewed", pubs.accepted, null);
    group("Under review", pubs.under_review, "Under review");
    group("Preprints", pubs.preprints, "Preprint");
  }

  function row(when, what, where, note) {
    var wrap = el("div", "row");
    wrap.appendChild(el("div", "row-when", when));
    var body = el("div", "row-what");
    body.appendChild(el("strong", null, what));
    if (where) body.appendChild(el("span", "row-where", where));
    if (note) body.appendChild(el("p", "row-note", note));
    wrap.appendChild(body);
    return wrap;
  }

  function renderExperience(data) {
    var host = document.getElementById("experience-list");
    host.innerHTML = "";
    (data.experience || []).forEach(function (job) {
      var when = [month(job.start_date), month(job.end_date)].filter(Boolean).join(" \u2013 ");
      host.appendChild(row(when, job.position, job.institution, job.description));
    });
  }

  function renderEducation(data) {
    var host = document.getElementById("education-list");
    host.innerHTML = "";
    (data.education || []).forEach(function (deg) {
      host.appendChild(row(years(deg.start_year, deg.end_year), deg.degree, deg.institution));
    });
  }

  function contactLine(host, lead, address) {
    if (!address) return;
    var p = el("p", "contact-line");
    p.appendChild(document.createTextNode(lead + " "));
    p.appendChild(link("mailto:" + address, address));
    p.appendChild(document.createTextNode("."));
    host.appendChild(p);
  }

  function renderContact(data) {
    var host = document.getElementById("contact-email");
    host.innerHTML = "";
    contactLine(host, "Write to me at", data.email);
    contactLine(host, "or, for personal matters,", data.personal_email);
  }

  /* ---------- section highlighting in the side nav ---------- */

  function spy() {
    var links = Array.prototype.slice.call(document.querySelectorAll(".nav a"));
    var sections = links
      .map(function (a) { return document.querySelector(a.getAttribute("href")); })
      .filter(Boolean);
    if (!("IntersectionObserver" in window) || !sections.length) return;

    var visible = {};
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) { visible[entry.target.id] = entry.isIntersecting; });
      var current = null;
      sections.forEach(function (s) { if (!current && visible[s.id]) current = s.id; });
      links.forEach(function (a) {
        if (current && a.getAttribute("href") === "#" + current) a.setAttribute("aria-current", "true");
        else a.removeAttribute("aria-current");
      });
    }, { rootMargin: "-20% 0px -70% 0px" });

    sections.forEach(function (s) { observer.observe(s); });
  }

  /* ---------- boot ---------- */

  function showError() {
    var box = document.getElementById("loadError");
    box.hidden = false;
    box.textContent = location.protocol === "file:"
      ? "The page could not read data/profile.json because browsers block file reads on file:// URLs. Run a local server from this folder, for example python3 -m http.server, then open http://localhost:8000."
      : "The page could not read data/profile.json. Check that the file exists at that path and contains valid JSON.";
  }

  fetch(DATA_URL, { cache: "no-cache" })
    .then(function (res) {
      if (!res.ok) throw new Error(res.status);
      return res.json();
    })
    .then(function (data) {
      var surname = renderRail(data);
      renderResearch(data);
      renderPublications(data, surname);
      renderExperience(data);
      renderEducation(data);
      renderContact(data);
      spy();
    })
    .catch(function (err) {
      console.error(err);
      showError();
    });
})();
