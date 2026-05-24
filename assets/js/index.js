const text = (value, fallback = "") => (value == null || value === "" ? fallback : String(value));

function setText(id, value) {
  const element = document.getElementById(id);
  if (element) element.textContent = value;
}

function createLink(href, label) {
  const link = document.createElement("a");
  link.href = href;
  link.textContent = label;
  if (!href.startsWith("mailto:")) {
    link.target = "_blank";
    link.rel = "noopener noreferrer";
  }
  return link;
}

function renderTitleLine(line) {
  const item = document.createElement("p");

  if (typeof line === "string") {
    item.textContent = line;
    return item;
  }

  item.append(text(line.text));
  if (line.advisors?.length) {
    item.append(" (", text(line.advisors_prefix, "Advised by"), " ");
    line.advisors.forEach((advisor, index) => {
      if (index > 0) item.append(index === line.advisors.length - 1 ? ", and " : ", ");
      item.append(createLink(advisor.url, advisor.name));
    });
    item.append(")");
  }

  return item;
}

function renderProfile(profile) {
  setText("profile-name", text(profile.name, "Yu Ji"));

  const title = document.getElementById("profile-title");
  title.replaceChildren(...(profile.title || []).map(renderTitleLine));

  const email = document.getElementById("profile-email");
  if (profile.email) {
    email.replaceChildren(createLink(`mailto:${profile.email}`, profile.email));
  } else {
    email.textContent = "To be updated";
  }

  const scholar = document.getElementById("profile-scholar");
  if (profile.scholar_url) {
    scholar.replaceChildren(createLink(profile.scholar_url, text(profile.scholar_text, "Google Scholar Profile")));
  } else {
    scholar.textContent = text(profile.scholar_text, "To be updated");
  }

  setText("profile-address", text(profile.address, "To be updated"));

  const interests = document.getElementById("research-interests");
  const researchInterests = profile.research_interests || [];
  interests.replaceChildren(...researchInterests.flatMap((interest, index) => {
    const nodes = [];
    if (index > 0) {
      const separator = document.createElement("span");
      separator.className = "interest-separator";
      separator.textContent = "·";
      nodes.push(separator);
    }
    const item = document.createElement("span");
    item.className = "interest-item";
    item.textContent = interest;
    nodes.push(item);
    return nodes;
  }));

  const bio = document.getElementById("profile-bio");
  const paragraphs = [profile.research_summary, ...(profile.bio || [])].filter(Boolean);
  bio.replaceChildren(...paragraphs.map((line) => {
    const paragraph = document.createElement("p");
    paragraph.textContent = line;
    return paragraph;
  }));
  bio.hidden = paragraphs.length === 0;

  const collaborationBox = document.getElementById("collaboration-box");
  const collaborationText = document.getElementById("collaboration-text");
  const collaboration = text(profile.collaboration, "");
  collaborationText.textContent = collaboration;
  collaborationBox.hidden = !collaboration;

  if (profile.site?.last_updated) {
    setText("last-updated", `Last updated: ${profile.site.last_updated}`);
  }

  const image = document.getElementById("profile-photo");
  const placeholder = document.getElementById("photo-placeholder");
  if (profile.photo) {
    image.src = profile.photo;
    image.addEventListener("load", () => {
      image.hidden = false;
      placeholder.hidden = true;
    });
    image.addEventListener("error", () => {
      image.hidden = true;
      placeholder.hidden = false;
    });
  }
}

fetch("data/profile.json")
  .then((response) => {
    if (!response.ok) throw new Error("Profile data failed to load");
    return response.json();
  })
  .then(renderProfile)
  .catch(() => {
    document.getElementById("profile-bio").innerHTML = '<p class="empty-state">暂无记录。</p>';
  });
