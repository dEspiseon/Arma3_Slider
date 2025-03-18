let images = [];
let previewUrl = '';

const fileInput = document.getElementById('image-file');
const urlInput = document.getElementById('image-url');
const previewImage = document.getElementById('preview-image');
const addButton = document.getElementById('add-image');
const imagesList = document.getElementById('images-list');
const saveButton = document.getElementById('save-changes');
const messageElement = document.getElementById('message');

document.addEventListener('DOMContentLoaded', () => {
    loadImagesFromStorage();
    renderImagesList();
});

fileInput.addEventListener('change', handleFileSelect);
urlInput.addEventListener('input', handleUrlInput);
addButton.addEventListener('click', addImage);
saveButton.addEventListener('click', saveChanges);

function handleFileSelect(event) {
    const file = event.target.files[0];
    if (!file) return;
    
    if (!file.type.match('image.*')) {
        showMessage('Пожалуйста, выберите изображение', 'error');
        return;
    }
    
    const reader = new FileReader();
    reader.onload = function(e) {
        previewUrl = e.target.result;
        previewImage.src = previewUrl;
        previewImage.style.display = 'block';
        urlInput.value = '';
    };
    reader.readAsDataURL(file);
}

function handleUrlInput(event) {
    const url = event.target.value.trim();
    if (url) {
        previewUrl = url;
        previewImage.src = url;
        previewImage.style.display = 'block';
        previewImage.onerror = function() {
            showMessage('Неверный URL изображения', 'error');
            previewImage.style.display = 'none';
            previewUrl = '';
        };
        fileInput.value = '';
    } else {
        previewImage.style.display = 'none';
        previewUrl = '';
    }
}

function addImage() {
    if (!previewUrl) {
        showMessage('Пожалуйста, выберите изображение или введите URL', 'error');
        return;
    }
    
    images.push(previewUrl);
    renderImagesList();
    resetForm();
    showMessage('Изображение добавлено', 'success');
}

function deleteImage(index) {
    images.splice(index, 1);
    renderImagesList();
    showMessage('Изображение удалено', 'success');
}

function moveImageUp(index) {
    if (index === 0) return;
    [images[index], images[index - 1]] = [images[index - 1], images[index]];
    renderImagesList();
}

function moveImageDown(index) {
    if (index === images.length - 1) return;
    [images[index], images[index + 1]] = [images[index + 1], images[index]];
    renderImagesList();
}

function renderImagesList() {
    imagesList.innerHTML = '';
    
    if (images.length === 0) {
        imagesList.innerHTML = '<p>Нет добавленных изображений</p>';
        return;
    }
    
    images.forEach((url, index) => {
        const imageItem = document.createElement('div');
        imageItem.className = 'image-item';
        
        const img = document.createElement('img');
        img.src = url;
        img.alt = `Изображение ${index + 1}`;
        
        const actions = document.createElement('div');
        actions.className = 'image-actions';
        
        const moveButtons = document.createElement('div');
        
        if (index > 0) {
            const upButton = document.createElement('button');
            upButton.className = 'move-button';
            upButton.textContent = '↑';
            upButton.onclick = () => moveImageUp(index);
            moveButtons.appendChild(upButton);
        }
        
        if (index < images.length - 1) {
            const downButton = document.createElement('button');
            downButton.className = 'move-button';
            downButton.textContent = '↓';
            downButton.onclick = () => moveImageDown(index);
            moveButtons.appendChild(downButton);
        }
        
        const deleteButton = document.createElement('button');
        deleteButton.className = 'delete-button';
        deleteButton.textContent = 'Удалить';
        deleteButton.onclick = () => deleteImage(index);
        
        actions.appendChild(moveButtons);
        actions.appendChild(deleteButton);
        
        imageItem.appendChild(img);
        imageItem.appendChild(actions);
        
        imagesList.appendChild(imageItem);
    });
}

function saveChanges() {
    saveImagesToStorage();
    updateIndexHtml();
    showMessage('Изменения сохранены успешно!', 'success');
}

function saveImagesToStorage() {
    localStorage.setItem('arma3SliderImages', JSON.stringify(images));
}

function loadImagesFromStorage() {
    const savedImages = localStorage.getItem('arma3SliderImages');
    if (savedImages) {
        images = JSON.parse(savedImages);
    } else {
        images = [
            'https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/107410/ss_e9220742c6b786efc9145c58ce7b276af891e9d5.1920x1080.jpg?t=1741874270',
            'https://storage.googleapis.com/gfn-am-games-catalogue-assets/arma_3_screenshot_15.jpg',
            'https://i.playground.ru/e/afBFHRZ67FjUg16HMiPNQQ.jpeg'
        ];
    }
}

function updateIndexHtml() {
    
    let slidesHtml = '';
    let thumbnailsHtml = '';
    
    images.forEach((url, index) => {
        slidesHtml += `
        <div class="slide">
            <img src="${url}" alt="Slide ${index + 1}">
        </div>`;
        
        thumbnailsHtml += `
        <img src="${url}" alt="Thumbnail ${index + 1}" class="slider-thumbnail${index === 0 ? ' active' : ''}">`;
    });
    
    localStorage.setItem('arma3SliderSlidesHtml', slidesHtml);
    localStorage.setItem('arma3SliderThumbnailsHtml', thumbnailsHtml);
}

function resetForm() {
    fileInput.value = '';
    urlInput.value = '';
    previewImage.style.display = 'none';
    previewUrl = '';
}

function showMessage(text, type) {
    messageElement.textContent = text;
    messageElement.className = `message ${type}`;
    messageElement.style.display = 'block';
    
    setTimeout(() => {
        messageElement.style.display = 'none';
    }, 3000);
}