document.addEventListener('DOMContentLoaded', async () => {
    const factsContainer = document.getElementById('facts-container');
    const categoryFilter = document.getElementById('category-filter');
    const searchInput = document.getElementById('search-input');
    const searchBtn = document.getElementById('search-btn');
    const refreshBtn = document.getElementById('refresh-btn');
    const randomFactBtn = document.getElementById('random-fact-btn');
    const factsCount = document.getElementById('facts-count');
    const filterResetBtn = document.getElementById('filter-reset');
    
    let allFacts = [];
    let categories = new Set();
    let currentDisplayedFacts = [];
    
    // Load facts from API
    async function loadFacts(forceRefresh = false) {
        factsContainer.innerHTML = '<div class="loading"><div class="spinner"></div>Loading science facts...</div>';
        
        try {
            allFacts = await fetchScienceFacts(forceRefresh);
            currentDisplayedFacts = [...allFacts];
            displayFacts(currentDisplayedFacts);
            populateCategories();
            updateFactsCount();
            
            // Store last update time
            const lastUpdated = document.getElementById('last-updated');
            if (lastUpdated) {
                lastUpdated.textContent = new Date().toLocaleTimeString();
            }
            
        } catch (error) {
            factsContainer.innerHTML = `
                <div class="error">
                    <p>Failed to load facts. ${error.message}</p>
                    <button id="retry-load" class="retry-btn">Retry</button>
                </div>
            `;
            document.getElementById('retry-load')?.addEventListener('click', () => loadFacts());
            console.error('Error loading facts:', error);
        }
    }
    
    // Display facts in the container
    function displayFacts(facts) {
        if (facts.length === 0) {
            factsContainer.innerHTML = `
                <div class="no-results">
                    <p>No facts found matching your criteria.</p>
                    <button id="reset-filters" class="reset-btn">Reset Filters</button>
                </div>
            `;
            document.getElementById('reset-filters')?.addEventListener('click', resetFilters);
            return;
        }
        
        factsContainer.innerHTML = '';
        const fragment = document.createDocumentFragment();
        
        facts.forEach(fact => {
            const factElement = createFactCard(fact);
            fragment.appendChild(factElement);
        });
        
        factsContainer.appendChild(fragment);
        currentDisplayedFacts = [...facts];
        updateFactsCount();
    }
    
    // Create a fact card element
    function createFactCard(fact) {
        const card = document.createElement('div');
        card.className = 'fact-card';
        
        // Add data attributes for filtering
        card.dataset.category = fact.category;
        card.dataset.title = fact.title.toLowerCase();
        card.dataset.content = fact.content.toLowerCase();
        card.dataset.source = fact.source ? fact.source.toLowerCase() : '';
        
        card.innerHTML = `
            <span class="fact-category">${fact.category}</span>
            <h3 class="fact-title">${fact.title}</h3>
            <p class="fact-content">${fact.content}</p>
            ${fact.source ? `<p class="fact-source">Source: <a href="${fact.source}" target="_blank" rel="noopener">${fact.source}</a></p>` : ''}
            <div class="fact-actions">
                <button class="copy-btn" title="Copy to clipboard">📋</button>
                <button class="share-btn" title="Share this fact">↗️</button>
            </div>
        `;
        
        // Add event listeners for action buttons
        card.querySelector('.copy-btn').addEventListener('click', () => copyToClipboard(fact));
        card.querySelector('.share-btn').addEventListener('click', () => shareFact(fact));
        
        return card;
    }
    
    // Extract and populate categories
    function populateCategories() {
        categories = new Set(allFacts.map(fact => fact.category));
        categoryFilter.innerHTML = '<option value="all">All Categories</option>';
        
        const sortedCategories = Array.from(categories).sort();
        
        sortedCategories.forEach(category => {
            const option = document.createElement('option');
            option.value = category;
            option.textContent = category;
            categoryFilter.appendChild(option);
        });
    }
    
    // Filter facts based on selected category and search term
    function filterFacts() {
        const selectedCategory = categoryFilter.value;
        const searchTerm = searchInput.value.toLowerCase().trim();
        
        let filteredFacts = allFacts;
        
        // Filter by category
        if (selectedCategory !== 'all') {
            filteredFacts = filteredFacts.filter(fact => fact.category === selectedCategory);
        }
        
        // Filter by search term
        if (searchTerm) {
            filteredFacts = filteredFacts.filter(fact => 
                fact.title.toLowerCase().includes(searchTerm) || 
                fact.content.toLowerCase().includes(searchTerm) ||
                (fact.source && fact.source.toLowerCase().includes(searchTerm))
            );
        }
        
        displayFacts(filteredFacts);
    }
    
    // Reset all filters
    function resetFilters() {
        categoryFilter.value = 'all';
        searchInput.value = '';
        displayFacts(allFacts);
    }
    
    // Update the facts counter
    function updateFactsCount() {
        if (factsCount) {
            factsCount.textContent = `${currentDisplayedFacts.length} of ${allFacts.length} facts`;
        }
    }
    
    // Copy fact to clipboard
    function copyToClipboard(fact) {
        const text = `${fact.title}\n\n${fact.content}\n\n${fact.source ? `Source: ${fact.source}` : ''}`;
        navigator.clipboard.writeText(text)
            .then(() => {
                showToast('Fact copied to clipboard!');
            })
            .catch(err => {
                console.error('Failed to copy:', err);
                showToast('Failed to copy fact', 'error');
            });
    }

    // Share fact
    function shareFact(fact) {
        if (navigator.share) {
            navigator.share({
                title: fact.title,
                text: fact.content,
                url: fact.source || window.location.href
            }).catch(err => {
                console.error('Error sharing:', err);
                showToast('Share cancelled', 'warning');
            });
        } else {
            // Fallback for browsers that don't support Web Share API
            copyToClipboard(fact);
        }
    }
    
    // Show toast notification
    function showToast(message, type = 'success') {
        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        toast.textContent = message;
        document.body.appendChild(toast);
        
        setTimeout(() => {
            toast.classList.add('fade-out');
            setTimeout(() => toast.remove(), 500);
        }, 3000);
    }
    
    // Event listeners
    categoryFilter.addEventListener('change', filterFacts);
    searchBtn.addEventListener('click', filterFacts);
    searchInput.addEventListener('keyup', (e) => {
        if (e.key === 'Enter') filterFacts();
    });
    
    if (refreshBtn) {
        refreshBtn.addEventListener('click', () => loadFacts(true));
    }
    
    if (randomFactBtn) {
        randomFactBtn.addEventListener('click', async () => {
            try {
                const randomFact = await getRandomScienceFact();
                displayFacts([randomFact]);
            } catch (error) {
                showToast('Failed to get random fact', 'error');
                console.error('Error getting random fact:', error);
            }
        });
    }
    
    if (filterResetBtn) {
        filterResetBtn.addEventListener('click', resetFilters);
    }
    
    // Initial load
    await loadFacts();
    
    // Add intersection observer for lazy loading if needed
    if ('IntersectionObserver' in window && factsContainer.children.length > 10) {
        const lazyLoadObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    lazyLoadObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });
        
        Array.from(factsContainer.children).forEach(child => {
            lazyLoadObserver.observe(child);
        });
    }
});
