import axios from 'axios';
import { useEffect, useState } from 'react';

//this functional component will be the logic for fetching/querying API and handling infinite scrolling

export default function useCardSearch(query, pageNumber) {
	// allow to control when to show loading spinner
	const [ loading, setLoading ] = useState(true);
	// shows error message when error occur i.e API not fetching
	const [ error, setError ] = useState(false);
	// stores the cards fetch from API
	const [ cards, setCards ] = useState([]);
	// allows to checks if there is a need to fetch/load more cards from API when checking against the number of results found when querying
	//this will also prevent from making request to API when there aren't any more results needed to be loaded/fetched
	const [ hasMore, setHasMore ] = useState(false);

	//checks when new query made and resets the cards in state, so old results aren't loaded with new search results
	useEffect(
		() => {
			setCards([]);
		},
		[ query ]
	);

	useEffect(
		() => {
			//initally set loading to true because thats when loading fetch results from API
			setLoading(true);
			//initially there won't be any error which hopefully succeed and when failed it'll caught in the .catch() method
			setError(false);

			//cancel variable will allow for canceling request since we don't want to request past queries from user input just the current
			//this variable will get its value from the provided axios cancelToken
			let cancel;

			// allows to fetch API asynchronously
			// axios provides parameters for get method as well as being able to customize what parameters you may want to add in order to query the info you want from API
			// cancel token will cancel old queries when typing new inputs to search input
			axios({
				method      : 'GET',
				url         : 'https://api.elderscrollslegends.io/v1/cards?pageSize=20',
				params      : { name: query, page: pageNumber },
				cancelToken : new axios.CancelToken((c) => (cancel = c))
			})
				//this data recieved from the API will be stored in the state where we will be access the following info and display in individual cards
				.then((res) => {
					//below are the information we will be storing to the state from API
					//if needed we can add more properties below from API, and display it by passing its index value
					//this will allow us to perform infinite scrolling as well by updating the previous cards with the new cards that loads when scrolling down to the bottom and needs to append more cards if there are more
					setCards((prevCards) => {
						//by passing our array of cards into Set we will get a return of unique values and then we are returning all of the unique results of combine old and new cards in an array, which will allow us to do all of the normal array manipulation such as mapping them to individual cards
						return [
							...new Set([
								...prevCards,
								...res.data.cards.map((card) => [
									card.name,
									card.id,
									card.set.name,
									card.text,
									card.imageUrl,
									card.type
								])
							])
						];
					});
					//checks if we need to load more cards by checking if the length is >0, which essentially means no more data since there are no cards returned to client
					//since no more data needs to be loaded we can also set loading to false
					setHasMore(res.data.cards.length > 0);
					setLoading(false);
				})
				.catch((e) => {
					//this will check if fetch request is canceled with axios built in method.
					//If this was an axios request cancelation than the error will be ignored and will not be shown
					if (axios.isCancel(e)) return;
					// we want to set to true here because this is where error would be caught and we want to display error to users when there are issues
					setError(true);
				});
			//this cancel() function will now cancel the old query everytime the useEffect is called
			return () => cancel();
		},
		// runs the querying everytime we have a change in the query made and change in page numbers
		[ query, pageNumber ]
	);
	//this will allow us to get information from our state from this functional component
	return { loading, error, cards, hasMore };
}
