// PlantHouse Application Logic

// PlantNet API Configuration
// Get free API key from: https://my.plantnet.org/
const PLANTNET_API_KEY = '2b10gNcrDjnUAIxQ9p9qjFETO'; // Replace with your API key
const PLANTNET_PROJECT = 'all'; // or 'weurope', 'canada', etc. for better accuracy

let selectedFile = null;
let identifiedPlantData = null;

// DOM Elements
const photoInput = document.getElementById('photoInput');
const identifyBtn = document.getElementById('identifyBtn');
const previewContainer = document.getElementById('previewContainer');
const identificationResult = document.getElementById('identificationResult');
const plantsTable = document.getElementById('plantsTable');

// Event Listeners
photoInput.addEventListener('change', handlePhotoSelect);
identifyBtn.addEventListener('click', identifyPlant);

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    loadPlants();
});

// Handle photo selection
function handlePhotoSelect(event) {
    const file = event.target.files[0];
    if (file) {
        selectedFile = file;
        displayPreview(file);
        identifyBtn.disabled = false;
        identificationResult.innerHTML = '';
        identifiedPlantData = null;
    }
}

// Display photo preview
function displayPreview(file) {
    const reader = new FileReader();
    reader.onload = (e) => {
        previewContainer.innerHTML = `
            <div class="preview-image-container">
                <img src="${e.target.result}" alt="Selected plant photo">
                <button onclick="clearPreview()" class="btn-clear">✕</button>
            </div>
        `;
    };
    reader.readAsDataURL(file);
}

// Clear preview
function clearPreview() {
    selectedFile = null;
    previewContainer.innerHTML = '';
    photoInput.value = '';
    identifyBtn.disabled = true;
    identificationResult.innerHTML = '';
    identifiedPlantData = null;
}

// Convert image to base64
function fileToBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => {
            const base64 = reader.result.split(',')[1];
            resolve(base64);
        };
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
}
// Identify plant using PlantNet API
async function identifyPlant() {
    if (!selectedFile) return;

    identifyBtn.disabled = true;
    identifyBtn.textContent = '🔍 Identifying...';
    identificationResult.innerHTML = '<div class="loading">Analyzing plant...</div>';

    try {
        // Create FormData for PlantNet API
        const formData = new FormData();
        formData.append('images', selectedFile);
        formData.append('organs', 'auto'); // auto-detect plant organ (leaf, flower, etc.)

        const response = await fetch(`https://my-api.plantnet.org/v2/identify/${PLANTNET_PROJECT}?api-key=${PLANTNET_API_KEY}&include-related-images=true`, {
            method: 'POST',
            body: formData
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`API Error ${response.status}: ${errorText}`);
        }

        const data = await response.json();
        
        if (data.results && data.results.length > 0) {
            const topResult = data.results[0];
            const species = topResult.species;
            
            identifiedPlantData = {
                name: species.scientificNameWithoutAuthor,
                commonNames: species.commonNames || [],
                probability: (topResult.score * 100).toFixed(1),
                description: species.genus?.scientificNameWithoutAuthor 
                    ? `Genus: ${species.genus.scientificNameWithoutAuthor}` 
                    : 'No description available',
                family: species.family?.scientificNameWithoutAuthor || 'Unknown',
                genus: species.genus?.scientificNameWithoutAuthor || 'Unknown',
                imageUrl: topResult.images?.[0]?.url?.o || '',
                gbifId: species.gbifId || null
            };

            displayIdentificationResult(identifiedPlantData);
        } else {
            identificationResult.innerHTML = '<div class="error">No plant identification found. Please try with a clearer photo of leaves or flowers.</div>';
        }
    } catch (error) {
        console.error('Identification error:', error);
        identificationResult.innerHTML = `<div class="error">Error identifying plant: ${error.message}. Please check your API key and try again.</div>`;
    } finally {
        identifyBtn.disabled = false;
        identifyBtn.textContent = '🔍 Identify Plant';
    }
}   

