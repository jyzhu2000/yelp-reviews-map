// Initialize and add the map
let map;

async function initMap() {
  // Retrieve reviews 
  const API_URL = "http://localhost:4000";
  let data = [];
  try {
    const response = await fetch(`${API_URL}/reviews`, {
      method: 'GET'
    })
    data = await response.json();
  } catch (error) {
    console.log(error);
  }
  

  //@ts-ignore
  const { Map, InfoWindow } = await google.maps.importLibrary("maps");
  const { AdvancedMarkerElement } = await google.maps.importLibrary("marker");
  const startingPosition= { lat: 40.75075749242302, lng: -73.98678352499347 };

  map = new Map(document.getElementById("map"), {
    zoom: 10,
    center: startingPosition,
    mapId: "MAP_ID",
  });

  data.forEach(d => {
    const position = { lat: d.latitude, lng: d.longitude };

    // Create map marker for business
    const marker = new AdvancedMarkerElement({
      map: map,
      content: buildMarkerContent(),
      position: position
    });
    // Create info window 
    const infoWindow = new InfoWindow({
      content: buildInfoContent(d), 
      ariaLable: d.business
    });

    // Add mouseover 
    marker.addListener("click", () => {});
    let timeout;
    marker.content.addEventListener("mouseenter", () => {
      toggleHighlight(marker);
      timeout = setTimeout(() => {
        infoWindow.open({
          anchor: marker, 
          shouldFocus: false
        });
      }, 300);
    });
    marker.content.addEventListener("mouseleave", () => {
      toggleHighlight(marker);
      clearTimeout(timeout);
    });
    // Close info window after mousing away
    infoWindow.content.addEventListener("mouseleave", () => {
      infoWindow.close();
    });
  })
}

function toggleHighlight(marker) {
  if (marker.content.classList.contains("highlight")) {
    marker.content.classList.remove("highlight");
    marker.zIndex = null;
  } else {
    marker.content.classList.add("highlight");
    marker.zIndex = 1;
  }
}

function toggleInfoWindow(infoWindow) {

}

function buildMarkerContent() {
  const content = document.createElement("div");

  content.classList.add("business");
  content.innerHTML = `
    <div class="icon">
      <svg xmlns="http://www.w3.org/2000/svg" class="fa-yelp" viewBox="0 0 384 512"><!--!Font Awesome Free 6.5.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.--><path fill="currentColor" d="M42.9 240.3l99.6 48.6c19.2 9.4 16.2 37.5-4.5 42.7L30.5 358.5a22.8 22.8 0 0 1 -28.2-19.6 197.2 197.2 0 0 1 9-85.3 22.8 22.8 0 0 1 31.6-13.2zm44 239.3a199.5 199.5 0 0 0 79.4 32.1A22.8 22.8 0 0 0 192.9 490l3.9-110.8c.7-21.3-25.5-31.9-39.8-16.1l-74.2 82.4a22.8 22.8 0 0 0 4.1 34.1zm145.3-109.9l58.8 94a22.9 22.9 0 0 0 34 5.5 198.4 198.4 0 0 0 52.7-67.6A23 23 0 0 0 364.2 370l-105.4-34.3c-20.3-6.5-37.8 15.8-26.5 33.9zm148.3-132.2a197.4 197.4 0 0 0 -50.4-69.3 22.9 22.9 0 0 0 -34 4.4l-62 91.9c-11.9 17.7 4.7 40.6 25.2 34.7L366 268.6a23 23 0 0 0 14.6-31.2zM62.1 30.2a22.9 22.9 0 0 0 -9.9 32l104.1 180.4c11.7 20.2 42.6 11.9 42.6-11.4V22.9a22.7 22.7 0 0 0 -24.5-22.8 320.4 320.4 0 0 0 -112.3 30.1z"/></svg>
    </div>
  `;
  return content;
}

