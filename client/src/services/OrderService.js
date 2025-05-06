import apiService from "services";

const OrderService = {
	async getCompOrders(id) {
		return apiService.get(`/orders/${id}`);
	},

	async updateOrder(data, id) {
		return apiService.put(`/orders/${id}`, data, id);
	},
};

export default OrderService;
