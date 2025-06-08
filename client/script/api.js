
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