function buildInfoContent(review) {
  const content = document.createElement("div"); 
  const dateOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  };
  const date = new Date(Date.parse(review.date));

  content.classList.add("info"); 
  content.innerHTML = `
    <div class="section-title">
      <p class="title">${review.business}</p>
    </div>
    <div class="section-rating">
      <div class="rating">
        ${buildReviewSvg(review.rating)}
      </div>
      <div class="rating-date"> 
        ${date.toLocaleDateString('en-US', dateOptions)}
      </div>
    </div>
    <div class="section-review"> 
      <p class="review">${review.review}</p>
    </div>
  `
  return content;
}

function buildReviewSvg(rating) {
  const fullStar = `<div class="full star"><svg width="20" height="20" viewBox="0 0 20 20"><path fill="rgba(255,100,61,1)" opacity="1" d="M0 4C0 1.79086 1.79086 0 4 0H10V20H4C1.79086 20 0 18.2091 0 16V4Z"></path><path fill="rgba(255,100,61,1)" opacity="1" d="M20 4C20 1.79086 18.2091 0 16 0H10V20H16C18.2091 20 20 18.2091 20 16V4Z"></path><path fill="white" fill-rule="evenodd" clip-rule="evenodd" d="M10 13.3736L12.5949 14.7111C12.7378 14.7848 12.9006 14.8106 13.0593 14.7847C13.4681 14.718 13.7454 14.3325 13.6787 13.9237L13.2085 11.0425L15.2824 8.98796C15.3967 8.8748 15.4715 8.72792 15.4959 8.569C15.5588 8.15958 15.2779 7.77672 14.8685 7.71384L11.983 7.2707L10.6699 4.66338C10.5975 4.51978 10.481 4.40322 10.3374 4.33089C9.96742 4.14458 9.51648 4.29344 9.33017 4.66338L8.01705 7.2707L5.13157 7.71384C4.97265 7.73825 4.82577 7.81309 4.71261 7.92731C4.42109 8.22158 4.42332 8.69645 4.71759 8.98796L6.79152 11.0425L6.32131 13.9237C6.29541 14.0824 6.3212 14.2452 6.39486 14.3881C6.58464 14.7563 7.03696 14.9009 7.40514 14.7111L10 13.3736Z"></path></svg></div>`;
  const emptyStar = `<div class="empty star"><svg width="20" height="20" viewBox="0 0 20 20"><path fill="#BBBAC0" opacity="0.5" d="M0 4C0 1.79086 1.79086 0 4 0H10V20H4C1.79086 20 0 18.2091 0 16V4Z"></path><path fill="#BBBAC0" opacity="0.5" d="M20 4C20 1.79086 18.2091 0 16 0H10V20H16C18.2091 20 20 18.2091 20 16V4Z"></path><path fill="white" fill-rule="evenodd" clip-rule="evenodd" d="M10 13.3736L12.5949 14.7111C12.7378 14.7848 12.9006 14.8106 13.0593 14.7847C13.4681 14.718 13.7454 14.3325 13.6787 13.9237L13.2085 11.0425L15.2824 8.98796C15.3967 8.8748 15.4715 8.72792 15.4959 8.569C15.5588 8.15958 15.2779 7.77672 14.8685 7.71384L11.983 7.2707L10.6699 4.66338C10.5975 4.51978 10.481 4.40322 10.3374 4.33089C9.96742 4.14458 9.51648 4.29344 9.33017 4.66338L8.01705 7.2707L5.13157 7.71384C4.97265 7.73825 4.82577 7.81309 4.71261 7.92731C4.42109 8.22158 4.42332 8.69645 4.71759 8.98796L6.79152 11.0425L6.32131 13.9237C6.29541 14.0824 6.3212 14.2452 6.39486 14.3881C6.58464 14.7563 7.03696 14.9009 7.40514 14.7111L10 13.3736Z"></path></svg></div>`;

  let reviewSvg = ''; 
  for (let i=0; i<rating; i++) {
    reviewSvg += fullStar; 
  }
  for (let i=rating; i<5; i++) {
    reviewSvg += emptyStar; 
  }
  return reviewSvg;
} 

initMap();