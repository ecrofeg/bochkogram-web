import * as React from 'react';
import SendIcon from '@material-ui/icons/Send';
import io from 'socket.io-client';
import autobind from 'autobind-decorator';

import './App.css';
import Auth from './components/Auth/Auth';
import { USER_KEY } from './utils';
import { Message, User } from './types';
import Messages from './components/Messages/Messages';

interface State {
	messages: Message[];
	inputText: string;
	authorInputText: string;
	user: User;
}

class App extends React.Component<{}, State> {
	private socket: SocketIOClient.Socket;
	private messageInput: HTMLTextAreaElement;

	state: State = {
		messages: [],
		inputText: '',
		authorInputText: '',
		user: null
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

	@autobind
	private onAuth(user: User): void {
		this.setState({
			user: user
		});

		this.socket.on('load messages', (result: Message[]) => {
			if (!this.state.messages.length || window.innerHeight + window.pageYOffset === document.body.scrollHeight) {
				setTimeout(() => window.scrollTo(0, document.body.scrollHeight), 100);
			}

			this.setState({
				messages: result
			});
		});

		setTimeout(() => this.messageInput.focus(), 200);
	}

	componentDidMount() {
		let userInfoString = localStorage.getItem(USER_KEY);

		if (userInfoString) {
			const userInfo: User = JSON.parse(userInfoString);

			this.onAuth(userInfo);
		}
	}

	sendMessage() {
		if (this.state.inputText && this.state.inputText.trim()) {
			this.socket.emit('add message', {
				text: this.state.inputText,
				author: this.state.user.name,
				color: this.state.user.color
			} as Message);

			this.setState({
				inputText: ''
			});

			setTimeout(() => window.scrollTo(0, document.body.scrollHeight), 100);
		}
	}

	public render(): React.ReactNode {
		return (
			<div className="app">
				{this.state.user ? (
					<>
						<div />
						<Messages messages={this.state.messages} currentUser={this.state.user} />

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
								<SendIcon />
							</div>
						</div>
					</>
				) : (
					<Auth onAuth={this.onAuth} />
				)}
			</div>
		);
	}
}

export default App;
