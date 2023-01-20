/**
 * WordPress dependencies
 */
import { registerBlockType } from '@wordpress/blocks';

/**
 * Internal dependencies
 */
import metadata from './data.json';
import edit from './edit';
import save from './save';

/**
 * Register Block
 */
registerBlockType( metadata, {
	edit,
	save,
	icon: (
		<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
			<line x1="2" y1="7" x2="2" y2="18" stroke="#0EA489" strokeWidth="2"/>
			<line x1="22" y1="6" x2="22" y2="18" stroke="#0EA489" strokeWidth="2"/>
			<line x1="1" y1="7" x2="22" y2="7" stroke="#0EA489" strokeWidth="2"/>
			<path d="M5 12.25L19 12.25" stroke="#0EA489" strokeWidth="2"/>
			<line x1="1" y1="17" x2="22" y2="17" stroke="#0EA489" strokeWidth="2"/>
		</svg>
	)
} );