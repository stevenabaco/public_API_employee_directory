//Declare Global Variables
const api = 'https://randomuser.me/api/?results=12&nat=us';
const searchContainer = document.querySelector('.search-container');
const gallery = document.querySelector('.gallery');

let employees = [];
let modalIndex = 0;

// Fetch Random User API for list of employees

fetch(api)
	.then(res => res.json()) // Parse data to JSON
	.then(res => res.results)
	.then(res => {
		employees = res; // Assign response array to global Employee Variable
		return res; // Return response so the next chained code can continue
	}) // Extract just the results from response
	.then(renderGalleryHTML)
	.catch(error => console.log('Sorry... There was an error', error)); // Catch for error handling

//HTML code to create a search input box
const searchHTML = `
      <form action="#" method="get">
        <input type="search" id="search-input" class="search-input" placeholder="Search...">
      </form>
      `;

// Render searchHTML by injecting it into search container
searchContainer.insertAdjacentHTML('beforeend', searchHTML);

// Logic for searching through employee database using search input
function search(input) {
	const found = [];
	employees.forEach(employee => {
		// Concatenate full name
		const name = employee.name.first + employee.name.last;
		// Check for user input value
		if (name.toLowerCase().includes(input.toLowerCase())) {
			found.push(employee);
		}
	});
	gallery.innerHTML = ''; // Clear any rendered cards
	renderGalleryHTML(found);
}

// Search input submit handler
searchContainer.addEventListener('keyup', e => {
	const searchInput = document.querySelector('#search-input');
	search(searchInput.value);
});

// Inject gallery section HTML
async function renderGalleryHTML(data) {
	await data.forEach((employee, index) => {
		// Assign variables to be used for dynamic content
		const picture = employee.picture.large;
		const nameFirst = employee.name.first;
		const nameLast = employee.name.last;
		const city = employee.location.city;
		const state = employee.location.state;
		const email = employee.email;

		// HTML code to create a card element injected into index.html
		const cardHTML = `
    <div class="card" index="${index}">
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
		// Render html to selected DOM element
		gallery.insertAdjacentHTML('beforeend', cardHTML);
	});
	// Add Click event listener to Cards to trigger Modal
	const cards = document.querySelectorAll('#gallery .card');
	cards.forEach(card => {
		card.addEventListener('click', e => {
			let card = e.target.closest('.card');
			modalIndex = +card.getAttribute('index');
			renderModal(modalIndex);
		});
	});
}
/*******************************************
 *                   MODAL                  *
 * ******************************************/

// Render a Modal with additional info when an employee card is clicked

function renderModal(index) {
	// Capture the the selected card info for dynamic input into Modal
	let employee = employees[index];
	const employeePicture = employee.picture.large;
	const employeeNameFirst = employee.name.first;
	const employeeNameLast = employee.name.last;
	const employeeEmail = employee.email;
	const employeeStreetNumber = employee.location.street.number;
	const employeeStreetName = employee.location.street.name;
	const employeeCity = employee.location.city;
	const employeeState = employee.location.state;
	const employeePostcode = employee.location.postcode;
	const employeePhone = employee.cell;
	const employeeBirthMonth = new Date(employee.dob.date).getMonth() + 1;
	const employeeBirthDay = new Date(employee.dob.date).getDate();
	const employeeBirthYear = new Date(employee.dob.date).getFullYear();

	// Format phone number to not have a dash.
	// Found solution on stack overflow here https://stackoverflow.com/questions/8358084/regular-expression-to-reformat-a-us-phone-number-in-javascript;

	function formatPhoneNumber(phoneNumberString) {
		var cleaned = phoneNumberString.replace(/\D/g, '');
		var match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
		if (match) {
			return '(' + match[1] + ') ' + match[2] + '-' + match[3];
		}
		return null;
	}

	// HTML to build the Modal

	const modalHTML = `
  <div class="modal-container">
                <div class="modal">
                    <button type="button" id="modal-close-btn" class="modal-close-btn"><strong>X</strong></button>
                    <div class="modal-info-container">
                        <img class="modal-img" src="${employeePicture}" alt="${employeeNameFirst} ${employeeNameLast} profile picture">
                        <h3 id="name" class="modal-name cap">${employeeNameFirst} ${employeeNameLast}</h3>
                        <p class="modal-text">${employeeEmail}</p>
                        <p class="modal-text cap">${employeeCity}</p>
                        <hr>
                        <p class="modal-text">${formatPhoneNumber(
													employeePhone
												)}</p>
                        <p class="modal-text">${employeeStreetNumber} ${employeeStreetName}, ${employeeCity}, ${employeeState} ${employeePostcode}</p>
                        <p class="modal-text">Birthday: ${employeeBirthMonth}/${employeeBirthDay}/${employeeBirthYear}</p>
                    </div>
                     <div class="modal-btn-container">
                    <button type="button" id="modal-prev" class="modal-prev btn">Prev</button>
                    <button type="button" id="modal-next" class="modal-next btn">Next</button>
                  </div>
                </div>
  `;

	document.body.insertAdjacentHTML('beforeend', modalHTML);

	// Add event handlers to Modal buttons
	const modalContainer = document.querySelector('.modal-container');
	const closeModalBtn = document.getElementById('modal-close-btn');
	const modalPrevBtn = document.getElementById('modal-prev');
	const modalNextBtn = document.getElementById('modal-next');
	const cards = document.querySelectorAll('#gallery .card');
	const cardIndex = document.querySelector('.card').getAttribute('index');

	// Check to see if currently displayed card is the last one
	if (modalIndex >= cards.length - 1) {
		// Remove the next button if it's the last card
		modalNextBtn.remove();
	}

	// Check to see if currently displayed card is the first one
	if (modalIndex === 0) {
		// Remove the next button if it's the last card
		modalPrevBtn.remove();
	}
	// The close modal button
	closeModalBtn.addEventListener('click', () => {
		modalContainer.remove();
	});

	// The next modal button
	modalNextBtn.addEventListener('click', () => {
		if (modalIndex < cards.length - 1) {
			modalIndex += 1;
			modalContainer.remove();
			renderModal(modalIndex);
		}
	});

	// The previous modal button
	modalPrevBtn.addEventListener('click', () => {
		if (modalIndex >= 1) {
			modalIndex -= 1;
			modalContainer.remove();
			renderModal(modalIndex);
		}
	});
}
