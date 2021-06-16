import React from 'react';
import * as styles from './Card.module.css';
function Card(props) {
	return (
		<div className={styles.cardContainer} key={props.id}>
			<div className={styles.overlay}>
				<img src={props.imgURL} alt="elder scroll legend ..." className={styles.cardImg} />
			</div>
			<div className={styles.infoContainer}>
				<div className={styles.name}>
					Name: <span>{props.name}</span>
				</div>
				<div className={styles.type}>
					Type: <span>{props.type}</span>
				</div>
				<div className={styles.setName}>
					Set Name: <span>{props.set}</span>
				</div>
				<br />
				<div className={styles.text}>
					<span>{props.text}</span>
				</div>
			</div>
		</div>
	);
}

export default Card;
