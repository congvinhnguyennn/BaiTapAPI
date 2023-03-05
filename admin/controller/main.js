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
                        <button class="btn btn-info" onclick="selectProduct('${product.id}')" data-target="#myModal" data-toggle="modal">Sửa</button>
                    </td>
                </tr>
            `
        );
    }, "");
    getEle("#tableDanhSach").innerHTML = html;
}

function checkValidateForm(){
        isValid = true;
        let name = getEle("#name").value,
            price = getEle("#price").value,
            photo = getEle("#photo").value,
            desc = getEle("#desc").value,
            type = getEle("#type").value;
    
        // Name
        if(name === ""){
            isValid = false;
            getEle("#name").style.borderColor = "red";
            getEle("#tbName").innerHTML = "Không được để trống";
            getEle("#tbName").style.display = "block";
        }
    
        // Price
        if(price === ""){
            isValid = false;
            getEle("#price").style.borderColor = "red";
            getEle("#tbPrice").innerHTML = "Không được để trống";
            getEle("#tbPrice").style.display = "block";
    
        }else if(!isNumber(price)){
            isValid = false;
            getEle("#price").style.borderColor = "red";
            getEle("#tbPrice").innerHTML = "Giá tiền phải là số";
            getEle("#tbPrice").style.display = "block";
        }
    
        // Photo
        if(photo === ""){
            isValid = false;
            getEle("#photo").style.borderColor = "red";
            getEle("#tbPhoto").innerHTML = "Không được để trống";
            getEle("#tbPhoto").style.display = "block";
        }
    
        // Desc
        if(desc === ""){
            isValid = false;
            getEle("#desc").style.borderColor = "red";
            getEle("#tbDesc").innerHTML = "Không được để trống";
            getEle("#tbDesc").style.display = "block";
        }
    
        // Type
        if(type === "Select brand"){
            isValid = false;
            getEle("#type").style.borderColor = "red";
            getEle("#tbType").innerHTML = "Không được để trống";
            getEle("#tbType").style.display = "block";
        }
    
        return isValid;
}

function addProduct(){
    const product = {
        name: getEle("#name").value,
        price: getEle("#price").value,
        photo: getEle("#photo").value,
        desc: getEle("#desc").value,
        type: getEle("#type").value,
    }

    checkValidateForm() ? apiAddProducts(product).then(response => {
        getProductFromAPI();
        alert("Thêm sản phẩm thành công");
    }).catch(error => {
        alert("Thêm sản phẩm thất bại");
    }) : alert("Thông tin sản phẩm không được để trống");
}

function deleteProduct(productId){
    apiDeleteProduct(productId).then(() => {
        getProductFromAPI();
        alert("Xóa sản phẩm thành công");
    }).catch((error) => {
        alert("Xóa sản phẩm thất bại");
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
        alert("Chọn sản phẩm thất bại");
    })

    getEle("#header-title").innerHTML = "Sửa thông tin sản phẩm";
    getEle(".modal-footer").innerHTML = `
    <button class="btn btn-primary" onclick="updateProduct('${productId}')">Cập nhật</button>
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
        alert("Cập nhật thành công")
    }).catch(() => {
        alert('Cập nhật thất bại');
    });
}

// ============ Đổi tên modal khi ấn thêm sản phẩm ===============
getEle("#btnThem").addEventListener("click", () => {
    getEle("#header-title").innerHTML = "Thêm sản phẩm";
    getEle(".modal-footer").innerHTML = `
        <button class="btn btn-primary" onclick="addProduct()">Thêm</button>
        <button class="btn btn-secondary" data-dismiss="modal">Huỷ</button>
    `;

    getEle("#name").value = "";
    getEle("#price").value = "";
    getEle("#photo").value = "";
    getEle("#desc").value = "";
    getEle("#type").value = "Select brand";
  });

// ============ Tìm kiếm sản phẩm ===============   
getEle("#searchName").addEventListener("keyup", () => {
    const searchValue = getEle("#searchName").value;
    apiProducts(searchValue).then((response) => {
        const products = response.data.map((product) => {
            return new Product(product.id, product.name, product.price, product.photo, product.desc, product.type);
        });
        renderProduct(products);
    }).catch((error) => {
        alert("Thất bại");
    });
});

// Sorting Product Price
// let isAscending = false;
 
// getEle("#sortValue").addEventListener("click", () => {
//     if(isAscending){
//         getEle("#SapXepGiam1").style.display = "none";
//     } else {
//         getEle("#SapXepGiam1").style.display = "inline-block";
//     }
    
//     if(!isAscending){
//         getEle("#SapXepTang1").style.display = "none";
//     } else {
//         getEle("#SapXepTang1").style.display = "inline-block";
//     }

//     var sortValue = getEle("#sortValue").value;
//     apiProducts(null, sortValue).then((response) => {
//         var products = response.data.sort((a, b) => (isAscending ? a.price - b.price : b.price - a.price)) //ternary operator using variable determined earlier
//             .map((product) => {
//                 return new Product(product.id, product.name, product.price, product.photo, product.desc, product.type);
//             });
//         renderProduct(products);
//         isAscending = !isAscending;           //update the value of isAscending after each call
//     }).catch((error) => {
//         alert("Thất bại");
//     });
// });




getEle("#sortValue").addEventListener("click", () => {
    const isDescending = getEle("#SapXepGiam1").style.display === "none"; 
    getEle("#SapXepGiam1").style.display = isDescending ? "inline-block" : "none"; 
    getEle("#SapXepTang1").style.display = !isDescending ? "inline-block" : "none";

    var sortValue = getEle("#sortValue").value;
    apiProducts(null, sortValue).then((response) => {
        var products = response.data.sort((a, b) => (isDescending ? b.price - a.price : a.price - b.price))
            .map((product) => {
                return new Product(product.id, product.name, product.price, product.photo, product.desc, product.type);
            });
        renderProduct(products);
    }).catch((error) => {
        alert("Thất bại");
    });
});




// Helper
function getEle(selector){
    return document.querySelector(selector);
}

