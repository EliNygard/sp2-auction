import "./listing-card-component.ts";
import api from "../../api/instance.ts";
import { Bid, Listing, Profile } from "../types/types.ts";
import { onUpdate } from "../ui/auth/update.ts";

class UserCard extends HTMLElement {
  constructor() {
    super();
  }

  async connectedCallback() {
    const userName = this.getAttribute("user-name");

    if (userName) {
      try {
        const userData: Profile = await api.profiles.singleProfile(userName);

        this.render(userData);
        this.attachEventListeners();

        const myItemsBtn = this.querySelector("#myItemsBtn") as HTMLElement;
        myItemsBtn?.click();
      } catch (error) {
        console.error(error);
        this.render(null);
      }
    }
  }

  render(userData: Profile | null) {
    if (userData) {
      this.innerHTML = `
        <div class="hidden w-full" id="updateImageContainer">
          <div class="bg-white max-w-4xl m-auto p-8 z-50 flex flex-col">
            <button class="inline-flex justify-end mt-4 md:mt-9 md:mr-6" id="closeButton">
              <span class="fa-solid fa-x text-2xl"></span>
            </button>
            <form class="font-body text-base md:text-lg flex flex-col gap-1 max-w-2xl my-12" name="updateImage" action="#">
              <label for="profileImg" class="mt-2">Update your profile image</label>
              <input class="form-input mb-2" type="text" id="profileImg" name="profileImg" />
              <button class="btn btn-auth btn-big mt-6" type="submit">Update</button>
            </form>
          </div>
        </div>
        
        <div class="mx-auto">
          <div class="max-w-4xl mx-auto px-6 mt-14">
            <section class="flex">
              <button id="profileImage" class="w-24 h-32" title="Edit your profile image">
                <img class="rounded-md h-full object-cover hover:object-contain" src="${userData.avatar?.url}" alt="">
              </button>
              <div class="font-body ml-4 flex flex-col items-start">
                <h1 class="text-2xl mb-5">${userData.name}</h1>
                <div class="flex flex-col items-center text-sm">
                  <p>${userData.credits}</p>
                  <p>credits</p>
                </div>
              </div>
            </section>
        
            <div class="my-9">
              <button id="logout" class="btn btn:hover btn-accent:hover btn-accent active:bg-accent-default px-3 py-2 text-brand-dark text-xs">Log out</button>
            </div>
  
            <header class="font-body text-base md:text-lg flex justify-between max-w-sm">
              <button id="myItemsBtn" class="tab-btn">My items</button>
              <button id="myWinsBtn" class="tab-btn">My wins</button>
              <button id="myBidsBtn" class="tab-btn">My bids</button>
            </header>

          </div>

          <div class="bg-brand-default">
            <div id="itemsContainer" class="max-w-4xl py-8 px-6 mt-4 m-auto grid gap-3 justify-center grid-cols-1 md:grid-cols-2 lg:grid-cols-3 items-stretch"></div>
          </div>
      
        </div>
        `;
    } else {
      this.innerHTML = `
          <p>Failed to load user data</p>
          `;
    }
    const itemsContainer = this.querySelector<HTMLElement>("#itemsContainer");
    const myListings = userData?.listings;
    console.log(myListings);

    myListings?.forEach((listing: Listing) => {
      const listingCard = document.createElement("listing-card-component");
      listingCard.setAttribute("data-listing", JSON.stringify(listing));
      itemsContainer?.appendChild(listingCard);
    });

    const myWins = userData?.wins;
    console.log(myWins);
  }

  attachEventListeners() {
    const logoutBtn = this.querySelector("#logout");
    logoutBtn?.addEventListener("click", () => {
      api.auth.logout();
    });

    // const body = document.querySelector("body");

    const updateImageContainer = this.querySelector<HTMLElement>("#updateImageContainer");
    const profileImageBtn = this.querySelector<HTMLButtonElement>("#profileImage");
    profileImageBtn?.addEventListener("click", () => {
      updateImageContainer?.classList.toggle("hidden");
      updateImageContainer?.classList.toggle("absolute");
    });

    const closeButton = this.querySelector("#closeButton");
    closeButton?.addEventListener("click", () => {
      updateImageContainer?.classList.toggle("hidden");
      updateImageContainer?.classList.toggle("absolute");
    });

    const updateForm = this.querySelector<HTMLFormElement>("form[name='updateImage']");
    if (updateForm) {
      updateForm.onsubmit = (event) => {
        event.preventDefault();
        onUpdate(event);
      };
    }

    const itemsContainer = this.querySelector<HTMLElement>("#itemsContainer");
    const headerButtons = this.querySelectorAll(".tab-btn");

    headerButtons.forEach((button) => {
      button.addEventListener("click", () => {
        
        headerButtons.forEach((btn) => btn.classList.remove("active"));
        button.classList.add("active");

        if (!itemsContainer) return;

        itemsContainer.innerHTML = "";
        const userName = this.getAttribute("user-name");
        if (!userName) return;

        if (button.id === "myItemsBtn") {
          api.profiles.singleProfile(userName).then((userData: Profile) => {
            userData.listings?.forEach((listing: Listing) => {
              console.log(listing);

              const listingCard = document.createElement("listing-card-component");
              listingCard.setAttribute("data-listing", JSON.stringify(listing));
              itemsContainer?.appendChild(listingCard);
            });
            if (!userData.listings?.length) {
              itemsContainer.innerHTML = `
              <p>You have no Bidlets yet. Create one today!
              <a class="underline" href="./create">Create a new Bidlet</a>
              </p>
              `;
            }
          });
        } else if (button.id === "myWinsBtn") {
          api.profiles.singleProfile(userName).then((userData: Profile) => {
            userData.wins?.forEach((win: Listing) => {
              console.log(win);
              
              const listingCard = document.createElement("listing-card-component");
              listingCard.setAttribute("data-listing", JSON.stringify(win));
              itemsContainer?.appendChild(listingCard);
            });
            if (!userData.wins?.length) {
              itemsContainer.innerHTML = `
              <p>You have no wins yet. Start bidding on your favorite Bidlets!
              <a class="underline" href="./">Find a new Bidlet</a>
              </p>
              `;
            }
          });
        } else if (button.id === "myBidsBtn") {
          api.profiles.bidsByProfile(userName).then((bids: Bid[]) => {
            bids.forEach((bid: Bid) => {
              const listingCard = document.createElement("listing-card-component");
              listingCard.setAttribute("data-listing", JSON.stringify(bid.listing));
              itemsContainer?.appendChild(listingCard);
            });
          });
        }
      });
    });
  }
}

customElements.define("user-card-component", UserCard);
export default UserCard;
