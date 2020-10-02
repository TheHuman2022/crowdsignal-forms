/**
 * External dependencies
 */
import React from 'react';

/**
 * WordPress dependencies
 */
import {
	Button,
	ExternalLink,
	PanelBody,
	TextControl,
	SelectControl,
	TimePicker,
} from '@wordpress/components';
import { InspectorControls, PanelColorSettings } from '@wordpress/block-editor';
import { includes } from 'lodash';

import { PollStatus } from './constants';

/**
 * Internal dependencies
 */
import { __ } from 'lib/i18n';

const SideBar = ( { attributes, setAttributes, viewResultsUrl } ) => {
	const handleChangeTitle = ( title ) => setAttributes( { title } );

	const resultsLinkEnabled = '' !== viewResultsUrl;

	const handleChangePollStatus = ( pollStatus ) => {
		if ( ! includes( PollStatus, pollStatus ) ) {
			return;
		}

		// closedAfterDateTime MUST be set when pollStatus is set to CLOSED_AFTER
		setAttributes( {
			closedAfterDateTime:
				pollStatus === PollStatus.CLOSED_AFTER
					? new Date(
							new Date().getTime() + 24 * 60 * 60 * 1000
					  ).toISOString()
					: null,
			pollStatus,
		} );
	};

	const handleChangeCloseAfterDateTime = ( closedAfterDateTime ) => {
		const dateTime = new Date( closedAfterDateTime );
		setAttributes( { closedAfterDateTime: dateTime.toISOString() } );
	};

	const handleChangeTextColor = ( textColor ) =>
		setAttributes( { textColor } );

	const handleChangeBackgroundColor = ( backgroundColor ) =>
		setAttributes( { backgroundColor } );

	const handleChangeBorderColor = ( borderColor ) =>
		setAttributes( { borderColor } );

	return (
		<InspectorControls>
			<PanelBody title={ __( 'Results' ) } initialOpen={ true }>
				<p>
					{ resultsLinkEnabled
						? __( 'Manage results on ' )
						: __( 'Publish this post to enable results on ' ) }
					<ExternalLink
						href={
							resultsLinkEnabled
								? viewResultsUrl
								: 'https://www.crowdsignal.com'
						}
					>
						crowdsignal.com
					</ExternalLink>
				</p>
				<p>
					<Button
						href={ viewResultsUrl }
						isSecondary
						target="_blank"
						disabled={ ! resultsLinkEnabled }
					>
						{ __( 'View results' ) }
					</Button>
				</p>

				<TextControl
					value={ attributes.title }
					label={ __( 'Title of the applause block' ) }
					onChange={ handleChangeTitle }
				/>
			</PanelBody>
			<PanelBody title={ __( 'Status' ) }>
				<SelectControl
					value={ attributes.pollStatus }
					label={ __( 'Currently' ) }
					options={ [
						{
							label: __( 'Open' ),
							value: PollStatus.OPEN,
						},
						{
							label: __( 'Closed after' ),
							value: PollStatus.CLOSED_AFTER,
						},
						{
							label: __( 'Closed' ),
							value: PollStatus.CLOSED,
						},
					] }
					onChange={ handleChangePollStatus }
				/>
				{ PollStatus.CLOSED_AFTER === attributes.pollStatus && (
					<TimePicker
						currentTime={ attributes.closedAfterDateTime }
						label={ __( 'Close applause block on' ) }
						onChange={ handleChangeCloseAfterDateTime }
						is12Hour={ true }
					/>
				) }
			</PanelBody>
			<PanelColorSettings
				title={ __( 'Styling' ) }
				initialOpen={ true }
				colorSettings={ [
					{
						value: attributes.textColor,
						onChange: handleChangeTextColor,
						label: __( 'Text color' ),
					},
					{
						value: attributes.backgroundColor,
						onChange: handleChangeBackgroundColor,
						label: __( 'Background color' ),
					},
					{
						value: attributes.borderColor,
						onChange: handleChangeBorderColor,
						label: __( 'Border color' ),
					},
				] }
			></PanelColorSettings>
		</InspectorControls>
	);
};

export default SideBar;