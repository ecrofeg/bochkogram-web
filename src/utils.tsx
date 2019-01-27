import * as React from 'react';

export const USER_KEY = 'bochka-user-key';

export const urlRegexp = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/;

const colors = [
	'#f44336',
	'#e91e63',
	'#9c27b0',
	'#673ab7',
	'#3f51b5',
	'#2196f3',
	'#03a9f4',
	'#00bcd4',
	'#009688',
	'#4caf50',
	'#8bc34a',
	'#cddc39',
	'#ffeb3b',
	'#ffc107',
	'#ff9800',
	'#ff5722',
	'#795548'
];

export const getRandomColor = () => colors[Math.floor(Math.random() * colors.length)];

export const replaceUrl = (string: string): React.ReactNode | React.ReactNode[] => {
	const urlMatch = string.match(urlRegexp);
	let result;

	if (urlMatch) {
		result = [
			<span key={0}>{string.substr(0, urlMatch.index)}</span>,
			<a key={1} href={urlMatch[0]} target="_blank">
				{urlMatch[0]}
			</a>,
			<span key={2}>{replaceUrl(string.substr(urlMatch.index + urlMatch[0].length))}</span>
		];
	} else {
		result = string;
	}

	return result;
};
