const initializeProductSearch = () => {
    const searchInput = document.getElementById('productSearch');
    const resultCount = document.getElementById('resultCount');
    const emptyState = document.getElementById('emptyState');
    const productCards = Array.from(document.querySelectorAll('.product-card'));

    if (!searchInput || !resultCount || !emptyState || productCards.length === 0) {
        return;
    }

    searchInput.addEventListener('input', () => {
        const query = searchInput.value.trim().toLowerCase();
        let visibleCount = 0;

        productCards.forEach((card) => {
            const searchableText = `${card.dataset.search || ''} ${card.textContent}`.toLowerCase();
            const matches = searchableText.includes(query);
            card.hidden = !matches;
            card.classList.toggle('search-result', query.length > 0 && matches);

            if (matches) {
                visibleCount += 1;
            }
        });

        resultCount.textContent = `Showing ${visibleCount} product${visibleCount === 1 ? '' : 's'}`;
        emptyState.hidden = visibleCount !== 0;
    });

    resultCount.textContent = `Showing ${productCards.length} products`;
};

const initProductPage = () => {
    initializeProductSearch();
};

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initProductPage);
} else {
    initProductPage();
}
