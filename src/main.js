import SimpleLightbox from "simplelightbox";
import iziToast from "izitoast";
import "izitoast/dist/css/iziToast.min.css";
import closeModalIcon from "/img/close-modal-btn.svg"
import { createGalleryCardTemplate, showLoader, hideLoader } from "/js/render-functions.js";
import { fetchPhotosByQuery } from "/js/pixabay-api.js"; 


const searchFormEl = document.querySelector('.js-search-form');
const galleryEl = document.querySelector(".js-gallery");
const loadMoreBtnEL = document.querySelector(".js-load-more-btn");

let gallery = new SimpleLightbox('.js-gallery a', { captionsData: 'alt', captionDelay: 250 });
const state = { searchQuery: '', page: 1 };

// let page = 1;
// let searchQuery = '';

const onSearchFormSubmit = async event => {
    try {
    event.preventDefault();
    
    state.searchQuery = event.currentTarget.elements.user_query.value.trim();

    if (state.searchQuery === "") {
        return iziToast.warning({
            message: 'The field is empty! Please enter a search query!',
            timeout: 2500,
            position: "topRight",
            backgroundColor: "#f0ad4e",
            messageColor: "#ffffff",
        });
        };

        state.page = 1;

        loadMoreBtnEL.classList.add('is-hidden');

        showLoader();
        
        const {data} = await fetchPhotosByQuery(state.searchQuery, state.page);

        if (data.total === 0) {
            iziToast.error({
                message: 'Sorry, there are no images matching your search query. Please try again!',
                timeout: 3500,
                position: "topRight",
                maxWidth: 432,
                titleColor: "#ffffff",
                messageColor: "#ffffff",
                backgroundColor: "#ef4040",
                close: false,
                closeIcon: true,
                closeIconColor: '#ffffff',
                closeOnEscape: true,
                closeOnClick: true,
                icon: 'font-icon',
                iconUrl: closeModalIcon,
            });
            galleryEl.innerHTML = "";

            searchFormEl.reset();

            return;
        }

        if (data.totalHits > 1) {
            loadMoreBtnEL.classList.remove('is-hidden');

            loadMoreBtnEL.addEventListener('click', onLoardMoreBtnClick);
        }

        galleryEl.innerHTML = data.hits.map(el => createGalleryCardTemplate(el)).join("");

        searchFormEl.reset();

        gallery.refresh();

    } catch (error) {
        console.log(error);
        iziToast.error({
            message: 'Something went wrong. Please try again later.',
            timeout: 3500,
            position: "topRight",
        });
    } finally {
        hideLoader();
    }
}

searchFormEl.addEventListener('submit', onSearchFormSubmit);

const onLoardMoreBtnClick = async event => {
    try {
        state.page++;

        const { data } = await fetchPhotosByQuery(state.searchQuery, state.page);
        
        const galleryTemplate = data.hits.map(el => createGalleryCardTemplate(el)).join("");

        galleryEl.insertAdjacentHTML('beforeend', galleryTemplate);

        const {height: cardHeight} = galleryEl.firstElementChild.getBoundingClientRect();

        window.scrollBy({
            top: cardHeight * 2,
            behavior: 'smooth',
        })

        const total = Math.ceil(data.totalHits / 15);
        
                if (state.page >= total || data.hits.length < 15) {
            loadMoreBtnEL.classList.add('is-hidden');

            loadMoreBtnEL.removeEventListener('click', onLoardMoreBtnClick);

                    iziToast.info({
                        message: `We're sorry, but you've reached the end of search results.`,
                        timeout: 3500,
                        position: "topRight",
                    });
        }

        // searchFormEl.reset();

        gallery.refresh();
    } catch (error) {
        console.log(error);
    iziToast.error({
        message: 'Something went wrong while loading more images. Please try again later.',
        timeout: 3500,
        position: "topRight",
    });
    }
}
