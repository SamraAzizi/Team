
const CACHE_EXPIRY_TIME = 1000 * 60 * 30; 
let factsCache = null;
let lastFetchTime = 0;

/**
 * Fetches science facts either from cache or from the data source
 * @param {boolean} forceRefresh - Bypass cache and force a fresh fetch
 * @returns {Promise<Array>} Array of science facts
 */
async function fetchScienceFacts(forceRefresh = false) {
    // Return cached data if it's still valid and not forcing refresh
    if (!forceRefresh && factsCache && Date.now() - lastFetchTime < CACHE_EXPIRY_TIME) {
        console.log('Returning cached science facts');
        return factsCache;
    }

    try {
        console.log('Fetching science facts...');
        
        
        const response = await fetch('data/science-facts.json', {
            cache: forceRefresh ? 'reload' : 'default'
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const facts = await response.json();
        
        // Validate the response structure
        if (!Array.isArray(facts)) {
            throw new Error('Invalid data format: expected an array of facts');
        }

        // Cache the results
        factsCache = facts;
        lastFetchTime = Date.now();
        
        // Optional: Store in localStorage for offline use
        try {
            localStorage.setItem('scienceFacts', JSON.stringify({
                data: facts,
                timestamp: lastFetchTime
            }));
        } catch (e) {
            console.warn('Could not cache facts in localStorage', e);
        }

        return facts;
    } catch (error) {
        console.error('Error fetching science facts:', error);
        
        // Try to return cached data from localStorage if available
        try {
            const cached = localStorage.getItem('scienceFacts');
            if (cached) {
                const parsed = JSON.parse(cached);
                if (parsed.data && Array.isArray(parsed.data)) {
                    console.warn('Using offline cached facts');
                    return parsed.data;
                }
            }
        } catch (e) {
            console.warn('Could not read from localStorage', e);
        }

        // If we have memory cache but failed to fetch new data
        if (factsCache) {
            console.warn('Returning stale cached facts');
            return factsCache;
        }
        
        throw error;
    }
}

/**
 * Gets a random science fact from the fetched data
 * @returns {Promise<Object>} A random science fact
 */
async function getRandomScienceFact() {
    const facts = await fetchScienceFacts();
    if (!facts.length) {
        throw new Error('No facts available');
    }
    return facts[Math.floor(Math.random() * facts.length)];
}

/**
 * Gets facts filtered by category
 * @param {string} category - The category to filter by
 * @returns {Promise<Array>} Filtered array of facts
 */
async function getFactsByCategory(category) {
    const facts = await fetchScienceFacts();
    return facts.filter(fact => 
        fact.category && fact.category.toLowerCase() === category.toLowerCase()
    );
}

/**
 * Prefetches facts for better performance
 */
function prefetchScienceFacts() {
    // Start fetching but don't wait for it
    fetchScienceFacts().catch(e => 
        console.debug('Prefetch failed (this is normal for offline)', e)
    );
}

// Export the functions if using modules
// export { fetchScienceFacts, getRandomScienceFact, getFactsByCategory, prefetchScienceFacts };
