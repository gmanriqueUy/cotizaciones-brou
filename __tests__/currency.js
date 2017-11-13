import axios from 'axios'
import startServer from '../src/server'

let server

const URL = 'http://localhost:3000/api/currency',
	DEFAULT_BASE = 'UYU'

beforeAll(() => {
	return startServer()
		.then((s) => {
			server = s
		})
})

afterAll((done) => {
	console.log("Closing server");
	server.close(done)
})

test("can get latest exchanges for default base", async () => {

	let { data } = await axios.get(`${URL}/latest`)

	expect(data).toMatchObject({
		timestamp: expect.any(Number),
		base: DEFAULT_BASE,
		rates: expect.any(Object)
	})

	for (const key in data.rates) {
		if (data.rates.hasOwnProperty(key))
			expect(data.rates[key]).toMatchObject({
				sell: expect.any(Number),
				buy: expect.any(Number)
			})
	}

})

test("can get exchanges for default base from a given date", async () => {
	let date = '2017-03-03',
		timestamp = new Date(date).getTime() / 1000,
		{ data } = await axios.get(`${URL}/${date}`)

	expect(data).toMatchObject({
		timestamp,
		base: DEFAULT_BASE,
		rates: expect.any(Object)
	})
})