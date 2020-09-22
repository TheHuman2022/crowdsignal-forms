/**
 * External dependencies
 */
import React, { useEffect, useState } from 'react';
import { map, zipObject } from 'lodash';
import classNames from 'classnames';

/**
 * Internal dependencies
 */
import VoteItem from 'components/vote/vote-item';
import { usePollResults, usePollVote } from 'data/hooks';
import { getVoteStyleVars } from 'blocks/vote/util';
import { __ } from 'lib/i18n';
import { VoteStyles, getVoteStyles } from './styles';
import { withFallbackStyles } from 'components/with-fallback-styles';

const Vote = ( { attributes, fallbackStyles, renderStyleProbe } ) => {
	const apiPollId = attributes.apiPollData.id;
	const [ votedOnId, setVotedOnId ] = useState( 0 );
	const { hasVoted, vote, storedCookieValue } = usePollVote(
		apiPollId,
		true,
		true
	);

	const { results } = usePollResults( apiPollId, ! attributes.hideResults );

	useEffect( () => {
		if ( '' !== storedCookieValue ) {
			setVotedOnId( parseInt( storedCookieValue.split( ',' )[ 0 ], 10 ) );
		}
	}, [ storedCookieValue ] );

	const handleVoteClick = async ( answerId ) => {
		setVotedOnId( answerId );
		await vote( [ answerId ] );
	};

	const classes = classNames(
		'crowdsignal-forms-vote',
		attributes.className,
		`size-${ attributes.size }`
	);

	const answerClientIdToApiId = zipObject(
		map( attributes.apiPollData.answers, 'client_id' ),
		map( attributes.apiPollData.answers, 'id' )
	);

	const voteStyleVars = getVoteStyleVars( attributes );

	return (
		<div className={ classes } style={ voteStyleVars }>
			<div className="crowdsignal-forms-vote__items">
				{ map( attributes.innerBlocks, ( voteAttributes ) => {
					const apiAnswerId =
						answerClientIdToApiId[ voteAttributes.answerId ];

					return (
						<VoteItem
							{ ...voteAttributes }
							fallbackStyles={ fallbackStyles }
							key={ voteAttributes.answerId }
							apiAnswerId={ apiAnswerId }
							onVote={ handleVoteClick }
							disabled={ hasVoted || 0 !== votedOnId }
							isVotedOn={ apiAnswerId === votedOnId }
							voteCount={ results ? results[ apiAnswerId ] : 0 }
							hideCount={ attributes.hideResults }
						/>
					);
				} ) }
			</div>

			{ hasVoted && ! attributes.hideBranding && (
				<div className="crowdsignal-forms-vote__branding">
					<a
						className="crowdsignal-forms-vote__branding-link"
						href="https://crowdsignal.com"
						target="blank"
						rel="noopener noreferrer"
					>
						{ __( 'Powered by Crowdsignal' ) }
					</a>
				</div>
			) }

			{ renderStyleProbe() }
		</div>
	);
};

export default withFallbackStyles( VoteStyles, getVoteStyles )( Vote );
