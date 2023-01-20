/**
 * WordPress dependencies
 */
import { registerBlockType } from '@wordpress/blocks';

/**
 * Child block
 */
import './tab/index'

/**
 * Internal dependencies
 */
import metadata from './block.json';
import edit from "./edit";
import save from './save';

/**
 * Styles
 */
import './style.scss'

/**
 * Register Block
 */
registerBlockType( metadata, {
	edit,
    save,
    icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <line x1="2" y1="3" x2="2" y2="21" stroke="#0EA489" strokeWidth="2"/>
            <line x1="8.75" y1="3" x2="8.75" y2="9" stroke="#0EA489" strokeWidth="1.5"/>
            <path d="M15.75 3L15.75 9" stroke="#0EA489" strokeWidth="1.5"/>
            <line x1="22" y1="3" x2="22" y2="21" stroke="#0EA489" strokeWidth="2"/>
            <line x1="1" y1="4" x2="22" y2="4" stroke="#0EA489" strokeWidth="2"/>
            <path d="M8 8.25L22 8.25" stroke="#0EA489" strokeWidth="1.5"/>
            <line x1="1" y1="20" x2="22" y2="20" stroke="#0EA489" strokeWidth="2"/>
        </svg>
    )
} );