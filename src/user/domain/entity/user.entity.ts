export interface IUser {
	id: string
	name: string
	email: string
	password: string
	createdAt: Date
	subscriptionExpiration: Date | null
}

export class User implements IUser {
	readonly id: string
	readonly name: string
	readonly email: string
	readonly password: string
	readonly createdAt: Date
	readonly subscriptionExpiration: Date | null

	constructor(user: IUser) {
		Object.assign(this, user)
	}
}
