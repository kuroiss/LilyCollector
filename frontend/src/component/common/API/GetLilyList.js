import fetchApi from "./FetchApi";

const getLilyList = async () => {
    return fetchApi(
        "/api/get_lily_list"
    );
};

export default getLilyList;
