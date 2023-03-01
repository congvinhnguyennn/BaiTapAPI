getProductFromAPI()


function getProductFromAPI(){
    apiProducts().then((response) => {
        const products = response.data.map((product) => {
            return new Product(product.id, product.name, product.price, product.photo, product.desc, product.type);
        });
        renderProduct(products);
    }).catch((error) =>{
        alert("Thất bại");
    });
}

function renderProduct(products){
    let html = products.reduce((result, product, index) => {
        return ( result += `
                <tr>
                    <td>${index + 1}</td>
                    <td>${product.name}</td>
                    <td>${product.price}</td>
                    <td>
                        <img src="${product.photo}" width="100" height="100">
                    </td>
                    <td>${product.desc}</td>
                    <td>${product.type}</td>
                    <td>
                        <button class="btn btn-danger" onclick="deleteProduct('${product.id}')">Xóa</button>
                        <button class="btn btn-primary" onclick="selectProduct(${product.id})" data-target="#myModal" data-toggle="modal">Sửa</button>
                    </td>
                </tr>
            `
        );
    }, "");
    getEle("#tableDanhSach").innerHTML = html;
}

function addProduct(){
    const product = {
        name: getEle("#name").value,
        price: getEle("#price").value,
        photo: getEle("#photo").value,
        desc: getEle("#desc").value,
        type: getEle("#type").value,
    }
    apiAddProducts(product).then((response) => {
        getProductFromAPI();
    }).catch((error) => {
        alert("Thất bại");
    });
}



function deleteProduct(productId){
    apiDeleteProduct(productId).then(() => {
        getProductFromAPI();
    }).catch((error) => {
        alert("Thất bại");
    });
}


function selectProduct(productId){
    apiGetProductById(productId).then((response) => {
        const product = response.data;
        getEle("#name").value = product.name;
        getEle("#price").value = product.price;
        getEle("#photo").value = product.photo;
        getEle("#desc").value = product.desc;
        getEle("#type").value = product.type;
    }).catch((error) => {
        alert("Thất bại");
    })

    getEle("#header-title").innerHTML = "Sửa thông tin sản phẩm";
    getEle(".modal-footer").innerHTML = `
    <button class="btn btn-primary" onclick="updateProduct()">Cập nhật</button>
    <button class="btn btn-danger" data-dismiss="modal">Đóng</button>
    `
}


function updateProduct(productId) {
    const product = {
        name: getEle("#name").value,
        price: getEle("#price").value,
        photo: getEle("#photo").value,
        desc: getEle("#desc").value,
        type: getEle("#type").value, 
    };

    apiUpdateProduct(productId, product).then((response) => {
        getProductFromAPI();
    }).catch(() => {
        alert('Thất bại');
    });
}

// ============ Đổi tên modal khi ấn thêm sản phẩm ===============
getEle("#btnThem").addEventListener("click", () => {
    getEle("#header-title").innerHTML = "Thêm sản phẩm";
    getEle(".modal-footer").innerHTML = `
        <button class="btn btn-primary" onclick="addProduct()">Thêm sản phẩm</button>
        <button class="btn btn-secondary" data-dismiss="modal">Huỷ</button>
    `;

    getEle("#name").value = "";
    getEle("#price").value = "";
    getEle("#photo").value = "";
    getEle("#desc").value = "";
    getEle("#type").value = "Select brand";
  });

// Helper
function getEle(selector){
    return document.querySelector(selector);
}

