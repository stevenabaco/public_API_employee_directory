//Declare Global Variables
const api = 'https://randomuser.me/api/?results=12&nat=us';
const gallery = document.querySelector('.gallery');

fetch(api) // Fetch data from "Random User API"
	.then(res => res.json()) // Parse data to JSON
	.then(res => res.results) // Extract just the results from response
	.then(addHTML)
	.catch(error => console.log('Sorry... There was an error', error)); // Catch for error handling

function addHTML(data) { // Dynamically add HTML to gallery section
  data.forEach((employee, index) => {
    // Assign variables to be used for dynamic content
		const picture = employee.picture.large;
		const nameFirst = employee.name.first;
    const nameLast = employee.name.last;
    const city = employee.location.city;
    const state = employee.location.state;
    const email = employee.email;
    
    // HTML code to create a card element injected into index.html
		const card = `
    <div class="card">
      <div class="card-img-container">
          <img class="card-img" src="${picture}" alt=" ${nameFirst} ${nameLast} profile picture">
      </div>
      <div class="card-info-container">
          <h3 id="name" class="card-name cap">${nameFirst} ${nameLast}</h3>
          <p class="card-text">${email}</p>
          <p class="card-text cap">${city}, ${state}</p>
      </div>
    </div>
  `;
		gallery.insertAdjacentHTML('beforeend', card);
	});
}
