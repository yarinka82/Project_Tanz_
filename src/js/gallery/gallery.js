import { photos } from "../data/slaider";


 let page = 1;
const perPage = 9;

const gallery = document.getElementById("gallery");
let visible = [];
let currentIndex = 0;
export const getVisible = () => visible;

export function renderGallery() {
  if (!gallery) return false;
 
  const start = (page - 1) * perPage;
  const end = start + perPage;

  const newPhotos = photos.slice(start, end);

  if (newPhotos.length === 0) return false;
    page++;
  visible.push(...newPhotos);
  console.log("🚀 ~ renderGallery ~ visible:", visible)

  const newPhotosHtml = newPhotos
    .map((p) => {
      return `<li class="gallery-item slide">
        <img src="${p.image}" alt="${p.name}" />
        </li>`;
    })
    .join("");

  gallery.insertAdjacentHTML("beforeend", newPhotosHtml);

  return true;
}



