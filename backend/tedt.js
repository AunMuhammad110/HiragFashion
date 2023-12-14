const products =[{id:"1",name:"miiz "},{id:"2",name:"asudsa"}];
const quantity=[1,2];

const productsWithQuantity = products.map((product, index) => ({
    ...product,
    quantity: quantity[index]
  }));
// for (let i=0;i<products.size;i++){
//     products[i].("quantity")=quantity[i];
//   }
  console.log(productsWith);