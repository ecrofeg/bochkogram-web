import * as React from 'react';
import { differenceInMinutes } from 'date-fns';

import { Message as MessageType, User } from '../../types';
import Message from './Message/Message';
import './Messages.css';

interface Props {
	messages: MessageType[];
	currentUser: User;
}

const messageIsNew = (message: MessageType, prevMessage: MessageType): boolean => {
	return differenceInMinutes(message.date, prevMessage.date) > 5;
};

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
						isGrouped={
							messages[index + 1] &&
							messages[index + 1].author === message.author &&
							!messageIsNew(messages[index + 1], message)
						}
						showAuthor={
							!messages[index - 1] ||
							messages[index - 1].author !== message.author ||
							messageIsNew(message, messages[index - 1])
						}
					/>
				))}
			</div>
		);
	}
}

export default Messages;
