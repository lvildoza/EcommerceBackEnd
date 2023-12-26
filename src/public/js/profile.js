const logout = document.getElementById('logout');
const accessAdmin = document.getElementById('accessAdmin');
const cart = document.getElementById('cart');
const btnsAddCart = document.getElementsByClassName('btnAddCart');
const userRole = document.getElementsByClassName('userRole')[0];
const userIsPremium = document.getElementById('userIsPremium');
const du = document.getElementById('du');
const ldu = document.getElementById('ldu');
const cd = document.getElementById('cd');
const lcd = document.getElementById('lcd');
const ec = document.getElementById('ec');
const lec = document.getElementById('lec');
const avatarLabel = document.getElementById('avatarLabel');
const avatarInput = document.getElementById('avatarInput');
const hiddenUserData = document.getElementById('hiddenUserData');
const avatarForm = document.getElementById('avatarForm');
const duForm = document.getElementById('duForm');
const cdForm = document.getElementById('cdForm');
const ecForm = document.getElementById('ecForm');
const avatarDiv = document.getElementById('avatarDiv');

const userEmail = hiddenUserData.getAttribute('data-user-email')
const userImg = hiddenUserData.getAttribute('data-user-profile')

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

if (!userImg) {
   
}

const isAdmin = userRole.id === "admin"
if (isAdmin) {
    cart.style.display = "none";
    avatarDiv.style.display = "none";
    userIsPremium.style.display = "none"
} else {
    accessAdmin.style.display = "none";
} 

const isPremium = userRole.id === "premium"
if (isPremium) {
    userIsPremium.style.display = "none";
}

for (let i = 0; i < btnsAddCart.length; i++) {
    if (btnsAddCart[i].value === "0") {
        btnsAddCart[i].disabled = true;
        btnsAddCart[i].style.backgroundColor = "grey";
    }
    btnsAddCart[i].addEventListener('click', ()=>{
        console.log(btnsAddCart[i].id);
        fetch(`/api/carts/${cart.value}/products/add/${btnsAddCart[i].id}`, {
            method: 'PUT',
        }).then(result => {
            if (result.status === 200) {
                alert('Producto agregado');
                location.reload();
            }
        })
    });
}

cart.addEventListener('click', e => {
    e.preventDefault();
    window.location.replace(`/api/carts/${cart.value}`);
});

async function addProd() {
    await fetch(`/api/carts/${cart.value}/products/add/${btnsAddCart[i].id}`, {
        method: 'PUT',
    }).then(result => {
        if (result.status === 200) {
            alert('Producto agregado');
            location.reload();
        }
    })
}

accessAdmin.addEventListener('click', e => {
    e.preventDefault();
    window.location.replace(`/api/users/private/admin`);
});


function handleAvatarInputChange(input, label){
    input.setAttribute('type', 'file');
    input.setAttribute('id', input);
    input.style.display = 'none';
    label.addEventListener('click', () => {
        input.click();
    })
        input.addEventListener('change', () => {
            if (input.files.length > 0) {
                const fileName = input.files[0].name;
                label.textContent = fileName;
            }
        });

}

function handleFileInputChange(input, label){
    input.setAttribute('type', 'file');
    input.setAttribute('id', input);
    input.style.display = 'none';
    label.addEventListener('click', () => {
        input.click();
    })
        input.addEventListener('change', () => {
            if (input.files.length > 0) {
                const fileName = input.files[0].name;
                label.textContent = fileName;
            }
        });

}


handleAvatarInputChange(avatarInput, avatarLabel);
handleFileInputChange(du, ldu);
handleFileInputChange(cd, lcd);
handleFileInputChange(ec, lec);
    
    avatarForm.addEventListener('submit', async (event) => {
        event.preventDefault();
        const formData = new FormData();
        formData.append('file', avatarInput.files[0]);
        try {
            const response = await fetch(`/api/users/uploadAvatar/${userEmail}`, {
                method: 'POST',
                body: formData
            });
            if (response.ok) {
                alert('Avatar actualizado');
                location.reload(true)
            } else {
                console.error('Error al subir el archivo');
            }
        } catch (error) {
            console.error('Error:', error);
        }
    });

    duForm.addEventListener('submit', async (event) => {
        event.preventDefault();
        const formData = new FormData();
        formData.append('du', du.files[0]);
        try {
            const response = await fetch(`/api/users/uploadDocs/du/${userEmail}`, {
                method: 'POST',
                body: formData
            });
            if (response.ok) {
                alert('DNI actualizado');
                location.reload(true)
            } else {
                console.error('Error al subir el archivo');
            }
        } catch (error) {
            console.error('Error:', error);
        }
    });

    cdForm.addEventListener('submit', async (event) => {
        event.preventDefault();
        const formData = new FormData();
        formData.append('cd', cd.files[0]);
        try {
            const response = await fetch(`/api/users/uploadDocs/cd/${userEmail}`, {
                method: 'POST',
                body: formData
            });
            if (response.ok) {
                alert('Certificado de domicilio actualizado');
                location.reload(true)
            } else {
                console.error('Error al subir el archivo');
            }
        } catch (error) {
            console.error('Error:', error);
        }
    });
    ecForm.addEventListener('submit', async (event) => {
        event.preventDefault();
        const formData = new FormData();
        formData.append('ec', ec.files[0]);
        try {
            const response = await fetch(`/api/users/uploadDocs/ec/${userEmail}`, {
                method: 'POST',
                body: formData
            });
            if (response.ok) {
                alert('Certificado de domicilio actualizado');
                location.reload(true)
            } else {
                console.error('Error al subir el archivo');
            }
        } catch (error) {
            console.error('Error:', error);
        }
    });