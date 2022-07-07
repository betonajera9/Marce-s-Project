import { createStore } from 'vuex'

import Api from '../service/api'
const api = new Api()

export const store = createStore({
	state: () => ({
		isActive: false,
		customers: [],
		stock: [],
		sales: [],
		history: [],
		accountStatements: [],
	}),
	getters: {
		isActive(state) {
			return state.isActive
		},

		// Customers Getters
		customers(state) {
			return state.customers
		},
		customersInput(state) {
			return state.customers.map((element) => {
				return { label: element.name, value: element.id }
			})
		},
		customer(state) {
			return (id) => state.customers.find((element) => element.id === id)
		},

		// Sales Getters
		sales(state) {
			return state.sales
		},
		salesInput(state) {
			return state.sales.map((element) => {
				return { label: element.name, value: element.id }
			})
		},
		sale(state) {
			return (id) => state.sales.find((element) => element.id === id)
		},

		// History Getters
		historys(state) {
			return state.history
		},
		history(state) {
			return (id) => state.history.find((element) => element.id === id)
		},

		// Stock Getters
		stocks(state) {
			return state.stock
		},
		stocksInput(state) {
			return state.stock.map((element) => {
				return { label: element.name, value: element.id }
			})
		},
		stock(state) {
			return (id) => state.stock.find((element) => element.id === id)
		},

		//AccountStatement Getters
		account(state) {
			return (id) =>
				state.accountStatements.find((element) => element.id === id)
		},
		accountMovement(state) {
			return (userId, movementId) => {
				const account = state.accountStatements.find(
					(element) => element.id === userId
				)
				return account.movements.find((element) => element.id === movementId)
			}
		},
	},
	mutations: {
		toogleActive(state) {
			state.isActive = !state.isActive
		},

		// Customers Mutation
		setCustomers(state, customers) {
			state.customers = customers
		},
		setCustomer(state, dataCustomer) {
			state.customers.push(dataCustomer)
		},
		updateCustomer(state, dataCustomer) {
			state.customers = state.customers.map((element) => {
				if (element.id === dataCustomer.id) return dataCustomer
				else return element
			})
		},
		deleteCustomer(state, id) {
			state.customers = state.customers.filter((element) => element.id !== id)
		},

		// Sales Muttions
		setSales(state, sales) {
			state.sales = sales
		},
		setSale(state, dataSale) {
			state.sales.push(dataSale)
		},
		updateSale(state, dataSale) {
			state.sales = state.sales.map((element) => {
				if (element.id === dataSale.id) return dataSale
				else return element
			})
		},
		deleteSale(state, id) {
			state.sales = state.sales.filter((element) => element.id !== id)
		},

		// History Mutations
		setHistory(state, history) {
			state.history = history
		},
		addToHistory(state, sale) {
			state.history.push(sale)
		},
		updateHistory(state, dataHistory) {
			state.history = state.history.map((element) => {
				if (element.id === dataHistory.id) return dataHistory
				else return element
			})
		},
		deleteHistory(state, id) {
			state.history = state.history.filter((element) => element.id !== id)
		},

		// Stock Mutations
		setAllStock(state, stock) {
			state.stock = stock
		},
		setStock(state, dataStock) {
			state.stock.push(dataStock)
		},
		updateStock(state, dataStock) {
			state.stock = state.stock.map((element) => {
				if (element.id === dataStock.id) return dataStock
				else return element
			})
		},
		deleteStock(state, id) {
			state.stock = state.stock.filter((element) => element.id !== id)
		},

		// AccountStatements Mutations
		setAccountStatements(state, AccountStatements) {
			state.accountStatements = AccountStatements
		},
		setAccountStatement(state, AccountStatement) {
			state.accountStatements.push(AccountStatement)
		},
		updateAccountStatements(state, AccountStatement) {
			state.accountStatements = state.accountStatements.map((element) => {
				if (element.id === AccountStatement.id) return AccountStatement
				else return element
			})
		},
		addMovementToAccount(state, movement) {
			state.accountStatements = state.accountStatements.map((element) => {
				if (element.id === movement.id) {
					element.movements.push(movement.data)
					element.total += movement.data.total
					return element
				} else return element
			})
		},
	},
	actions: {
		toogleActive(context) {
			context.commit('toogleActive')
		},

		// Customers Actions
		async setCustomers(context) {
			const customers = await api.getCustomers()
			context.commit('setCustomers', customers)
		},
		async setCustomer(context, data) {
			const res = await api.setCustomer(data)
			context.commit('setCustomer', res)
			return res
		},
		async updateCustomer(context, data) {
			const res = await api.updateCustomer(data.id, data)
			context.commit('updateCustomer', res)
		},
		async deleteCustomer(context, id) {
			const { id: res } = await api.deleteCustomer(id)
			context.commit('deleteCustomer', res)
		},

		// Sales Actions
		async setSales(context, data) {
			const res = await api.setSale(data)
			context.commit('addToHistory', res)

			data.material.map((element) => {
				const stock = context.getters.stock(element.id)
				stock.number = Number(stock.number) - Number(element.number)
				context.dispatch('updateStock', stock)
			})
			return res
		},
		async emptySales(context) {
			context.commit('setSales', [])
		},
		async setSale(context, data) {
			context.commit('setSale', data)
		},
		async updateSale(context, data) {
			context.commit('updateSale', data)
		},
		async deleteSale(context, id) {
			context.commit('deleteSale', id)
		},

		// History Actions
		async setHistory(context) {
			const history = await api.getSales()
			context.commit('setHistory', history)
		},
		async updateHistory(context, data) {
			const res = await api.updateSale(data.id, data)
			context.commit('updateHistory', res)
		},
		async deleteHistory(context, id) {
			const { id: res } = await api.deleteSale(id)
			context.commit('deleteHistory', res)
		},

		// Stock Actions
		async setAllStock(context) {
			const stock = await api.getStock()
			context.commit('setAllStock', stock)
		},
		async setStock(context, data) {
			const res = await api.setStock(data)
			context.commit('setStock', res)
		},
		async updateStock(context, data) {
			const res = await api.updateStock(data.id, data)
			context.commit('updateStock', res)
		},
		async deleteStock(context, id) {
			const { id: res } = await api.deleteStock(id)
			context.commit('deleteStock', res)
		},

		// Account statements Actions
		async setAccountStatements(context) {
			const accounts = await api.getAccountStatements()
			context.commit('setAccountStatements', accounts)
		},
		async setAccountStatement(context, data) {
			const res = await api.setAccountStatements(data)
			context.commit('setAccountStatements', res)
		},
		async updateAccountStatements(context, data) {
			const res = await api.updateAccountStatements(data.id, data)
			context.commit('updateAccountStatements', res)
		},
		async addMovementToAccount(context, movement) {
			const res = await api.addMovementToAccount(movement.id, movement.data)
			context.commit('addMovementToAccount', { id: movement.id, data: res })
		},
	},
})

export function useStore() {
	return store
}
