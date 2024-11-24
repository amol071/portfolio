window.onload = () => {
    const loadingScreen = document.getElementById('loading-screen');
    if (loadingScreen) {
        setTimeout(() => {
            loadingScreen.classList.add('hidden'); // Add a class for fade-out
        }, 1500);
    }
};
