import React, { useState, useRef, useCallback } from 'react';
import './App.css';
import useCardSearch from '../Search/useCardSearch';
import Card from '../Card/Card';
import * as styles from './App.module.css';
import searchIcon from '../../assets/searchIcon.png';
import title from '../../assets/title3.png';
import background from '../../assets/background.jpeg';
function App() {
	const [ query, setQuery ] = useState('');
	const [ pageNumber, setPageNumber ] = useState('');

	const { cards, hasMore, loading, error } = useCardSearch(query, pageNumber);

	//this variable take on the value of the last card which will allow us to trigger infinite scrolling
	const observer = useRef();
	//this will allow us to set the value of obeserver
	const lastCardElementRef = useCallback(
		(node) => {
			//we just want to return if loading because we don't want to constantly trigger API calls while loading
			if (loading) return;

			//by disconnecting the current observer here we will be able to update the new last card for the next page to allow infinite scrolling
			if (observer.current) observer.current.disconnect();
			//this will set the new observer/new last card and when it is visible on the browser it will update the state and add one to the page number
			//also by checking against the hasMore we can prevent the calling of the API and prevent the browser to keep paginating when its no longer necessary
			observer.current = new IntersectionObserver((entries) => {
				if (entries[0].isIntersecting && hasMore) {
					setPageNumber((prevPageNumber) => prevPageNumber + 1);
				}
			});
			//if there is a last card observer will be observing it
			if (node) observer.current.observe(node);
		},
		[ loading, hasMore ]
	);

	//handleSearch will allow for updating the search query by Name when user is searching in the input, and it will reset the page number back to one because when user re-query/new query we want data to restart at very first page
	function handleSearch(e) {
		setQuery(e.target.value);
		setPageNumber(1);
	}
	return (
		<div className={styles.bodyContainer}>
			<div className={styles.title}>
				<img src={title} alt="Elder Scrolls Legends Title" />
			</div>
			<div className={styles.backgroundImg} />
			<div className={styles.searchInputContainer}>
				<input
					type="text"
					value={query}
					onChange={handleSearch}
					placeholder="Search..."
					className={styles.searchInput}
				/>
				<img src={searchIcon} alt="search icon" className={styles.searchIcon} />
			</div>
			<div>{loading && <div className={styles.loadingSpinner}>Loading...</div>}</div>

			<div className={styles.cardContainer}>
				<div className={styles.backgroundImg} />

				{cards.map((card, index) => {
					//this will map through our array of cards and display it individually in our card component

					//this if statement checks for the very last book, which will render more cards
					if (cards.length === index + 1) {
						return (
							//ref will allow us to get a piece of persisting information even after each rendering
							<div ref={lastCardElementRef} key={index} className={styles.card}>
								<Card name={card[0]} id={card[1]} set={card[2]} text={card[3]} imgURL={card[4]} />
							</div>
						);
					}
					else {
						return (
							//essentially this returns the same thing but without the ref which isn't necessary anymore when there's no more data to load meaning no longer needs to check for observer
							<div key={index} className={styles.card}>
								<Card
									name={card[0]}
									id={card[1]}
									set={card[2]}
									text={card[3]}
									imgURL={card[4]}
									type={card[5]}
								/>
							</div>
						);
					}
				})}

				<div>{error && 'ERROR... Something has gone wrong'}</div>
			</div>
		</div>
	);
}

export default App;
