const logout = document.getElementById('logout');
const deleteAll = document.getElementById('deleteAll');

/**** PRODUCTOS ****/
const findProd = document.getElementById('findProd')
const updateProd = document.getElementById('update');
const createProd = document.getElementById('create');
const deleteProd = document.getElementById('delete');
const prodForm = document.getElementById('prodForm');

/**** USUARIOS ****/
const findUser = document.getElementById('findUser');
const userForm = document.getElementById('userForm');
const updateUser = document.getElementById('updateUser');
const deleteUser = document.getElementById('deleteUser');

let prodUpdate = [];
let userUpdate = [];

logout.addEventListener('click', e => {
    e.preventDefault();
    fetch('/api/users/logout', {
        method: 'GET',
    }).then(result => {
        if (result.status === 200) {
            alert('Sesion cerrada');
            window.location.replace('/users/login');
        }
    })
})

/**** LOGICA DE PRODUCTOS ****/
findProd.addEventListener('submit', funcFindProd);
deleteProd.addEventListener('click', delprod);
updateProd.addEventListener('click', updProd);
createProd.addEventListener('click', crtProd);

async function funcFindProd(e) {
    prodUpdate.splice(0, prodUpdate.length)
    e.preventDefault();
    let id = document.getElementById('pid').value;
    const response = await fetch(`/api/products/findOne/${id}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'           
        }
    });
    if (response.status === 200 ) {
        const prod = await response.json();
        prodUpdate.push(prod);
        findProd.reset();

        const prodData = prodUpdate[0].payload;
        if (!prodData) {
            prodForm.reset();
            alert('No hay datos disponibles para este producto');
            
        }else{            
        document.getElementById('id').value = prodData._id;
        document.getElementById('title').value = prodData.title;
        document.getElementById('description').value = prodData.description;
        document.getElementById('price').value = prodData.price;
        document.getElementById('status').value = prodData.status;
        document.getElementById('thumbnail').value = prodData.thumbnail;
        document.getElementById('code').value = prodData.code;
        document.getElementById('stock').value = prodData.stock;
        document.getElementById('available').value = prodData.available;
    }
    }
    else if (response.status === 401) {
        alert('Producto no encontrado');
    };
};

async function delprod(e) {
    e.preventDefault();
    let id = document.getElementById('id').value;
    console.log(id);
    const result = await fetch(`/api/products/deleteOne/${id}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json'           
        }
    }).then(result => {
        if (result.status === 200) {
            alert('Producto eliminado');
            prodForm.reset();
        }
            else if (result.status === 401) {
                alert('Producto no encontrado');
            };
    });
};


async function updProd(e) {
    e.preventDefault();
    let id = document.getElementById('id').value; 
    const data = new FormData(prodForm);
    const obj = {};
    data.forEach((value, key) => obj[key] = value);
    const result = await fetch(`/api/products/updateOne/${id}`,{
        method: 'PUT',
        body: JSON.stringify(obj),
        headers: {
            'Content-Type': 'application/json'           
        }}).then(result => {
            if (result.status === 200) {
                alert('Producto actualizado');
                prodForm.reset();
            }
                else if (result.status === 401) {
                    alert('Producto no encontrado');
                };
            });
    }

async function crtProd(e) {
    e.preventDefault();
    const data = new FormData(prodForm);
    const obj = {};
    data.forEach((value, key) => obj[key] = value);
    const result = await fetch(`/api/products/createOne`,{
        method: 'POST',
        body: JSON.stringify(obj),
        headers: {
            'Content-Type': 'application/json'           
        }}).then(result => {
            if (result.status === 200) {
                alert('Producto creado con exito');
                prodForm.reset();
            }
                else if (result.status === 401) {
                    alert('Error al crear el producto');
                };
            });
}

/**** LOGICA DE USUARIOS ****/
findUser.addEventListener('submit', funcFindUser);
deleteUser.addEventListener('click', delUser);
updateUser.addEventListener('click', updUser);

async function funcFindUser(e) {
    userUpdate.splice(0, userUpdate.length)
    e.preventDefault();
    let id = document.getElementById('uid').value;
    const response = await fetch(`/api/users/findOne/${id}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'           
        }
    });
    if (response.status === 200 ) {
        const user = await response.json();
        console.log(user);
        userUpdate.push(user);
        findUser.reset();

        const userData = userUpdate[0].payload;
        if (!userData) {
            userForm.reset();
            alert('No hay datos disponibles para este usuario');
            
        }else{
            function restaFechas(fecha1, fecha2) {
                const fecha1Obj = new Date(fecha1);
                const fecha2Obj = new Date(fecha2);
                const diferencia = ((fecha1Obj - fecha2Obj)/60000).toFixed(0) ;
                if (diferencia < 2880) {
                    return "Activo"
                }else{
                    return "Inactivo";
                }
            }
        const fechaActual = new Date();
        const last_connection = new Date(userData.last_connection).toLocaleDateString();

        document.getElementById('userId').value = userData.id;
        document.getElementById('userFirst').value = userData.first_name;
        document.getElementById('userLast').value = userData.last_name;
        document.getElementById('userEmail').value = userData.email;
        document.getElementById('userRole').value = userData.role;
        document.getElementById('userStatus').value = restaFechas(fechaActual, userData.last_connection);
        document.getElementById('last_connection').value = last_connection;
        document.getElementById('userDoc').value = userData.documents.length === 3 ? "Documentación completa": "Falta completar documentación";

        const userStatus = document.getElementById('userStatus')
        userStatus.value === "Activo" ? userStatus.style.color = "green" : userStatus.style.color = "red";
        }
    }
    else if (response.status === 401) {
        alert('Usuario no encontrado');
    };
};

async function updUser(e) {
    e.preventDefault();
    let id = document.getElementById('userId').value; 
    const data = new FormData(userForm);
    const obj = {};
    data.forEach((value, key) => obj[key] = value);
    const result = await fetch(`/api/users/update/${id}`,{
        method: 'PUT',
        body: JSON.stringify(obj),
        headers: {
            'Content-Type': 'application/json'           
        }}).then(result => {
            if (result.status === 200) {
                alert('Usuario  actualizado');
                userForm.reset();
            }
                else if (result.status === 401) {
                    alert('Usuario no encontrado');
                };
            });
};

async function delUser(e) {
    e.preventDefault();
    let id = document.getElementById('userId').value;
    console.log(id);
    const result = await fetch(`/api/users/deleteOne/${id}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json'           
        }
    }).then(result => {
        if (result.status === 200) {
            alert('Usuario eliminado');
            userForm.reset();
        }
            else if (result.status === 401) {
                alert('Usuario no encontrado');
            };
    });
};

/**** USUARIOS INACTIVOS ****/
deleteAll.addEventListener('click',()=>{
    fetch('/api/users/inactiveUsers', {
        method: 'DELETE',
    }).then(result => {
        if (result.status === 200) {
            alert('Usuarios sin actividad eliminados');
        } else if (result.status === 401) {
            alert('Usuario no encontrado');
        };
    }
    )
});

