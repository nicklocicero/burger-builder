import * as actionTypes from "../actions/actionsTypes";
import { updateObject } from "../../shared/utility";

const initialState = {
  orders: [],
  loading: false,
  purchasing: false
};

const purchasedInit = (state, action) => {
  return updateObject(state, { purchased: false });
};

const purchasedBurgerStart = (state, action) => {
  return updateObject(state, { purchased: true });
};

const purchasedBurgerSuccess = (state, action) => {
  const newOrder = updateObject(action.orderData, {
    id: action.orderId
  });
  return updateObject(state, {
    loading: false,
    purchased: true,
    orders: state.orders.concat(newOrder)
  });
};

const purchasedBurgerFail = (state, action) => {
  return updateObject(state, { loading: false });
};

const fetchedOrdersStart = (state, action) => {
  return updateObject(state, { loading: true });
};

const fetchedOrdersSuccess = (state, action) => {
  return updateObject(state, {
    orders: action.orders,
    loading: false
  });
};

const fetchedOrdersFail = (state, action) => {
  return updateObject(state, { loading: false });
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.PURCHASE_INIT:
      return purchasedInit(state, action);
    case actionTypes.PURCHASE_BURGER_START:
      return purchasedBurgerStart(state, action);
    case actionTypes.PURCHASE_BURGER_SUCCESS:
      return purchasedBurgerSuccess(state, action);
    case actionTypes.PURCHASE_BURGER_FAIL:
      return purchasedBurgerFail(state, action);
    case actionTypes.FETCHED_ORDERS_START:
      return fetchedOrdersStart(state, action);
    case actionTypes.FETCHED_ORDERS_SUCCESS:
      return fetchedOrdersSuccess(state, action);
    case actionTypes.FETCHED_ORDERS_FAIL:
      return fetchedOrdersFail(state, action);
    default:
      return state;
  }
};

export default reducer;
