document.addEventListener('DOMContentLoaded', async () => {
    const factsContainer = document.getElementById('facts-container');
    const categoryFilter = document.getElementById('category-filter');
    const searchInput = document.getElementById('search-input');
    const searchBtn = document.getElementById('search-btn');
    
    let allFacts = [];
    let categories = new Set();
    
    // Load facts from API
    async function loadFacts() {
        factsContainer.innerHTML = '<div class="loading">Loading science facts...</div>';
        
        try {
            allFacts = await fetchScienceFacts();
            displayFacts(allFacts);
            populateCategories();
        } catch (error) {
            factsContainer.innerHTML = `<div class="error">Failed to load facts. ${error.message}</div>`;
            console.error('Error loading facts:', error);
        }
    }
    
    // Display facts in the container
    function displayFacts(facts) {
        if (facts.length === 0) {
            factsContainer.innerHTML = '<div class="loading">No facts found matching your criteria.</div>';
            return;
        }
        
        factsContainer.innerHTML = '';
        facts.forEach(fact => {
            const factElement = createFactCard(fact);
            factsContainer.appendChild(factElement);
        });
    }
    
    // Create a fact card element
    function createFactCard(fact) {
        const card = document.createElement('div');
        card.className = 'fact-card';
        
        card.innerHTML = `
            <span class="fact-category">${fact.category}</span>
            <h3 class="fact-title">${fact.title}</h3>
            <p class="fact-content">${fact.content}</p>
            ${fact.source ? `<p class="fact-source">Source: ${fact.source}</p>` : ''}
        `;
        
        return card;
    }
    
    // Extract and populate categories
    function populateCategories() {
        categories = new Set(allFacts.map(fact => fact.category));
        categoryFilter.innerHTML = '<option value="all">All Categories</option>';
        
        categories.forEach(category => {
            const option = document.createElement('option');
            option.value = category;
            option.textContent = category;
            categoryFilter.appendChild(option);
        });
    }
    
    // Filter facts based on selected category and search term
    function filterFacts() {
        const selectedCategory = categoryFilter.value;
        const searchTerm = searchInput.value.toLowerCase();
        
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
    
    // Event listeners
    categoryFilter.addEventListener('change', filterFacts);
    searchBtn.addEventListener('click', filterFacts);
    searchInput.addEventListener('keyup', (e) => {
        if (e.key === 'Enter') filterFacts();
    });
    
    // Initial load
    await loadFacts();
});
