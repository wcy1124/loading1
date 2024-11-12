// document.addEventListener('DOMContentLoaded', () => {
//     const gameCoin = document.querySelector('.game-coin');
//     const initialSrc = 'img/coin1.png';
//     const grabbedSrc = 'img/coin2.png';
//     let isDragging = false;

//     gameCoin.addEventListener('mousedown', (e) => {
//         isDragging = true;
//         gameCoin.src = grabbedSrc;

//         const rect = gameCoin.getBoundingClientRect();
//         const offsetX = e.clientX - (rect.width);
//         const offsetY = e.clientY - (rect.height);

//         function mouseMoveHandler(e) {
//             if (!isDragging) return;

//             gameCoin.style.position = 'absolute';
//             gameCoin.style.left = `${e.clientX - offsetX}px`;
//             gameCoin.style.top = `${e.clientY - offsetY}px`;
//         }

//         function mouseUpHandler() {
//             isDragging = false;
//             gameCoin.src = initialSrc;
//             gameCoin.style.position = '';
//             gameCoin.style.left = '';
//             gameCoin.style.top = '';
            
//             document.removeEventListener('mousemove', mouseMoveHandler);
//             document.removeEventListener('mouseup', mouseUpHandler);
//         }

//         document.addEventListener('mousemove', mouseMoveHandler);
//         document.addEventListener('mouseup', mouseUpHandler);
//     });
// });


// document.addEventListener('DOMContentLoaded', () => {
//     const gameCoin = document.querySelector('.game-coin');
//     const container = document.querySelector('.container');
//     const slot = document.querySelector('.slot');
//     const initialSrc = 'img/coin1.png';
//     const grabbedSrc = 'img/coin2.png';
//     let isDragging = false;

//     gameCoin.addEventListener('mousedown', (e) => {
//         if (e.button !== 0) return;
//         isDragging = true;
//         gameCoin.src = grabbedSrc;


//         const offsetX = e.clientX - gameCoin.getBoundingClientRect().width;
//         const offsetY = e.clientY - gameCoin.getBoundingClientRect().height;

//         gameCoin.style.pointerEvents = 'none';

//         function mouseMoveHandler(e) {
//             if (!isDragging) return;

//             gameCoin.style.left = `${e.clientX - offsetX}px`;
//             gameCoin.style.top = `${e.clientY - offsetY}px`;
//         }

//         function mouseUpHandler() {
//             isDragging = false;
//             gameCoin.src = initialSrc;
//             gameCoin.style.pointerEvents = 'auto';
            
//             const coinRect = gameCoin.getBoundingClientRect();
//             const slotRect = slot.getBoundingClientRect();

//             const isOverSlot = (
//                 coinRect.left < slotRect.right &&
//                 coinRect.right > slotRect.left &&
//                 coinRect.top < slotRect.bottom &&
//                 coinRect.bottom > slotRect.top
//             );

//             if (isOverSlot) {
//                 container.style.display = 'none';
//             }

//             gameCoin.style.position = '';
//             gameCoin.style.left = '';
//             gameCoin.style.top = '';
            
//             document.removeEventListener('mousemove', mouseMoveHandler);
//             document.removeEventListener('mouseup', mouseUpHandler);
//         }

//         document.addEventListener('mousemove', mouseMoveHandler);
//         document.addEventListener('mouseup', mouseUpHandler);
//     });
// });


document.addEventListener('DOMContentLoaded', () => {
    const gameCoin = document.querySelector('.game-coin');
    const container = document.querySelector('.container');
    const slot = document.querySelector('.machine');
    const initialSrc = 'img/coin1.png';
    const grabbedSrc = 'img/coin2.png';
    let isDragging = false;

    // 創建一个 canvas
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    const img = new Image();
    img.crossOrigin = 'anonymous';  // 設置跨域属性

    img.src = slot.src;
    img.onload = () => {
        // 当圖片載入結束，設置 canvas 大小並繪製
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0);
        console.log('Image loaded and drawn onto canvas');
    };

    gameCoin.addEventListener('mousedown', (e) => {
        if (e.button !== 0) return; // 滑鼠左鍵
        isDragging = true;
        gameCoin.src = grabbedSrc;

        const offsetX = e.clientX - gameCoin.getBoundingClientRect().width;
        const offsetY = e.clientY - gameCoin.getBoundingClientRect().height;

        gameCoin.style.pointerEvents = 'none'; // 防止 coin 被點擊

        console.log('Game coin is being dragged');

        function mouseMoveHandler(e) {
            if (!isDragging) return;

            gameCoin.style.left = `${e.clientX - offsetX}px`;
            gameCoin.style.top = `${e.clientY - offsetY}px`;
        }

        function mouseUpHandler(e) {
            isDragging = false;
            gameCoin.src = initialSrc;
            gameCoin.style.pointerEvents = 'auto';

            const coinRect = gameCoin.getBoundingClientRect();
            const slotRect = slot.getBoundingClientRect();

            // 判斷 coin 是否和 slot 有重疊
            const isOverSlot = (
                coinRect.left < slotRect.right &&
                coinRect.right > slotRect.left &&
                coinRect.top < slotRect.bottom &&
                coinRect.bottom > slotRect.top
            );

            console.log('Game coin is over slot:', isOverSlot);

            // 在 slot 内判斷是否在有颜色的區域内
            if (isOverSlot) {
                // 獲取目前 coin 的位置，轉為canvas 座標中的位置
                const coinCenterX = e.clientX - coinRect.left;
                const coinCenterY = e.clientY - coinRect.top;

                console.log(`Coin center position: (${coinCenterX}, ${coinCenterY})`);

                // 獲取 canvas 上該位置的像素資訊
                const pixel = ctx.getImageData(coinCenterX, coinCenterY, 1, 1).data;
                console.log('Pixel data at coin center:', pixel);

                // pixel[3] 是 alpha 通道值，表示透明度
                const isOverColoredArea = pixel[3] > 0 || (pixel[0] !== 0 || pixel[1] !== 0 || pixel[2] !== 0); // 如果透明度不為 0，說明該像素是有颜色的
                console.log('Is coin over a colored area:', isOverColoredArea);

                if (isOverColoredArea) {
                    container.style.display = 'none';
                    console.log('Coin is over a colored area, hiding container');
                }
            }

            // 重置 coin 的樣式
            gameCoin.style.position = '';
            gameCoin.style.left = '';
            gameCoin.style.top = '';

            // 移除事件監聽
            document.removeEventListener('mousemove', mouseMoveHandler);
            document.removeEventListener('mouseup', mouseUpHandler);
        }

        document.addEventListener('mousemove', mouseMoveHandler);
        document.addEventListener('mouseup', mouseUpHandler);
    });
});
