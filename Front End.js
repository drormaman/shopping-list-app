const productList = document.getElementById('productList');
const inputNameProduct = document.getElementById('inputNameProduct');
const inputPriceProduct = document.getElementById('inputPriceProduct');
const addItemButton = document.getElementById('addItemButton');
const returnStatus = document.getElementById('statusAction');
const inputSearchProduct = document.getElementById('inputSearchProduct');
const showMyCart = document.getElementById('showMyCart');
const createDivStatus = document.createElement('div');
const createDiv = document.createElement('div');

function capitalize(string) {
    if (typeof string === typeof "") {
        let newString = string.charAt(0).toUpperCase() + string.slice(1);
        return newString;
    } else {
        return string;
    };
};

function addChild(parent, className, text, child, id) {
    parent.appendChild(child);
    child.className = className;
    child.id = id;
    child.textContent = capitalize(text);
    return child;
};

function removeAllChildren(parent) {
    while (parent.hasChildNodes()) {
        parent.removeChild(parent.firstChild);
    };
};

async function getProducts() {
    removeAllChildren(productList);
    const response = await axios.get('http://localhost:3000/products')
    const resData = await response.data
        //let x = axios.get('http://localhost:3000/products').then(response => response.data);
    return resData
};

// function getProduct(id) {
//     removeAllChildren(productList);
//     let product = axios.get('http://localhost:3000/products' + `/${id}`).then(response => response.data);
//     return product;
// };

function postProduct(obj) {
    return axios.post('http://localhost:3000/products', obj)
        .then(response => response.data);
};

function deleteProduct(id) {
    return axios.delete(`http://localhost:3000/products/${id}`)
        .then(response => response.data);
};

function editProduct(id, obj) {
    return axios.put(`http://localhost:3000/products/${id}`, obj)
        .then(response => response.data);
};

async function addNewProduct() {
    if (inputNameProduct.value !== "" && inputPriceProduct.value !== "") {
        removeAllChildren(productList)
        const product = {
            productName: inputNameProduct.value,
            price: inputPriceProduct.value
        };
        const returnPostedPruduct = await postProduct(product);
        const createRow = document.createElement('li');
        const createNameCell = document.createElement('li');
        const createPriceCell = document.createElement('span');
        addChild(returnStatus, "returnStatus", returnPostedPruduct.productName + " Was Added", createDivStatus);
        addChild(productList, "product", null, createRow, returnPostedPruduct.id);
        addChild(createRow, "productName", `${returnPostedPruduct.productName}`, createNameCell);
        addChild(createRow, "productPrice", `${returnPostedPruduct.price}$`, createPriceCell)
        inputPriceProduct.value = "";
        inputNameProduct.value = "";
        inputSearchProduct.value = "";
        inputNameProduct.focus();
    } else {
        alert('require name + price')
    }
};

function printItemsList(ProductLists) {
    ProductLists.forEach(product => {
        const createRow = document.createElement('li');
        const createNameCell = document.createElement('li');
        const createPriceCell = document.createElement('span');
        addChild(productList, "product", null, createRow, product.id);
        addChild(createRow, "productName", `${product.productName}`, createNameCell);
        addChild(createRow, "productPrice", `${product.price}$`, createPriceCell)
        const createEditButton = document.createElement('button');
        addChild(createRow, "editButton", null, createEditButton);
        createEditButton.onclick = async() => {
            const editedProductName = prompt("Please enter new name", product.productName);
            switch (editedProductName) {
                case null:
                    return
            };
            const editedProductPrice = prompt("Please enter new price", product.price);
            switch (editedProductPrice) {
                case null:
                    return
            };
            const newEditedproduct = {
                productName: editedProductName,
                price: editedProductPrice
            };
            const returnEditProduct = await editProduct(product.id, newEditedproduct);
            addChild(returnStatus, "returnStatus", returnEditProduct.productName + " Was Edited", createDivStatus);
            const returnProductList = await getProducts();
            printItemsList(returnProductList);
            inputNameProduct.focus();
            inputSearchProduct.value = "";

        };
        const createDeleteButton = document.createElement('button');
        addChild(createRow, "deleteButton", null, createDeleteButton);
        createDeleteButton.onclick = async() => {
            const returnDeleteProduct = await deleteProduct(product.id);
            addChild(returnStatus, "returnStatus", returnDeleteProduct, createDivStatus);
            const returnProductList = await getProducts();
            printItemsList(returnProductList);
            inputNameProduct.focus();
            inputSearchProduct.value = "";
        };

    });
    totalProductAmount(ProductLists);
};

async function searchProduct() {
    createDivStatus.remove()
    const returnProductList = await getProducts();
    let resaultsSearch = [];
    returnProductList.forEach(product => {
        let lowerCaseName = product.productName.toLowerCase();
        if (lowerCaseName.includes(inputSearchProduct.value.toLowerCase()) || product.pric.includes(inputSearchProduct.value.toLowerCase())) {
            resaultsSearch.push(product);
        };
    });
    removeAllChildren(productList);
    printItemsList(resaultsSearch);
};

async function showMyCartList() {
    createDivStatus.remove()
    const returnProductList = await getProducts();
    printItemsList(returnProductList);
};

function totalProductAmount(returnProductList) {
    let totalProductsAmount = 0;
    returnProductList.forEach(product => {
        totalProductsAmount += parseInt(product.price);
    });
    addChild(productList, "totalAmount", "total amount: " + totalProductsAmount + "$" + ` ,  ${returnProductList.length} Products`, createDiv);
};

window.onload = showMyCartList();
addItemButton.addEventListener("click", addNewProduct);
inputSearchProduct.addEventListener("keyup", searchProduct);
showMyCart.addEventListener("click", showMyCartList);