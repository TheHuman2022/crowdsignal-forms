<?php
/**
 * Contains Crowdsignal_Forms\Frontend\Blocks\Crowdsignal_Forms_Poll_Block
 *
 * @package Crowdsignal_Forms\Frontend\Blocks
 * @since   1.0.0
 */

namespace Crowdsignal_Forms\Frontend\Blocks;

use Crowdsignal_Forms\Frontend\Crowdsignal_Forms_Blocks_Assets;
use Crowdsignal_Forms\Frontend\Crowdsignal_Forms_Block;
use Crowdsignal_Forms\Crowdsignal_Forms;

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Handles Crowdsignal Forms' Poll block.
 *
 * @package  Crowdsignal_Forms\Frontend\Blocks
 * @since    1.0.0
 */
class Crowdsignal_Forms_Poll_Block implements Crowdsignal_Forms_Block {
	const TRANSIENT_HIDE_BRANDING = 'cs-hide-branding';
	const HIDE_BRANDING_YES       = 'YES';
	const HIDE_BRANDING_NO        = 'NO';

	/**
	 * {@inheritDoc}
	 */
	public function register() {
		register_block_type(
			'crowdsignal-forms/poll',
			array(
				'attributes'      => $this->attributes(),
				'script'          => Crowdsignal_Forms_Blocks_Assets::POLL,
				'editor_script'   => Crowdsignal_Forms_Blocks_Assets::EDITOR,
				'style'           => Crowdsignal_Forms_Blocks_Assets::POLL,
				'editor_style'    => Crowdsignal_Forms_Blocks_Assets::EDITOR,
				'render_callback' => array( $this, 'render' ),
			)
		);
	}

	/**
	 * Renders the poll dynamic block
	 *
	 * @param array $attributes The block's attributes.
	 */
	public function render( $attributes ) {
		$attributes['hideBranding'] = $this->should_hide_branding();
		return sprintf(
			'<div class="align%s" data-crowdsignal-poll="%s"></div>',
			$attributes['align'],
			htmlentities( wp_json_encode( $attributes ) )
		);
	}

	/**
	 * Determines if branding should be shown in the poll.
	 * Result is cached in a short-lived transient for performance.
	 *
	 * @return bool
	 */
	private function should_hide_branding() {
		if ( get_transient( self::TRANSIENT_HIDE_BRANDING ) ) {
			return self::HIDE_BRANDING_YES === get_transient( self::TRANSIENT_HIDE_BRANDING );
		}

		try {
			$capabilities  = Crowdsignal_Forms::instance()->get_api_gateway()->get_capabilities();
			$hide_branding = false !== array_search( 'hide-branding', $capabilities, true )
				? self::HIDE_BRANDING_YES
				: self::HIDE_BRANDING_NO;
		} catch ( \Exception $ex ) {
			// ignore error, we'll get the updated value next time.
			$hide_branding = self::HIDE_BRANDING_YES;
		}
		set_transient(
			self::TRANSIENT_HIDE_BRANDING,
			$hide_branding,
			MINUTE_IN_SECONDS
		);
		return $hide_branding;
	}

	/**
	 * Returns the attributes definition array for register_block_type
	 *
	 * Note: Any changes to the array returned by this function need to be
	 *       duplicated in client/blocks/poll/attributes.js.
	 *
	 * @return array
	 */
	private function attributes() {
		return array(
			'pollId'                      => array(
				'type'    => 'number',
				'default' => null,
			),
			'isMultipleChoice'            => array(
				'type'    => 'boolean',
				'default' => false,
			),
			'title'                       => array(
				'type'    => 'string',
				'default' => __( 'Untitled Poll', 'crowdsignal-forms' ),
			),
			'question'                    => array(
				'type'    => 'string',
				'default' => '',
			),
			'note'                        => array(
				'type'    => 'string',
				'default' => '',
			),
			'answers'                     => array(
				'type'    => 'array',
				'default' => array( new \stdClass(), new \stdClass(), new \stdClass() ),
				'items'   => array(
					'type'       => 'object',
					'properties' => array(
						'answerId' => array(
							'type'    => 'number',
							'default' => null,
						),
						'text'     => array(
							'type'    => 'string',
							'default' => '',
						),
					),
				),
			),
			'submitButtonLabel'           => array(
				'type'    => 'string',
				'default' => __( 'Submit', 'crowdsignal-forms' ),
			),
			'submitButtonTextColor'       => array(
				'type' => 'string',
			),
			'submitButtonBackgroundColor' => array(
				'type' => 'string',
			),
			'confirmMessageType'          => array(
				'type'    => 'string',
				'default' => 'results', // See: client/blocks/poll/constants.js.
			),
			'customConfirmMessage'        => array(
				'type' => 'string',
			),
			'redirectAddress'             => array(
				'type' => 'string',
			),
			'textColor'                   => array(
				'type' => 'string',
			),
			'backgroundColor'             => array(
				'type' => 'string',
			),
			'borderColor'                 => array(
				'type' => 'string',
			),
			'borderWidth'                 => array(
				'type'    => 'number',
				'default' => 2,
			),
			'borderRadius'                => array(
				'type'    => 'number',
				'default' => 0,
			),
			'hasBoxShadow'                => array(
				'type'    => 'boolean',
				'default' => true,
			),
			'fontFamily'                  => array(
				'type'    => 'string',
				'default' => null,
			),
			'hasOneResponsePerComputer'   => array(
				'type'    => 'boolean',
				'default' => false,
			),
			'randomizeAnswers'            => array(
				'type'    => 'boolean',
				'default' => false,
			),
			'align'                       => array(
				'type'    => 'string',
				'default' => 'center',
			),
			'pollStatus'                  => array(
				'type'    => 'string',
				'default' => 'open', // See: client/blocks/poll/constants.js.
			),
			'closedPollState'             => array(
				'type'    => 'string',
				'default' => 'show-results', // See: client/blocks/poll/constants.js.
			),
			'closedAfterDateTime'         => array(
				'type'    => 'string',
				'default' => null,
			),
			'hideBranding'                => array(
				'type'    => 'boolean',
				'default' => false,
			),
		);
	}
}
