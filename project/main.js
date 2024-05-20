// Function to create the gallery using D3
function createGallery(data) {
    const gallery = d3.select('#gallery');

    const artworkDivs = gallery.selectAll('.artwork')
        .data(data)
        .enter()
        .append('div')
        .attr('class', 'artwork');

    artworkDivs.append('img')
        .attr('src', d => d.ImageURL)
        .attr('alt', d => d.Title);

    artworkDivs.append('div')
        .attr('class', 'tooltip')
        .html(d => `
            <strong>Title:</strong> ${d.Title}<br>
            <strong>Artist:</strong> ${d.Artist}<br>
            <strong>Nationality:</strong> ${d.Nationality}<br>
            <strong>Medium:</strong> ${d.Medium}<br>
            <strong>Date Acquired:</strong> ${d.DateAcquired}
        `);
}

// Load the CSV data and create the gallery
d3.csv('data/artworks.csv').then(data => {
    createGallery(data);
}).catch(error => {
    console.error('Error loading the CSV file:', error);
});

