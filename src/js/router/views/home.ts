import "../../components/header-component.ts";
import "../../components/footer-component.ts";
import "../../components/listing-card-component.ts";
import api from "../../../api/instance.ts";
import { showLoader } from "../../utilities/showLoader.ts";
import { hideLoader } from "../../utilities/hideLoader.ts";
import { Listing, Meta } from "../../types/types.ts";

async function initializePage(): Promise<void> {
  const page = document.getElementById("app");
  if (page) {
    showLoader(page);

    try {
      const header = document.createElement("header-component");
      const main = document.createElement("main");
      const footer = document.createElement("footer-component");

      const heading = document.createElement("h1");
      heading.textContent = "Browse Active and All Bidlets";
      heading.className = "sr-only";
      heading.id = "bidletsHeading";

      const listingsHeader = document.createElement("div");
      listingsHeader.className =
        "max-w-7xl mx-auto px-5 mt-9 flex justify-between md:justify-start md:gap-8 lg:gap-12 font-heading text-base tracking-[.11em] md:text-xl tracking-widest";
      const activeBidletsBtn = document.createElement("button");
      activeBidletsBtn.textContent = "Active Bidlets";
      activeBidletsBtn.className = "tab-btn active";
      activeBidletsBtn.id = "activeBidlets";
      activeBidletsBtn.setAttribute("aria-labelledby", "bidletsHeading");
      const allBidletsBtn = document.createElement("button");
      allBidletsBtn.textContent = "All Bidlets";
      allBidletsBtn.className = "tab-btn";
      allBidletsBtn.id = "allBidlets";
      allBidletsBtn.setAttribute("aria-labelledby", "bidletsHeading");
      listingsHeader.append(activeBidletsBtn, allBidletsBtn);

      const bgListingsSection = document.createElement("div");
      bgListingsSection.className = "bg-brand-default";
      const listingsSection = document.createElement("div");
      listingsSection.className =
        "max-w-7xl py-8 px-5 mt-4 m-auto grid gap-3 justify-center grid-cols-1 md:grid-cols-2 lg:grid-cols-3 items-stretch";

      const listings = await api.listings.readAll("&_active=true&sort=created&sortOrder=desc&limit=12&page=1");

      const paginationControls = document.createElement("div");
      paginationControls.id = "paginationControls";
      paginationControls.className = "flex justify-center items-center gap-20 max-w-md mx-auto pt-6 pb-6";

      const prevBtn = document.createElement("button");
      prevBtn.id = "prevBtn";
      prevBtn.ariaLabel = "Go to previous page of listings";
      prevBtn.className = "disabled:text-gray-500 pointer";
      const prevIcon = document.createElement("span");
      prevIcon.setAttribute("aria-hidden", "true");
      prevIcon.className = "fa-solid fa-chevron-left text-xl md:text-2xl";
      prevBtn.appendChild(prevIcon);
      const pageInfo = document.createElement("span");
      pageInfo.textContent = "";
      pageInfo.id = "pageInfo";
      pageInfo.className = "font-body text-sm md:text-base";
      const nextBtn = document.createElement("button");
      nextBtn.id = "nextBtn";
      nextBtn.ariaLabel = "Go to next page of listings";
      nextBtn.className = "disabled:text-gray-500 pointer";
      const nextIcon = document.createElement("span");
      nextIcon.setAttribute("aria-hidden", "true");
      nextIcon.className = "fa-solid fa-chevron-right text-xl md:text-2xl";
      nextBtn.appendChild(nextIcon);

      paginationControls.append(prevBtn, pageInfo, nextBtn);

      listings.data.forEach((listing: Listing) => {
        const listingCard = document.createElement("listing-card-component");
        listingCard.setAttribute("data-listing", JSON.stringify(listing));
        listingsSection.appendChild(listingCard);
      });

      bgListingsSection.append(listingsSection, paginationControls);
      main.append(heading, listingsHeader, bgListingsSection);
      page.append(header, main, footer);

      const listingsHeaderButtons = document.querySelectorAll(".tab-btn");
      listingsHeaderButtons.forEach((button) => {
        button.addEventListener("click", async () => {
          listingsHeaderButtons.forEach((btn) => btn.classList.remove("active"));
          button.classList.add("active");

          if (!listingsSection) return;

          listingsSection.innerHTML = "";

          if (button.id === "activeBidlets") {
            bgListingsSection.innerHTML = ""
            showLoader(bgListingsSection)

            try {
              const listings = await api.listings.readAll("&_active=true&sort=created&sortOrder=desc&limit=12&page=1");
              listings.data.forEach((listing: Listing) => {
                const listingCard = document.createElement("listing-card-component");
                listingCard.setAttribute("data-listing", JSON.stringify(listing));
                listingsSection.appendChild(listingCard);
              });
              bgListingsSection.append(listingsSection, paginationControls)
              updatePaginationControls(listings.meta)
            } catch (error) {
              console.error(error);
              alert("Could not display active bidlets")
            } finally {
              hideLoader(bgListingsSection)
            }
          } else if (button.id === "allBidlets") {
            bgListingsSection.innerHTML = ""
            showLoader(bgListingsSection)

            try {
              const listings = await api.listings.readAll("&sort=created&sortOrder=desc&limit=12&page=1");
              listings.data.forEach((listing: Listing) => {
                const listingCard = document.createElement("listing-card-component");
                listingCard.setAttribute("data-listing", JSON.stringify(listing));
                listingsSection.appendChild(listingCard);
              });
              bgListingsSection.append(listingsSection, paginationControls)
              updatePaginationControls(listings.meta)
            } catch (error) {
              console.error(error);
              alert("Could not display all bidlets")
            } finally {
              hideLoader(bgListingsSection)
            }
          }
        });
      });

      function updatePaginationControls(meta: Meta) {
        const prevBtn = document.getElementById("prevBtn") as HTMLButtonElement;
        const nextBtn = document.getElementById("nextBtn") as HTMLButtonElement;
        const pageInfo = document.getElementById("pageInfo");

        if (prevBtn && nextBtn && pageInfo) {
          prevBtn.disabled = meta.isFirstPage;
          nextBtn.disabled = meta.isLastPage;
          pageInfo.textContent = `Page ${meta.currentPage} of ${meta.pageCount}`;
        }
      }
      updatePaginationControls(listings.meta);

      nextBtn.addEventListener("click", async () => {
        const nextPage = api.meta.nextPage;

        listingsSection.innerHTML = "";
        bgListingsSection.innerHTML = "";
        showLoader(bgListingsSection);
        window.scrollTo(0, 0);

        try {
          const listings = await api.listings.readAll(
            `&_active=true&sort=created&sortOrder=desc&limit=12&page=${nextPage}`,
          );
          listings.data.forEach((listing: Listing) => {
            const listingCard = document.createElement("listing-card-component");
            listingCard.setAttribute("data-listing", JSON.stringify(listing));
            listingsSection.appendChild(listingCard);
          });
          bgListingsSection.append(listingsSection, paginationControls);

          updatePaginationControls(listings.meta);
        } catch (error) {
          console.error(error);
          alert("Could not display next page");
        } finally {
          hideLoader(bgListingsSection);
        }
      });

      prevBtn.addEventListener("click", async () => {
        const prevPage = api.meta.previousPage;

        listingsSection.innerHTML = "";
        bgListingsSection.innerHTML = "";
        showLoader(bgListingsSection);
        window.scrollTo(0, 0);

        try {
          const listings = await api.listings.readAll(
            `&_active=true&sort=created&sortOrder=desc&limit=12&page=${prevPage}`,
          );
          listings.data.forEach((listing: Listing) => {
            const listingCard = document.createElement("listing-card-component");
            listingCard.setAttribute("data-listing", JSON.stringify(listing));
            listingsSection.appendChild(listingCard);
          });
          bgListingsSection.append(listingsSection, paginationControls);

          updatePaginationControls(listings.meta);
        } catch (error) {
          console.error(error);
          alert("Could not display next page");
        } finally {
          hideLoader(bgListingsSection);
        }
      });
    } catch (error) {
      console.error(error);
    } finally {
      hideLoader(page);
    }
  } else {
    console.error("Could not display page");
  }
}

initializePage();
