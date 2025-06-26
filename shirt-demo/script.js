const categorySelect = document.getElementById('categorySelect');
const templateSelect = document.getElementById('templateSelect');
const imageUpload = document.getElementById('imageUpload');
const uploadedImage = document.getElementById('uploadedImage');
const tshirt = document.getElementById('tshirt');
const centerHorizontal = document.getElementById('centerHorizontal');
const centerVertical = document.getElementById('centerVertical');

let isDragging = false;
let offsetX, offsetY;

// 衣服模板資料
const templates = {
  76000: [
    { name: "黑色", path: "76000/黑色.png" },
    { name: "白色", path: "76000/白色.png" },
    { name: "RS運動灰", path: "76000/RS運動灰.png" },
    { name: "藏青色", path: "76000/藏青色.png" },
    { name: "桃紅色", path: "76000/桃紅色.png" },
    { name: "果綠色", path: "76000/果綠色.png" },
    { name: "粉紅色", path: "76000/粉紅色.png" },
    { name: "橘黃色", path: "76000/橘黃色.png" },
    { name: "寶石藍", path: "76000/寶石藍.png" }
  ],
  9000: [
    { name: "黑色", path: "9000/黑色.png" },
    { name: "經典白", path: "9000/經典白.png" },
    { name: "紳士藍", path: "9000/紳士藍.png" },
    { name: "粉紅", path: "9000/粉紅.png" },
    { name: "松綠", path: "9000/松綠.png" },
    { name: "卡其", path: "9000/卡其.png" },
    { name: "石墨灰", path: "9000/石墨灰.png" }
  ]
};

// 切換衣服類別時更新選單
categorySelect.addEventListener('change', () => {
  const selected = categorySelect.value;
  const options = templates[selected] || [];

  templateSelect.innerHTML = '';
  options.forEach(template => {
    const option = document.createElement('option');
    option.value = template.path;
    option.textContent = template.name;
    templateSelect.appendChild(option);
  });

  // 預設顯示第一張圖
  if (options.length > 0) {
    tshirt.src = options[0].path;
  }
});

// 切換衣服模板圖片
templateSelect.addEventListener('change', (e) => {
  tshirt.src = e.target.value;
});

// 上傳圖案（去背 + 置中）
imageUpload.addEventListener('change', (e) => {
  const file = e.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = (event) => {
    uploadedImage.onload = null;

    const tempImage = new Image();
    tempImage.onload = () => {
      removeWhiteBackground(tempImage, (dataUrl) => {
        uploadedImage.src = dataUrl;
        uploadedImage.style.display = 'block';
        centerImageHorizontally();
        uploadedImage.style.top = `80px`;
      });
    };
    tempImage.src = event.target.result;
  };
  reader.readAsDataURL(file);
});

// 拖曳圖案
uploadedImage.addEventListener('mousedown', (e) => {
  isDragging = true;
  offsetX = e.offsetX;
  offsetY = e.offsetY;
});

document.addEventListener('mousemove', (e) => {
  if (!isDragging) return;
  const rect = document.getElementById('tshirtArea').getBoundingClientRect();
  uploadedImage.style.left = `${e.clientX - rect.left - offsetX}px`;
  uploadedImage.style.top = `${e.clientY - rect.top - offsetY}px`;
});

document.addEventListener('mouseup', () => {
  isDragging = false;
});

// 滾輪縮放圖案
uploadedImage.addEventListener('wheel', (e) => {
  e.preventDefault();
  let width = uploadedImage.offsetWidth;
  width += e.deltaY * -0.2;
  width = Math.max(20, width);
  uploadedImage.style.width = `${width}px`;
});

// 置中功能
centerHorizontal.addEventListener('click', centerImageHorizontally);
centerVertical.addEventListener('click', centerImageVertically);

function centerImageHorizontally() {
  const tshirtArea = document.getElementById('tshirtArea');
  const tshirtWidth = tshirtArea.offsetWidth;
  const imageWidth = uploadedImage.offsetWidth;
  uploadedImage.style.left = `${(tshirtWidth - imageWidth) / 2}px`;
}

function centerImageVertically() {
  const tshirtArea = document.getElementById('tshirtArea');
  const tshirtHeight = tshirtArea.offsetHeight;
  const imageHeight = uploadedImage.offsetHeight;
  uploadedImage.style.top = `${(tshirtHeight - imageHeight) / 2}px`;
}

// 去背邏輯（白色轉透明）
function removeWhiteBackground(imgElement, callback) {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  canvas.width = imgElement.naturalWidth;
  canvas.height = imgElement.naturalHeight;

  ctx.drawImage(imgElement, 0, 0);
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const data = imageData.data;

  for (let i = 0; i < data.length; i += 4) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    if (r > 240 && g > 240 && b > 240) {
      data[i + 3] = 0;
    }
  }

  ctx.putImageData(imageData, 0, 0);
  callback(canvas.toDataURL());
}

// 初始化：預設顯示 T恤模板
categorySelect.dispatchEvent(new Event('change'));
