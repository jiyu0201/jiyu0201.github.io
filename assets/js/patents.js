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

function renderPatents(items) {
  const container = document.getElementById("patents-list");
  if (!items.length) {
    container.innerHTML = '<p class="empty-state">暂无记录。</p>';
    return;
  }

  const groups = groupByYear(items, "granted_date");
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

      const inventors = document.createElement("p");
      inventors.className = "record-primary";
      inventors.textContent = record.inventors || "";
      article.append(inventors);

      const meta = document.createElement("p");
      meta.className = "record-meta";
      if (record.role) {
        const role = document.createElement("span");
        role.className = "role";
        role.textContent = record.role;
        meta.append(role);
      }
      if (record.granted_date) {
        if (meta.childNodes.length) meta.append(" · ");
        meta.append(`授权日期: ${record.granted_date}`);
      }
      article.append(meta);

      section.append(article);
    });

    return section;
  }));
}

fetch("data/patents.json")
  .then((response) => {
    if (!response.ok) throw new Error("Patent data failed to load");
    return response.json();
  })
  .then(renderPatents)
  .catch(() => {
    document.getElementById("patents-list").innerHTML = '<p class="empty-state">暂无记录。</p>';
  });
