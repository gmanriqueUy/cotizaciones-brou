import fs from 'fs';
import http from 'http';
import xlsx from 'xlsx';
import async from 'async';
import moment from 'moment';

// Constants
import COL from './constants/columns';
import CURR from './constants/currencies';
import FILE_URL from './constants/ine-file-url.js';

const INT_REGEX = /^\d+$/;
const FLOAT_REGEX = /^\d+([\.\,]\d+)?$/;
const FILE = './cotizaciones.xls';

moment.locale('es');

function seed() {

	async.waterfall([

		// Download the file
		// downloadFile,
		async.apply(
			fs.readFile,
			FILE
		),

		// Read the file and discard the unuseful lines
		readFile,

		// Parse the array of lines and transform it to an
		// array of days
		makeArrayOfDays,

		// Save the currencies into the database
		save

	], (err) => {
		if (err) {
			throw err;
		}
	});
}

function save(days, cbSave) {
	console.log(days[0]);
}

/**
 * 
 * @param {Array} lines - Array of useful lines
 * @param {function(Error, Array)} cb - The callback
 */
function makeArrayOfDays(lines, cb) {

	let year,
		month,
		day,
		date,
		days = [];

	lines.forEach((line, i) => {

		day = line[COL.DAY];
		month = line[COL.MONTH] || month;
		year = line[COL.YEAR] || year;
		date = getDate(day, month, year);

		days[i] = {
			date,
			currencies: [
				{
					iso: CURR.USD,
					buy: getValue(line[COL.USD_BUY]),
					sell: getValue(line[COL.USD_SELL])
				},
				{
					iso: CURR.ARS,
					buy: getValue(line[COL.ARS_BUY]),
					sell: getValue(line[COL.ARS_SELL])
				},
				{
					iso: CURR.BRL,
					buy: getValue(line[COL.BRL_BUY]),
					sell: getValue(line[COL.BRL_SELL])
				},
				{
					iso: CURR.EUR,
					buy: getValue(line[COL.EUR_BUY]),
					sell: getValue(line[COL.EUR_SELL])
				}
			]
		};

	});
	
	return cb(null, days);
}

function getValue(value) {
	return FLOAT_REGEX.test(value) ? value : null;
}

/**
 * Get a moment instance by parsing
 * day, month, and year
 * 
 * @param {number} day
 * @param {string} month
 * @param {number} year
 */
function getDate(day, month, year) {
	let date = `${day}-${month.toLowerCase()}.-${year}`;
	return moment(
		date, [
			'D-MMMM-YYYY',
			'D-MMM-YYYY'
		]
	);
}

/**
 * Read the file and calls the callback with an array
 * of useful lines
 * @param {Buffer} file - A buffer with the file
 * @param {function(Error,Array)} cb - The callback
 */
function readFile(file, cb) {

	/*
	 * Opens the file and get array of arrays
	 */
	const book = xlsx.read(file, { type: 'buffer' }),
		sheet = book.Sheets[book.SheetNames[0]],
		lines = xlsx.utils.sheet_to_json(sheet, {
			header: 1,
			range: 7
		});

	let usefulLines = [];

	lines.forEach((line) => {
		if (INT_REGEX.test(line[0])) {
			usefulLines.push(line);
		}
	});

	return cb(null, usefulLines);
}

/**
 * Download the INE file
 * 
 * @param {function(Error,Bufer)} cb 
 */
function downloadFile(cb) {
	let buffers = [];

	http.get(FILE_URL, (response) => {
		response.on('data', (chunk) => {
			buffers.push(chunk);
		});

		response.on('error', (err) => {
			return cb(err);
		});

		response.on('end',() => {
			return cb(null, Buffer.concat(buffers));
		});
	});
}

seed();