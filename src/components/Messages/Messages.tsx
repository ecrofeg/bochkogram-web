import * as React from 'react';
import { Message as MessageType, User } from '../../types';
import Message from './Message/Message';
import './Messages.css';

interface Props {
	messages: MessageType[];
	currentUser: User;
}

class Messages extends React.Component<Props> {
	public render(): React.ReactNode {
		const messages = this.props.messages;

		return (
			<div className="messages">
				{messages.map((message, index) => (
					<Message
						key={index}
						message={message}
						isCurrentUserMessage={this.props.currentUser.name === message.author}
						isGrouped={messages[index + 1] && messages[index + 1].author === message.author}
						showAuthor={!messages[index - 1] || messages[index - 1].author !== message.author}
					/>
				))}
			</div>
		);
	}
}

export default Messages;
