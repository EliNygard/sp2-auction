class ItemPageComponent extends HTMLElement {
    constructor() {
        super()
    }

    connectedCallback() {
        this.innerHTML = `
        <section class="flex flex-col m-auto my-6 px-4 max-w-xl">
      <!-- <div class="flex justify-end">
        <span class="fa-solid fa-ellipsis-vertical"></span>
      </div> -->
      <div class="">
        <img class="max-w-full max-h-full object-contain" src="" alt="" />
        <ul id="carousel"></ul>
      </div>

      <div class="flex justify-center gap-12 mt-4">
        <button aria-label="Previous button" id="prev-button" class="">
          <span aria-hidden="true" class="fa-solid fa-chevron-left"></span>
        </button>
        <button aria-label="Next button" id="next-button" class="">
          <span aria-hidden="true" class="fa-solid fa-chevron-right"></span>
        </button>
      </div>

      <div class="mb-6 mt-8">
        <div class="mb-6">
          <p
            class="font-heading uppercase text-xs md:text-sm text-brand-dark bg-brand-default hover:bg-accent-default rounded inline-flex px-1 py-1"
          >
            Interior &amp; Furniture
          </p>
        </div>
        <div>
          <h1 class="font-heading text-2xl md:text-3xl mb-2">Comfortable blue chair</h1>
          <a href="">
            <p class="font-body text-sm md:text-base mb-5">Eli Nygård</p>
          </a>
          <p class="font-body text-base md:text-lg mb-4">Current bid: 600 kr</p>
          <p class="font-body text-sm md:text-base mb-1">Time left: 10 days 21 hours 38 min</p>
          <p class="font-body text-sm md:text-base">Ends at 23 December 2024, 19:30</p>
        </div>
      </div>

      <form class="flex flex-col gap-4" action="" name="bid">
        <label class="hidden" for="bid">Add your bid</label>
        <input
          class="form-input max-w-max70"
          type="text"
          name="bid-amount"
          pattern="\\d+(.\\d+)?"
          title="Please enter a valid number."
          required
        />

        <button class="btn btn-big">Place your bid</button>
      </form>

      <section class="mt-12">
        <h2 class="font-heading text-xl md:text-2xl mb-2">Description</h2>
        <p class="font-body text-base md:text-lg">
          Lorem ipsum dolor sit amet consectetur. Ut suspendisse aliquam quam penatibus. Magnis vulputate pellentesque
          feugiat lacus consectetur nibh.
        </p>
      </section>

      <section class="mt-12 mr-10 flex flex-col gap-4 max-w-60">
        <h2 class="font-heading text-xl md:text-2xl">All bids (2)</h2>
        <div class="flex flex-row justify-between">
          <p class="font-body text-base md:text-lg">28.12.2024 - 14:20</p>
          <p class="font-body text-base md:text-lg">2000 kr</p>
        </div>
      </section>
    </section>
        `
    }
}

customElements.define("-item-page-component", ItemPageComponent)

export default ItemPageComponent