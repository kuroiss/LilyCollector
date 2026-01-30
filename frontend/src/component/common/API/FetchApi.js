const fetchApi = async (url) => {
    try{
        const response = await fetch(url);
        // console.log("fetchApi response : ", await response.text());

        const data = await response.json();

        return data;
    } catch(error) {
        console.error("Failed to get data", error);
    }

};

export default fetchApi;
