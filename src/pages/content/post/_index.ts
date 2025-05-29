import type { WlDatabase } from "$lib/client/webslab/database";

const metaDescriptionEl = document
  .querySelector("meta[name='description']") as HTMLMetaElement;

const visitsElement = document
  .getElementById("content-visits") as HTMLSpanElement;

const wlDatabase = document.querySelector("wl-database") as WlDatabase;
const titleEl = document.querySelector("title") as HTMLTitleElement;
const imgEl = document.querySelector("#post-hero") as HTMLImageElement;
const h1El = document.querySelector("h1")!;

wlDatabase.addEventListener("wl-task:completed", (event: Event) => {
  const { result } = (event as CustomEvent).detail;

  visitsElement.textContent = result.visits || 0;
  titleEl.innerText = result.title;
  h1El.innerText = result.title;

  imgEl.style.viewTransitionName = `item-${result.slug}`;
  imgEl.alt = result.title;
  imgEl.src = result.hero;

  if (!metaDescriptionEl) {
    const metaDescription = document.createElement("meta");

    metaDescription.name = "description";
    metaDescription.content = result.description;

    document.head.appendChild(metaDescription);
  } else {
    metaDescriptionEl.content = result.description;
  }
});
