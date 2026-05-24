function groupByYear(items, dateField) {
  return items
    .slice()
    .sort((a, b) => (b[dateField] || "").localeCompare(a[dateField] || ""))
    .reduce((groups, item) => {
      const year = item[dateField] ? item[dateField].slice(0, 4) : "Earlier";
      if (!groups[year]) groups[year] = [];
      groups[year].push(item);
      return groups;
    }, {});
}

function appendMeta(parent, parts) {
  const meta = document.createElement("p");
  meta.className = "record-meta";
  parts.filter(Boolean).forEach((part, index) => {
    if (index > 0) meta.append(" · ");
    if (part.className) {
      const span = document.createElement("span");
      span.className = part.className;
      span.textContent = part.text;
      meta.append(span);
    } else {
      meta.append(part);
    }
  });
  parent.append(meta);
}

function renderPublications(items) {
  const container = document.getElementById("publications-list");
  if (!items.length) {
    container.innerHTML = '<p class="empty-state">暂无记录。</p>';
    return;
  }

  const groups = groupByYear(items, "accepted_date");
  container.replaceChildren(...Object.entries(groups).map(([year, records]) => {
    const section = document.createElement("section");
    section.className = "year-group";

    const heading = document.createElement("h2");
    heading.className = "year-heading";
    heading.textContent = year;
    section.append(heading);

    records.forEach((record) => {
      const article = document.createElement("article");
      article.className = "record";

      const title = document.createElement("h3");
      title.className = "record-title";
      if (record.link) {
        const link = document.createElement("a");
        link.href = record.link;
        link.target = "_blank";
        link.rel = "noopener noreferrer";
        link.textContent = record.title;
        title.append(link);
      } else {
        title.textContent = record.title;
      }
      article.append(title);

      const authors = document.createElement("p");
      authors.className = "record-primary";
      authors.textContent = record.authors || "";
      article.append(authors);

      appendMeta(article, [
        record.venue,
        record.level,
        record.role ? { text: record.role, className: "role" } : "",
        record.accepted_date ? `Accepted: ${record.accepted_date}` : ""
      ]);

      section.append(article);
    });

    return section;
  }));
}

fetch("data/publications.json")
  .then((response) => {
    if (!response.ok) throw new Error("Publication data failed to load");
    return response.json();
  })
  .then(renderPublications)
  .catch(() => {
    document.getElementById("publications-list").innerHTML = '<p class="empty-state">暂无记录。</p>';
  });
