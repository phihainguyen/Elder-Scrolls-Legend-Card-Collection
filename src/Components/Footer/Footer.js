import React from 'react';
import GithubIcon from '../../assets/GithubIcon.svg';
import LinkedInIcon from '../../assets/linkedinIcon.svg';
import * as styles from './Footer.module.css';
function Footer() {
	return (
		<div className={styles.footerContainer}>
			<div>
				<a href="https://github.com/phihainguyen" target="_blank">
					<img src={GithubIcon} className={styles.iconImg} />
				</a>
				<a href="https://www.linkedin.com/in/phi-hai-nguyen/" target="_blank">
					<img src={LinkedInIcon} className={styles.iconImg} />
				</a>
			</div>
			<div>
				<p className={styles.footerContact}>
					Contact: <span>phihai93@gmail.com</span>
				</p>
			</div>
			<div>
				<p className={styles.footerCopyright}>© Phi Hai Nguyen, 2021</p>
			</div>
		</div>
	);
}

export default Footer;
