import * as React from 'react';
import autobind from 'autobind-decorator';

import './Auth.css';
import { getRandomColor, USER_KEY } from '../../utils';
import { User } from '../../types';

interface Props {
	onAuth: (user: User) => void;
}

interface State {
	inputText: string;
}

class Auth extends React.Component<Props, State> {
	public state: State = {
		inputText: ''
	};

	@autobind
	private onInputChange(event: React.ChangeEvent<HTMLInputElement>): void {
		this.setState({
			inputText: event.target.value
		});
	}

	@autobind
	onAuth() {
		if (this.state.inputText && this.state.inputText.trim()) {
			const user: User = {
				name: this.state.inputText.trim(),
				color: getRandomColor()
			};

			localStorage.setItem(USER_KEY, JSON.stringify(user));

			this.props.onAuth(user);
		} else {
			alert('SAY ME YOUR NAME');
		}
	}

	public render(): React.ReactNode {
		return (
			<div className="auth">
				<h1>WHO THE ARE YOU?</h1>

				<input
					className="auth-input"
					placeholder="I am..."
					autoComplete="off"
					autoCorrect="off"
					spellCheck={false}
					value={this.state.inputText}
					onChange={this.onInputChange}
					required={true}
				/>

				<button className="auth-proceed" onClick={this.onAuth}>
					PROCEED TO BOCHKA
				</button>
			</div>
		);
	}
}

export default Auth;
