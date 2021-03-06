import { Stock } from './stock.type'

export interface Sale {
	id: string
	date: Date
	subtotal: number
	discount: number
	total: number
	isCustomer?: boolean
	customerId?: string
	name: string
	phone: string
	RFC?: string
	CFDI?: string
	wayToPay?: 'EFECTIVO' | 'TARJETA CREDITO/DEBITO'
	material: Stock[] | []
}
