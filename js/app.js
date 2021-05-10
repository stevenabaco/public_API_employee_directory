//Declare Global Variables
const api = 'https://randomuser.me/api/?results=12&nat=us';
const gallery = document.querySelector('.gallery');
let employees = [];

fetch(api) // Fetch data from "Random User API"
	.then(res => res.json()) // Parse data to JSON
	.then(res => res.results)
	.then(res => {
		employees = res; // Assign response array to global Employee Variable
		return res; // Return response so the next chained code can continue
	}) // Extract just the results from response
	.then(renderGalleryHTML)
	.then(gallery.chil)
	.catch(error => console.log('Sorry... There was an error', error)); // Catch for error handling

async function renderGalleryHTML(data) {
	// Dynamically add HTML to gallery section
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
    <div class="card" id="${index}">
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
			renderModal(e);

			console.log('Card clicked!', e.target.closest('.card'));
		});
	});
}

// Render a Modal when an employee card is clicked
// to show additional detailed information

function renderModal(e) {
	// Capture the the selected card info for dynamic input into Modal
	const card = e.target.closest('.card');
	const employeeNum = card.id;
	const employeeData = employees[employeeNum];
	const employeePicture = employeeData.picture.large;
	const employeeNameFirst = employeeData.name.first;
	const employeeNameLast = employeeData.name.last;
	const employeeEmail = employeeData.email;
	const employeeStreetNumber = employeeData.location.street.number;
	const employeeStreetName = employeeData.location.street.name;
	const employeeCity = employeeData.location.city;
	const employeeState = employeeData.location.state;
	const employeePostcode = employeeData.location.postcode;
	const employeePhone = employeeData.cell;
	const employeeBirthMonth = new Date(employeeData.dob.date).getMonth() + 1;
	const employeeBirthDay = new Date(employeeData.dob.date).getDate();
	const employeeBirthYear = new Date(employeeData.dob.date).getFullYear();

	console.log(employeeData);

  // Format phone number to not have a dash.
  // Found solution on stack overflow here https://stackoverflow.com/questions/8358084/regular-expression-to-reformat-a-us-phone-number-in-javascript;
	
  function formatPhoneNumber(phoneNumberString) {
		var cleaned = (phoneNumberString).replace(/\D/g, '');
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
                </div>
  `;

	document.body.insertAdjacentHTML('beforeend', modalHTML);
}
