import React, { Component } from 'react';
import axios from '../../../axios-orders';

import Button from '../../../components/UI/Button/Button';
import Spinner from '../../../components/UI/Spinner/Spinner';
import classes from './ContactData.css';

class ContactData extends Component {

	state = {
		name: '',
		email: '',
		address: {
			street: '',
			postalCode: ''
		}
	}

	orderHandler = (event) => {
		event.preventDefault();
		this.setState({ loading: true });
		const order = {
			ingredietns: this.props.ingredients,
			price: this.props.totalPrice,
			customer: {
				name: 'Nick LoCicero',
				address: {
					street: 'highway 1',
					zipcode: '93410',
					state: 'California'
				},
				email: 'test@test.com'
			},
			deliveryMethod: 'fast'
		}
		axios.post('/orders.json', order)
			.then(response => {
				this.setState({ loading: false });
				this.props.history.push('/');
			})
			.catch(error => {
				this.setState({ loading: false, purchasing: false })
			});
	}

	render() {
		let form = (
			<div className={classes.ContactData}>
				<h4>Enter your Contact Data</h4>
				<form>
					<input className={classes.Input} type="text" name="name" placeholder="Your Name" />
					<input className={classes.Input} type="email" name="email" placeholder="Your Email" />
					<input className={classes.Input} type="text" name="street" placeholder="Street" />
					<input className={classes.Input} type="text" name="postal" placeholder="Postal Code" />
					<Button btnType="Success" clicked={this.orderHandler}>ORDER</Button>
				</form>
			</div>
		);
		if (this.state.loading) {
			form = <Spinner />
		}
		return ( form );
	}
}

export default ContactData;