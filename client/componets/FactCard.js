/**
 * Creates a fact card component with the given fact data
 * @param {Object} fact - The science fact object
 * @param {string} fact.title - The title of the fact
 * @param {string} fact.content - The content/description of the fact
 * @param {string} fact.category - The category of the fact
 * @param {string} [fact.source] - Optional source of the fact
 * @returns {HTMLElement} - The created fact card element
 */
export function createFactCard(fact) {
    const card = document.createElement('div');
    card.className = 'fact-card';
    
    // Add category badge if available
    if (fact.category) {
        const categoryBadge = document.createElement('span');
        categoryBadge.className = 'fact-category';
        categoryBadge.textContent = fact.category;
        card.appendChild(categoryBadge);
    }
    
    // Add title if available
    if (fact.title) {
        const titleElement = document.createElement('h3');
        titleElement.className = 'fact-title';
        titleElement.textContent = fact.title;
        card.appendChild(titleElement);
    }
    
    // Add content
    const contentElement = document.createElement('p');
    contentElement.className = 'fact-content';
    contentElement.textContent = fact.content;
    card.appendChild(contentElement);
    
    // Add source if available
    if (fact.source) {
        const sourceElement = document.createElement('p');
        sourceElement.className = 'fact-source';
        sourceElement.textContent = `Source: ${fact.source}`;
        card.appendChild(sourceElement);
    }
    
    // Add click event for potential expansion
    card.addEventListener('click', () => {
        card.classList.toggle('expanded');
    });
    
    return card;
}

/**
 * Creates a loading skeleton for fact cards
 * @returns {HTMLElement} - The loading skeleton element
 */
export function createLoadingSkeleton() {
    const skeleton = document.createElement('div');
    skeleton.className = 'fact-card loading-skeleton';
    
    skeleton.innerHTML = `
        <div class="skeleton-badge"></div>
        <div class="skeleton-title"></div>
        <div class="skeleton-content"></div>
        <div class="skeleton-content"></div>
        <div class="skeleton-content"></div>
    `;
    
    return skeleton;
}
