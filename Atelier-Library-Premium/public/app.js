const API = "/api/books";
const state = { books: [], view: "all", category: "", search: "", sort: "title", editingId: null };
const $ = (selector) => document.querySelector(selector);
const bookGrid = $("#bookGrid");
const modal = $("#bookModal");
let toastTimer;

function escapeHTML(value = "") {
  return String(value).replace(/[&<>"']/g, (char) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
  }[char]));
}
async function request(url, options = {}) {
  const response = await fetch(url, {
    ...options,
    headers: { ...(options.body ? { "Content-Type": "application/json" } : {}), ...(options.headers || {}) }
  });
  let result;
  try { result = await response.json(); } catch { result = {}; }
  if (!response.ok || result.success === false) {
    const message = result.errors?.join(", ") || result.message || `Request failed (${response.status})`;
    throw new Error(message);
  }
  return result;
}
function showToast(message) {
  const toast = $("#toast");
  toast.textContent = message;
  toast.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove("show"), 2600);
}
function showError(message) {
  const banner = $("#errorBanner");
  banner.textContent = message;
  banner.classList.remove("hidden");
}
function hideError() { $("#errorBanner").classList.add("hidden"); }

async function loadBooks() {
  hideError();
  bookGrid.innerHTML = '<div class="loading-state"><span class="loader"></span> Arranging your shelves...</div>';
  try {
    const result = await request(API);
    state.books = Array.isArray(result.data) ? result.data : [];
    render();
  } catch (error) {
    bookGrid.innerHTML = "";
    showError(`${error.message}. Make sure the server is running and try refreshing.`);
  }
}
function categories() {
  return [...new Set(state.books.map(book => book.category).filter(Boolean))].sort((a,b) => a.localeCompare(b));
}
function updateStats() {
  const available = state.books.filter(book => book.available === true).length;
  $("#totalStat").textContent = state.books.length.toString().padStart(2, "0");
  $("#availableStat").textContent = available.toString().padStart(2, "0");
  $("#borrowedStat").textContent = (state.books.length - available).toString().padStart(2, "0");
  $("#categoryStat").textContent = categories().length.toString().padStart(2, "0");
  $("#navAllCount").textContent = state.books.length.toString().padStart(2, "0");
  $("#footerCount").textContent = `${state.books.length} BOOKS · ${categories().length} CATEGORIES`;
}
function updateCategoryControls() {
  const cats = categories();
  const select = $("#categoryFilter");
  const selected = state.category;
  select.innerHTML = '<option value="">All categories</option>' + cats.map(c => `<option value="${escapeHTML(c)}">${escapeHTML(c)}</option>`).join("");
  select.value = cats.includes(selected) ? selected : "";
  state.category = select.value;
  $("#categoryNav").innerHTML = cats.map(c => `<button class="nav-link ${state.category === c && state.view === "all" ? "active" : ""}" data-category="${escapeHTML(c)}">${escapeHTML(c)}</button>`).join("");
  $("#categorySuggestions").innerHTML = cats.map(c => `<option value="${escapeHTML(c)}"></option>`).join("");
}
function getVisibleBooks() {
  let books = [...state.books];
  if (state.view === "available") books = books.filter(book => book.available === true);
  if (state.category) books = books.filter(book => book.category.toLowerCase() === state.category.toLowerCase());
  if (state.search.trim()) books = books.filter(book => book.title.toLowerCase().includes(state.search.trim().toLowerCase()));
  if (state.sort === "title") books.sort((a,b) => a.title.localeCompare(b.title));
  if (state.sort === "newest") books.sort((a,b) => b.publishedYear - a.publishedYear);
  if (state.sort === "oldest") books.sort((a,b) => a.publishedYear - b.publishedYear);
  return books;
}
function coverMarkup(book, index, detail = false) {
  const n = ((index % 6) + 1);
  const title = escapeHTML(book.title);
  const author = escapeHTML(book.author);
  return `<div class="${detail ? "detail-cover" : "book-cover"} cover-${n}"><div class="cover-book"><small>ATELIER EDITIONS</small><b>${title}</b><span class="cover-ornament">✳</span><small>${author}</small></div></div>`;
}
function render() {
  updateStats();
  updateCategoryControls();
  const books = getVisibleBooks();
  $("#resultCount").textContent = `Showing ${books.length} of ${state.books.length} ${state.books.length === 1 ? "book" : "books"}`;
  $("#emptyState").classList.toggle("hidden", books.length !== 0);
  bookGrid.classList.toggle("hidden", books.length === 0);
  bookGrid.innerHTML = books.map(book => {
    const index = state.books.findIndex(item => item.id === book.id);
    return `<article class="book-card">
      <div class="book-cover cover-${(index % 6) + 1}">
        <span class="availability-pill ${book.available ? "" : "borrowed"}">${book.available ? "Available" : "Borrowed"}</span>
        <div class="cover-book"><small>ATELIER EDITIONS</small><b>${escapeHTML(book.title)}</b><span class="cover-ornament">✳</span><small>${escapeHTML(book.author)}</small></div>
      </div>
      <div class="book-info">
        <div class="book-category">${escapeHTML(book.category)}</div>
        <h3 class="book-title" title="${escapeHTML(book.title)}">${escapeHTML(book.title)}</h3>
        <p class="book-author">by ${escapeHTML(book.author)}</p>
        <div class="book-meta"><span>${escapeHTML(book.publishedYear)}</span><div class="card-actions">
          <button class="mini-action" data-action="view" data-id="${book.id}" aria-label="View ${escapeHTML(book.title)}" title="View details">↗</button>
          <button class="mini-action" data-action="edit" data-id="${book.id}" aria-label="Edit ${escapeHTML(book.title)}" title="Edit">✎</button>
          <button class="mini-action" data-action="delete" data-id="${book.id}" aria-label="Delete ${escapeHTML(book.title)}" title="Delete">⌫</button>
        </div></div>
      </div></article>`;
  }).join("");
  $("#sectionTitle").innerHTML = state.view === "available" ? 'Available books<span class="heading-period">.</span>' : state.category ? `${escapeHTML(state.category)}<span class="heading-period">.</span>` : 'Your collection<span class="heading-period">.</span>';
  $("#sectionSubtitle").textContent = state.view === "available" ? "Books currently ready for their next reader." : "A curated overview of the books on your shelves.";
  $("#breadcrumbCurrent").textContent = state.view === "available" ? "Available books" : state.category || "Overview";
  document.querySelectorAll("[data-view]").forEach(button => button.classList.toggle("active", button.dataset.view === state.view && !state.category));
  document.querySelectorAll("[data-category]").forEach(button => button.classList.toggle("active", button.dataset.category === state.category));
}
function openModal(book = null) {
  state.editingId = book ? book.id : null;
  $("#modalTitle").innerHTML = book ? 'Edit book<span class="heading-period">.</span>' : 'Add a book<span class="heading-period">.</span>';
  $("#saveBookBtn").innerHTML = book ? 'Save changes <span>↗</span>' : 'Save book <span>↗</span>';
  $("#formError").classList.add("hidden");
  const form = $("#bookForm");
  form.reset();
  if (book) {
    form.elements.title.value = book.title;
    form.elements.author.value = book.author;
    form.elements.category.value = book.category;
    form.elements.publishedYear.value = book.publishedYear;
    form.elements.available.value = String(book.available);
  }
  modal.classList.remove("hidden");
  document.body.style.overflow = "hidden";
  setTimeout(() => form.elements.title.focus(), 50);
}
function closeModal() {
  modal.classList.add("hidden");
  document.body.style.overflow = "";
}
function openDetails(book) {
  const index = state.books.findIndex(item => item.id === book.id);
  $("#detailContent").innerHTML = `${coverMarkup(book, index, true)}
    <div class="eyebrow">${escapeHTML(book.category)}</div><h2 id="detailTitle">${escapeHTML(book.title)}</h2>
    <p class="detail-author">Written by ${escapeHTML(book.author)}</p>
    <div class="detail-list">
      <div class="detail-item"><small>Published</small><strong>${escapeHTML(book.publishedYear)}</strong></div>
      <div class="detail-item"><small>Availability</small><strong>${book.available ? "Available to borrow" : "Currently borrowed"}</strong></div>
      <div class="detail-item"><small>Catalogue ID</small><strong>#${escapeHTML(book.id)}</strong></div>
      <div class="detail-item"><small>Collection</small><strong>Atelier Library</strong></div>
    </div>`;
  $("#detailModal").classList.remove("hidden");
}
async function deleteBook(id) {
  const book = state.books.find(item => item.id === id);
  if (!book || !confirm(`Remove "${book.title}" from your collection?`)) return;
  try {
    await request(`${API}/${id}`, { method: "DELETE" });
    showToast("Book removed from your collection");
    await loadBooks();
  } catch (error) { showToast(error.message); }
}

