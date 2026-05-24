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

function renderProjects(items) {
  const container = document.getElementById("projects-list");
  if (!items.length) {
    container.innerHTML = '<p class="empty-state">暂无记录。</p>';
    return;
  }

  const groups = groupByYear(items, "start_date");
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
      title.textContent = record.title;
      article.append(title);

      const partner = document.createElement("p");
      partner.className = "record-primary";
      partner.textContent = record.partner || "";
      article.append(partner);

      const meta = document.createElement("p");
      meta.className = "record-meta";
      const parts = [
        record.period,
        record.pi ? `主持人: ${record.pi}` : "",
        record.role,
        record.funding
      ].filter(Boolean);
      parts.forEach((part, index) => {
        if (index > 0) meta.append(" · ");
        if (part === record.role) {
          const role = document.createElement("span");
          role.className = "role";
          role.textContent = part;
          meta.append(role);
        } else {
          meta.append(part);
        }
      });
      article.append(meta);

      section.append(article);
    });

    return section;
  }));
}

fetch("data/projects.json")
  .then((response) => {
    if (!response.ok) throw new Error("Project data failed to load");
    return response.json();
  })
  .then(renderProjects)
  .catch(() => {
    document.getElementById("projects-list").innerHTML = '<p class="empty-state">暂无记录。</p>';
  });
