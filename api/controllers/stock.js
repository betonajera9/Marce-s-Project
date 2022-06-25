import DB from '../lib/database'

export default class Stocks {
	constructor() {
		const db = new DB()
		this.db = db.connection
		this.collection = 'stocks'
	}

	getAllStocks() {
		return this.db.get(this.collection).value()
	}

	getStock(data) {
		return this.db.get(this.collection).find(data).value()
	}

	createStock(data) {
		this.db.get(this.collection).push(data).write()
		return data
	}

	updateStock(findData, newData) {
		this.db.get(this.collection).find(findData).assign(newData).write()
		return newData
	}
}