// Display identification result
function displayIdentificationResult(plant) {
    const commonNamesStr = plant.commonNames.length > 0 
        ? plant.commonNames.slice(0, 3).join(', ')
        : 'No common names available';

    identificationResult.innerHTML = `
        <div class="result-card">
            <h3>✅ Plant Identified!</h3>
            <div class="result-details">
                <p><strong>Scientific Name:</strong> ${plant.name}</p>
                <p><strong>Common Names:</strong> ${commonNamesStr}</p>
                <p><strong>Confidence:</strong> ${plant.probability}%</p>
            </div>
            <button onclick="savePlant()" class="btn-save">💾 Save to Collection</button>
        </div>
    `;
}

// Save plant to Firebase
async function savePlant() {
    if (!identifiedPlantData) return;

    try {
        const plantDetails = generatePlantDetails(identifiedPlantData);

        const plantDoc = {
            name: identifiedPlantData.name,
            commonNames: identifiedPlantData.commonNames,
            details: plantDetails,
            imageUrl: identifiedPlantData.imageUrl,
            description: identifiedPlantData.description.substring(0, 200),
            addedAt: firebase.firestore.FieldValue.serverTimestamp()
        };

        await db.collection('plant-house').add(plantDoc);

        identificationResult.innerHTML = '<div class="success">✅ Plant saved to your collection!</div>';
        
        // Clear form and reload plants
        setTimeout(() => {
            clearPreview();
            loadPlants();
        }, 1500);

    } catch (error) {
        console.error('Error saving plant:', error);
        identificationResult.innerHTML = `<div class="error">Error saving plant: ${error.message}</div>`;
    }
}

// Generate bullet points from plant data
function generatePlantDetails(plant) {
    const details = [];

    // Common names
    if (plant.commonNames && plant.commonNames.length > 0) {
        details.push(`Common names: ${plant.commonNames.slice(0, 3).join(', ')}`);
    }

    // Family
    if (plant.family) {
        details.push(`Family: ${plant.family}`);
    }

    // Genus
    if (plant.genus) {
        details.push(`Genus: ${plant.genus}`);
    }

    // Short description
    if (plant.description && plant.description !== 'No description available') {
        details.push(plant.description);
    }

    // Add GBIF link for more info
    if (plant.gbifId) {
        details.push(`More info: gbif.org/species/${plant.gbifId}`);
    }

    return details.length > 0 ? details : ['Information pending'];
}

// Load plants from Firebase
async function loadPlants() {
    try {
        const snapshot = await db.collection('plant-house')
            .orderBy('addedAt', 'desc')
            .get();

        if (snapshot.empty) {
            plantsTable.innerHTML = '<div class="loading">No plants added yet. Start by identifying your first plant!</div>';
            return;
        }

        let tableHTML = '<div class="plants-grid">';

        snapshot.forEach(doc => {
            const plant = doc.data();
            tableHTML += createPlantCard(doc.id, plant);
        });

        tableHTML += '</div>';
        plantsTable.innerHTML = tableHTML;

    } catch (error) {
        console.error('Error loading plants:', error);
        plantsTable.innerHTML = '<div class="error">Error loading plants. Please check your Firebase configuration.</div>';
    }
}

// Create plant card HTML
function createPlantCard(id, plant) {
    const detailsList = plant.details.map(detail => `<li>${detail}</li>`).join('');
    const imageHtml = plant.imageUrl 
        ? `<img src="${plant.imageUrl}" alt="${plant.name}" class="plant-image">`
        : '<div class="plant-image-placeholder">🌿</div>';

    return `
        <div class="plant-card">
            <div class="plant-image-container">
                ${imageHtml}
            </div>
            <div class="plant-info">
                <h3 class="plant-name">${plant.name}</h3>
                <ul class="plant-details">
                    ${detailsList}
                </ul>
                <button onclick="deletePlant('${id}')" class="btn-delete">🗑️ Remove</button>
            </div>
        </div>
    `;
}

// Delete plant from Firebase
async function deletePlant(plantId) {
    if (!confirm('Are you sure you want to remove this plant?')) return;

    try {
        await db.collection('plant-house').doc(plantId).delete();
        loadPlants();
    } catch (error) {
        console.error('Error deleting plant:', error);
        alert('Error removing plant. Please try again.');
    }
}
