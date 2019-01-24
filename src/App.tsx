import * as React from 'react';
import cn from 'classnames';
import io from 'socket.io-client';
import { format } from 'date-fns';
import './App.css';
import autobind from 'autobind-decorator';

const USER_KEY = 'bochka-user-key';

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

const getRandomColor = () => colors[Math.floor(Math.random() * colors.length)];

interface User {
	name: string;
	color: string;
}

interface Message {
	author: string;
	color: string;
	text: string;
	date: Date;
}

interface State {
	messages: Message[];
	inputText: string;
	authorInputText: string;
	user: string;
	authorColor: string;
}

class App extends React.Component<{}, State> {
	private socket: SocketIOClient.Socket;
	private messageInput: HTMLTextAreaElement;

	state: State = {
		messages: [],
		inputText: '',
		authorInputText: '',
		user: '',
		authorColor: '#ffffff'
	};

	constructor(props: {}) {
		super(props);

		this.socket = io(
			process.env.REACT_APP_NODE_SOCKET_URL ? process.env.REACT_APP_NODE_SOCKET_URL : 'http://node:7000/'
		);
	}

	@autobind
	getMessageInputRef(element: HTMLTextAreaElement): void {
		this.messageInput = element;
	}

	@autobind
	onAuth() {
		if (this.state.authorInputText && this.state.authorInputText.trim()) {
			localStorage.setItem(
				USER_KEY,
				JSON.stringify({
					name: this.state.authorInputText.trim(),
					color: getRandomColor()
				})
			);

			setTimeout(() => this.load(), 100);
		} else {
			alert('SAY ME YOUR FUCKING NAME');
		}
	}

	@autobind
	onAuthInputChange(event: React.ChangeEvent<HTMLInputElement>) {
		this.setState({
			authorInputText: event.target.value
		});
	}

	@autobind
	onInputChange(event: React.ChangeEvent<HTMLTextAreaElement>) {
		this.setState({
			inputText: event.target.value
		});
	}

	@autobind
	onNewMessageButtonClick() {
		this.sendMessage();

		this.messageInput.focus();
	}

	@autobind
	onEnterKeyPressed(event: React.KeyboardEvent<HTMLTextAreaElement>) {
		if (event.key === 'Enter' && !event.shiftKey) {
			this.sendMessage();

			event.preventDefault();
		}
	}

	load() {
		let userInfoString = localStorage.getItem(USER_KEY);

		if (userInfoString) {
			const userInfo: User = JSON.parse(userInfoString);

			this.setState({
				user: userInfo.name,
				authorColor: userInfo.color
			});

			this.socket.on('load messages', (result: Message[]) => {
				this.setState({
					messages: result
				});

				setTimeout(() => window.scrollTo(0, document.body.scrollHeight), 200);
			});
		}
	}

	componentDidMount() {
		this.load();

		setTimeout(() => this.messageInput.focus(), 200);
	}

	sendMessage() {
		if (this.state.inputText && this.state.inputText.trim()) {
			this.socket.emit('add message', {
				text: this.state.inputText,
				author: this.state.user,
				color: this.state.authorColor
			});

			this.setState({
				inputText: ''
			});

			setTimeout(() => window.scrollTo(0, document.body.scrollHeight), 100);
		}
	}

	render() {
		return (
			<div className="app">
				{this.state.user ? (
					<>
						<div className="messages">
							{this.state.messages.map((message, index) => (
								<div
									key={index}
									className={cn('message', {
										message_smallMargin:
											this.state.messages[index + 1] &&
											this.state.messages[index + 1].author === message.author
									})}
								>
									{(!this.state.messages[index - 1] ||
										this.state.messages[index - 1].author !== message.author) && (
										<div className="message-author" style={{ color: message.color }}>
											{message.author},&nbsp;
											<span className="message-date">{format(message.date, 'HH:mm')}</span>
										</div>
									)}

									<span
										className={cn('message-text', {
											'message-text_yours': this.state.user === message.author
										})}
									>
										{message.text.split('\n').map(function(item, key) {
											return (
												<span key={key}>
													{item}
													<br />
												</span>
											);
										})}
									</span>
								</div>
							))}
						</div>

						<div className="newMessage">
							<textarea
								ref={this.getMessageInputRef}
								className="newMessage-input"
								value={this.state.inputText}
								onChange={this.onInputChange}
								onKeyPress={this.onEnterKeyPressed}
								autoComplete="off"
								spellCheck={false}
								placeholder="Bochka is listening..."
							/>

							<div className="newMessage-button" onClick={this.onNewMessageButtonClick}>
								<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
									<path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
									<path d="M0 0h24v24H0z" fill="none" />
								</svg>
							</div>
						</div>
					</>
				) : (
					<div className="auth">
						<h1>WHO THE FUCK ARE YOU?</h1>

						<input
							className="auth-input"
							placeholder="I am..."
							autoComplete="off"
							autoCorrect="off"
							spellCheck={false}
							value={this.state.authorInputText}
							onChange={this.onAuthInputChange}
							required={true}
						/>

						<button className="auth-proceed" onClick={this.onAuth}>
							PROCEED TO BOCHKA
						</button>
					</div>
				)}
			</div>
		);
	}
}

export default App;