$("#bookGrid").addEventListener("click", async event => {
  const button = event.target.closest("[data-action]");
  if (!button) return;
  const id = Number(button.dataset.id);
  const book = state.books.find(item => item.id === id);
  if (!book) return;
  if (button.dataset.action === "view") openDetails(book);
  if (button.dataset.action === "edit") openModal(book);
  if (button.dataset.action === "delete") await deleteBook(id);
});
$("#bookForm").addEventListener("submit", async event => {
  event.preventDefault();
  const form = event.currentTarget;
  const body = {
    title: form.elements.title.value.trim(),
    author: form.elements.author.value.trim(),
    category: form.elements.category.value.trim(),
    publishedYear: Number(form.elements.publishedYear.value),
    available: form.elements.available.value === "true"
  };
  const button = $("#saveBookBtn");
  button.disabled = true;
  button.textContent = "Saving...";
  try {
    if (state.editingId) await request(`${API}/${state.editingId}`, { method: "PUT", body: JSON.stringify(body) });
    else await request(API, { method: "POST", body: JSON.stringify(body) });
    closeModal();
    showToast(state.editingId ? "Book details updated" : "A new book joined your collection");
    await loadBooks();
  } catch (error) {
    $("#formError").textContent = error.message;
    $("#formError").classList.remove("hidden");
  } finally {
    button.disabled = false;
    button.innerHTML = state.editingId ? 'Save changes <span>↗</span>' : 'Save book <span>↗</span>';
  }
});
$("#addBookBtn").addEventListener("click", () => openModal());
$("#closeModal").addEventListener("click", closeModal);
$("#cancelModal").addEventListener("click", closeModal);
$("#closeDetail").addEventListener("click", () => $("#detailModal").classList.add("hidden"));
$("#bookModal").addEventListener("click", event => { if (event.target === modal) closeModal(); });
$("#detailModal").addEventListener("click", event => { if (event.target.id === "detailModal") $("#detailModal").classList.add("hidden"); });
document.addEventListener("keydown", event => {
  if (event.key === "Escape") { closeModal(); $("#detailModal").classList.add("hidden"); }
  if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") { event.preventDefault(); $("#searchInput").focus(); }
});
$("#searchInput").addEventListener("input", event => { state.search = event.target.value; render(); });
$("#categoryFilter").addEventListener("change", event => { state.category = event.target.value; state.view = "all"; render(); });
$("#sortFilter").addEventListener("change", event => { state.sort = event.target.value; render(); });
$("#clearFilters").addEventListener("click", clearFilters);
$("#emptyClear").addEventListener("click", clearFilters);
function clearFilters() {
  state.search = ""; state.category = ""; state.view = "all"; state.sort = "title";
  $("#searchInput").value = ""; $("#sortFilter").value = "title";
  render();
}
document.querySelectorAll("[data-view]").forEach(button => button.addEventListener("click", () => {
  state.view = button.dataset.view; state.category = ""; render();
}));
$("#categoryNav").addEventListener("click", event => {
  const button = event.target.closest("[data-category]");
  if (!button) return;
  state.view = "all"; state.category = button.dataset.category; render();
});
$("#mobileMenu").addEventListener("click", () => $("#sidebar").classList.toggle("open"));
document.addEventListener("click", event => {
  if (window.innerWidth <= 760 && !event.target.closest("#sidebar") && !event.target.closest("#mobileMenu")) $("#sidebar").classList.remove("open");
});
$("#todayLabel").textContent = new Intl.DateTimeFormat("en", { weekday: "short", month: "short", day: "numeric", year: "numeric" }).format(new Date());
loadBooks();
