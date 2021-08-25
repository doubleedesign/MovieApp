document.addEventListener('DOMContentLoaded', function() {
	const apiKey = 'b42b0ba0480edbc4aa3a8e40bd89f82e';
	const form = document.getElementById('search-form');
	const heading = document.querySelector('#search-heading h1');
	const results = document.getElementById('search-results');

	// Handle form submission to populate with new data
	form.addEventListener('submit', event => {
		event.preventDefault();

		// Get the year the user entered
		let year = form.querySelector('#search').value;

		// Clear the previous results
		results.innerHTML = '';

		// Check that the year entered is in the valid range before proceeding
		if(year >= 1895 && year <= 2021) {

			// Update the heading
			heading.innerHTML = `Top movies of ${year}`;

			// Get the data and then handle it
			getMoviesForYear(year).then(response => {

				// If there's 10 or less results, just use those. If there's more than 10, cut off at 10.
				const count = (response.results.length > 10) ? 10 : response.results.length;

				// Update the page background according to the #1 movie that year
				updatePageBackground(response.results[0]);

				// Loop through the list and show a card for each movie
				for (let i = 0; i < count; i++) {
					displayMovieCard(response.results[i]);
				}
			});


		}
		// If the year entered isn't in the valid range, show an alert
		else {
			alert('Please enter a year between 1895 and 2021')
		}
	});

	/**
	 * Function to query the API to get movies for the given year
	 * @param year
	 *
	 * @returns {Promise}
	 */
	async function getMoviesForYear(year) {
		let query = `https://api.themoviedb.org/3/discover/movie?&primary_release_year=${year}&language=en&sort_by=popularity.desc&api_key=${apiKey}`;

		if(query) {
			return axios.get(query).then((response) => {
				return response.data;
			});
		}
	}

	/**
	 * Function to update the page background according to a given movie
	 * @param movieObject
	 */
	function updatePageBackground(movieObject) {
		document.body.style.backgroundImage = `url(https://image.tmdb.org/t/p/original${movieObject.backdrop_path})`;
	}

	/**
	 * Function to display a movie detail card
	 */
	function displayMovieCard(movieObject) {

		const card = `
			<div class="movie" style="background-image:url(https://image.tmdb.org/t/p/w500${movieObject.backdrop_path})">
				<div class="movie-image">
					<img src="https://image.tmdb.org/t/p/w200${movieObject.poster_path}" alt="${movieObject.title} poster"/>
				</div>
				<div class="movie-text">
					<h2>${movieObject.title}</h2>
					<span class="date">Release date: ${movieObject.release_date}</span>
					<p>${movieObject.overview}</p>
				</div>
			</div>
		`;

		results.innerHTML += card;
	}
});

