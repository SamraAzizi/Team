// In a real app, this would fetch from your server
// For this demo, we'll use a local JSON file

async function fetchScienceFacts() {
    try {
        // In a real app, you might fetch from an API endpoint:
        // const response = await fetch('/api/facts');
        // if (!response.ok) throw new Error('Network response was not ok');
        // return await response.json();
        
        // For this demo, we'll use a local JSON file
        const response = await fetch('data/science-facts.json');
        if (!response.ok) throw new Error('Failed to load facts data');
        return await response.json();
    } catch (error) {
        console.error('Error fetching science facts:', error);
        throw error;
    }
}
