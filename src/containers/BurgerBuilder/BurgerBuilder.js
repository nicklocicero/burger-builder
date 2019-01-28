import React, { Component } from 'react';
import Aux from '../../hoc/Aux/Aux';
import Burger from '../../components/Burger/Burger';
import BuildControls from '../../components/Burger/BuildControls/BuildControls';
import Modal from '../../components/UI/Modal/Modal';
import OrderSummary from '../../components/Burger/OrderSummary/OrderSummary';
import Spinner from '../../components/UI/Spinner/Spinner';
import withErrorHandler from '../../hoc/withErrorHandler/withErrorHandler';
import axios from '../../axios-orders';

const INGREDIENT_PRICES = {
	salad: 0.5,
	bacon: 0.7,
	cheese: 0.4,
	meat: 1.3
}

class BurgerBuilder extends Component {

	// constructor(props) {
	// 	super(props);
	// 	this.state = {...}
	// }

	state = {
		ingredients: null,
		totalPrice: 7,
		purchasable: false,
		purchasing: false,
		loading: false,
		error: null
	}

	componentDidMount() {
		axios.get('https://react-my-burger-7004f.firebaseio.com/ingredients.json')
			.then(response => {
				this.setState({ ingredients: response.data });
			})
			.catch(error => {
				this.setState({error: true});
			});
	}

	updatePurchasedState(ingredients) {
		const sum = Object.keys(ingredients)
			.map(igKey => {
				return ingredients[igKey];
			})
			.reduce((sum, el) => {
				return sum + el;
			}, 0);
		this.setState({ purchasable: sum > 0 });
	}

	addIngredientHandler = (type) => {
		const oldCount = this.state.ingredients[type];
		const updatedCount = oldCount + 1;
		const updatedIngredients = {
			...this.state.ingredients
		};
		updatedIngredients[type] = updatedCount;
		const priceAddition = INGREDIENT_PRICES[type];
		const oldPrice = this.state.totalPrice;
		const newPrice = oldPrice + priceAddition;
		this.setState({ totalPrice: newPrice, ingredients: updatedIngredients });
		this.updatePurchasedState(updatedIngredients);
	}

	removeIngredientHandler = (type) => {
		const oldCount = this.state.ingredients[type];
		if (oldCount <= 0) {
			return;
		}
		const updatedCount = oldCount - 1;
		const updatedIngredients = {
			...this.state.ingredients
		};
		updatedIngredients[type] = updatedCount;
		const priceDeduction = INGREDIENT_PRICES[type];
		const oldPrice = this.state.totalPrice;
		const newPrice = oldPrice - priceDeduction;
		this.setState({ totalPrice: newPrice, ingredients: updatedIngredients });
		this.updatePurchasedState(updatedIngredients);
	}

	purchaseHandler = () => {
		this.setState({ purchasing: true });
	}

	purchaseCancelHandler = () => {
		this.setState({ purchasing: false });
	}

	purchaseContinueHandler = () => {
		// alert('You continue!');
		this.setState({ loading: true });
		const order = {
			ingredietns: this.state.ingredients,
			price: this.state.totalPrice,
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
				this.setState({ loading: false, purchasing: false });
			})
			.catch(error => {
				this.setState({ loading: false, purchasing: false })
			});

	}

	render() {
		const disabledInfo = {
			...this.state.ingredients
		};
		for (let key in disabledInfo) {
			disabledInfo[key] = disabledInfo[key] <= 0;
		}
		let orderSummary = null;
		let burger = this.state.error ? <p>ingredients can't be loaded</p> : <Spinner />;
		if (this.state.ingredients !== null) {
			burger = (
				<Aux>
					<Burger ingredients={this.state.ingredients} />
					<BuildControls
						ingredientAdded={this.addIngredientHandler}
						ingredientRemoved={this.removeIngredientHandler}
						disabled={disabledInfo}
						purchasable={this.state.purchasable}
						price={this.state.totalPrice}
						ordered={this.purchaseHandler} />
				</Aux>
			)
			orderSummary = <OrderSummary
				ingredients={this.state.ingredients}
				purchaseCancelled={this.purchaseCancelHandler}
				purchaseContinued={this.purchaseContinueHandler}
				price={this.state.totalPrice} />
		}
		if (this.state.loading) {
			orderSummary = <Spinner />
		}
		return (
			<Aux>
				<Modal show={this.state.purchasing} modalClosed={this.purchaseCancelHandler}>
					{orderSummary}
				</Modal>
				{burger}
			</Aux>
		);
	}
}

export default withErrorHandler(BurgerBuilder, axios);