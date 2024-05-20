let allData;

// Function to create the gallery using D3
function createGallery(data) {
    const gallery = d3.select('#gallery');
    gallery.selectAll('*').remove();  // Clear existing content

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

// Function to filter artworks by ethnicity
function filterArtworks(ethnicity) {
    let filteredData;
    if (ethnicity === 'all') {
        filteredData = allData;
    } else {
        filteredData = allData.filter(d => d.Ethnicity === ethnicity);
    }
    createGallery(filteredData);
}

// Function to create a tree map
function createTreeMap(data) {
    const width = document.getElementById('tree-map').clientWidth;
    const height = document.getElementById('tree-map').clientHeight;

    const svg = d3.select('#tree-map').append('svg')
        .attr('width', width)
        .attr('height', height);

    // Group the data by Ethnicity and Artist, and count the number of artworks
    const groupedData = d3.group(data, d => d.Ethnicity, d => d.Artist);

    const root = d3.hierarchy({ children: Array.from(groupedData, ([ethnicity, artists]) => ({ ethnicity, children: Array.from(artists, ([artist, artworks]) => ({ artist, value: artworks.length })) })) })
        .sum(d => d.value)
        .sort((a, b) => b.value - a.value);

    d3.treemap()
        .size([width, height])
        .padding(1)
        (root);

    const nodes = svg.selectAll('g')
        .data(root.leaves())
        .enter().append('g')
        .attr('transform', d => `translate(${d.x0},${d.y0})`);

    nodes.append('rect')
        .attr('width', d => d.x1 - d.x0)
        .attr('height', d => d.y1 - d.y0)
        .attr('fill', d => d.parent.data.ethnicity === 'Israeli' ? '#005EB8' : '#149954')
        .on('mouseover', (event, d) => {
            const tooltip = d3.select('#tooltip');
            tooltip.html(d.data.artist); // Set tooltip text
            tooltip.style('visibility', 'visible'); // Show tooltip
        })
        .on('mousemove', (event) => {
            const tooltip = d3.select('#tooltip');
            tooltip.style('top', (event.pageY - 10) + 'px');
            tooltip.style('left', (event.pageX + 10) + 'px');
        })
        .on('mouseout', () => {
            const tooltip = d3.select('#tooltip');
            tooltip.style('visibility', 'hidden'); // Hide tooltip
        });

    // Add text to the rectangles with proper alignment
    nodes.append('text')
        .attr('x', 5)
        .attr('y', 15)
        .text(d => {
            const maxLength = Math.min(d.x1 - d.x0, d.y1 - d.y0); // Maximum length of text to fit within rectangle
            let text = d.data.artist;
            if (text.length > maxLength / 6) {
                // Truncate text if too long
                while (text.length > maxLength / 6) {
                    text = text.slice(0, -1); // Remove one character at a time
                }
                text += '...'; // Add ellipsis to indicate truncation
            }
            return text;
        })
        .attr('font-size', '10px')
        .attr('fill', 'white');
}

// Load the CSV data and create the gallery and tree map
d3.csv('../data/artworks.csv').then(data => {
    allData = data;
    createGallery(data);
    createTreeMap(data);
}).catch(error => {
    console.error('Error loading the CSV file:', error);
});
