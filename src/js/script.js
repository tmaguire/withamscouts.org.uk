/* jshint esversion:10 */
let router = null;
const loadingGif = '<div class="text-center"><img src="./img/loading.gif" height="150" width="150" class="img-fluid text-center" alt="Loading animation placeholder"></div>';

function changePage(page, title) {
	// Update Canonical tag
	document.querySelector("link[rel='canonical']").setAttribute('href', page === '404' ? 'https://withamscouts.org.uk' : `https://withamscouts.org.uk/${page}`);
	// Update menu
	document.querySelectorAll('a.nav-link').forEach(menuItem => {
		if (menuItem.getAttribute('href') === page) {
			menuItem.classList.add('active');
			menuItem.setAttribute('aria-current', 'page');
		} else {
			menuItem.classList.remove('active');
			menuItem.removeAttribute('aria-current');
		}
	});
	// Hide all pages (except selected)
	document.querySelectorAll('section').forEach(section => {
		if (section.id !== page) {
			section.setAttribute('class', 'row mx-auto d-none');
			section.setAttribute('aria-hidden', 'true');
		}
	});
	// Set page as active
	document.getElementById(page).setAttribute('class', 'row mx-auto');
	document.getElementById(page).removeAttribute('aria-hidden');
	// Change document title
	document.title = `${title} | Witham Scouts`;
	// Scroll to top
	window.scrollTo({
		top: 0,
		left: 0,
		behavior: 'smooth'
	});
	// Close the navbar menu (if it is open)
	const menuToggle = document.getElementById('navbarToggler');
	const bsCollapse = new bootstrap.Collapse(menuToggle, {
		toggle: false
	});
	bsCollapse.hide();
}

// Function to start on page load
window.onload = function () {
	// Create router
	router = new Navigo('/');
	// Specify routes and resolve
	router
		.on('/', function () {
			changePage('home', 'Home');
		})
		.on('/home', function () {
			changePage('home', 'Home');
		})
		.on('/1st-witham', function () {
			changePage('1st-witham', '1st Witham Scout Group');
		})
		.on('/3rd-witham', function () {
			changePage('3rd-witham', '3rd Witham Scout Group');
		})
		.on('/explorers', function () {
			changePage('explorers', 'Witham Explorers');
		})
		.on('/volunteering', function () {
			changePage('volunteering', 'Volunteering');
		})
		.on('/openSourceLicenses', function () {
			changePage('openSourceLicenses', 'Open Source Licenses');
		})
		.notFound(function () {
			changePage('404', 'Page not found', false);
		})
		.resolve();
};