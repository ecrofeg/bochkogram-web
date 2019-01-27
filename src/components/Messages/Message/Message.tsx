import * as React from 'react';
import cn from 'classnames';
import { format } from 'date-fns';

import { Message as MessageType } from '../../../types';
import './Message.css';
import { replaceUrl } from '../../../utils';

interface Props {
	message: MessageType;
	isGrouped: boolean;
	isCurrentUserMessage: boolean;
	showAuthor: boolean;
}

class Message extends React.Component<Props> {
	public render(): React.ReactNode {
		const { message, showAuthor, isGrouped, isCurrentUserMessage } = this.props;

		return (
			<div className={cn('message', { message_smallMargin: isGrouped })}>
				{showAuthor && (
					<div className="message-author" style={{ color: message.color }}>
						{message.author},&nbsp;
						<span className="message-date">{format(message.date, 'HH:mm')}</span>
					</div>
				)}

				<span className={cn('message-text', { 'message-text_yours': isCurrentUserMessage })}>
					{message.text.split('\n').map(function(item, key) {
						return (
							<span key={key}>
								{replaceUrl(item)}
								<br />
							</span>
						);
					})}
				</span>
			</div>
		);
	}
}

export default Message;
