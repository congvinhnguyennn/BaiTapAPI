const baseURL = "https://63f643b459c944921f70c150.mockapi.io/products";

function apiProducts(){
    return axios({
        url: `${baseURL}`,
        method: "GET",
    });
}

function apiAddProducts(product){
    return axios({
        url: `${baseURL}`,
        method: "POST",
        data: product,
    });
}

function apiDeleteProduct(productId){
    return axios({
        url: `${baseURL}/${productId}`,
        method: "DELETE",
    });
}

function apiGetProductById(productId){
    return axios({
        url: `${baseURL}/${productId}`,
        method: "GET",
    });
}

function apiUpdateProduct(productId, product) {
    return axios({
        url: `${baseURL}/${productId}`,
        method: "PUT",
        data: product,
    });
}
