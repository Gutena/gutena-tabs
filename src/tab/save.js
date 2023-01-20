/**
 * WordPress dependencies
 */
import { useBlockProps, useInnerBlocksProps } from '@wordpress/block-editor';

/**
 * External dependencies
 */
import classnames from 'classnames';

export default function save( { attributes } ) {
    const { uniqueId, tabId } = attributes;

    const blockProps = useBlockProps.save( {
        className: classnames( `gutena-tab-block`, `gutena-tab-block-${ uniqueId }`, {
            'active': 1 === tabId,
            'inactive': 1 !== tabId,
        } ),
    } );

    const innerBlocksProps = useInnerBlocksProps.save( blockProps );
    
    return <div { ...innerBlocksProps } data-tab={ tabId } />;
}