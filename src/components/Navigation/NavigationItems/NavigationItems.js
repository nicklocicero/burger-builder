import React from 'react';

import classes from './NavigationItems.css'
import NavigationItem from './NavigationItem/NavigationItem';

const navigationItems = () => (
		<ul className={classes.NavigationItems}>
			<NavigationItem link="/">Buger Builder</NavigationItem>
			<NavigationItem link="/orders">Orders</NavigationItem>
		</ul>
);

export default navigationItems;