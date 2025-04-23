document.addEventListener('DOMContentLoaded', function() {
    const images = document.querySelectorAll('img.shadowbox');

    images.forEach(image => {
        image.addEventListener('click', function() {
            const shadowbox = document.createElement('div');
            shadowbox.style.position = 'fixed';
            shadowbox.style.top = '0';
            shadowbox.style.left = '0';
            shadowbox.style.width = '100%';
            shadowbox.style.height = '100%';
            shadowbox.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
            shadowbox.style.display = 'flex';
            shadowbox.style.alignItems = 'center';
            shadowbox.style.justifyContent = 'center';
            shadowbox.style.zIndex = '1000';

            const shadowboxImage = document.createElement('img');
            shadowboxImage.src = image.src;
            shadowboxImage.style.maxWidth = '90%';
            shadowboxImage.style.maxHeight = '90%';

            shadowbox.addEventListener('click', function() {
                document.body.removeChild(shadowbox);
            });

            shadowbox.appendChild(shadowboxImage);
            document.body.appendChild(shadowbox);
        });
    });
});
