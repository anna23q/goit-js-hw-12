import axios from 'axios';

export const fetchPhotosByQuery = (searchQuery, currentPage) => {

    const axiosParams = {
        params: {
            key: "48425996-443ae7ea34c7b13ee27a488e8",
            q: searchQuery,
            page: currentPage,
            per_page: 15,
            image_type: 'photo',
            orientation: 'horizontal',
            safesearch: true,
        }
    }

    return axios.get(`https://pixabay.com/api/`, axiosParams);
}
