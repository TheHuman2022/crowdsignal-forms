/**
 * WordPress dependencies
 */
import { Notice, Icon } from '@wordpress/components';

const EditorNotice = ( { icon, children, ...props } ) => {
	return (
		<Notice className="crowdsignal-forms__editor-notice" { ...props }>
			{ icon && (
				<div className="crowdsignal-forms__editor-notice-icon">
					{ <Icon icon={ icon } /> }
				</div>
			) }
			<div className="crowdsignal-forms__editor-notice-text">
				{ children }
			</div>
		</Notice>
	);
};

export default EditorNotice;